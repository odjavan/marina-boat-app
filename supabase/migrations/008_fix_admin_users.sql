-- SCRIPT DE CORREÇÃO FINAL - MARINA BOAT APP (V3 Brute Force)
-- Remove travas de segurança para permitir modo Demo e Gestão Total

-- 1. REMOVER A FOREIGN KEY DE FORMA DEFINITIVA
-- Isso permite criar usuários "fantasmas" (sem login) para demonstração ou clientes offline.
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- NÃO recriamos a constraint. No modo Demo, a integridade fica por conta da aplicação.

-- 2. GARANTIR PERMISSÕES TOTAIS PARA ADMIN (CRUD Completo)

-- 2.1 INSERT (Já existia, reforçando)
DROP POLICY IF EXISTS "Admins can insert any profile" ON public.profiles;
CREATE POLICY "Admins can insert any profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    -- Permite se for Admin OU se for o próprio usuário
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() 
      AND role IN ('admin', 'funcionario')
    )
    OR auth.uid() = id
  );

-- 2.2 UPDATE (Nova Descoberta Auto-corrigida)
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
  ON public.profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() 
      AND role IN ('admin', 'funcionario')
    )
    OR auth.uid() = id
  );

-- 2.3 DELETE (Nova Descoberta Auto-corrigida)
DROP POLICY IF EXISTS "Admins can delete any profile" ON public.profiles;
CREATE POLICY "Admins can delete any profile"
  ON public.profiles
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() 
      AND role IN ('admin', 'funcionario')
    )
  );

-- 3. VERIFICAÇÃO FINAL
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'profiles';
