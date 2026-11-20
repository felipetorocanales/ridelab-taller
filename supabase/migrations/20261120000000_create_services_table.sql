-- ========================================================
-- RIDE LAB TALLER DE MTB - TABLA DE SERVICIOS Y PRECIOS
-- ========================================================
-- Copia y pega este script en el "SQL Editor" de tu proyecto de Supabase
-- y presiona "Run" para crear la tabla de servicios y cargar el catálogo inicial.

-- 1. Crear tabla de servicios
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    price NUMERIC NOT NULL DEFAULT 0,
    price_label TEXT DEFAULT '',
    category TEXT DEFAULT 'mantencion',
    show_in_landing BOOLEAN DEFAULT false,
    show_in_booking BOOLEAN DEFAULT true,
    show_in_quick_add BOOLEAN DEFAULT true,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas para lectura pública y administración desde la intranet
DROP POLICY IF EXISTS "Permitir lectura publica de servicios" ON public.services;
CREATE POLICY "Permitir lectura publica de servicios"
ON public.services FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Permitir insercion publica de servicios" ON public.services;
CREATE POLICY "Permitir insercion publica de servicios"
ON public.services FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualizacion publica de servicios" ON public.services;
CREATE POLICY "Permitir actualizacion publica de servicios"
ON public.services FOR UPDATE
USING (true);

DROP POLICY IF EXISTS "Permitir eliminacion publica de servicios" ON public.services;
CREATE POLICY "Permitir eliminacion publica de servicios"
ON public.services FOR DELETE
USING (true);

-- 4. Habilitar soporte de tiempo real en Supabase para la tabla services
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'services'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
  END IF;
END $$;

-- 5. Cargar catálogo inicial de servicios RIDE LAB
INSERT INTO public.services (
    id, code, name, description, price, price_label, category,
    show_in_landing, show_in_booking, show_in_quick_add, active, sort_order
)
VALUES
(
    'srv-01', 'SRV-001', 'Mantención Completa MTB',
    'Desarme, limpieza ultrasónica, lubricación de pivotes, engrase general, regulación de cambios y torques.',
    55000, '', 'mantencion', true, true, true, true, 1
),
(
    'srv-02', 'SRV-002', 'Mantención E-Bike Eléctrica',
    'Servicio mecánico completo adaptado a bicicletas eléctricas, revisión de cableados, motor y batería.',
    60000, '', 'mantencion', true, true, true, true, 2
),
(
    'srv-03', 'SRV-003', 'Servicio de Frenos & Purgado',
    'Purgado con aceite mineral / DOT, eliminación de aire, limpieza de pistones y cambio de pastillas.',
    20000, '', 'frenos', true, true, true, true, 3
),
(
    'srv-04', 'SRV-004', 'Armado de Ruedas & Enrayado',
    'Enrayado desde cero o centrado fino con tensiómetro de rayos de alta precisión.',
    25000, '', 'ruedas', true, true, true, true, 4
),
(
    'srv-05', 'SRV-005', 'Conversión Tubeless & Sellado',
    'Instalación de cintas especiales, válvulas de aluminio con color y recarga de líquido sellante.',
    14000, 'Desde $14.000', 'tubeless', true, true, false, true, 5
),
(
    'srv-06', 'SRV-006', 'Rodamientos de Maza & Motor',
    'Extracción e instalación de rodamientos sellados de precisión para mazas y caja de pedalier.',
    20000, 'Desde $20.000', 'rodamientos', true, true, false, true, 6
),
(
    'srv-07', 'SRV-007', 'Servicio freno trasero / delantero',
    'Revisión completa, limpieza de cáliper y ajuste de freno hidráulico.',
    20000, '', 'frenos', false, false, true, true, 7
),
(
    'srv-08', 'SRV-008', 'Pastillas de freno traseras',
    'Reemplazo de pastillas de freno traseras.',
    9800, '', 'repuestos', false, false, true, true, 8
),
(
    'srv-09', 'SRV-009', 'Ajuste de cambios / transmisión',
    'Calibración fina de pata de cambio, piola y transmisión.',
    4000, '', 'ajustes', false, true, true, true, 9
),
(
    'srv-10', 'SRV-010', 'Ajuste bicicleta nueva',
    'Armado, torque general, centrado y calibración de bicicleta nueva.',
    10000, '', 'ajustes', false, true, true, true, 10
),
(
    'srv-11', 'SRV-011', 'Cinta tubeless',
    'Instalación de cinta tubeless en una rueda.',
    6000, '', 'tubeless', false, false, true, true, 11
),
(
    'srv-12', 'SRV-012', 'Cinta tubeless x2',
    'Instalación de cinta tubeless en ambas ruedas.',
    14000, '', 'tubeless', false, false, true, true, 12
),
(
    'srv-13', 'SRV-013', 'Recarga de líquido tubeless',
    'Recarga de líquido sellante tubeless en una rueda.',
    8000, '', 'tubeless', false, false, true, true, 13
),
(
    'srv-14', 'SRV-014', 'Recarga líquido tubeless x2',
    'Recarga de líquido sellante tubeless en ambas ruedas.',
    16000, '', 'tubeless', false, false, true, true, 14
),
(
    'srv-15', 'SRV-015', 'Válvulas color x2',
    'Par de válvulas tubeless de aluminio anodizado.',
    15000, '', 'repuestos', false, false, true, true, 15
),
(
    'srv-16', 'SRV-016', 'Rodamientos maza trasera',
    'Reemplazo de rodamientos sellados de maza trasera.',
    24000, '', 'rodamientos', false, false, true, true, 16
),
(
    'srv-17', 'SRV-017', 'Rodamientos motor',
    'Reemplazo de rodamientos de caja de motor / pedalier.',
    20000, '', 'rodamientos', false, false, true, true, 17
),
(
    'srv-18', 'SRV-018', 'Rodamiento maneta',
    'Reemplazo de rodamiento de maneta de freno.',
    5000, '', 'rodamientos', false, false, true, true, 18
),
(
    'srv-19', 'SRV-019', 'Neumático Maxxis DHR2',
    'Neumático Maxxis Minion DHR II.',
    73980, '', 'neumaticos', false, false, true, true, 19
),
(
    'srv-20', 'SRV-020', 'Neumático New HighRoller',
    'Neumático Maxxis New HighRoller.',
    63000, '', 'neumaticos', false, false, true, true, 20
)
ON CONFLICT (id) DO NOTHING;
