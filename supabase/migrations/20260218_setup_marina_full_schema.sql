-- Full Schema Creation for New Marina Boat Project

-- 1. Create profiles table (since it's a fresh project)
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name text,
    email text,
    phone text,
    user_type text DEFAULT 'cliente',
    avatar_initial text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. Create boats table
CREATE TABLE IF NOT EXISTS public.boats (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    name text NOT NULL,
    type text,
    brand text,
    model text,
    year integer,
    length text,
    registration_number text,
    photos text[] DEFAULT '{}',
    documents text[] DEFAULT '{}',
    is_archived boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. Create services catalog table
CREATE TABLE IF NOT EXISTS public.services (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id text,
    name text NOT NULL,
    description text,
    estimated_time text,
    icon text,
    price numeric,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- 4. Create service_requests table
CREATE TABLE IF NOT EXISTS public.service_requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    boat_id uuid REFERENCES public.boats(id) ON DELETE SET NULL,
    category text,
    service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
    description text,
    preferred_date text,
    urgency text DEFAULT 'Normal',
    status text DEFAULT 'Pendente',
    photos text[] DEFAULT '{}',
    admin_notes text,
    total_cost numeric,
    status_payment text DEFAULT 'Pendente',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 5. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies
-- Profiles
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Enable insert for authenticated users only" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Boats
CREATE POLICY "Users can view own boats" ON public.boats
    FOR SELECT USING (auth.uid() = owner_id OR (SELECT user_type FROM public.profiles WHERE id = auth.uid()) = 'funcionario');
CREATE POLICY "Users can insert own boats" ON public.boats FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own boats" ON public.boats FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own boats" ON public.boats FOR DELETE USING (auth.uid() = owner_id);

-- Services
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins manage services" ON public.services
    FOR ALL USING ((SELECT user_type FROM public.profiles WHERE id = auth.uid()) = 'funcionario');

-- Requests
CREATE POLICY "Users view own requests" ON public.service_requests
    FOR SELECT USING (auth.uid() = user_id OR (SELECT user_type FROM public.profiles WHERE id = auth.uid()) = 'funcionario');
CREATE POLICY "Users create requests" ON public.service_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own requests" ON public.service_requests
    FOR UPDATE USING (auth.uid() = user_id OR (SELECT user_type FROM public.profiles WHERE id = auth.uid()) = 'funcionario');
