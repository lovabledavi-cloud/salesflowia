
-- 1. Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'sdr', 'closer');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create team_members table
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    avatar_url TEXT,
    role app_role NOT NULL DEFAULT 'sdr',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- 4. Create goals table (individual goals per team member)
CREATE TABLE public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_member_id UUID REFERENCES public.team_members(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL CHECK (year >= 2020),
    leads_goal INTEGER DEFAULT 0,
    contacts_goal INTEGER DEFAULT 0,
    conversions_goal INTEGER DEFAULT 0,
    revenue_goal DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(team_member_id, month, year)
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- 5. Create company_goals table
CREATE TABLE public.company_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL CHECK (year >= 2020),
    leads_goal INTEGER DEFAULT 0,
    contacts_goal INTEGER DEFAULT 0,
    conversions_goal INTEGER DEFAULT 0,
    revenue_goal DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(month, year)
);

ALTER TABLE public.company_goals ENABLE ROW LEVEL SECURITY;

-- 6. Create lead_status enum for pipeline stages
CREATE TYPE public.pipeline_stage AS ENUM (
    'novo',
    'prospeccao', 
    'qualificado',
    'negociacao',
    'proposta',
    'ganho',
    'perdido'
);

-- 7. Alter leads table - add new fields
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES public.team_members(id),
ADD COLUMN IF NOT EXISTS value DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS source TEXT,
ADD COLUMN IF NOT EXISTS qualified_by UUID REFERENCES public.team_members(id),
ADD COLUMN IF NOT EXISTS closed_by UUID REFERENCES public.team_members(id),
ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS lost_reason TEXT,
ADD COLUMN IF NOT EXISTS pipeline_stage pipeline_stage DEFAULT 'novo',
ADD COLUMN IF NOT EXISTS stage_changed_at TIMESTAMPTZ DEFAULT now();

-- 8. Create activities table
CREATE TABLE public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
    team_member_id UUID REFERENCES public.team_members(id),
    type TEXT NOT NULL CHECK (type IN ('call', 'whatsapp', 'email', 'meeting', 'note', 'status_change')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- 9. Create has_role security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 10. Create is_admin function
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- 11. Create get_user_team_member_id function
CREATE OR REPLACE FUNCTION public.get_user_team_member_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.team_members WHERE user_id = _user_id LIMIT 1
$$;

-- RLS Policies for user_roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for team_members
CREATE POLICY "Admins and managers can manage team members"
ON public.team_members
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'manager'))
WITH CHECK (public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Team members can view all team members"
ON public.team_members
FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for goals
CREATE POLICY "Admins and managers can manage goals"
ON public.goals
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'manager'))
WITH CHECK (public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Team members can view goals"
ON public.goals
FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for company_goals
CREATE POLICY "Admins and managers can manage company goals"
ON public.company_goals
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'manager'))
WITH CHECK (public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'manager'));

CREATE POLICY "All authenticated can view company goals"
ON public.company_goals
FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for activities
CREATE POLICY "Authenticated users can create activities"
ON public.activities
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can view activities"
ON public.activities
FOR SELECT
TO authenticated
USING (true);

-- Trigger to update stage_changed_at when pipeline_stage changes
CREATE OR REPLACE FUNCTION public.update_stage_changed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.pipeline_stage IS DISTINCT FROM NEW.pipeline_stage THEN
    NEW.stage_changed_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_leads_stage_changed_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_stage_changed_at();

-- Trigger to update updated_at on team_members
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to update updated_at on goals
CREATE TRIGGER update_goals_updated_at
BEFORE UPDATE ON public.goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to update updated_at on company_goals
CREATE TRIGGER update_company_goals_updated_at
BEFORE UPDATE ON public.company_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.goals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.company_goals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;
