import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { CartItem } from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// --- CREDENCIALES ETOMIN ---
const ETOMIN_EMAIL = process.env.ETOMIN_EMAIL!;
const ETOMIN_PASSWORD = process.env.ETOMIN_PASSWORD!;
const ETOMIN_BASE_URL = 'https://pagos.etomin.com/api/v1';

const resend = new Resend(process.env.RESEND_API_KEY);
const formatPrice = (price: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

const getEtominHeaders = (extraHeaders = {}) => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Origin': 'https://tripnova.com', 
  ...extraHeaders
});

async function safeEtominFetch(url: string, options: RequestInit, stepName: string) {
  const res = await fetch(url, options);
  const text = await res.text(); 
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error(`Respuesta cruda de Etomin en [${stepName}]:`, text);
    throw new Error(`Falla en ${stepName}. Etomin respondió: ${text.slice(0, 50)}...`);
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

    // 1. SIGNIN EN ETOMIN
    const signinData = await safeEtominFetch(`${ETOMIN_BASE_URL}/signin`, {
      method: 'POST',
      headers: getEtominHeaders(),
      body: JSON.stringify({ email: ETOMIN_EMAIL, password: ETOMIN_PASSWORD })
    }, 'Login Etomin');
    
    if (!signinData.authToken) {
      throw new Error("Credenciales de Etomin incorrectas o bloqueadas.");
    }
    const authToken = signinData.authToken;

    // 2. TOKENIZACIÓN DE TARJETA ETOMIN
    const cardPayload = {
      cardData: {
        cardNumber: cardInfo.number,
        cardholderName: cardInfo.name,
        expirationMonth: cardInfo.expiry.split('/')[0],
        expirationYear: cardInfo.expiry.split('/')[1],
      }
    };

    const tokenData = await safeEtominFetch(`${ETOMIN_BASE_URL}/card/tokenizer`, {
      method: 'POST',
      headers: getEtominHeaders({ 'Authorization': `Bearer ${authToken}` }),
      body: JSON.stringify(cardPayload)
    }, 'Tokenización de Tarjeta');

    if (!tokenData.cardNumberToken) {
      throw new Error("Tarjeta rechazada por Etomin (Datos inválidos o encriptación fallida).");
    }
    const cardToken = tokenData.cardNumberToken;

    // 3. PREPARAR ITEMS PARA LA VENTA
    const etominItems = manualFolioData 
      ? [{ title: `Pago Cotización: ${manualFolioData.folio}`, amount: manualFolioData.amount, quantity: 1, id: manualFolioData.folio }]
      : cart.items.map((item: CartItem) => ({
          title: item.experience.title, // Se envía en su idioma original a la pasarela
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
        country: 'MX',
        ip: '127.0.0.1' 
      },
      cardData: {
        cardNumberToken: cardToken,
        cvv: cardInfo.cvv
      },
      items: etominItems,
      redirectUrl: 'https://tripnova.com' 
    };

    const saleData = await safeEtominFetch(`${ETOMIN_BASE_URL}/sale`, {
      method: 'POST',
      headers: getEtominHeaders({ 'Authorization': `Bearer ${authToken}` }),
      body: JSON.stringify(salePayload)
    }, 'Procesar Venta');
    
    if (saleData.status !== 'APPROVED' && saleData.status !== 'PENDING') {
      console.error("❌ DETALLE DEL RECHAZO ETOMIN:", saleData); 
      throw new Error(`Pago declinado: ${saleData.message || saleData.responseCode || 'Tarjeta rechazada por el banco'}`);
    }

    // 5. GUARDAR EN SUPABASE (EN TABLAS TRIPNOVA)
    const { data: customer, error: custError } = await supabase
      .from('customers_tripnova')
      .upsert({ 
        first_name: contactInfo.firstName, 
        last_name: contactInfo.lastName, 
        email: contactInfo.email, 
        phone: contactInfo.phone 
      }, { onConflict: 'email' })
      .select().single();

    if (custError) throw new Error("Error guardando cliente en la base de datos.");

    const { data: booking, error: bookError } = await supabase
      .from('bookings_tripnova')
      .insert({
        customer_id: customer.id,
        session_id: manualFolioData ? manualFolioData.folio : null,
        total_amount: finalAmountToCharge,
        payment_status: 'paid',
        transaction_id: saleData.transactionId || saleData.authorizationNumber || tempReferenceId,
        payment_provider: 'etomin', 
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
        const { error: itemsError } = await supabase.from('booking_items_tripnova').insert(validBookingItems);
        if (itemsError) throw new Error("Error guardando items de reserva en la BD.");
      }   
    }
   
    // 6. CORREOS ELECTRÓNICOS 
    const primaryColor = '#FF6B6B'; // Coral Tripnova

    const isEnglish = locale === 'en';
    const subjectClient = isEnglish 
      ? `Purchase Confirmation - Thank you for traveling with Tripnova!` 
      : `Confirmación de Compra - ¡Gracias por viajar con Tripnova!`;

    const greeting = isEnglish ? `Hello ${contactInfo.firstName}!` : `¡Hola ${contactInfo.firstName}!`;
    const confirmationText = isEnglish ? "Your reservation is confirmed." : "Tu reservación ha sido confirmada.";
    const totalLabel = isEnglish ? "TOTAL PAID:" : "TOTAL PAGADO:";
    const quoteLabel = isEnglish ? "Quote Payment" : "Pago de Cotización";
    const folioLabel = isEnglish ? "Folio" : "Folio";
    const qtyLabel = isEnglish ? "Qty." : "Cant.";
    const priceLabel = isEnglish ? "Price" : "Precio";
    const experienceLabel = isEnglish ? "Experience" : "Experiencia";
    const detailsLabel = isEnglish ? "Contact & Billing Details" : "Detalles de Contacto y Facturación";
    const phoneLabel = isEnglish ? "Phone:" : "Teléfono:";
    const addressLabel = isEnglish ? "Address:" : "Dirección:";
    const notesLabel = isEnglish ? "Notes:" : "Notas:";
    
    const htmlClient = `
        <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: auto; color: #1a1a1a; border: 1px solid #e5e5e5; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #1a1a1a; padding: 40px 30px; text-align: center; border-bottom: 4px solid ${primaryColor};">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">TRIPNOVA</h1>
          </div>
          <div style="padding: 40px 30px; background-color: #ffffff;">
            <h2 style="color: #1a1a1a; margin-top: 0; font-size: 24px; font-weight: 800;">${greeting}</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #666666;">${confirmationText}</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; margin-top: 30px;">
              <thead>
                <tr style="border-bottom: 2px solid #f5f5f5; text-align: left;">
                  <th style="padding: 12px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #999999;">${experienceLabel}</th>
                  <th style="padding: 12px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #999999; text-align: center;">${qtyLabel}</th>
                  <th style="padding: 12px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #999999; text-align: right;">${priceLabel}</th>
                </tr>
              </thead>
              <tbody>
                ${!manualFolioData ? cart.items.map((item: CartItem) => `
                  <tr style="border-bottom: 1px solid #fafafa;">
                    <td style="padding: 20px 0;">
                      <p style="margin: 0; font-weight: 800; font-size: 16px; color: #1a1a1a;">${translateText(item.experience.title, locale)}</p>
                      <p style="margin: 6px 0 0; font-size: 13px; color: #666666;">📅 ${item.date} <br>✨ ${translateText(item.levelName, locale)}</p>
                    </td>
                    <td style="padding: 20px 0; text-align: center; vertical-align: top; font-weight: 600; color: #444444;">${item.people}</td>
                    <td style="padding: 20px 0; text-align: right; font-weight: 800; font-size: 15px; color: #1a1a1a; vertical-align: top;">${formatPrice(item.totalPrice)}</td>
                  </tr>
                `).join('') : `
                   <tr style="border-bottom: 1px solid #fafafa;">
                    <td style="padding: 20px 0;">
                      <p style="margin: 0; font-weight: 800; font-size: 16px; color: #1a1a1a;">${quoteLabel}</p>
                      <p style="margin: 6px 0 0; font-size: 13px; color: #666666;">${folioLabel}: ${manualFolioData.folio}</p>
                    </td>
                    <td style="padding: 20px 0; text-align: center; vertical-align: top; font-weight: 600;">1</td>
                    <td style="padding: 20px 0; text-align: right; font-weight: 800; font-size: 15px; color: #1a1a1a; vertical-align: top;">${formatPrice(manualFolioData.amount)}</td>
                  </tr>
                `}
              </tbody>
            </table>

            <div style="background-color: #fafafa; border-radius: 16px; padding: 25px; margin-bottom: 30px; text-align: right;">
              <span style="font-size: 14px; font-weight: 800; color: #666666; text-transform: uppercase; letter-spacing: 1px;">${totalLabel} </span>
              <span style="font-size: 28px; font-weight: 900; color: ${primaryColor}; display: block; margin-top: 5px;">${formattedTotal}</span>
            </div>

            <div style="padding: 25px; border-radius: 16px; border: 1px solid #e5e5e5;">
              <h3 style="margin: 0 0 20px; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #1a1a1a;">${detailsLabel}</h3>
              <p style="margin: 8px 0; font-size: 14px; color: #444444;"><strong>Email:</strong> ${contactInfo.email}</p>
              <p style="margin: 8px 0; font-size: 14px; color: #444444;"><strong>${phoneLabel}</strong> ${contactInfo.phone}</p>
              <p style="margin: 8px 0; font-size: 14px; color: #444444;"><strong>${addressLabel}</strong> ${billingInfo.direccion}, ${billingInfo.localidad}, ${billingInfo.estado}, ${billingInfo.codigo_postal}, ${billingInfo.pais}</p>
              ${orderNotes ? `<p style="margin: 8px 0; font-size: 14px; color: #444444; border-top: 1px dashed #cccccc; padding-top: 10px; mt-2;"><strong>${notesLabel}</strong> ${orderNotes}</p>` : ''}
            </div>

          </div>
        </div>
    `;

    await resend.emails.send({
      from: 'Tripnova <info@tripnova.com.mx>', 
      to: [contactInfo.email], 
      subject: subjectClient,
      html: htmlClient,
    });

    // --- NOTIFICACIÓN INTERNA PARA EL EQUIPO ---
    const subjectInternal = `[NUEVA VENTA] - ${formattedTotal} - ${contactInfo.firstName} ${contactInfo.lastName}`;
    
    const htmlInternal = `
      <div style="font-family: sans-serif; color: #333;">
        <h2 style="color: #FF6B6B;">¡Nueva Venta Registrada! (Vía Etomin)</h2>
        <p>Se ha procesado un pago exitoso a través de la página web Tripnova.</p>
        <hr/>
        <p><strong>Monto Total:</strong> ${formattedTotal}</p>
        <p><strong>ID Transacción (Etomin):</strong> ${saleData.transactionId || saleData.authorizationNumber}</p>
        <hr/>
        <h3>Datos del Cliente:</h3>
        <p><strong>Nombre:</strong> ${contactInfo.firstName} ${contactInfo.lastName}</p>
        <p><strong>Email:</strong> ${contactInfo.email}</p>
        <p><strong>Teléfono:</strong> ${contactInfo.phone}</p>
        <p><strong>Dirección:</strong> ${billingInfo.direccion}, ${billingInfo.localidad}, ${billingInfo.estado}, ${billingInfo.codigo_postal}</p>
        <p><strong>Notas:</strong> ${orderNotes || 'Sin notas'}</p>
        <hr/>
        <h3>Detalle del Pedido:</h3>
        <ul>
          ${!manualFolioData ? cart.items.map((item: CartItem) => `
            <li>${item.experience.title} (x${item.people}) - ${formatPrice(item.totalPrice)}</li>
          `).join('') : `<li>Pago Manual de Folio: ${manualFolioData.folio}</li>`}
        </ul>
      </div>
    `;

    await resend.emails.send({
      from: 'Sistema Tripnova <info@tripnova.com.mx>',
      to: ['info@tripnova.com.mx'],
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