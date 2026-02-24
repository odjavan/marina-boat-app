-- Add missing columns to boats table
ALTER TABLE public.boats ADD COLUMN IF NOT EXISTS capacity INTEGER;
ALTER TABLE public.boats ADD COLUMN IF NOT EXISTS price_per_hour NUMERIC;

-- Add comments for clarity
COMMENT ON COLUMN public.boats.capacity IS 'Capacidade máxima de passageiros';
COMMENT ON COLUMN public.boats.price_per_hour IS 'Preço por hora de aluguel';
