CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================================
-- 1. LIMPIEZA PREVENTIVA
-- =====================================================================================
DROP TABLE IF EXISTS public.booking_items_tripnova CASCADE;
DROP TABLE IF EXISTS public.cart_items_tripnova CASCADE;
DROP TABLE IF EXISTS public.bookings_tripnova CASCADE;
DROP TABLE IF EXISTS public.activity_packages_tripnova CASCADE;
DROP TABLE IF EXISTS public.activities_tripnova CASCADE;
DROP TABLE IF EXISTS public.categories_tripnova CASCADE;
DROP TABLE IF EXISTS public.customers_tripnova CASCADE;
DROP TABLE IF EXISTS public.contact_messages_tripnova CASCADE;
DROP TABLE IF EXISTS public.custom_quotes_tripnova CASCADE;
DROP TABLE IF EXISTS public.fifa_experiences_tripnova CASCADE;

-- =====================================================================================
-- 2. CREACIÓN DE TABLAS TRIPNOVA (Estructura Optimizada)
-- =====================================================================================

CREATE TABLE public.categories_tripnova (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE
);

CREATE TABLE public.activities_tripnova (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  description TEXT,
  category_id INTEGER REFERENCES public.categories_tripnova(id),
  location VARCHAR,
  images JSONB,
  important_info JSONB, -- Estructura: {"codigo": "TRG...", "requiere_destino": boolean}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.activity_packages_tripnova (
  id SERIAL PRIMARY KEY,
  activity_id INTEGER REFERENCES public.activities_tripnova(id),
  package_name VARCHAR NOT NULL, 
  price NUMERIC NOT NULL,
  min_pax INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE public.customers_tripnova (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  phone VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bookings_tripnova (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.customers_tripnova(id),
  session_id VARCHAR, 
  total_amount NUMERIC NOT NULL,
  payment_status VARCHAR DEFAULT 'pending',
  transaction_id VARCHAR,
  payment_provider VARCHAR,
  payment_date TIMESTAMPTZ,
  pais VARCHAR,
  direccion VARCHAR,
  localidad VARCHAR,
  estado VARCHAR,
  codigo_postal VARCHAR,
  order_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.booking_items_tripnova (
  id SERIAL PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings_tripnova(id),
  package_id INTEGER REFERENCES public.activity_packages_tripnova(id),
  scheduled_date DATE NOT NULL,
  scheduled_time VARCHAR,
  pax_qty INTEGER DEFAULT 1,
  unit_price NUMERIC NOT NULL
);

CREATE TABLE public.custom_quotes_tripnova (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR NOT NULL,
  customer_email VARCHAR NOT NULL,
  phone VARCHAR,
  destination VARCHAR,
  pax_qty INTEGER,
  budget VARCHAR,
  special_requests TEXT,
  start_date DATE,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.contact_messages_tripnova (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR,
  phone VARCHAR,
  email VARCHAR,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.fifa_experiences_tripnova (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  subtitle VARCHAR,
  description TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  order_index INTEGER DEFAULT 0
);

-- =====================================================================================
-- 3. POLÍTICAS DE SEGURIDAD RLS
-- =====================================================================================
ALTER TABLE public.categories_tripnova ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities_tripnova ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_packages_tripnova ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fifa_experiences_tripnova ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers_tripnova ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings_tripnova ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_items_tripnova ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_quotes_tripnova ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages_tripnova ENABLE ROW LEVEL SECURITY;

-- Lectura pública para catálogos
CREATE POLICY "Lectura pública catálogos" ON public.categories_tripnova FOR SELECT USING (true);
CREATE POLICY "Lectura pública actividades" ON public.activities_tripnova FOR SELECT USING (true);
CREATE POLICY "Lectura pública paquetes" ON public.activity_packages_tripnova FOR SELECT USING (true);
CREATE POLICY "Lectura pública fifa" ON public.fifa_experiences_tripnova FOR SELECT USING (true);

-- Permisos para Checkout
CREATE POLICY "Acceso a clientes en checkout" ON public.customers_tripnova FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso a reservas en checkout" ON public.bookings_tripnova FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso a items de reserva" ON public.booking_items_tripnova FOR ALL USING (true) WITH CHECK (true);

-- Permisos explícitos para formularios web (Cotizar y Contacto)
CREATE POLICY "Permitir insercion cotizaciones" ON public.custom_quotes_tripnova FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Permitir insercion contacto" ON public.contact_messages_tripnova FOR INSERT TO anon WITH CHECK (true);

-- Otorgar los privilegios al rol anónimo para evitar bloqueos silenciosos
GRANT INSERT ON public.custom_quotes_tripnova TO anon;
GRANT INSERT ON public.contact_messages_tripnova TO anon;

-- =====================================================================================
-- 4. INSERTAR CATEGORÍAS TRIPNOVA
-- =====================================================================================
INSERT INTO public.categories_tripnova (id, name, slug) VALUES 
(1, 'Experiencias de Bienestar', 'experiencias-bienestar'),
(2, 'Itinerarios de Viaje', 'itinerarios-viaje'),
(3, 'Tours Locales', 'tours-locales'),
(4, 'Talleres Artesanales', 'talleres-artesanales'),
(5, 'Servicios Adicionales', 'servicios-adicionales'),
(6, 'Paquetes Combinados', 'paquetes-combinados'),
(7, 'Planes Premium Travel Concierge', 'premium-travel-concierge');

SELECT setval('categories_tripnova_id_seq', 7);

-- =====================================================================================
-- 5. INSERTAR LOS 41 NUEVOS PLANES (Asignados correctamente a las nuevas categorías)
-- =====================================================================================
INSERT INTO public.activities_tripnova (id, title, slug, category_id, location, description, important_info, images) VALUES
(1, 'Sesión de Yoga con Meditación Sonora', 'yoga-meditacion-tepoztlan', 1, 'Tepoztlán', 'Clase de yoga, meditación guiada, terapia con cuencos sonoros, espacio natural de relajación. Precio por persona con IVA incluido.', '{"codigo": "TRG-EB07", "requiere_destino": false}', '["https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg"]'),
(2, 'Itinerario Express', 'itinerario-express', 2, 'A elección', 'Escapadas de fin de semana o viajes de 1 a 3 días. Ruta básica del destino, 3-6 lugares recomendados, 2-4 recomendaciones de restaurantes locales, actividades principales. El cliente confirma su destino. Precio con IVA incluido.', '{"codigo": "TRG-IT01", "requiere_destino": true}', '["https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg"]'),
(3, 'Experiencias Indígenas Comunitarias', 'experiencias-indigenas-comunitarias', 3, 'Varios', 'Actividad cultural con comunidad local, demostración de tradiciones o artesanías, taller participativo, degustación tradicional, guía comunitario. Duración: 2-4 horas. Precio por persona con IVA incluido.', '{"codigo": "TRG-TL05", "requiere_destino": false}', '["https://images.pexels.com/photos/2873836/pexels-photo-2873836.jpeg"]'),
(4, 'Clase de Yoga en la Naturaleza', 'yoga-naturaleza-tulum', 1, 'Tulum', 'Sesión guiada de yoga, meditación o respiración, uso de tapetes, sesión en playa o selva. Duración: 1-2 horas. Precio por persona con IVA incluido.', '{"codigo": "TRG-EB03", "requiere_destino": false}', '["https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg"]'),
(5, 'Guía Local en Pueblos Mágicos', 'guia-local-pueblos-magicos', 3, 'Varios', 'Recorrido por el centro histórico, explicación cultural e histórica, visita a 3-5 puntos de interés, recomendaciones de restaurantes y tiendas locales, guía certificado. Duración: 2-3 horas. Precio por persona con IVA incluido.', '{"codigo": "TRG-TL04", "requiere_destino": false}', '["https://images.pexels.com/photos/2873836/pexels-photo-2873836.jpeg"]'),
(6, 'Temazcal Comunitario Tradicional', 'temazcal-comunitario-san-cristobal', 1, 'San Cristóbal de las Casas', 'Ritual tradicional en grupo, hierbas medicinales, té herbal posterior, guía local. Precio por persona con IVA incluido.', '{"codigo": "TRG-EB04", "requiere_destino": false}', '["https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg"]'),
(7, 'Itinerario Económico Digital', 'itinerario-economico-digital', 2, 'A elección', 'Guía organizada para viajeros. PDF descargable, mapa de lugares, lista de hospedajes económicos, recomendación de 5 restaurantes locales. El cliente confirma su destino. Precio con IVA incluido.', '{"codigo": "TRG-IT02", "requiere_destino": false}', '["https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg"]'),
(8, 'Itinerario para Viajeros Mochileros', 'itinerario-mochileros', 2, 'A elección', 'Transporte económico, hostales y actividades baratas. Transporte público sugerido, hostales, rutas a pie, actividades gratuitas. El cliente confirma su destino. Precio con IVA incluido.', '{"codigo": "TRG-IT03", "requiere_destino": false}', '["https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg"]'),
(9, 'Taller de Papel Amate', 'taller-papel-amate-san-pablito', 4, 'San Pablito', 'Proceso artesanal, elaboración de papel, creación de pieza artesanal sencilla, recorrido por talleres comunitarios. Duración: 2-3 horas. Precio por persona con IVA incluido.', '{"codigo": "TRG-TA07", "requiere_destino": false}', '["https://images.pexels.com/photos/2873836/pexels-photo-2873836.jpeg"]'),
(10, 'Taller de Textiles Tradicionales', 'taller-textiles-zinacantan', 4, 'Zinacantán', 'Telar de cintura, bordados tradicionales, tejido básico, vestimenta tradicional. Duración: 2-3 horas. Precio por persona con IVA incluido.', '{"codigo": "TRG-TA04", "requiere_destino": false}', '["https://images.pexels.com/photos/2873836/pexels-photo-2873836.jpeg"]'),
(11, 'Recomendaciones de Renta de Autos', 'recomendaciones-renta-autos', 5, 'Nacional', 'Comparación de agencias, recomendaciones de seguros, reserva anticipada. Precio con IVA incluido.', '{"codigo": "TRG-SV01", "requiere_destino": false}', '["https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg"]'),
(12, 'Experiencia Huasteca Cultural', 'huasteca-cultural-xilitla', 3, 'Xilitla', 'Música huasteca, baile tradicional, degustación de comida regional, tradiciones locales. Duración: 2-4 horas. Precio por persona con IVA incluido.', '{"codigo": "TRG-TA08", "requiere_destino": false}', '["https://images.pexels.com/photos/2873836/pexels-photo-2873836.jpeg"]'),
(13, 'Experiencia Purépecha Cultural', 'purepecha-cultural-tzintzuntzan', 3, 'Tzintzuntzan', 'Recorrido por comunidad indígena, tradiciones purépechas, artesanía local, degustación de comida tradicional. Duración: 2-4 horas. Precio por persona con IVA incluido.', '{"codigo": "TRG-TA05", "requiere_destino": false}', '["https://images.pexels.com/photos/2873836/pexels-photo-2873836.jpeg"]'),
(14, 'Taller de Barro Tradicional', 'taller-barro-coyotepec', 4, 'San Bartolo Coyotepec', 'Demostración de elaboración de barro negro, taller de modelado, técnicas tradicionales, recorrido por taller artesanal. Duración: 2-3 horas. Precio por persona con IVA incluido.', '{"codigo": "TRG-TA01", "requiere_destino": false}', '["https://images.pexels.com/photos/2873836/pexels-photo-2873836.jpeg"]'),
(15, 'Taller de Máscaras Tradicionales', 'taller-mascaras-tocuaro', 4, 'Tócuaro', 'Tallado en madera, uso cultural de las máscaras, pintura básica, interacción con artesanos. Duración: 2-3 horas. Precio por persona con IVA incluido.', '{"codigo": "TRG-TA06", "requiere_destino": false}', '["https://images.pexels.com/photos/2873836/pexels-photo-2873836.jpeg"]'),
(16, 'Tour de Mezcal', 'tour-mezcal-pueblos', 6, 'Pueblos Pequeños', 'Visita a 1-2 palenques artesanales, explicación del proceso del mezcal, degustación de 3-5 variedades, guía mezcalero, transporte local, compra directa al productor. Duración: 3-5 horas. Precio por persona con IVA incluido.', '{"codigo": "TRG-TL03", "requiere_destino": false}', '["https://images.pexels.com/photos/2081199/pexels-photo-2081199.jpeg"]'),
(17, 'Taller de Talabartería', 'taller-talabarteria-leon', 4, 'León', 'Trabajo en cuero, proceso artesanal, actividad sencilla participativa, visita a taller local. Duración: 2-3 horas. Precio por persona con IVA incluido.', '{"codigo": "TRG-TA09", "requiere_destino": false}', '["https://images.pexels.com/photos/2873836/pexels-photo-2873836.jpeg"]'),
(18, 'Taller de Alebrijes', 'taller-alebrijes-tilcajete', 4, 'San Martín Tilcajete', 'Arte de los alebrijes, tallado en madera, pintura básica de figura artesanal, interacción con artesanos locales. Duración: 2-3 horas. Precio por persona con IVA incluido.', '{"codigo": "TRG-TA02", "requiere_destino": false}', '["https://images.pexels.com/photos/2873836/pexels-photo-2873836.jpeg"]'),
(19, 'Experiencia de Bienestar en Cenotes', 'bienestar-cenotes-valladolid', 1, 'Valladolid', 'Meditación guiada, yoga en cenote o naturaleza, baño en cenote, bebidas naturales. Precio por persona con IVA incluido.', '{"codigo": "TRG-EB10", "requiere_destino": false}', '["https://images.pexels.com/photos/2704257/pexels-photo-2704257.jpeg"]'),
(20, 'Tour de 2 Cenotes', 'tour-2-cenotes-yucatan', 3, 'Yucatán', 'Transporte local, entrada a 2 cenotes naturales, tiempo libre para nadar, chaleco salvavidas, guía local, agua o bebida hidratante, seguro básico. Duración: 4-6 horas. Precio por persona con IVA incluido.', '{"codigo": "TRG-TL01", "requiere_destino": false}', '["https://images.pexels.com/photos/2704257/pexels-photo-2704257.jpeg"]'),
(21, 'Experiencia de Cocina Tradicional Maya', 'cocina-tradicional-maya-merida', 6, 'Mérida', 'Preparación de platillos tradicionales, ingredientes regionales, degustación, introducción a tradiciones culinarias mayas. Duración: 3-4 horas. Precio por persona con IVA incluido.', '{"codigo": "TRG-TA03", "requiere_destino": false}', '["https://images.pexels.com/photos/2081199/pexels-photo-2081199.jpeg"]'),
(22, 'Experiencia de Temazcal Tradicional', 'temazcal-tradicional-tepoztlan', 1, 'Tepoztlán', 'Ceremonia de temazcal guiada, hierbas medicinales, cantos o ritual tradicional, bebidas herbales. Duración: 1-2 horas. Precio por persona con IVA incluido.', '{"codigo": "TRG-EB01", "requiere_destino": false}', '["https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg"]'),
(23, 'Taller de Cerámica Tradicional', 'taller-ceramica-mata-ortiz', 4, 'Mata Ortiz', 'Técnicas de cerámica, modelado y decoración, creación básica de pieza artesanal, interacción con artesanos. Duración: 2-3 horas. Precio por persona con IVA incluido.', '{"codigo": "TRG-TA10", "requiere_destino": false}', '["https://images.pexels.com/photos/2873836/pexels-photo-2873836.jpeg"]'),
(24, 'Itinerario de Pueblos Mágicos', 'itinerario-pueblos-magicos', 2, 'A elección', 'Rutas entre pueblos pequeños. Rutas de carretera, hospedajes boutique, experiencias culturales. Ejemplos: Real de Catorce, Cuatro Ciénegas, Xilitla. Precio con IVA incluido.', '{"codigo": "TRG-IT05", "requiere_destino": false}', '["https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg"]'),
(25, 'Itinerario Gastronómico', 'itinerario-gastronomico', 2, 'A elección', 'Exploración de comida regional. Recomendación de 5-10 restaurantes locales, mercados tradicionales, tours gastronómicos y comida típica del destino. El cliente confirma su destino. Precio con IVA incluido.', '{"codigo": "TRG-IT04", "requiere_destino": false}', '["https://images.pexels.com/photos/2081199/pexels-photo-2081199.jpeg"]'),
(26, 'Itinerario para Road Trip', 'itinerario-road-trip', 2, 'A elección', 'Viajes en carretera. Rutas panorámicas, paradas recomendadas, gasolineras, hospedajes en carretera. Precio con IVA incluido.', '{"codigo": "TRG-IT08", "requiere_destino": false}', '["https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg"]'),
(27, 'Tour Gastronómico', 'tour-gastronomico-oaxaca', 6, 'Oaxaca', 'Recorrido por mercados y zonas gastronómicas, degustación de 4 a 6 platillos típicos, explicación cultural, bebidas tradicionales, guía gastronómico, visita a cocinas tradicionales. Duración: 4 horas. Precio por persona con IVA incluido.', '{"codigo": "TRG-TL02", "requiere_destino": false}', '["https://images.pexels.com/photos/2081199/pexels-photo-2081199.jpeg"]'),
(28, 'Itinerario Cultural e Histórico', 'itinerario-cultural-historico', 2, 'A elección', 'Museos, zonas arqueológicas y sitios históricos. Guías culturales, rutas históricas, museos y sitios arqueológicos. Ejemplos: Teotihuacan, Monte Alban, Palenque. Precio con IVA incluido.', '{"codigo": "TRG-IT07", "requiere_destino": false}', '["https://images.pexels.com/photos/327394/pexels-photo-327394.jpeg"]'),
(29, 'Circuito de Spa y Relajación', 'circuito-spa-playa-del-carmen', 1, 'Playa del Carmen', 'Sauna y vapor, piscinas de hidroterapia, mini masaje o exfoliación, bebidas y descanso. Duración: 3-6 horas. Precio por persona con IVA incluido.', '{"codigo": "TRG-EB02", "requiere_destino": false}', '["https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg"]'),
(30, 'Experiencia de Spa Natural con Temazcal', 'spa-natural-temazcal-bacalar', 1, 'Bacalar', 'Temazcal, masaje relajante, uso de laguna o piscina natural, bebidas naturales. Precio por persona con IVA incluido.', '{"codigo": "TRG-EB08", "requiere_destino": false}', '["https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg"]'),
(31, 'Itinerario Familiar', 'itinerario-familiar', 2, 'A elección', 'Viajes con niños. Parques, actividades educativas y restaurantes familiares. Precio con IVA incluido.', '{"codigo": "TRG-IT10", "requiere_destino": false}', '["https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg"]'),
(32, 'Itinerario de Aventura', 'itinerario-aventura', 3, 'A elección', 'Naturaleza y deportes extremos. Trekking, cascadas, cuevas, rafting o rappel. Destinos: Huasteca Potosina, Sierra Tarahumara, Selva Lacandona. Precio con IVA incluido.', '{"codigo": "TRG-IT06", "requiere_destino": false}', '["https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg"]'),
(33, 'Paquete Explorador', 'paquete-explorador', 7, 'Nacional', 'Itinerario personalizado, recomendaciones locales, mapa interactivo. Precio con IVA incluido.', '{"codigo": "TRG-PQ01", "requiere_destino": false}', '["https://images.pexels.com/photos/327394/pexels-photo-327394.jpeg"]'),
(34, 'Experiencia de Temazcal en Resort', 'temazcal-resort-riviera-maya', 1, 'Riviera Maya', 'Ceremonia guiada por chamán, ritual con copal, bebidas herbales, acceso a instalaciones del spa. Precio por persona con IVA incluido.', '{"codigo": "TRG-EB06", "requiere_destino": false}', '["https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg"]'),
(35, 'Itinerario Romántico', 'itinerario-romantico', 2, 'A elección', 'Parejas o luna de miel. Hoteles boutique, restaurantes románticos, experiencias privadas. Destinos: San Miguel de Allende, Valle de Bravo, Bacalar. Precio con IVA incluido.', '{"codigo": "TRG-IT09", "requiere_destino": false}', '["https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg"]'),
(36, 'Plan Travel Planner Profesional', 'travel-planner-profesional', 5, 'Nacional', 'Itinerario detallado, mapas interactivos, asesoría por videollamada, recomendaciones personalizadas. Precio con IVA incluido.', '{"codigo": "TRG-PP01", "requiere_destino": false}', '["https://images.pexels.com/photos/327394/pexels-photo-327394.jpeg"]'),
(37, 'Plan Concierge de Viaje', 'concierge-de-viaje', 5, 'Nacional', 'Planificación completa, reservas de hoteles (puede llevar costo adicional), reservas de tours (puede llevar costo adicional), asistencia durante el viaje. Precio con IVA incluido.', '{"codigo": "TRG-PP02", "requiere_destino": false}', '["https://images.pexels.com/photos/327394/pexels-photo-327394.jpeg"]'),
(38, 'Paquete Aventura Total', 'paquete-aventura-total', 7, 'Nacional', 'Itinerario, reservas de tours (puede llevar costo adicional), guía local. Precio con IVA incluido.', '{"codigo": "TRG-PQ02", "requiere_destino": false}', '["https://images.pexels.com/photos/327394/pexels-photo-327394.jpeg"]'),
(39, 'Retiro Corto de Yoga y Meditación', 'retiro-yoga-malinalco', 1, 'Malinalco', 'Clases diarias de yoga, meditación guiada, alimentación saludable, actividades de bienestar. Precio por persona con IVA incluido.', '{"codigo": "TRG-EB05", "requiere_destino": false}', '["https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg"]'),
(40, 'Paquete Viaje Completo', 'paquete-viaje-completo', 7, 'Nacional', 'Planificación total, reservas (puede llevar costo adicional), soporte durante el viaje. Precio con IVA incluido.', '{"codigo": "TRG-PQ03", "requiere_destino": false}', '["https://images.pexels.com/photos/327394/pexels-photo-327394.jpeg"]'),
(41, 'Retiro de Yoga frente al Mar', 'retiro-yoga-huatulco', 1, 'Huatulco', 'Hospedaje, clases diarias de yoga, meditación, temazcal y talleres. Duración: 5-7 días. Precio por persona con IVA incluido.', '{"codigo": "TRG-EB09", "requiere_destino": false}', '["https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg"]');

SELECT setval('activities_tripnova_id_seq', 41);

-- =====================================================================================
-- 6. ASIGNAR TARIFAS ÚNICAS
-- =====================================================================================
INSERT INTO public.activity_packages_tripnova (activity_id, package_name, price) VALUES
(1, 'Tarifa Única', 800.00), (2, 'Tarifa Única', 900.00), (3, 'Tarifa Única', 900.00),
(4, 'Tarifa Única', 1000.00), (5, 'Tarifa Única', 1200.00), (6, 'Tarifa Única', 1250.00),
(7, 'Tarifa Única', 1350.00), (8, 'Tarifa Única', 1500.00), (9, 'Tarifa Única', 1500.00),
(10, 'Tarifa Única', 1500.00), (11, 'Tarifa Única', 1600.00), (12, 'Tarifa Única', 1700.00),
(13, 'Tarifa Única', 1800.00), (14, 'Tarifa Única', 1800.00), (15, 'Tarifa Única', 2000.00),
(16, 'Tarifa Única', 2000.00), (17, 'Tarifa Única', 2200.00), (18, 'Tarifa Única', 2200.00),
(19, 'Tarifa Única', 2400.00), (20, 'Tarifa Única', 2500.00), (21, 'Tarifa Única', 2500.00),
(22, 'Tarifa Única', 2500.00), (23, 'Tarifa Única', 2500.00), (24, 'Tarifa Única', 2800.00),
(25, 'Tarifa Única', 3100.00), (26, 'Tarifa Única', 3200.00), (27, 'Tarifa Única', 3500.00),
(28, 'Tarifa Única', 3500.00), (29, 'Tarifa Única', 3600.00), (30, 'Tarifa Única', 3600.00),
(31, 'Tarifa Única', 3800.00), (32, 'Tarifa Única', 4000.00), (33, 'Tarifa Única', 4500.00),
(34, 'Tarifa Única', 4700.00), (35, 'Tarifa Única', 6000.00), (36, 'Tarifa Única', 8000.00),
(37, 'Tarifa Única', 8900.00), (38, 'Tarifa Única', 12000.00), (39, 'Tarifa Única', 12000.00),
(40, 'Tarifa Única', 35000.00), (41, 'Tarifa Única', 35000.00);

-- =====================================================================================
-- 7. DATOS MUNDIAL
-- =====================================================================================
INSERT INTO public.fifa_experiences_tripnova (title, subtitle, description, items, image_url, order_index) VALUES
('Estadios y Museos', 'Recorridos Históricos', 'Visitas guiadas a los templos del fútbol y acceso a zonas restringidas.', '["Visitas guiadas a estadios", "Acceso a vestidores", "Recorridos por museos"]', 'https://images.pexels.com/photos/12327672/pexels-photo-12327672.jpeg', 1),
('Fan Experiences', 'Interacción Total', 'Zonas de realidad virtual y encuentros con leyendas del deporte.', '["Clínicas de fútbol", "Realidad virtual", "Meet & greet"]', 'https://images.pexels.com/photos/33660694/pexels-photo-33660694.jpeg', 2),
('Viewing Parties', 'Eventos en Vivo', 'Proyección de partidos en pantallas gigantes con ambiente temático.', '["Pantallas gigantes", "Trivia y juegos", "Catering temático"]', 'https://images.pexels.com/photos/26832707/pexels-photo-26832707.jpeg', 3),
('Cultura y Ciudad', 'Recorridos Urbanos', 'Explora el lado futbolero de las sedes mundialistas.', '["Street football tours", "Bares icónicos", "Arte urbano"]', 'https://images.pexels.com/photos/13201287/pexels-photo-13201287.jpeg', 4),
('Experiencias educativas', 'Historia y estrategia', 'Descubre más acerca del fútbol', '["Talleres", "Trivia con premios"]', 'https://images.pexels.com/photos/8455345/pexels-photo-8455345.jpeg', 5);