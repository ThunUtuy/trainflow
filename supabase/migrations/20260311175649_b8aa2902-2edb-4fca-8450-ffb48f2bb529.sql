
-- Drop the restrictive policy and recreate as permissive
DROP POLICY IF EXISTS "Managers can update staff profiles in establishment" ON public.profiles;

CREATE POLICY "Managers can update staff profiles in establishment"
ON public.profiles
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'manager'::app_role)
  AND establishment_id = get_user_establishment_id(auth.uid())
  AND user_id != auth.uid()
)
WITH CHECK (true);
