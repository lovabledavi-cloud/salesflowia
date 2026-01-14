
-- Drop old permissive policies on leads table
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can delete leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.leads;

-- Create new more secure policies for leads
-- Anyone can submit a lead (public capture form)
CREATE POLICY "Anyone can submit a lead"
ON public.leads
FOR INSERT
WITH CHECK (true);

-- Authenticated users with any role can view leads
CREATE POLICY "Authenticated users can view leads"
ON public.leads
FOR SELECT
TO authenticated
USING (
  public.is_admin(auth.uid()) OR 
  public.has_role(auth.uid(), 'manager') OR
  public.has_role(auth.uid(), 'sdr') OR
  public.has_role(auth.uid(), 'closer') OR
  assigned_to = public.get_user_team_member_id(auth.uid())
);

-- Admins, managers, and assigned team members can update leads
CREATE POLICY "Authorized users can update leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (
  public.is_admin(auth.uid()) OR 
  public.has_role(auth.uid(), 'manager') OR
  assigned_to = public.get_user_team_member_id(auth.uid())
)
WITH CHECK (
  public.is_admin(auth.uid()) OR 
  public.has_role(auth.uid(), 'manager') OR
  assigned_to = public.get_user_team_member_id(auth.uid())
);

-- Only admins and managers can delete leads
CREATE POLICY "Admins and managers can delete leads"
ON public.leads
FOR DELETE
TO authenticated
USING (
  public.is_admin(auth.uid()) OR 
  public.has_role(auth.uid(), 'manager')
);

-- Update activities policy to be more secure
DROP POLICY IF EXISTS "Authenticated users can create activities" ON public.activities;

CREATE POLICY "Authenticated team members can create activities"
ON public.activities
FOR INSERT
TO authenticated
WITH CHECK (
  team_member_id IS NULL OR 
  team_member_id = public.get_user_team_member_id(auth.uid()) OR
  public.is_admin(auth.uid()) OR
  public.has_role(auth.uid(), 'manager')
);
