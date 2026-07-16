import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { CartItem } from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// --- CREDENCIALES OCTANO ---
const OCTANO_EMAIL = process.env.OCTANO_EMAIL!;
const OCTANO_PASSWORD = process.env.OCTANO_PASSWORD!;
const OCTANO_BASE_URL = 'https://pagos.octanopayments.com/api/v1';

const resend = new Resend(process.env.RESEND_API_KEY);
const formatPrice = (price: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

const getOctanoHeaders = (extraHeaders = {}) => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Origin': 'https://rovia.com.mx', 
  ...extraHeaders
});

async function safeOctanoFetch(url: string, options: RequestInit, stepName: string) {
  const res = await fetch(url, options);
  const text = await res.text(); 
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error(`Respuesta cruda de Octano en [${stepName}]:`, text);
    throw new Error(`Falla en ${stepName}. Octano respondió: ${text.slice(0, 50)}...`);
  }
}

// === DICCIONARIO DE TRADUCCIÓN PARA EL CORREO ===
const enTranslations: Record<string, string> = {
  "Tarifa Única": "Flat Rate",
  "Aventura Personalizada": "Custom Adventure",
  "Personalizado": "Customized",
  "Sesión de Yoga con Meditación Sonora": "Yoga Session with Sound Meditation",
  "Itinerario Express": "Express Itinerary",
  "Experiencias Indígenas Comunitarias": "Indigenous Community Experiences",
  "Clase de Yoga en la Naturaleza": "Nature Yoga Class",
  "Guía Local en Pueblos Mágicos": "Local Guide in Magical Towns",
  "Temazcal Comunitario Tradicional": "Traditional Community Temazcal",
  "Itinerario Económico Digital": "Digital Budget Itinerary",
  "Itinerario para Viajeros Mochileros": "Backpackers Itinerary",
  "Taller de Papel Amate": "Amate Paper Workshop",
  "Taller de Textiles Tradicionales": "Traditional Textiles Workshop",
  "Recomendaciones de Renta de Autos": "Car Rental Recommendations",
  "Experiencia Huasteca Cultural": "Huasteca Cultural Experience",
  "Experiencia Purépecha Cultural": "Purepecha Cultural Experience",
  "Taller de Barro Tradicional": "Traditional Clay Workshop",
  "Taller de Máscaras Tradicionales": "Traditional Masks Workshop",
  "Tour de Mezcal": "Mezcal Tour",
  "Taller de Talabartería": "Leatherworking Workshop",
  "Taller de Alebrijes": "Alebrijes Workshop",
  "Experiencia de Bienestar en Cenotes": "Wellness Experience in Cenotes",
  "Tour de 2 Cenotes": "2 Cenotes Tour",
  "Experiencia de Cocina Tradicional Maya": "Traditional Mayan Cooking Experience",
  "Experiencia de Temazcal Tradicional": "Traditional Temazcal Experience",
  "Taller de Cerámica Tradicional": "Traditional Ceramics Workshop",
  "Itinerario de Pueblos Mágicos": "Magical Towns Itinerary",
  "Itinerario Gastronómico": "Gastronomic Itinerary",
  "Itinerario para Road Trip": "Road Trip Itinerary",
  "Tour Gastronómico": "Gastronomic Tour",
  "Itinerario Cultural e Histórico": "Cultural and Historical Itinerary",
  "Circuito de Spa y Relajación": "Spa and Relaxation Circuit",
  "Experiencia de Spa Natural con Temazcal": "Natural Spa Experience with Temazcal",
  "Itinerario Familiar": "Family Itinerary",
  "Itinerario de Aventura": "Adventure Itinerary",
  "Paquete Explorador": "Explorer Package",
  "Experiencia de Temazcal en Resort": "Resort Temazcal Experience",
  "Itinerario Romántico": "Romantic Itinerary",
  "Plan Travel Planner Profesional": "Professional Travel Planner",
  "Plan Concierge de Viaje": "Travel Concierge Plan",
  "Paquete Aventura Total": "Total Adventure Package",
  "Retiro Corto de Yoga y Meditación": "Short Yoga & Meditation Retreat",
  "Paquete Viaje Completo": "Complete Travel Package",
  "Retiro de Yoga frente al Mar": "Beachfront Yoga Retreat"
};

