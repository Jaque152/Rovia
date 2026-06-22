import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, customerName, email, phone, message, destination, locale, budget, startDate, travelers } = body;

    // 1.  AMBOS tipos de formulario
    if (type !== 'CONTACT' && type !== 'QUOTE') {
      return NextResponse.json({ error: 'Tipo de correo no soportado' }, { status: 400 });
    }

    // Colores Tripnova (Sunset Horizon)
    const bgDark = '#1A1A1A'; // Deep Onyx
    const textAccent = '#FF6B6B'; // Vibrant Coral
    const textGold = '#FCA311'; // Golden Sand
    const bgLight = '#FAFAFA'; // Off-White
    const textColor = '#444444'; // Gris oscuro para lectura

    let subjectClient = '';
    let htmlClient = '';
    let subjectInternal = '';
    let htmlInternal = '';

    const greeting = `¡Hola ${customerName}!`;

    // ==========================================
    // 2A. LÓGICA PARA CONTACTO GENERAL
    // ==========================================
    if (type === 'CONTACT') {
      subjectClient = '[Tripnova] Hemos recibido tu mensaje';
      subjectInternal = `[NUEVO MENSAJE DE CONTACTO] - ${customerName}`;

      htmlClient = `
        <div style="font-family: 'DM Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a1a1a; max-width: 600px; margin: auto; border: 1px solid #e5e5e5; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);">
          <div style="background-color: ${bgDark}; padding: 40px 20px; text-align: center; border-bottom: 4px solid ${textAccent};">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">TRIPNOVA</h1>
          </div>
          <div style="padding: 40px 30px; background-color: #ffffff;">
            <h2 style="color: ${bgDark}; margin-top: 0; font-size: 24px; font-weight: 800;">${greeting}</h2>
            <p style="font-size: 16px; line-height: 1.6; color: ${textColor};">Hemos recibido tu mensaje con éxito. Nuestro equipo de expertos lo está analizando y nos pondremos en contacto contigo a la brevedad para ayudarte en tu próxima aventura.</p>
            
            <div style="margin: 30px 0; padding: 25px; border-radius: 16px; border: 1px solid #e5e5e5; background-color: ${bgLight};">
              <p style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #999999; margin-top: 0; margin-bottom: 15px;">Registro de tu mensaje</p>
              <p style="font-size: 14px; font-style: italic; color: ${textColor}; margin: 0; line-height: 1.5;">"${message || 'Sin mensaje adicional.'}"</p>
            </div>

            <div style="text-align: center; margin-top: 40px;">
              <a href="https://tripnova.com/es/#experiencias" style="display: inline-block; background-color: ${textAccent}; color: #ffffff; padding: 16px 32px; border-radius: 9999px; text-decoration: none; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                Explorar Rutas
              </a>
            </div>
          </div>
        </div>
      `;

      htmlInternal = `
        <div style="font-family: sans-serif; color: #333;">
          <h2 style="color: ${textAccent};">Nuevo Mensaje Web (Tripnova)</h2>
          <hr/>
          <p><strong>Nombre:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
          <hr/>
          <p><strong>Mensaje:</strong></p>
          <p style="background: ${bgLight}; padding: 15px; border-radius: 8px; border: 1px solid #e5e5e5;">${message || 'Sin mensaje'}</p>
        </div>
      `;
    } 
    // ==========================================
    // 2B. LÓGICA PARA COTIZACIONES
    // ==========================================
    else if (type === 'QUOTE') {
      subjectClient = `[Tripnova] Estamos diseñando tu ruta a ${destination}`;
      subjectInternal = `[NUEVA COTIZACIÓN] - ${destination} - ${customerName}`;

      htmlClient = `
        <div style="font-family: 'DM Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a1a1a; max-width: 600px; margin: auto; border: 1px solid #e5e5e5; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);">
          <div style="background-color: ${bgDark}; padding: 40px 30px; text-align: center; border-bottom: 4px solid ${textAccent};">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">TRIPNOVA</h1>
            <p style="color: ${textGold}; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 4px; margin-top: 10px;">Servicio Concierge</p>
          </div>
          <div style="padding: 40px 30px; background-color: #ffffff;">
            <h2 style="color: ${bgDark}; margin-top: 0; font-size: 24px; font-weight: 800;">${greeting}</h2>
            <p style="font-size: 16px; line-height: 1.6; color: ${textColor};">Hemos recibido tus coordenadas para <strong>${destination}</strong>. Nuestro equipo ya está orquestando tu itinerario a la medida y nos pondremos en contacto contigo muy pronto con una propuesta increíble.</p>
                        
            <div style="margin: 30px 0; padding: 25px; border-radius: 16px; border: 1px solid #e5e5e5; background-color: ${bgLight};">
              <p style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #999999; margin-top: 0; margin-bottom: 20px;">Detalles de tu solicitud</p>
              
              <div style="margin-bottom: 12px;">
                <span style="font-size: 14px; color: #888888; font-weight: 600;">Destino:</span><br/>
                <span style="font-size: 16px; color: ${bgDark}; font-weight: 800;">${destination}</span>
              </div>
              
              <div style="margin-bottom: 12px;">
                <span style="font-size: 14px; color: #888888; font-weight: 600;">Fecha de inicio:</span><br/>
                <span style="font-size: 16px; color: ${bgDark}; font-weight: 800;">${startDate}</span>
              </div>
              
              <div style="margin-bottom: 12px;">
                <span style="font-size: 14px; color: #888888; font-weight: 600;">Viajeros:</span><br/>
                <span style="font-size: 16px; color: ${bgDark}; font-weight: 800;">${travelers}</span>
              </div>
              
              <div>
                <span style="font-size: 14px; color: #888888; font-weight: 600;">Presupuesto estimado:</span><br/>
                <span style="font-size: 16px; color: ${textAccent}; font-weight: 800;">${budget}</span>
              </div>
            </div>

            ${message ? `
            <div style="background-color: ${bgLight}; padding: 20px; border-radius: 12px; border-left: 4px solid ${textGold}; margin-bottom: 30px;">
              <p style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #999999; margin-top: 0; margin-bottom: 10px;">Requerimientos Especiales</p>
              <p style="margin: 0; font-size: 14px; font-style: italic; color: ${textColor}; line-height: 1.5;">"${message}"</p>
            </div>
            ` : ''}
          </div>
        </div>
      `;

      htmlInternal = `
        <div style="font-family: sans-serif; color: #333;">
          <h2 style="color: ${textAccent};">Nueva Cotización (Tripnova)</h2>
          <hr/>
          <p><strong>Cliente:</strong> ${customerName}</p>
          <p><strong>Destino:</strong> ${destination}</p>
          <p><strong>Fecha:</strong> ${startDate}</p>
          <p><strong>Viajeros:</strong> ${travelers}</p>
          <p><strong>Presupuesto:</strong> ${budget}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
          <hr/>
          <p><strong>Requerimientos Especiales:</strong></p>
          <p style="background: ${bgLight}; padding: 15px; border-radius: 8px; border: 1px solid #e5e5e5;">${message || 'Sin requerimientos'}</p>
        </div>
      `;
    }

    // 3. ENVÍO DE CORREOS
    // Al cliente:
    const { data, error } = await resend.emails.send({
      from: 'Tripnova <info@tripnova.com.mx>', 
      to: [email],
      subject: subjectClient,
      html: htmlClient,
    });

    if (error) {
      console.error('Error de Resend al enviar al cliente:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Al equipo interno:
    const internalMail = await resend.emails.send({
      from: 'Sistema Tripnova <info@tripnova.com.mx>',
      to: ['info@tripnova.com.mx'], 
      subject: subjectInternal,
      html: htmlInternal,
    });

    if (internalMail.error) {
      console.error('Error al enviar correo interno:', internalMail.error);
      
    }

    return NextResponse.json({ ok: true, data });

  } catch (error: any) {
    console.error('Error crítico en API Send:', error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}




    