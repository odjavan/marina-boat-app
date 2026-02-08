-- Add price column to services table
ALTER TABLE public.services 
    ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0 CHECK (price >= 0);

COMMENT ON COLUMN public.services.price IS 'Preço do serviço em reais';
