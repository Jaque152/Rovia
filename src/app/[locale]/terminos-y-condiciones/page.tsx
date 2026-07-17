"use client";

import { useLocale } from 'next-intl';
import { LegalPage } from "@/components/LegalPage";

const esSections = [
  {
    heading: "Términos y Condiciones – ARNUG, S.A. DE C.V. (ROVIA)",
    content: "Última actualización: 23 de junio 2026.\n\nEstos Términos y Condiciones regulan el acceso, navegación, cotización, contratación y uso del sitio web http://rovia.com.mx (en adelante el “Sitio”), así como de los servicios, productos, itinerarios, experiencias, planes, asesorías, contenidos digitales y propuestas personalizadas que ponemos a disposición de las personas usuarias. Al ingresar, navegar, cotizar, enviar formularios, solicitar información, contratar o pagar cualquiera de nuestros servicios, aceptas estos Términos y Condiciones."
  },
  {
    heading: "PRIMERA.- Identidad del prestador",
    content: "Somos una empresa dedicada al diseño, recomendación, comercialización, coordinación y, en su caso, gestión de experiencias turísticas, itinerarios, servicios de planeación de viaje, actividades de bienestar, experiencias culturales, gastronómicas, de aventura y servicios relacionados dentro de la República Mexicana. La denominación social, domicilio, correo electrónico y demás datos de identificación legal quedarán señalados como sigue:\n\nDenominación: ARNUG, S.A. DE C.V.\nDomicilio: Avenida Coyoacán 1878, Piso 14 Dep. 1405 – A, Colonia Del Valle Benito Juárez, Ciudad de Mexico, C.P. 03100.\nCorreo: info@rovia.com.mx"
  },
  {
    heading: "SEGUNDA.- Alcance de nuestros servicios",
    content: "Nuestros servicios pueden incluir, según el plan o experiencia contratada: itinerarios digitales, itinerarios personalizados, recomendaciones de hospedaje, restaurantes, rutas, actividades, experiencias culturales o de bienestar, guías de viaje, propuestas a medida, asesoría previa al viaje, apoyo de coordinación, y servicios de concierge o acompañamiento. De acuerdo con la descripción publicada en el sitio, también ofrecemos experiencias específicas por persona, itinerarios temáticos, planes para viajeros solos, parejas, familias o grupos, y cotizaciones personalizadas conforme al destino, número de personas, duración, tipo de experiencia y presupuesto aproximado.\n\nAlgunos servicios consisten exclusivamente en planeación, diseño de ruta, entrega de información, recomendaciones o asesoría; otros pueden incluir coordinación de reservas o vinculación con terceros. En los casos en que una reserva, traslado, hospedaje, tour, entrada o actividad sea prestada materialmente por un tercero, nuestra participación podrá limitarse a la intermediación, recomendación, gestión o coordinación, según se indique en cada caso."
  },
  {
    heading: "TERCERA.- Capacidad para contratar y uso permitido",
    content: "Solo podrán contratar nuestros servicios las personas con capacidad legal suficiente para obligarse conforme a la legislación aplicable. Si una persona contrata en nombre de un grupo, familia, pareja, empresa u otra persona, entendemos que cuenta con autorización suficiente para hacerlo y para aceptar estos Términos y Condiciones en representación de todas las personas viajeras incluidas en la solicitud.\n\nTe comprometes a utilizar el sitio y nuestros servicios de manera lícita, veraz y acorde con su finalidad. Queda prohibido usar el sitio para realizar actos fraudulentos, suplantar identidades, proporcionar información falsa, intentar vulnerar su funcionamiento, copiar contenidos sin autorización o utilizar nuestras propuestas, materiales, itinerarios o documentos con fines comerciales no autorizados."
  },
  {
    heading: "CUARTA.- Información proporcionada por la persona usuaria",
    content: "Para poder elaborar cotizaciones, itinerarios o propuestas personalizadas, podremos solicitar datos como destino o destinos de interés, número de personas, duración del viaje, tipo de experiencia buscada, presupuesto aproximado, nombre, correo electrónico, teléfono y cualquier otra información razonablemente necesaria para diseñar el servicio. La persona usuaria es responsable de que toda la información proporcionada sea exacta, completa y actualizada.\n\nNo seremos responsables por errores, omisiones, costos, afectaciones, propuestas inadecuadas o imposibilidad de prestar correctamente el servicio cuando estos deriven de información incompleta, inexacta o entregada fuera de tiempo por parte de la persona usuaria."
  },
  {
    heading: "QUINTA.- Naturaleza de las propuestas, itinerarios y recomendaciones",
    content: "Nuestras propuestas, itinerarios, guías, mapas, listas de lugares, recomendaciones y documentos digitales se elaboran con base en información disponible al momento de su preparación, criterios de planeación, experiencia operativa y referencias consideradas confiables. Sin embargo, las condiciones de viaje pueden cambiar por causas ajenas a nosotros, incluyendo disponibilidad, clima, cierres temporales, restricciones de acceso, cambios de horario, saturación, decisiones de autoridades, prestadores locales o condiciones de seguridad.\n\nPor ello, salvo que expresamente se indique como servicio confirmado con reserva formal, nuestros itinerarios y recomendaciones deben entenderse como una herramienta de planeación y orientación, no como garantía absoluta de disponibilidad, acceso, horario, tarifa, continuidad operativa o resultado específico."
  },
  {
    heading: "SEXTA.- Servicios prestados por terceros",
    content: "En diversos casos, los servicios turísticos efectivos pueden ser proporcionados por terceros, tales como hoteles, anfitriones, guías, transportistas, operadores de tours, recintos, restaurantes, centros de bienestar, comunidades, artesanos, espacios naturales, agencias de renta de autos u otros proveedores. Cuando ello ocurra, dichos terceros serán responsables directos de sus propios servicios, instalaciones, disponibilidad, atención, seguridad, operación, permisos, pólizas, restricciones, reglas, calidad y cumplimiento.\n\nNosotros no sustituimos la responsabilidad legal de los terceros prestadores ni respondemos por actos, omisiones, incumplimientos, cancelaciones, cambios, accidentes, pérdidas, retrasos, cierres, lesiones, enfermedades, mala prestación del servicio, negativa de acceso o cualquier situación generada directamente por ellos, salvo en aquello que la ley expresamente nos imponga por nuestra intervención específica."
  },
  {
    heading: "SÉPTIMA.- Precios, moneda e impuestos",
    content: "Los precios publicados en el sitio están expresados en pesos mexicanos y, conforme a la información del propio sitio, incluyen IVA. Asimismo, el sitio indica que el pago de ciertos planes es único por el plan seleccionado y que algunos servicios pueden requerir costos adicionales dependiendo de reservas de hoteles, tours o experiencias específicas.\n\nSalvo que se indique expresamente lo contrario, el precio publicado corresponde únicamente al servicio descrito en cada ficha o propuesta y no incluye conceptos no mencionados, como transporte foráneo, vuelos, hospedaje, alimentos, propinas, seguros amplios, entradas no especificadas, gastos personales, impuestos locales adicionales, cambios solicitados después de la entrega o cualquier otro concepto extraordinario.\n\nEn servicios personalizados o de concierge, podremos emitir cotizaciones particulares con vigencia limitada. Toda cotización estará sujeta a cambios si la persona usuaria modifica el alcance, fechas, número de viajeros, destino, tipo de experiencia o servicios requeridos."
  },
  {
    heading: "OCTAVA.- Formas de pago y confirmación",
    content: "El sitio indica que el pago puede realizarse en línea con tarjeta de forma segura. La contratación se considerará solicitada cuando recibamos la orden correspondiente, pero solo se tendrá por confirmada una vez que el pago haya sido autorizado, recibido y validado, y cuando además hayamos enviado confirmación expresa del servicio contratado, cuando ello resulte aplicable.\n\nNos reservamos el derecho de rechazar, suspender o cancelar solicitudes de compra o contratación cuando detectemos inconsistencias, errores manifiestos de precio, sospechas de fraude, cargos no reconocidos, datos incompletos, imposibilidad operativa o cualquier circunstancia que razonablemente justifique una revisión. En esos casos, procederemos conforme corresponda con la aclaración, reprogramación o reembolso aplicable."
  },
  {
    heading: "NOVENA.- Entrega de itinerarios, documentos y servicios digitales",
    content: "Los servicios digitales, como itinerarios, guías descargables, mapas, recomendaciones, propuestas o documentos personalizados, se entregarán por el medio que indiquemos al momento de la compra o confirmación, ya sea mediante correo electrónico, archivo digital, enlace de descarga, mensajería u otro canal acordado. Los tiempos de entrega podrán variar según la complejidad del servicio, el nivel de personalización y la oportunidad con la que la persona usuaria proporcione la información necesaria.\n\nCuando un servicio dependa de validación previa, videollamada, levantamiento de requerimientos o confirmación de destino, el plazo de entrega empezará a correr a partir de que contemos con todos los datos necesarios para desarrollarlo."
  },
  {
    heading: "DÉCIMA.- Cambios solicitados por la persona usuaria",
    content: "Si la persona usuaria solicita modificaciones al destino, fechas, número de viajeros, enfoque del viaje, presupuesto, tipo de experiencia o cualquier otro elemento sustancial después de haber iniciado la elaboración del servicio, podremos ajustar tiempos de entrega, alcance y costo. Algunas modificaciones podrán considerarse una actualización menor, mientras que otras podrán implicar la contratación de un nuevo servicio o el cobro de diferencias.\n\nEn particular, cuando el servicio contratado sea un plan estratégico, itinerario personalizado, concierge, paquete armado o propuesta a medida, cualquier cambio relevante posterior a la confirmación podrá estar sujeto a nueva valoración operativa y económica."
  },
  {
    heading: "DÉCIMA PRIMERA.- Reservas, disponibilidad y costos adicionales",
    content: "Cuando un servicio incluya o contemple apoyo con reservas, sugerencias de hospedaje, tours, renta de autos, actividades, entradas u otros componentes prestados por terceros, su disponibilidad dependerá de la oferta existente al momento de la gestión o contratación real. El hecho de que un servicio o precio aparezca en una propuesta, itinerario o recomendación no implica por sí mismo bloqueo de espacios ni garantía de disponibilidad futura.\n\nLos costos adicionales por reservas, hoteles, tours, seguros, transportes, ajustes de temporada, tarifas dinámicas, políticas de terceros o requerimientos especiales correrán a cargo de la persona usuaria, salvo pacto expreso en contrario."
  },
  {
    heading: "DÉCIMA SEGUNDA.- Obligaciones de la persona viajera",
    content: "Corresponde exclusivamente a cada persona viajera verificar y cumplir con los requisitos necesarios para realizar su viaje o participar en la experiencia contratada, incluyendo documentación personal, identificaciones, permisos, estado de salud, condición física, restricciones alimentarias, contraindicaciones médicas, requisitos de edad, reglas del operador, horarios de presentación y cualquier condición particular aplicable.\n\nEn actividades de aventura, naturaleza, bienestar, temazcal, trekking, cuevas, rafting, cenotes, recorridos comunitarios u otras actividades que impliquen exigencia física, contacto con entornos naturales o condiciones especiales, la persona usuaria reconoce que pueden existir riesgos inherentes y se obliga a seguir todas las instrucciones, advertencias y medidas de seguridad emitidas por el operador correspondiente."
  },
  {
    heading: "DÉCIMA TERCERA.- Salud, seguridad y riesgos inherentes",
    content: "Algunas experiencias turísticas pueden implicar esfuerzo físico, exposición a condiciones climáticas variables, terrenos irregulares, agua, calor, altura, fauna, alimentos regionales, prácticas tradicionales, transporte terrestre o dinámicas grupales. La contratación de estos servicios implica el reconocimiento de que existen riesgos normales e inherentes a este tipo de actividades.\n\nSerá responsabilidad de cada persona viajera informar oportunamente sobre padecimientos, lesiones, embarazo, alergias, limitaciones de movilidad, requerimientos especiales o cualquier circunstancia que pueda afectar su participación segura. Nos reservamos el derecho de abstenernos de recomendar, gestionar o confirmar ciertas experiencias cuando advirtamos que pueden no ser adecuadas para el perfil de la persona viajera o cuando el proveedor tercero así lo determine."
  },
  {
    heading: "DÉCIMA CUARTA.- Política de conducta y derecho de admisión de terceros",
    content: "Las personas usuarias y viajeras deberán conducirse con respeto hacia comunidades anfitrionas, personal operativo, guías, prestadores, artesanos, anfitriones, otros viajeros y entornos naturales o culturales. Cualquier conducta agresiva, discriminatoria, riesgosa, ilícita, abusiva o contraria a reglas básicas de convivencia podrá dar lugar a la suspensión del servicio, cancelación de actividades o negativa de acceso por parte nuestra o del tercero proveedor, sin responsabilidad para nosotros ni obligación de reembolso cuando la causa sea imputable a la persona usuaria."
  },
  {
    heading: "DÉCIMA QUINTA.- Fuerza mayor y caso fortuito",
    content: "No seremos responsables por incumplimientos, retrasos, reprogramaciones, cancelaciones o modificaciones derivadas de eventos fuera de nuestro control razonable, tales como fenómenos naturales, contingencias sanitarias, actos de autoridad, bloqueos, conflictos sociales, inseguridad, accidentes, fallas de comunicaciones, cierres carreteros, restricciones operativas, desastres naturales, falta de disponibilidad sobrevenida o cualquier supuesto de caso fortuito o fuerza mayor.\n\nEn tales casos, podremos buscar alternativas razonables, reprogramar, emitir saldos a favor o aplicar las condiciones que resulten viables conforme a la naturaleza del servicio y las políticas de terceros involucrados."
  },
  {
    heading: "DÉCIMA SEXTA.- Propiedad intelectual",
    content: "Todo el contenido del sitio, incluyendo textos, estructura, diseño, selección de destinos, descripciones, formatos, documentos, mapas, rutas, propuestas, metodología de planeación, materiales descargables, imágenes, logotipos, compilaciones y demás elementos, es de nuestra titularidad o se utiliza con autorización legítima.\n\nLa contratación de un servicio no transmite derechos de propiedad intelectual sobre nuestros materiales. La persona usuaria podrá utilizar el contenido entregado únicamente para fines personales y de uso propio vinculados con su viaje, y no podrá copiarlo, comercializarlo, reproducirlo, redistribuirlo, sublicenciarlo o explotarlo de manera distinta sin autorización previa y por escrito."
  },
  {
    heading: "DÉCIMA SÉPTIMA.- Promociones, descuentos y vigencia de ofertas",
    content: "Cualquier promoción, descuento, beneficio, campaña temporal o precio especial estará sujeto a la vigencia, alcance, condiciones y disponibilidad que se indiquen en cada caso. Nos reservamos el derecho de modificar o retirar promociones cuando concluyan su vigencia, exista error manifiesto o se detecte uso indebido."
  },
  {
    heading: "DÉCIMA OCTAVA.- Comunicaciones",
    content: "La persona usuaria acepta que podremos contactarla por correo electrónico, teléfono, mensajería o cualquier medio proporcionado para dar seguimiento a su solicitud, confirmar servicios, recabar información, compartir entregables, notificar cambios operativos o atender aclaraciones relacionadas con la contratación."
  },
  {
    heading: "DÉCIMA NOVENA.- Limitación de responsabilidad",
    content: "En la máxima medida permitida por la legislación aplicable, nuestra responsabilidad total frente a la persona usuaria por cualquier reclamación derivada de la contratación o uso de nuestros servicios se limitará al monto efectivamente pagado por el servicio específico que haya dado origen a la reclamación.\n\nNo seremos responsables por daños indirectos, incidentales, consecuenciales, lucro cesante, pérdida de oportunidad, pérdida de disfrute del viaje, gastos imprevistos, pérdidas derivadas de decisiones personales de viaje ni por hechos atribuibles a terceros prestadores, autoridades o circunstancias fuera de nuestro control razonable."
  },
  {
    heading: "VIGÉSIMA.- Cancelación o suspensión por nuestra parte",
    content: "Podremos cancelar o suspender servicios cuando exista imposibilidad material de cumplimiento, incumplimiento de la persona usuaria, falta de colaboración esencial, información falsa, conducta indebida, sospecha razonable de fraude, riesgo para la seguridad o cualquier situación que haga inviable continuar con la prestación. En su caso, procederemos conforme a la naturaleza del servicio ya ejecutado y a la política de reembolsos aplicable."
  },
  {
    heading: "VIGÉSIMA PRIMERA.- Datos personales",
    content: "El tratamiento de datos personales se regirá por nuestro Aviso de Privacidad, disponible en nuestro Sitio. La persona usuaria reconoce que ciertos datos serán necesarios para cotizar, contratar, diseñar experiencias personalizadas, dar seguimiento a servicios y, en su caso, coordinar con terceros prestadores, siempre conforme a la normativa aplicable."
  },
  {
    heading: "VIGÉSIMA SEGUNDA.- Nulidad parcial",
    content: "Si alguna disposición de estos Términos y Condiciones llegara a considerarse inválida, ilegal o inaplicable por autoridad competente, las demás disposiciones permanecerán vigentes y se interpretarán de forma que conserve, en la mayor medida posible, su finalidad original."
  },
  {
    heading: "VIGÉSIMA TERCERA.- Modificaciones",
    content: "Podremos actualizar estos Términos y Condiciones en cualquier momento para reflejar cambios legales, operativos, comerciales o de funcionamiento del sitio. La versión vigente será la publicada en el sitio en la fecha de su última actualización. El uso posterior del sitio o la contratación posterior de servicios implicará la aceptación de la versión actualizada."
  },
  {
    heading: "VIGÉSIMA CUARTA.- Legislación aplicable y jurisdicción",
    content: "Estos Términos y Condiciones se interpretarán conforme a las leyes aplicables en los Estados Unidos Mexicanos. Para la atención de cualquier controversia derivada de su interpretación, cumplimiento o ejecución, las partes se someterán a los Tribunales competentes de la Ciudad de México.\n\nAl solicitar una cotización, contratar o pagar cualquiera de nuestros servicios, confirmas que has leído y aceptas los presentes Términos y Condiciones, así como nuestro Aviso de Privacidad y, en su caso, la Política de Reembolsos."
  }
];

