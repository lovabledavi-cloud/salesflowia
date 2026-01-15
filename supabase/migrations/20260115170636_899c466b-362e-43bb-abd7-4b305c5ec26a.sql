-- Add phone and timezone columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/Sao_Paulo';

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Create function to link team_member on signup
CREATE OR REPLACE FUNCTION public.link_team_member_on_signup()
RETURNS TRIGGER AS $$
DECLARE
  tm_record RECORD;
BEGIN
  -- Find team_member by email
  SELECT * INTO tm_record FROM public.team_members 
  WHERE email = NEW.email AND user_id IS NULL
  LIMIT 1;
  
  IF FOUND THEN
    -- Update team_member with user_id
    UPDATE public.team_members SET user_id = NEW.id WHERE id = tm_record.id;
    
    -- Create role based on team_member role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, tm_record.role)
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on auth.users for auto-linking
DROP TRIGGER IF EXISTS on_auth_user_created_link_team ON auth.users;
CREATE TRIGGER on_auth_user_created_link_team
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.link_team_member_on_signup();