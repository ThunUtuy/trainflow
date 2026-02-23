
-- Allow managers to read roles of users in their establishment
CREATE POLICY "Managers can read roles in establishment"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'manager'::app_role)
    AND user_id IN (
      SELECT p.user_id FROM public.profiles p
      WHERE p.establishment_id = get_user_establishment_id(auth.uid())
    )
  );
