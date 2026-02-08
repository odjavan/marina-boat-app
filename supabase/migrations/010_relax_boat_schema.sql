-- ============================================================
-- Migration: 010_relax_boat_schema.sql
-- Goal: Make 'capacity' and 'price_per_hour' nullable to fit Service App scope.
-- ============================================================

-- 1. Relax Capacity (Lotação)
ALTER TABLE public.boats 
ALTER COLUMN capacity DROP NOT NULL;

-- 2. Relax Price (Valor Hora)
ALTER TABLE public.boats 
ALTER COLUMN price_per_hour DROP NOT NULL;

-- 3. Update Comments
COMMENT ON COLUMN public.boats.capacity IS 'Capacidade (Opcional - Legado de Rental)';
COMMENT ON COLUMN public.boats.price_per_hour IS 'Preço Hora (Opcional - Legado de Rental)';
