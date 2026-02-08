-- SCRIPT DE CORREÇÃO PROATIVA - MARINA BOAT APP
-- Corrige discrepâncias de schema identificadas (Boats, Services) - Atualizado (V2)

-- 1. CORREÇÃO: Tabela 'boats' faltando colunas
-- O Frontend envia 'photos' (array) e 'type' (Veleiro, Lancha...), mas o banco não tinha.
ALTER TABLE public.boats 
  ADD COLUMN IF NOT EXISTS photos TEXT[],
  ADD COLUMN IF NOT EXISTS type TEXT;

-- Garantir que 'documents' exista também (definido na mig 002, mas reforçando)
ALTER TABLE public.boats 
  ADD COLUMN IF NOT EXISTS documents TEXT[];

-- 2. CORREÇÃO: Tabela 'service_requests' (Verificação)
-- Verificar se colunas essenciais existem para evitar erros futuros
ALTER TABLE public.service_requests 
  ADD COLUMN IF NOT EXISTS photos TEXT[],
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id);

-- 3. VERIFICAÇÃO FINAL
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM 
    information_schema.columns 
WHERE 
    table_name IN ('boats', 'service_requests') 
    AND column_name IN ('photos', 'documents', 'user_id')
ORDER BY 
    table_name;
