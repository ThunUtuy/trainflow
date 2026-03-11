
-- Allow managers to update staff profiles in their establishment (to remove them)
CREATE POLICY "Managers can update staff profiles in establishment"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'manager'::app_role)
  AND establishment_id = get_user_establishment_id(auth.uid())
  AND user_id != auth.uid()
)
WITH CHECK (true);
