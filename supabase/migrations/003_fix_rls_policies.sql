-- ============================================================
-- Migração 003: Correção de RLS para Catálogo de Serviços
-- ============================================================

-- Permitir que admins gerenciem o catálogo de serviços
-- (Atualmente estava apenas "Anyone can view", faltando permissões de escrita)

-- 1. Categorias de Serviço
CREATE POLICY "Admins can manage categories"
    ON public.service_categories
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'funcionario')
        )
    );

-- 2. Serviços (Catálogo)
CREATE POLICY "Admins can manage services"
    ON public.services
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'funcionario')
        )
    );

-- ============================================================
-- FIM
-- ============================================================
