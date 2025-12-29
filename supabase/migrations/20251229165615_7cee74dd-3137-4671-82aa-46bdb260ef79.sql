-- Criar enum para status do lead
CREATE TYPE public.lead_status AS ENUM ('novo', 'contactado', 'convertido', 'perdido');

-- Adicionar coluna status na tabela leads
ALTER TABLE public.leads 
ADD COLUMN status lead_status NOT NULL DEFAULT 'novo';

-- Adicionar coluna de notas para acompanhamento
ALTER TABLE public.leads 
ADD COLUMN notes text;

-- Permitir que usuários autenticados atualizem leads
CREATE POLICY "Authenticated users can update leads"
ON public.leads FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);