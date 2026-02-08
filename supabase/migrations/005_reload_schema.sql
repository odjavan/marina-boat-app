-- ============================================================
-- Migração 005: Forçar Atualização do Cache de Schema
-- ============================================================

-- O erro "PGRST204 - Could not find the column..." indica que 
-- o PostgREST (API do Supabase) está com cache antigo.

-- 1. Garantir (de novo) que as colunas existem
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cpf TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'cliente';

-- 2. Comando Mágico para recarregar o cache da API
NOTIFY pgrst, 'reload config';

-- 3. Verificação (Isso vai aparecer no output do SQL Editor)
DO $$
BEGIN
    RAISE NOTICE 'Cache recarregado! Tente usar o app agora.';
END $$;
