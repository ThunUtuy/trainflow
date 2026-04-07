
CREATE TABLE public.staff_establishments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  establishment_id uuid NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, establishment_id)
);

ALTER TABLE public.staff_establishments ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON public.staff_establishments TO authenticated;

CREATE POLICY "Staff can read own memberships"
ON public.staff_establishments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Staff can insert own memberships"
ON public.staff_establishments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Managers can read memberships in establishment"
ON public.staff_establishments
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'manager'::app_role)
  AND establishment_id = get_user_establishment_id(auth.uid())
);
