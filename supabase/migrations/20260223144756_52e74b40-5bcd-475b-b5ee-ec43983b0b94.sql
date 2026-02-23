
-- Create all tables first
CREATE TABLE IF NOT EXISTS public.playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id uuid NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.playlist_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  UNIQUE(playlist_id, module_id)
);

CREATE TABLE IF NOT EXISTS public.staff_playlist_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(playlist_id, user_id)
);

-- Enable RLS
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_playlist_assignments ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.playlists TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.playlist_modules TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.staff_playlist_assignments TO authenticated;

-- Playlists policies
CREATE POLICY "Managers can CRUD playlists"
  ON public.playlists FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'manager'::app_role) AND establishment_id = get_user_establishment_id(auth.uid()))
  WITH CHECK (has_role(auth.uid(), 'manager'::app_role) AND establishment_id = get_user_establishment_id(auth.uid()));

CREATE POLICY "Staff can read assigned playlists"
  ON public.playlists FOR SELECT TO authenticated
  USING (id IN (SELECT playlist_id FROM public.staff_playlist_assignments WHERE user_id = auth.uid()));

-- Playlist modules policies
CREATE POLICY "Managers can CRUD playlist modules"
  ON public.playlist_modules FOR ALL TO authenticated
  USING (playlist_id IN (SELECT id FROM public.playlists WHERE establishment_id = get_user_establishment_id(auth.uid()) AND has_role(auth.uid(), 'manager'::app_role)))
  WITH CHECK (playlist_id IN (SELECT id FROM public.playlists WHERE establishment_id = get_user_establishment_id(auth.uid()) AND has_role(auth.uid(), 'manager'::app_role)));

CREATE POLICY "Staff can read assigned playlist modules"
  ON public.playlist_modules FOR SELECT TO authenticated
  USING (playlist_id IN (SELECT playlist_id FROM public.staff_playlist_assignments WHERE user_id = auth.uid()));

-- Assignment policies
CREATE POLICY "Managers can CRUD assignments"
  ON public.staff_playlist_assignments FOR ALL TO authenticated
  USING (playlist_id IN (SELECT id FROM public.playlists WHERE establishment_id = get_user_establishment_id(auth.uid()) AND has_role(auth.uid(), 'manager'::app_role)))
  WITH CHECK (playlist_id IN (SELECT id FROM public.playlists WHERE establishment_id = get_user_establishment_id(auth.uid()) AND has_role(auth.uid(), 'manager'::app_role)));

CREATE POLICY "Staff can read own assignments"
  ON public.staff_playlist_assignments FOR SELECT TO authenticated
  USING (user_id = auth.uid());
