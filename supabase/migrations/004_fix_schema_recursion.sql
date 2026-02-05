-- ============================================================
-- Migração 004: Correção Crítica de Recursão e Schema
-- ============================================================

-- A. CORREÇÃO DE SCHEMA (Colunas Faltando)
-- O frontend espera 'cpf' e 'user_type', mas não existiam.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cpf TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'cliente';

-- B. CORREÇÃO DE RECURSÃO INFINITA (RLS Loop)
-- Criamos uma função segura (SECURITY DEFINER) para checar admin.
-- Isso permite ler a tabela 'profiles' ignorando o RLS, quebrando o loop.

CREATE OR REPLACE FUNCTION public.is_admin_or_employee()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'funcionario', 'owner')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- <--- O Segredo: Roda com permissão total interna

-- C. ATUALIZAR POLÍTICAS DA TABELA PROFILES
-- Substituímos a checagem manual pela função segura

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins and Employees can view all profiles" ON public.profiles; -- <--- Adicionado para evitar o erro

CREATE POLICY "Admins and Employees can view all profiles"
    ON public.profiles
    FOR SELECT
    USING (
        auth.uid() = id -- Próprio usuário
        OR
        public.is_admin_or_employee() -- Admin/Func (via função segura)
    );

-- D. CORREÇÃO NAS OUTRAS TABELAS (Para garantir)
-- Atualizamos as políticas de 'barcos' e 'reservas' para usar a função segura também
-- (Opcional, mas recomendado se elas também estiverem dando erro de recursão)

-- BOATS
DROP POLICY IF EXISTS "Admins can manage all boats" ON public.boats;
CREATE POLICY "Admins can manage all boats"
    ON public.boats
    FOR ALL
    USING (public.is_admin_or_employee());

-- BOOKINGS
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;
CREATE POLICY "Admins can manage all bookings"
    ON public.bookings
    FOR ALL
    USING (public.is_admin_or_employee());

-- SERVICES (Catálogo - Atualizando a do passo anterior para usar a função segura)
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
CREATE POLICY "Admins can manage services"
    ON public.services
    FOR ALL
    USING (public.is_admin_or_employee());

DROP POLICY IF EXISTS "Admins can manage categories" ON public.service_categories;
CREATE POLICY "Admins can manage categories"
    ON public.service_categories
    FOR ALL
    USING (public.is_admin_or_employee());
