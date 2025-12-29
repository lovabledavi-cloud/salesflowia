-- Adicionar campos de follow-up na tabela leads
ALTER TABLE public.leads 
ADD COLUMN next_followup_date timestamp with time zone,
ADD COLUMN followup_notes text,
ADD COLUMN last_contact_date timestamp with time zone;

-- Habilitar realtime para tabela leads
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;