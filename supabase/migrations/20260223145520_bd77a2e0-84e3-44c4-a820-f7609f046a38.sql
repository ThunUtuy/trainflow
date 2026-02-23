
-- Create security definer function to break recursion
CREATE OR REPLACE FUNCTION public.get_user_playlist_ids(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT playlist_id FROM public.staff_playlist_assignments WHERE user_id = _user_id
$$;

-- Fix playlists policies
DROP POLICY IF EXISTS "Staff can read assigned playlists" ON public.playlists;
CREATE POLICY "Staff can read assigned playlists"
  ON public.playlists FOR SELECT TO authenticated
  USING (id IN (SELECT get_user_playlist_ids(auth.uid())));

-- Fix playlist_modules policies
DROP POLICY IF EXISTS "Staff can read assigned playlist modules" ON public.playlist_modules;
CREATE POLICY "Staff can read assigned playlist modules"
  ON public.playlist_modules FOR SELECT TO authenticated
  USING (playlist_id IN (SELECT get_user_playlist_ids(auth.uid())));
