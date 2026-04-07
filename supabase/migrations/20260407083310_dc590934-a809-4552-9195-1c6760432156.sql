CREATE POLICY "Staff can delete own progress"
ON public.staff_module_progress
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Staff can delete own attempts"
ON public.staff_quiz_attempts
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);