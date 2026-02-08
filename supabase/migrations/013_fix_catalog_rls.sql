-- Migration: 013_fix_catalog_rls.sql
-- Goal: Ensure Admin RLS policies for Service and Category management are correctly applied.

-- 1. Reset Policies for Service Categories
DROP POLICY IF EXISTS "Admins can manage categories" ON public.service_categories;

CREATE POLICY "Admins can manage categories"
    ON public.service_categories
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'funcionario')
        )
    );

-- 2. Reset Policies for Services (Catalog)
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;

CREATE POLICY "Admins can manage services"
    ON public.services
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'funcionario')
        )
    );

-- 3. Ensure RLS is enabled
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
