
-- ============================================================
-- Migration: 012_fix_recursion_final.sql
-- Goal: Fix "infinite recursion detected in policy" error.
-- Solution: Use a SECURITY DEFINER function to check admin status, 
--           bypassing RLS checks within the policy itself.
-- ============================================================

-- 1. Create Helper Function (SECURITY DEFINER)
-- This function runs with the permissions of the database owner (superuser),
-- ignoring the RLS on 'profiles' table when called.
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'funcionario')
  );
$$;

-- 2. Drop the PROBLEMATIC policies from previous migration
DROP POLICY IF EXISTS "Admins have full access" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete any profile" ON public.profiles;

-- 3. Re-create Policy using the SAFE Function
CREATE POLICY "Admins have full access"
ON public.profiles
FOR ALL
USING ( check_is_admin() );

-- 4. Re-enforce User Self-Service Policies (Safe from recursion usually, but good to ensure)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK ( auth.uid() = id );

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING ( auth.uid() = id );

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles
FOR SELECT
USING ( true );
