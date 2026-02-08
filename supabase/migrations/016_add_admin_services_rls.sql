-- Add RLS policies for admin to manage services catalog
-- This allows funcionarios (admins) to create, update, and delete services

-- Policy: Admins can insert services
CREATE POLICY "Admins can insert services" 
    ON public.services 
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'funcionario')
        )
    );

-- Policy: Admins can update services
CREATE POLICY "Admins can update services" 
    ON public.services 
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'funcionario')
        )
    );

-- Policy: Admins can delete services
CREATE POLICY "Admins can delete services" 
    ON public.services 
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'funcionario')
        )
    );

-- Also add policies for service_categories if not already present
CREATE POLICY IF NOT EXISTS "Admins can insert categories" 
    ON public.service_categories 
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'funcionario')
        )
    );

CREATE POLICY IF NOT EXISTS "Admins can update categories" 
    ON public.service_categories 
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'funcionario')
        )
    );

CREATE POLICY IF NOT EXISTS "Admins can delete categories" 
    ON public.service_categories 
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'funcionario')
        )
    );
