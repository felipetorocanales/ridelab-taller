-- ========================================================
-- RIDE LAB TALLER DE MTB - ESQUEMA DE BASE DE DATOS SUPABASE
-- ========================================================
-- Copia y pega este script en el "SQL Editor" de tu proyecto de Supabase
-- y presiona "Run" para crear las tablas y cargar los datos iniciales.

-- 1. Crear tabla de órdenes de mantención
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT,
    bike_brand TEXT,
    bike_model TEXT NOT NULL,
    bike_type TEXT DEFAULT 'mtb',
    bike_size TEXT,
    notes TEXT,
    service_type TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    total NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'en_taller',
    entry_date TEXT,
    delivery_date TEXT,
    completed_date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas para lectura y escritura pública/anónima
-- (Permite al taller y en el futuro a los clientes agendar mantenciones)
CREATE POLICY "Permitir lectura publica de ordenes" 
ON public.orders FOR SELECT 
USING (true);

CREATE POLICY "Permitir insercion publica de ordenes" 
ON public.orders FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir actualizacion publica de ordenes" 
ON public.orders FOR UPDATE 
USING (true);

CREATE POLICY "Permitir eliminacion publica de ordenes" 
ON public.orders FOR DELETE 
USING (true);

-- 4. Habilitar soporte de tiempo real en Supabase para la tabla orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- 5. Cargar los 13 datos reales de las notas de RIDELAB
INSERT INTO public.orders (id, code, client_name, client_phone, bike_brand, bike_model, bike_type, bike_size, notes, service_type, items, total, status, entry_date, delivery_date, completed_date)
VALUES
(
    'RL-1001', 'RL-1001', 'Miguel Ángel', '', 'Whyte', 'G-180', 'mtb', 'L',
    'Mantenimiento general suspensiones y cambio rodamientos maza trasera.',
    'Servicio Mantención Full',
    '[{"id":"i1","description":"Mantención full","price":55000},{"id":"i2","description":"Rodamientos maza trasera","price":24000}]'::jsonb,
    79000, 'entregado', '2026-10-09', '2026-10-10', '2026-10-10'
),
(
    'RL-1002', 'RL-1002', 'Matías Vásquez', '', 'Trek', 'Rail+', 'ebike', 'XL',
    'Revisión eléctrica y mantención completa e-MTB.',
    'Servicio Full Mantención E-Bike',
    '[{"id":"i1","description":"Mantención completa ebike","price":60000}]'::jsonb,
    60000, 'entregado', '2026-10-09', '2026-10-11', '2026-10-11'
),
(
    'RL-1003', 'RL-1003', 'Fabián Ramírez', '', 'Specialized', 'Turbo Levo', 'ebike', 'S4 (L)',
    'Frenos con aire en el circuito, cambio de pastillas desgastadas.',
    'Frenos y Transmisión',
    '[{"id":"i1","description":"Purgado de frenos","price":20000},{"id":"i2","description":"Pastillas traseras","price":9800},{"id":"i3","description":"Ajuste de cambios","price":4000}]'::jsonb,
    33800, 'entregado', '2026-10-10', '2026-10-11', '2026-10-11'
),
(
    'RL-1004', 'RL-1004', 'Juanito', '', 'MTB', 'Rueda Custom', 'mtb', '29"',
    'Armado de rueda desde cero, encintado tubeless sellado.',
    'Armado de Rueda',
    '[{"id":"i1","description":"Enrayado y centrado","price":25000},{"id":"i2","description":"Cinta tubeless","price":6000}]'::jsonb,
    31000, 'entregado', '2026-10-15', '2026-10-16', '2026-10-16'
),
(
    'RL-1005', 'RL-1005', 'Patricio', '', 'Polygon', 'Collosus N7', 'mtb', 'M',
    'Mantención completa Enduro y reemplazo rodamientos masa trasera.',
    'Servicio Full Mantención',
    '[{"id":"i1","description":"Mantención completa","price":55000},{"id":"i2","description":"Rodamientos maza trasera","price":24000}]'::jsonb,
    79000, 'entregado', '2026-10-26', '2026-10-28', '2026-10-28'
),
(
    'RL-1006', 'RL-1006', 'Alejandro Elgueta', '', 'Canyon', 'Torque', 'mtb', 'L',
    'Ajuste fino de pata de cambio, sellado de llanta y líquido nuevo.',
    'Ajustes y Tubeless',
    '[{"id":"i1","description":"Ajuste de cambios","price":4000},{"id":"i2","description":"Cinta tubeless","price":8000},{"id":"i3","description":"Recarga de líquido tubeless","price":10000}]'::jsonb,
    22000, 'entregado', '2026-10-29', '2026-10-30', '2026-10-30'
),
(
    'RL-1007', 'RL-1007', 'Ignacio', '', '715 Industries', 'Hardtail Enduro', 'mtb', 'M',
    'Mantención general completa, cambio neumático trasero Maxxis DHR2, enrayado y rodamientos de motor nuevos.',
    'Servicio Full Mantención & Repuestos',
    '[{"id":"i1","description":"Mantención completa","price":50000},{"id":"i2","description":"Enrayado","price":25000},{"id":"i3","description":"Cinta tubeless","price":6000},{"id":"i4","description":"Recarga de líquido","price":8000},{"id":"i5","description":"Neumático Maxxis DHR2","price":73980},{"id":"i6","description":"Rodamientos motor","price":20000}]'::jsonb,
    182980, 'entregado', '2026-11-02', '2026-11-04', '2026-11-04'
),
(
    'RL-1008', 'RL-1008', 'Meisser', '', 'MTB', 'Frenos Hidráulicos', 'mtb', 'Estándar',
    'Servicio a fondo de freno trasero y reemplazo de rodamiento en la maneta.',
    'Servicio Full Mantención Frenos',
    '[{"id":"i1","description":"Servicio freno trasero","price":20000},{"id":"i2","description":"Rodamiento maneta","price":5000}]'::jsonb,
    25000, 'entregado', '2026-11-04', '2026-11-05', '2026-11-05'
),
(
    'RL-1009', 'RL-1009', 'Kevin', '', 'MTB', 'Ruedas 29', 'mtb', '29"',
    'Instalación de neumático nuevo HighRoller, encintado y líquido doble.',
    'Ruedas y Neumáticos',
    '[{"id":"i1","description":"Cinta tubeless","price":6000},{"id":"i2","description":"Recarga líquido x2","price":16000},{"id":"i3","description":"Neumático New HighRoller","price":63000}]'::jsonb,
    85000, 'entregado', '2026-11-05', '2026-11-06', '2026-11-06'
),
(
    'RL-1010', 'RL-1010', 'Totoro', '', 'Polygon', 'Collosus N7', 'mtb', 'L',
    'Mantención completa Enduro periódica.',
    'Servicio Full Mantención',
    '[{"id":"i1","description":"Mantención completa","price":50000}]'::jsonb,
    50000, 'entregado', '2026-11-05', '2026-11-07', '2026-11-07'
),
(
    'RL-1011', 'RL-1011', 'Rodrigo', '', 'Faucon', 'Gravel', 'gravel', '54cm',
    'Bicicleta recién sacada de caja, torque general, centrado y calibración.',
    'Ajuste Bicicleta Nueva',
    '[{"id":"i1","description":"Ajuste bicicleta nueva","price":10000}]'::jsonb,
    10000, 'listo', '2026-11-06', '2026-11-07', '2026-11-07'
),
(
    'RL-1012', 'RL-1012', 'Coke', '', 'Bicicleta', 'Rueda Delantera/Trasera', 'mtb', 'Estándar',
    'Enrayado completo con tensión calibrada con tensiómetro.',
    'Enrayado',
    '[{"id":"i1","description":"Enrayado","price":25000}]'::jsonb,
    25000, 'en_taller', '2026-11-06', '2026-11-14', null
),
(
    'RL-1013', 'RL-1013', 'Cristian Pinto', '', 'Commencal', 'Clash', 'mtb', 'L',
    'Instalación de cintas tubeless nuevas x2, válvulas de color x2 y recarga de líquido sellante.',
    'Conversión Tubeless Custom',
    '[{"id":"i1","description":"Cinta tubeless x2","price":14000},{"id":"i2","description":"Válvulas color x2","price":15000},{"id":"i3","description":"Recarga líquido x2","price":16000}]'::jsonb,
    45000, 'en_taller', '2026-11-09', '2026-11-15', null
)
ON CONFLICT (id) DO NOTHING;
