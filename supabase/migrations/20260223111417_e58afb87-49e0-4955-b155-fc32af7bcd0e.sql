
-- Drop and recreate all establishments policies
DROP POLICY IF EXISTS "Managers can create establishments" ON public.establishments;
DROP POLICY IF EXISTS "Members can read own establishment" ON public.establishments;
DROP POLICY IF EXISTS "Managers can update own establishment" ON public.establishments;

-- Recreate with explicit permissive keyword
CREATE POLICY "Managers can create establishments"
  ON public.establishments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Members can read own establishment"
  ON public.establishments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Managers can update own establishment"
  ON public.establishments
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());
