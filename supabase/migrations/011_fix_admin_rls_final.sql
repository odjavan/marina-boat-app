
-- ============================================================
-- Migration: 011_fix_admin_rls_final.sql
-- Goal: Ensure Admins have FULL permissions (INSERT, UPDATE, DELETE) on profiles.
--       Fixes "Access Negado" errors in Demo Mode.
-- ============================================================

-- 1. DROP EXISTING POLICIES TO AVOID CONFLICTS
DROP POLICY IF EXISTS "Admins can insert any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete any profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins have full access" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- 2. CREATE "SUPER PERMISSION" POLICY FOR ADMINS
-- This simplified policy handles ALL operations for admins.
CREATE POLICY "Admins have full access"
ON public.profiles
FOR ALL
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'funcionario')
);

-- 3. CREATE "SELF SERVICE" POLICY FOR USERS
-- Setup: Users can read everyone (for now, or strict: auth.uid() = id), and update/insert ONLY themselves.
-- Note: 'INSERT' needs 'WITH CHECK', others need 'USING'.

CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (
  auth.uid() = id
);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (
  auth.uid() = id
);

-- 4. GRANT PUBLIC READ (Optional, if needed for Client list)
-- Or restricted to Authenticated
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles
FOR SELECT
USING ( true );

-- 5. ENSURE RLS IS ENABLED
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
