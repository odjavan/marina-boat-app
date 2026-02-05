-- ============================================================
-- Migração 003: Correção de RLS para Catálogo de Serviços (Versão Segura)
-- ============================================================

-- Remover políticas antigas se existirem para evitar conflito
DROP POLICY IF EXISTS "Admins can manage categories" ON public.service_categories;
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;

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
