
-- Drop the restrictive INSERT policy and recreate as permissive
DROP POLICY IF EXISTS "Managers can create establishments" ON public.establishments;
CREATE POLICY "Managers can create establishments"
  ON public.establishments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Also fix the SELECT and UPDATE policies to be permissive
DROP POLICY IF EXISTS "Members can read own establishment" ON public.establishments;
CREATE POLICY "Members can read own establishment"
  ON public.establishments
  FOR SELECT
  TO authenticated
  USING (id = get_user_establishment_id(auth.uid()));

DROP POLICY IF EXISTS "Managers can update own establishment" ON public.establishments;
CREATE POLICY "Managers can update own establishment"
  ON public.establishments
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

-- Fix invite_codes INSERT policy too (also restrictive)
DROP POLICY IF EXISTS "Managers can create invite codes" ON public.invite_codes;
CREATE POLICY "Managers can create invite codes"
  ON public.invite_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'manager'::app_role) AND establishment_id = get_user_establishment_id(auth.uid()));
