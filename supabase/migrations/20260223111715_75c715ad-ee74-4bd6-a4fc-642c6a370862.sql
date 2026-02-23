
-- Tighten establishment policies back to secure values
DROP POLICY IF EXISTS "Managers can create establishments" ON public.establishments;
CREATE POLICY "Managers can create establishments"
  ON public.establishments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by AND has_role(auth.uid(), 'manager'::app_role));

DROP POLICY IF EXISTS "Members can read own establishment" ON public.establishments;
CREATE POLICY "Members can read own establishment"
  ON public.establishments
  FOR SELECT
  TO authenticated
  USING (id = get_user_establishment_id(auth.uid()) OR created_by = auth.uid());
