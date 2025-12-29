-- Add policy to allow authenticated users to delete leads
CREATE POLICY "Authenticated users can delete leads" 
ON public.leads 
FOR DELETE 
USING (true);