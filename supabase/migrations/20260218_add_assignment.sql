-- Add assigned_to column to service_requests table
ALTER TABLE public.service_requests 
ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES public.profiles(id) ON DELETE SET NULL;
