-- ============================================================
-- Migração 007: Adicionar Coluna de Email em Profiles (Critical Fix)
-- ============================================================

-- O Frontend espera exibir o email na lista de clientes, e tenta salvá-lo.
-- O erro PGRST204 indicou que esta coluna não existia em 'public.profiles'.

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
COMMENT ON COLUMN public.profiles.email IS 'Email de contato (redundante com auth.users para facilidade de leitura)';

-- Forçar refresh do cache novamente, por via das dúvidas
NOTIFY pgrst, 'reload config';
