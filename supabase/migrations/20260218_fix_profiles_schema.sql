-- Fix profiles table schema to match frontend requirements

-- 1. Add missing 'cpf' column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cpf text;

-- 2. Rename 'name' to 'full_name' as expected by App.tsx (addClient function)
-- Check if column exists before renaming to avoid errors if run multiple times
DO $$
BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='name') THEN
    ALTER TABLE public.profiles RENAME COLUMN name TO full_name;
  END IF;
END $$;
