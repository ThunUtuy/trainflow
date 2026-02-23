-- Recreate the trigger on auth.users for new user profile creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Also insert a profile for any existing users that are missing one
INSERT INTO public.profiles (user_id, name)
SELECT au.id, COALESCE(au.raw_user_meta_data->>'name', '')
FROM auth.users au
LEFT JOIN public.profiles p ON p.user_id = au.id
WHERE p.id IS NULL;