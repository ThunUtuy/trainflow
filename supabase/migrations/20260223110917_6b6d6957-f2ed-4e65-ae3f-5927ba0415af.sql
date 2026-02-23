
-- Grant necessary permissions on establishments table
GRANT SELECT, INSERT, UPDATE ON public.establishments TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.invite_codes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.module_pages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.modules TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_questions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quizzes TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.staff_module_progress TO authenticated;
GRANT SELECT, INSERT ON public.staff_quiz_attempts TO authenticated;
GRANT SELECT, INSERT ON public.user_roles TO authenticated;
