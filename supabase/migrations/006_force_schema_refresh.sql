-- ============================================================
-- Migração 006: ULTIMATE CACHE BUSTER
-- ============================================================

-- O erro PGRST204 persiste. Vamos forçar uma mudança de DDL
-- que obriga o PostgREST a recarregar o schema.

-- 1. Garantir colunas (Idempotente)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cpf TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'cliente';

-- 2. Alterar um comentário de tabela (Isso dispara evento de refresh no Supabase)
COMMENT ON TABLE public.profiles IS 'Perfis de usuários (Cache Refreshed)';

-- 3. Tentar o Notify novamente + Reload Schema
NOTIFY pgrst, 'reload config';

-- 4. Re-garantir permissão na tabela schema_migrations (opcional)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
