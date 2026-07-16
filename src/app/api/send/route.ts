import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, customerName, email, phone, message, destination, locale, budget, startDate, travelers } = body;

    if (type !== 'CONTACT' && type !== 'QUOTE') {
      return NextResponse.json({ error: 'Tipo de correo no soportado' }, { status: 400 });
    }

    const primaryColor = '#E4007C'; // Rosa Mexicano
    const bgDark = '#0a0a0a';
    const bgLight = '#f9f9fb';

    let subjectClient = '';
    let htmlClient = '';
    let subjectInternal = '';
    let htmlInternal = '';

    const isEn = locale === 'en';
    const greeting = isEn ? `Hello ${customerName},` : `Hola ${customerName},`;

    // ==========================================
    // 2A. LÓGICA PARA CONTACTO GENERAL
    // ==========================================
    if (type === 'CONTACT') {
      subjectClient = isEn ? '[Rovia] We have received your message' : '[Rovia] Hemos recibido tu mensaje';
      subjectInternal = `[ROVIA - NUEVO MENSAJE] - ${customerName}`;

      const bodyText = isEn 
        ? 'Your message has successfully reached our concierge desk. Our experts are currently reviewing your request and will be in touch shortly.'
        : 'Tu mensaje ha llegado exitosamente a nuestro escritorio concierge. Nuestros expertos lo están revisando y nos comunicaremos contigo a la brevedad.';
      const msgLabel = isEn ? 'Your transmission' : 'Registro de tu mensaje';
      const noMsgText = isEn ? 'No additional notes provided.' : 'Sin notas adicionales.';
      const btnText = isEn ? 'Explore the Catalog' : 'Explorar el Catálogo';

      htmlClient = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.05);">
          
          <div style="background-color: ${bgDark}; padding: 50px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: 900; letter-spacing: -2px;">Rovia</h1>
          </div>
          
          <div style="padding: 40px 30px;">
            <h2 style="color: #111111; margin-top: 0; margin-bottom: 12px; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">${greeting}</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-top: 0; margin-bottom: 30px;">${bodyText}</p>
            
            <div style="background-color: ${bgLight}; border-radius: 20px; padding: 24px; border: 1px solid #eeeeee;">
              <p style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #888888; margin-top: 0; margin-bottom: 12px;">${msgLabel}</p>
              <p style="font-size: 15px; font-style: italic; color: #111111; margin: 0; line-height: 1.6;">"${message || noMsgText}"</p>
            </div>

            <div style="text-align: center; margin-top: 40px;">
              <a href="https://rovia.com.mx/${locale}/experiencias" style="display: inline-block; background-color: ${bgDark}; color: #ffffff; padding: 18px 36px; border-radius: 9999px; text-decoration: none; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                ${btnText}
              </a>
            </div>
          </div>
        </div>
      `;

      htmlInternal = `
        <div style="font-family: -apple-system, sans-serif; color: #111; max-width: 600px; margin: auto; padding: 20px;">
          <h2 style="color: ${primaryColor};">Nuevo Mensaje (Rovia)</h2>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Nombre:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Mensaje:</strong></p>
          <p style="background: ${bgLight}; padding: 20px; border-radius: 12px; font-style: italic;">"${message || 'Sin mensaje'}"</p>
        </div>
      `;
    } 
    // ==========================================
    // 2B. LÓGICA PARA COTIZACIONES
    // ==========================================
    else if (type === 'QUOTE') {
      subjectClient = isEn ? `[Rovia] Curating your journey to ${destination}` : `[Rovia] Curando tu viaje a ${destination}`;
      subjectInternal = `[ROVIA - NUEVO DISEÑO DE RUTA] - ${destination}`;

      const conciergeTitle = isEn ? 'Concierge Services' : 'Servicio Concierge';
      const bodyText = isEn 
        ? `We have received your coordinates for <strong>${destination}</strong>. Our specialists are already orchestrating an impeccable, tailor-made itinerary. We will present you with an extraordinary proposal very soon.`
        : `Hemos recibido tus coordenadas para <strong>${destination}</strong>. Nuestros especialistas ya están orquestando un itinerario impecable y a la medida. Muy pronto te presentaremos una propuesta extraordinaria.`;
      
      const reqLabel = isEn ? 'Your Canvas' : 'Tu Lienzo de Viaje';
      const destLabel = isEn ? 'Destination' : 'Destino';
      const dateLabel = isEn ? 'Date' : 'Fecha';
      const paxLabel = isEn ? 'Travelers' : 'Viajeros';
      const specialReqLabel = isEn ? 'Special Requirements' : 'Notas Adicionales';

      htmlClient = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.05);">
          
          <div style="background-color: ${bgDark}; padding: 50px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: 900; letter-spacing: -2px;">Rovia</h1>
            <div style="margin-top: 16px; display: inline-block; background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #ffffff; padding: 6px 16px; border-radius: 9999px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">
              ${conciergeTitle}
            </div>
          </div>
          
          <div style="padding: 40px 30px;">
            <h2 style="color: #111111; margin-top: 0; margin-bottom: 12px; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">${greeting}</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-top: 0; margin-bottom: 30px;">${bodyText}</p>
                        
            <!-- Detalles de Cotización -->
            <div style="background-color: ${bgLight}; border-radius: 24px; padding: 30px; border: 1px solid #eeeeee;">
              <p style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #888888; margin-top: 0; margin-bottom: 24px; text-align: center;">${reqLabel}</p>
              
              <div style="display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 16px;">
                <div style="flex: 1; min-width: 120px; background-color: #ffffff; padding: 16px; border-radius: 16px; border: 1px solid #eeeeee;">
                  <span style="font-size: 10px; color: #999999; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">${destLabel}</span><br/>
                  <span style="font-size: 16px; color: #111111; font-weight: 800;">${destination}</span>
                </div>
                <div style="flex: 1; min-width: 120px; background-color: #ffffff; padding: 16px; border-radius: 16px; border: 1px solid #eeeeee;">
                  <span style="font-size: 10px; color: #999999; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">${dateLabel}</span><br/>
                  <span style="font-size: 16px; color: #111111; font-weight: 800;">${startDate}</span>
                </div>
              </div>
              
              <div style="display: flex; flex-wrap: wrap; gap: 16px;">
                <div style="flex: 1; min-width: 120px; background-color: #ffffff; padding: 16px; border-radius: 16px; border: 1px solid #eeeeee;">
                  <span style="font-size: 10px; color: #999999; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">${paxLabel}</span><br/>
                  <span style="font-size: 16px; color: #111111; font-weight: 800;">${travelers}</span>
                </div>
              </div>
            </div>

            ${message ? `
            <div style="margin-top: 24px; padding: 20px; border-left: 4px solid ${primaryColor}; background-color: rgba(228, 0, 124, 0.05); border-radius: 0 16px 16px 0;">
              <p style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: ${primaryColor}; margin-top: 0; margin-bottom: 8px;">${specialReqLabel}</p>
              <p style="margin: 0; font-size: 14px; font-style: italic; color: #444444; line-height: 1.6;">"${message}"</p>
            </div>
            ` : ''}
          </div>
        </div>
      `;

      htmlInternal = `
        <div style="font-family: -apple-system, sans-serif; color: #111; max-width: 600px; margin: auto; padding: 20px;">
          <h2 style="color: ${primaryColor};">Nueva Solicitud de Ruta (Rovia)</h2>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Cliente:</strong> ${customerName}</p>
          <p><strong>Destino:</strong> ${destination}</p>
          <p><strong>Fecha:</strong> ${startDate}</p>
          <p><strong>Viajeros:</strong> ${travelers}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Notas del Cliente:</strong></p>
          <p style="background: #f9f9fb; padding: 20px; border-radius: 12px; font-style: italic;">"${message || 'Sin requerimientos'}"</p>
        </div>
      `;
    }

    // 3. ENVÍO DE CORREOS
    const { data, error } = await resend.emails.send({
      from: 'Rovia <info@rovia.com.mx>',
      to: [email],
      subject: subjectClient,
      html: htmlClient,
    });

    if (error) {
      console.error('Error de Resend al enviar al cliente:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const internalMail = await resend.emails.send({
      from: 'Sistema Rovia <info@rovia.com.mx>',
      to: ['info@rovia.com.mx'], 
      subject: subjectInternal,
      html: htmlInternal,
    });

    if (internalMail.error) {
      console.error('Error al enviar correo interno:', internalMail.error);
    }

    return NextResponse.json({ ok: true, data });

  } catch (error: unknown) {
    console.error('Error crítico en API Send:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}