const translateText = (text: string, locale: string) => {
  if (locale !== 'en') return text;
  if (text.startsWith('Pago de folio:')) return text.replace('Pago de folio:', 'Folio payment:');
  return enTranslations[text] || text;
};
// =================================================

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { locale, contactInfo, billingInfo, orderNotes, cart, cardInfo, formattedTotal, manualFolioData} = body;

    const tempReferenceId = `REF-${Date.now()}`;

    // 1. SIGNIN EN OCTANO (Usando x-www-form-urlencoded según la documentación)
    const signinData = await safeOctanoFetch(`${OCTANO_BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Origin': 'https://rovia.com.mx'
      },
      body: new URLSearchParams({ email: OCTANO_EMAIL, password: OCTANO_PASSWORD }).toString()
    }, 'Login Octano');
    
    if (!signinData.authToken) {
      throw new Error("Credenciales de Octano incorrectas o bloqueadas.");
    }
    const authToken = signinData.authToken;

    // 2. TOKENIZACIÓN DE TARJETA OCTANO
    const cardPayload = {
      cardData: {
        cardNumber: cardInfo.number,
        cardholderName: cardInfo.name,
        expirationMonth: cardInfo.expiry.split('/')[0],
        expirationYear: cardInfo.expiry.split('/')[1],
      }
    };

    const tokenData = await safeOctanoFetch(`${OCTANO_BASE_URL}/card/tokenizer`, {
      method: 'POST',
      headers: getOctanoHeaders({ 'Authorization': `Bearer ${authToken}` }),
      body: JSON.stringify(cardPayload)
    }, 'Tokenización de Tarjeta');

    if (!tokenData.cardNumberToken) {
      throw new Error("Tarjeta rechazada por OctanoPayments (Datos inválidos o encriptación fallida).");
    }
    const cardToken = tokenData.cardNumberToken;

    // 3. PREPARAR ITEMS PARA LA VENTA
    const octanoItems = manualFolioData 
      ? [{ title: `Pago Cotización: ${manualFolioData.folio}`, amount: manualFolioData.amount, quantity: 1, id: manualFolioData.folio }]
      : cart.items.map((item: CartItem) => ({
          title: item.experience.title,
          amount: item.pricePerPerson,
          quantity: item.people,
          id: item.packageId.toString(),
    }));

    const finalAmountToCharge = manualFolioData ? manualFolioData.amount : cart.total;

    // 4. PROCESAR LA VENTA
    const salePayload = {
      amount: Number(finalAmountToCharge.toFixed(2)),
      currency: 484, // MXN
      reference: tempReferenceId,
      customerInformation: {
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName || 'Sin apellido',
        middleName: '',
        email: contactInfo.email,
        phone1: contactInfo.phone,
        city: billingInfo.localidad || 'Ciudad de México',
        address1: billingInfo.direccion || 'Sin Especificar',
        postalCode: billingInfo.codigo_postal || '00000',
        state: billingInfo.estado || 'CDMX',
        country: 'Mx', // Formato estricto de Octano
        ip: '127.0.0.1' 
      },
      cardData: {
        cardNumberToken: cardToken,
        cvv: cardInfo.cvv
      },
      items: octanoItems,
      redirectUrl: 'https://rovia.com.mx' 
    };

    const saleData = await safeOctanoFetch(`${OCTANO_BASE_URL}/sale`, {
      method: 'POST',
      headers: getOctanoHeaders({ 'Authorization': `Bearer ${authToken}` }),
      body: JSON.stringify(salePayload)
    }, 'Procesar Venta');
    
    if (saleData.status !== 'APPROVED' && saleData.status !== 'PENDING') {
      console.error("❌ DETALLE DEL RECHAZO OCTANO:", saleData); 
      throw new Error(`Pago declinado: ${saleData.message || saleData.responseCode || 'Tarjeta rechazada por el banco'}`);
    }

    // 5. GUARDAR EN SUPABASE
    const { data: customer, error: custError } = await supabase
      .from('customers_rovia')
      .upsert({ 
        first_name: contactInfo.firstName, 
        last_name: contactInfo.lastName, 
        email: contactInfo.email, 
        phone: contactInfo.phone 
      }, { onConflict: 'email' })
      .select().single();

    if (custError) throw new Error("Error guardando cliente en la base de datos.");

    const { data: booking, error: bookError } = await supabase
      .from('bookings_rovia')
      .insert({
        customer_id: customer.id,
        session_id: manualFolioData ? manualFolioData.folio : null,
        total_amount: finalAmountToCharge,
        payment_status: 'paid',
        transaction_id: saleData.transactionId || saleData.authorizationNumber || tempReferenceId,
        payment_provider: 'octano', // Actualizado
        payment_date: new Date().toISOString(),
        pais: billingInfo.pais,
        direccion: billingInfo.direccion,
        localidad: billingInfo.localidad,
        estado: billingInfo.estado,
        codigo_postal: billingInfo.codigo_postal,
        order_notes: orderNotes || null 
      })
      .select().single();

    if (bookError) throw new Error("Error guardando reserva en la base de datos.");

    if (cart.items.length > 0) {
      const validBookingItems = cart.items
        .filter((item: CartItem) => item.packageId > 0) 
        .map((item: CartItem) => ({
          booking_id: booking.id,
          package_id: item.packageId,
          scheduled_date: item.date,
          pax_qty: item.people,
          unit_price: item.pricePerPerson
        }));
      if (validBookingItems.length > 0) {
        const { error: itemsError } = await supabase.from('booking_items_rovia').insert(validBookingItems);
        if (itemsError) throw new Error("Error guardando items de reserva en la BD.");
      }   
    }
   
    // 6. CORREOS ELECTRÓNICOS REDISEÑADOS (Rovia)
    const primaryColor = '#E4007C'; // Rosa Mexicano
    const bgDark = '#0a0a0a';
    const bgLight = '#f9f9fb';

    const isEnglish = locale === 'en';
    const subjectClient = isEnglish 
      ? `Boarding Pass - Thank you for traveling with Rovia!` 
      : `Pase de Abordar - ¡Gracias por viajar con Rovia!`;

    const greeting = isEnglish ? `Hello ${contactInfo.firstName},` : `Hola ${contactInfo.firstName},`;
    const confirmationText = isEnglish ? "Your adventure is officially confirmed. Get ready to experience the extraordinary." : "Tu aventura está oficialmente confirmada. Prepárate para vivir lo extraordinario.";
    const totalLabel = isEnglish ? "Total Investment" : "Inversión Total";
    const quoteLabel = isEnglish ? "Concierge Quote Payment" : "Pago de Cotización Concierge";
    const folioLabel = isEnglish ? "Folio" : "Folio";
    const qtyLabel = isEnglish ? "Travelers" : "Viajeros";
    const detailsLabel = isEnglish ? "Billing Information" : "Datos de Facturación";
    const phoneLabel = isEnglish ? "Phone:" : "Teléfono:";
    const addressLabel = isEnglish ? "Address:" : "Dirección:";
    const notesLabel = isEnglish ? "Notes:" : "Notas:";
    const badgeText = isEnglish ? "OFFICIAL CONFIRMATION" : "CONFIRMACIÓN OFICIAL";
    
    const htmlClient = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.05);">
        
        <!-- Header Dark Premium -->
        <div style="background-color: ${bgDark}; padding: 50px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: 900; letter-spacing: -2px;">Rovia</h1>
          <div style="margin-top: 16px; display: inline-block; background-color: rgba(228, 0, 124, 0.15); border: 1px solid rgba(228, 0, 124, 0.3); color: ${primaryColor}; padding: 6px 16px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">
            ${badgeText}
          </div>
        </div>

        <!-- Body -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #111111; margin-top: 0; margin-bottom: 12px; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">${greeting}</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-top: 0; margin-bottom: 40px;">${confirmationText}</p>
          
          <!-- Itinerary Items -->
          <div style="margin-bottom: 40px;">
            ${!manualFolioData ? cart.items.map((item: CartItem) => `
              <div style="background-color: ${bgLight}; border: 1px solid #eeeeee; border-radius: 20px; padding: 24px; margin-bottom: 16px;">
                <div style="margin-bottom: 16px;">
                  <h3 style="margin: 0 0 4px; font-size: 18px; font-weight: 800; color: #111111; letter-spacing: -0.5px;">${translateText(item.experience.title, locale)}</h3>
                  <p style="margin: 0; font-size: 13px; font-weight: 600; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 1px;">${translateText(item.levelName, locale)}</p>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                  <div style="background-color: #ffffff; padding: 8px 16px; border-radius: 12px; border: 1px solid #eeeeee;">
                    <p style="margin: 0; font-size: 11px; font-weight: 800; color: #999999; text-transform: uppercase; letter-spacing: 1px;">FECHA</p>
                    <p style="margin: 2px 0 0; font-size: 14px; font-weight: 700; color: #111111;">${item.date}</p>
                  </div>
                  <div style="background-color: #ffffff; padding: 8px 16px; border-radius: 12px; border: 1px solid #eeeeee;">
                    <p style="margin: 0; font-size: 11px; font-weight: 800; color: #999999; text-transform: uppercase; letter-spacing: 1px;">${qtyLabel}</p>
                    <p style="margin: 2px 0 0; font-size: 14px; font-weight: 700; color: #111111;">${item.people}</p>
                  </div>
                </div>
              </div>
            `).join('') : `
              <div style="background-color: ${bgLight}; border: 1px solid #eeeeee; border-radius: 20px; padding: 24px; margin-bottom: 16px;">
                <h3 style="margin: 0 0 4px; font-size: 18px; font-weight: 800; color: #111111; letter-spacing: -0.5px;">${quoteLabel}</h3>
                <p style="margin: 0; font-size: 13px; font-weight: 600; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 1px;">${folioLabel}: ${manualFolioData.folio}</p>
              </div>
            `}
          </div>

          <!-- Total (Rosa Mexicano Accent) -->
          <div style="background-color: ${bgDark}; border-radius: 24px; padding: 30px; text-align: center; margin-bottom: 40px;">
            <p style="margin: 0; font-size: 12px; font-weight: 800; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 2px;">${totalLabel}</p>
            <p style="margin: 8px 0 0; font-size: 40px; font-weight: 900; color: #ffffff; letter-spacing: -1px;">${formattedTotal}</p>
          </div>

          <!-- Billing Info -->
          <div style="padding: 24px; border-radius: 24px; border: 1px solid #eeeeee;">
            <h4 style="margin: 0 0 16px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #888888;">${detailsLabel}</h4>
            <p style="margin: 0 0 8px; font-size: 14px; color: #444444;"><strong>Email:</strong> ${contactInfo.email}</p>
            <p style="margin: 0 0 8px; font-size: 14px; color: #444444;"><strong>${phoneLabel}</strong> ${contactInfo.phone}</p>
            <p style="margin: 0; font-size: 14px; color: #444444; line-height: 1.5;"><strong>${addressLabel}</strong> ${billingInfo.direccion}, ${billingInfo.localidad}, ${billingInfo.estado}, ${billingInfo.codigo_postal}, ${billingInfo.pais}</p>
            ${orderNotes ? `<div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #eeeeee;"><p style="margin: 0; font-size: 14px; color: #444444; font-style: italic;"><strong>${notesLabel}</strong> ${orderNotes}</p></div>` : ''}
          </div>

        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'Rovia <info@rovia.com.mx>', 
      to: [contactInfo.email], 
      subject: subjectClient,
      html: htmlClient,
    });

    // --- NOTIFICACIÓN INTERNA PARA EL EQUIPO ---
    const subjectInternal = `[ROVIA - NUEVO INGRESO] - ${formattedTotal} - ${contactInfo.firstName} ${contactInfo.lastName}`;
    
    const htmlInternal = `
      <div style="font-family: -apple-system, sans-serif; color: #111; max-width: 600px; margin: auto; padding: 20px;">
        <div style="background: #0a0a0a; color: white; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #E4007C;">+ ${formattedTotal}</h2>
          <p style="margin: 5px 0 0; opacity: 0.7; font-size: 12px;">Nueva Venta Vía OctanoPayments</p>
        </div>
        <p><strong>ID Octano:</strong> ${saleData.transactionId || saleData.authorizationNumber}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <h3>Cliente</h3>
        <p><strong>Nombre:</strong> ${contactInfo.firstName} ${contactInfo.lastName}</p>
        <p><strong>Email:</strong> ${contactInfo.email}</p>
        <p><strong>Teléfono:</strong> ${contactInfo.phone}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <h3>Resumen:</h3>
        <ul style="background: #f9f9fb; padding: 20px 40px; border-radius: 12px;">
          ${!manualFolioData ? cart.items.map((item: CartItem) => `
            <li style="margin-bottom: 10px;"><strong>${item.experience.title}</strong> (x${item.people}) - ${formatPrice(item.totalPrice)}</li>
          `).join('') : `<li>Pago Manual de Folio: <strong>${manualFolioData.folio}</strong></li>`}
        </ul>
      </div>
    `;

    await resend.emails.send({
      from: 'Sistema Rovia <info@rovia.com.mx>',
      to: ['info@rovia.com.mx'],
      subject: subjectInternal,
      html: htmlInternal,
    });

    return NextResponse.json({ 
      success: true, 
      bookingId: booking.id,
    });

  } catch (error: unknown) {
    console.error("Error capturado en Backend:", error);
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
  }
}

