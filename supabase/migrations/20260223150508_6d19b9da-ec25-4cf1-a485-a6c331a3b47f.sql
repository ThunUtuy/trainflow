
-- Individual module assignments (overrides beyond groups)
CREATE TABLE IF NOT EXISTS public.staff_module_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  module_id uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

ALTER TABLE public.staff_module_assignments ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON public.staff_module_assignments TO authenticated;

-- Managers can CRUD assignments for staff in their establishment
CREATE POLICY "Managers can CRUD staff module assignments"
  ON public.staff_module_assignments FOR ALL TO authenticated
  USING (
    has_role(auth.uid(), 'manager'::app_role)
    AND module_id IN (SELECT id FROM public.modules WHERE establishment_id = get_user_establishment_id(auth.uid()))
  )
  WITH CHECK (
    has_role(auth.uid(), 'manager'::app_role)
    AND module_id IN (SELECT id FROM public.modules WHERE establishment_id = get_user_establishment_id(auth.uid()))
  );

-- Staff can read their own assignments
CREATE POLICY "Staff can read own module assignments"
  ON public.staff_module_assignments FOR SELECT TO authenticated
  USING (user_id = auth.uid());
