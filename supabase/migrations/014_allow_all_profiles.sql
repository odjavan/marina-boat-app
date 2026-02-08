-- Allow anonymous access to profiles for demo purposes (Fixes System Audit)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all access for anon" ON public.profiles;

CREATE POLICY "Enable all access for anon"
ON public.profiles
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Ensure public access is also enabled (if not covered by anon)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