const enSections = [
  {
    heading: "Terms and Conditions – ARNUG, S.A. DE C.V. (ROVIA)",
    content: "Last update: June 23, 2026.\n\nThese Terms and Conditions regulate the access, navigation, quotation, contracting, and use of the website http://rovia.com.mx (hereinafter the 'Site'), as well as the services, products, itineraries, experiences, plans, consulting, digital content, and personalized proposals that we make available to users. By entering, navigating, quoting, submitting forms, requesting information, contracting, or paying for any of our services, you accept these Terms and Conditions."
  },
  {
    heading: "FIRST.- Identity of the provider",
    content: "We are a company dedicated to the design, recommendation, commercialization, coordination and, where appropriate, management of tourist experiences, itineraries, travel planning services, wellness activities, cultural, gastronomic, adventure experiences, and related services within the Mexican Republic. The corporate name, address, email, and other legal identification data will be indicated as follows:\n\nName: ARNUG, S.A. DE C.V.\nAddress: Avenida Coyoacán 1878, Piso 14 Dep. 1405 – A, Colonia Del Valle Benito Juárez, Mexico City, C.P. 03100.\nEmail: info@rovia.com.mx"
  },
  {
    heading: "SECOND.- Scope of our services",
    content: "Our services may include, depending on the contracted plan or experience: digital itineraries, personalized itineraries, accommodation recommendations, restaurants, routes, activities, cultural or wellness experiences, travel guides, tailor-made proposals, pre-trip consulting, coordination support, and concierge or accompaniment services. According to the description published on the site, we also offer specific experiences per person, thematic itineraries, plans for solo travelers, couples, families or groups, and personalized quotes according to the destination, number of people, duration, type of experience, and approximate budget.\n\nSome services consist exclusively of planning, route design, delivery of information, recommendations, or advice; others may include reservation coordination or connection with third parties. In cases where a reservation, transfer, accommodation, tour, entrance, or activity is materially provided by a third party, our participation may be limited to intermediation, recommendation, management, or coordination, as indicated in each case."
  },
  {
    heading: "THIRD.- Capacity to contract and permitted use",
    content: "Only persons with sufficient legal capacity to bind themselves under applicable law may contract our services. If a person contracts on behalf of a group, family, couple, company, or other person, we understand that they have sufficient authorization to do so and to accept these Terms and Conditions on behalf of all travelers included in the request.\n\nYou agree to use the site and our services in a lawful, truthful manner, and in accordance with their purpose. It is prohibited to use the site to carry out fraudulent acts, impersonate identities, provide false information, attempt to violate its operation, copy content without authorization, or use our proposals, materials, itineraries, or documents for unauthorized commercial purposes."
  },
  {
    heading: "FOURTH.- Information provided by the user",
    content: "In order to prepare quotes, itineraries, or personalized proposals, we may request data such as destination or destinations of interest, number of people, duration of the trip, type of experience sought, approximate budget, name, email, phone number, and any other reasonably necessary information to design the service. The user is responsible for ensuring that all provided information is accurate, complete, and updated.\n\nWe will not be responsible for errors, omissions, costs, damages, inappropriate proposals, or inability to properly provide the service when these derive from incomplete, inaccurate, or untimely information provided by the user."
  },
  {
    heading: "FIFTH.- Nature of the proposals, itineraries and recommendations",
    content: "Our proposals, itineraries, guides, maps, lists of places, recommendations, and digital documents are prepared based on information available at the time of preparation, planning criteria, operational experience, and references considered reliable. However, travel conditions may change due to causes beyond our control, including availability, weather, temporary closures, access restrictions, schedule changes, saturation, decisions by authorities, local providers, or security conditions.\n\nTherefore, unless expressly indicated as a confirmed service with a formal reservation, our itineraries and recommendations should be understood as a planning and guidance tool, not as an absolute guarantee of availability, access, schedule, rate, operational continuity, or specific outcome."
  },
  {
    heading: "SIXTH.- Services provided by third parties",
    content: "In several cases, effective tourism services may be provided by third parties, such as hotels, hosts, guides, carriers, tour operators, venues, restaurants, wellness centers, communities, artisans, natural spaces, car rental agencies, or other providers. When this occurs, these third parties will be directly responsible for their own services, facilities, availability, attention, security, operation, permits, policies, restrictions, rules, quality, and compliance.\n\nWe do not substitute the legal responsibility of third-party providers nor are we responsible for acts, omissions, breaches, cancellations, changes, accidents, losses, delays, closures, injuries, illnesses, poor service provision, denial of access, or any situation generated directly by them, except in what the law expressly imposes on us due to our specific intervention."
  },
  {
    heading: "SEVENTH.- Prices, currency and taxes",
    content: "The prices published on the site are expressed in Mexican pesos and, according to the information on the site itself, include VAT. Likewise, the site indicates that the payment of certain plans is unique for the selected plan and that some services may require additional costs depending on hotel reservations, tours, or specific experiences.\n\nUnless expressly stated otherwise, the published price corresponds only to the service described in each tab or proposal and does not include items not mentioned, such as foreign transport, flights, accommodation, food, tips, comprehensive insurance, unspecified tickets, personal expenses, additional local taxes, changes requested after delivery, or any other extraordinary concept.\n\nIn personalized or concierge services, we may issue specific quotes with limited validity. Any quote will be subject to changes if the user modifies the scope, dates, number of travelers, destination, type of experience, or required services."
  },
  {
    heading: "EIGHTH.- Payment methods and confirmation",
    content: "The site indicates that payment can be made online safely with a card. Contracting will be considered requested when we receive the corresponding order, but it will only be considered confirmed once the payment has been authorized, received, and validated, and when we have also sent express confirmation of the contracted service, when applicable.\n\nWe reserve the right to reject, suspend, or cancel purchase or contracting requests when we detect inconsistencies, manifest price errors, suspicions of fraud, unrecognized charges, incomplete data, operational impossibility, or any circumstance that reasonably justifies a review. In such cases, we will proceed accordingly with the applicable clarification, rescheduling, or refund."
  },
  {
    heading: "NINTH.- Delivery of itineraries, documents and digital services",
    content: "Digital services, such as itineraries, downloadable guides, maps, recommendations, proposals, or personalized documents, will be delivered by the means we indicate at the time of purchase or confirmation, whether by email, digital file, download link, messaging, or other agreed channel. Delivery times may vary depending on the complexity of the service, the level of personalization, and the timeliness with which the user provides the necessary information.\n\nWhen a service depends on prior validation, video call, requirements gathering, or destination confirmation, the delivery period will begin to run from the moment we have all the necessary data to develop it."
  },
  {
    heading: "TENTH.- Changes requested by the user",
    content: "If the user requests modifications to the destination, dates, number of travelers, travel focus, budget, type of experience, or any other substantial element after having started the elaboration of the service, we may adjust delivery times, scope, and cost. Some modifications may be considered a minor update, while others may involve contracting a new service or charging differences.\n\nIn particular, when the contracted service is a strategic plan, personalized itinerary, concierge, pre-packaged deal, or tailor-made proposal, any relevant change after confirmation may be subject to a new operational and economic assessment."
  },
  {
    heading: "ELEVENTH.- Reservations, availability and additional costs",
    content: "When a service includes or contemplates support with reservations, suggestions for accommodation, tours, car rentals, activities, tickets, or other components provided by third parties, its availability will depend on the existing offer at the time of the actual management or contracting. The fact that a service or price appears in a proposal, itinerary, or recommendation does not in itself imply blocking spaces or guarantee of future availability.\n\nAdditional costs for reservations, hotels, tours, insurance, transport, seasonal adjustments, dynamic rates, third-party policies, or special requirements will be borne by the user, unless expressly agreed otherwise."
  },
  {
    heading: "TWELFTH.- Obligations of the traveler",
    content: "It is exclusively the responsibility of each traveler to verify and comply with the necessary requirements to make their trip or participate in the contracted experience, including personal documentation, identifications, permits, health status, physical condition, dietary restrictions, medical contraindications, age requirements, operator rules, presentation times, and any particular applicable condition.\n\nIn adventure, nature, wellness, temazcal, trekking, caves, rafting, cenotes, community tours, or other activities that involve physical demands, contact with natural environments, or special conditions, the user acknowledges that there may be inherent risks and is obliged to follow all instructions, warnings, and safety measures issued by the corresponding operator."
  },
  {
    heading: "THIRTEENTH.- Health, security and inherent risks",
    content: "Some tourist experiences may involve physical effort, exposure to variable weather conditions, irregular terrain, water, heat, altitude, fauna, regional food, traditional practices, ground transportation, or group dynamics. Contracting these services implies the recognition that there are normal and inherent risks to this type of activities.\n\nIt will be the responsibility of each traveler to timely inform about illnesses, injuries, pregnancy, allergies, mobility limitations, special requirements, or any circumstance that may affect their safe participation. We reserve the right to refrain from recommending, managing, or confirming certain experiences when we notice that they may not be suitable for the traveler's profile or when the third-party provider determines so."
  },
  {
    heading: "FOURTEENTH.- Conduct policy and third-party right of admission",
    content: "Users and travelers must conduct themselves respectfully towards host communities, operational staff, guides, providers, artisans, hosts, other travelers, and natural or cultural environments. Any aggressive, discriminatory, risky, illicit, abusive conduct, or contrary to basic rules of coexistence may lead to the suspension of the service, cancellation of activities, or denial of access by us or the third-party provider, without responsibility for us or obligation of refund when the cause is attributable to the user."
  },
  {
    heading: "FIFTEENTH.- Force majeure and unforeseeable circumstances",
    content: "We will not be responsible for breaches, delays, rescheduling, cancellations, or modifications derived from events beyond our reasonable control, such as natural phenomena, health contingencies, acts of authority, blockades, social conflicts, insecurity, accidents, communications failures, road closures, operational restrictions, natural disasters, sudden lack of availability, or any event of unforeseeable circumstances or force majeure.\n\nIn such cases, we may seek reasonable alternatives, reschedule, issue credit balances, or apply the conditions that are viable according to the nature of the service and the policies of third parties involved."
  },
  {
    heading: "SIXTEENTH.- Intellectual property",
    content: "All site content, including texts, structure, design, selection of destinations, descriptions, formats, documents, maps, routes, proposals, planning methodology, downloadable materials, images, logos, compilations, and other elements, is our property or used with legitimate authorization.\n\nThe contracting of a service does not transfer intellectual property rights over our materials. The user may use the delivered content solely for personal purposes and own use linked to their trip, and may not copy, commercialize, reproduce, redistribute, sublicense, or exploit it differently without prior written authorization."
  },
  {
    heading: "SEVENTEENTH.- Promotions, discounts and validity of offers",
    content: "Any promotion, discount, benefit, temporary campaign, or special price will be subject to the validity, scope, conditions, and availability indicated in each case. We reserve the right to modify or withdraw promotions when their validity ends, there is a manifest error, or misuse is detected."
  },
  {
    heading: "EIGHTEENTH.- Communications",
    content: "The user agrees that we may contact them by email, phone, messaging, or any means provided to follow up on their request, confirm services, gather information, share deliverables, notify operational changes, or attend to clarifications related to the contracting."
  },
  {
    heading: "NINETEENTH.- Limitation of liability",
    content: "To the maximum extent permitted by applicable law, our total liability to the user for any claim arising from the contracting or use of our services will be limited to the amount actually paid for the specific service that gave rise to the claim.\n\nWe will not be responsible for indirect, incidental, consequential damages, loss of profit, loss of opportunity, loss of enjoyment of the trip, unforeseen expenses, losses derived from personal travel decisions nor for facts attributable to third-party providers, authorities, or circumstances beyond our reasonable control."
  },
  {
    heading: "TWENTIETH.- Cancellation or suspension by us",
    content: "We may cancel or suspend services when there is a material impossibility of compliance, user breach, lack of essential collaboration, false information, misconduct, reasonable suspicion of fraud, security risk, or any situation that makes it unfeasible to continue with the provision. In such case, we will proceed according to the nature of the service already executed and the applicable refund policy."
  },
  {
    heading: "TWENTY-FIRST.- Personal data",
    content: "The processing of personal data will be governed by our Privacy Notice, available on our Site. The user acknowledges that certain data will be necessary to quote, contract, design personalized experiences, follow up on services and, where appropriate, coordinate with third-party providers, always in accordance with applicable regulations."
  },
  {
    heading: "TWENTY-SECOND.- Partial invalidity",
    content: "If any provision of these Terms and Conditions were to be considered invalid, illegal, or inapplicable by a competent authority, the other provisions will remain in force and will be interpreted in a way that preserves, to the greatest extent possible, their original purpose."
  },
  {
    heading: "TWENTY-THIRD.- Modifications",
    content: "We may update these Terms and Conditions at any time to reflect legal, operational, commercial, or site functioning changes. The current version will be the one published on the site on the date of its last update. Subsequent use of the site or subsequent contracting of services will imply acceptance of the updated version."
  },
  {
    heading: "TWENTY-FOURTH.- Applicable law and jurisdiction",
    content: "These Terms and Conditions will be interpreted in accordance with the applicable laws of the United Mexican States. For the resolution of any controversy derived from their interpretation, compliance, or execution, the parties will submit to the competent Courts of Mexico City.\n\nBy requesting a quote, contracting, or paying for any of our services, you confirm that you have read and accept these Terms and Conditions, as well as our Privacy Notice and, where applicable, the Refund Policy."
  }
];

export default function TerminosYCondiciones() {
  const locale = useLocale();
  const isEnglish = locale === 'en';
  
  const title = isEnglish ? "Terms and Conditions" : "Términos y Condiciones";
  const sections = isEnglish ? enSections : esSections;

  return <LegalPage title={title} sections={sections} />;
}