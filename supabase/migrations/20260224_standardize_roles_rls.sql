-- Standardizing RLS Policies for Marina Boat standardized roles

-- 1. Profiles (already largely standard but ensuring consistency)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;

CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Enable insert for authenticated users only" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Boats
ALTER TABLE public.boats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own boats" ON public.boats;
DROP POLICY IF EXISTS "Users can insert own boats" ON public.boats;
DROP POLICY IF EXISTS "Users can update own boats" ON public.boats;
DROP POLICY IF EXISTS "Users can delete own boats" ON public.boats;

CREATE POLICY "Standard view boats" ON public.boats
    FOR SELECT USING (
        auth.uid() = owner_id OR 
        (SELECT user_type FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'marina')
    );
CREATE POLICY "Standard insert boats" ON public.boats FOR INSERT WITH CHECK (auth.uid() = owner_id OR (SELECT user_type FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Standard update boats" ON public.boats FOR UPDATE USING (auth.uid() = owner_id OR (SELECT user_type FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Standard delete boats" ON public.boats FOR DELETE USING (auth.uid() = owner_id OR (SELECT user_type FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- 3. Services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read services" ON public.services;
DROP POLICY IF EXISTS "Admins manage services" ON public.services;

CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins manage services" ON public.services
    FOR ALL USING ((SELECT user_type FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- 4. Service Requests
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own requests" ON public.service_requests;
DROP POLICY IF EXISTS "Users create requests" ON public.service_requests;
DROP POLICY IF EXISTS "Users update own requests" ON public.service_requests;

CREATE POLICY "Standard view requests" ON public.service_requests
    FOR SELECT USING (
        auth.uid() = user_id OR 
        (SELECT user_type FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'marina')
    );
CREATE POLICY "Standard create requests" ON public.service_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Standard update requests" ON public.service_requests
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        (SELECT user_type FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'marina')
    );
