-- Add admin role to the existing user
INSERT INTO public.user_roles (user_id, role)
VALUES ('79bdb9f3-aab5-4664-9f10-a7b4bdfe8111', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Also update leads SELECT policy to allow authenticated users to see all leads during development
-- First drop the existing policy
DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.leads;

-- Create a more permissive policy for viewing leads
CREATE POLICY "Authenticated users can view leads" 
ON public.leads 
FOR SELECT 
TO authenticated
USING (true);

-- Also make sure authenticated users can update leads
DROP POLICY IF EXISTS "Authorized users can update leads" ON public.leads;

CREATE POLICY "Authorized users can update leads" 
ON public.leads 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);