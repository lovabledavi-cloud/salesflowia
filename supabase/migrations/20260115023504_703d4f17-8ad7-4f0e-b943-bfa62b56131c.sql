-- Create enum for followup status
CREATE TYPE public.followup_status AS ENUM ('pendente', 'enviado', 'respondido', 'sem_resposta', 'concluido');

-- Add followup_status column to leads table
ALTER TABLE public.leads 
ADD COLUMN followup_status public.followup_status DEFAULT 'pendente';