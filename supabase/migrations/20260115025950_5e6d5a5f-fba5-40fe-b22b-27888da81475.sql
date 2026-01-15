-- Add new tracking fields to leads table
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS contacted_by uuid REFERENCES public.team_members(id);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS contacted_at timestamp with time zone;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS meeting_scheduled_by uuid REFERENCES public.team_members(id);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS followup_by uuid REFERENCES public.team_members(id);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.team_members(id);