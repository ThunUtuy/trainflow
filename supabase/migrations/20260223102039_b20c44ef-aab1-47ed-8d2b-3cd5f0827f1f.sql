
-- Role enum
CREATE TYPE public.app_role AS ENUM ('manager', 'staff');

-- Page type enum
CREATE TYPE public.page_type AS ENUM ('text', 'image', 'video', 'checklist');

-- Question type enum
CREATE TYPE public.question_type AS ENUM ('single_choice', 'multi_choice', 'true_false');

-- Module progress status enum
CREATE TYPE public.progress_status AS ENUM ('not_started', 'in_progress', 'completed');

-- Establishments
CREATE TABLE public.establishments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID NOT NULL,
  invite_code TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  establishment_id UUID REFERENCES public.establishments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles (separate table per security guidelines)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Modules
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID REFERENCES public.establishments(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  template_source TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Module pages
CREATE TABLE public.module_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  type page_type NOT NULL DEFAULT 'text',
  title TEXT NOT NULL DEFAULT '',
  content JSONB DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0
);

-- Quizzes
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Quiz'
);

-- Quiz questions
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  type question_type NOT NULL DEFAULT 'single_choice',
  options JSONB NOT NULL DEFAULT '[]',
  correct_answers JSONB NOT NULL DEFAULT '[]',
  sort_order INT NOT NULL DEFAULT 0
);

-- Staff module progress
CREATE TABLE public.staff_module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  status progress_status NOT NULL DEFAULT 'not_started',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, module_id)
);

-- Staff quiz attempts
CREATE TABLE public.staff_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  score INT NOT NULL DEFAULT 0,
  total INT NOT NULL DEFAULT 0,
  answers JSONB DEFAULT '[]',
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Invite codes
CREATE TABLE public.invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID REFERENCES public.establishments(id) ON DELETE CASCADE NOT NULL,
  code TEXT NOT NULL UNIQUE,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to get user's establishment_id
CREATE OR REPLACE FUNCTION public.get_user_establishment_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT establishment_id FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===================== RLS POLICIES =====================

-- Profiles: users can read/update their own, managers can read staff in same establishment
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Managers can read staff profiles in same establishment"
  ON public.profiles FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'manager') AND
    establishment_id = public.get_user_establishment_id(auth.uid())
  );

-- User roles: users can read their own role
CREATE POLICY "Users can read own role"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own role"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Establishments: managers can create, members can read their own
CREATE POLICY "Managers can create establishments"
  ON public.establishments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Members can read own establishment"
  ON public.establishments FOR SELECT TO authenticated
  USING (id = public.get_user_establishment_id(auth.uid()));

CREATE POLICY "Managers can update own establishment"
  ON public.establishments FOR UPDATE TO authenticated
  USING (created_by = auth.uid());

-- Modules: readable by establishment members, writable by managers
CREATE POLICY "Members can read modules"
  ON public.modules FOR SELECT TO authenticated
  USING (establishment_id = public.get_user_establishment_id(auth.uid()));

CREATE POLICY "Managers can insert modules"
  ON public.modules FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'manager') AND
    establishment_id = public.get_user_establishment_id(auth.uid())
  );

CREATE POLICY "Managers can update modules"
  ON public.modules FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'manager') AND
    establishment_id = public.get_user_establishment_id(auth.uid())
  );

CREATE POLICY "Managers can delete modules"
  ON public.modules FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(), 'manager') AND
    establishment_id = public.get_user_establishment_id(auth.uid())
  );

-- Module pages: same as modules via module's establishment
CREATE POLICY "Members can read module pages"
  ON public.module_pages FOR SELECT TO authenticated
  USING (
    module_id IN (
      SELECT id FROM public.modules WHERE establishment_id = public.get_user_establishment_id(auth.uid())
    )
  );

CREATE POLICY "Managers can insert module pages"
  ON public.module_pages FOR INSERT TO authenticated
  WITH CHECK (
    module_id IN (
      SELECT id FROM public.modules
      WHERE establishment_id = public.get_user_establishment_id(auth.uid())
        AND public.has_role(auth.uid(), 'manager')
    )
  );

CREATE POLICY "Managers can update module pages"
  ON public.module_pages FOR UPDATE TO authenticated
  USING (
    module_id IN (
      SELECT id FROM public.modules
      WHERE establishment_id = public.get_user_establishment_id(auth.uid())
        AND public.has_role(auth.uid(), 'manager')
    )
  );

CREATE POLICY "Managers can delete module pages"
  ON public.module_pages FOR DELETE TO authenticated
  USING (
    module_id IN (
      SELECT id FROM public.modules
      WHERE establishment_id = public.get_user_establishment_id(auth.uid())
        AND public.has_role(auth.uid(), 'manager')
    )
  );

-- Quizzes: same pattern
CREATE POLICY "Members can read quizzes"
  ON public.quizzes FOR SELECT TO authenticated
  USING (
    module_id IN (
      SELECT id FROM public.modules WHERE establishment_id = public.get_user_establishment_id(auth.uid())
    )
  );

CREATE POLICY "Managers can insert quizzes"
  ON public.quizzes FOR INSERT TO authenticated
  WITH CHECK (
    module_id IN (
      SELECT id FROM public.modules
      WHERE establishment_id = public.get_user_establishment_id(auth.uid())
        AND public.has_role(auth.uid(), 'manager')
    )
  );

CREATE POLICY "Managers can update quizzes"
  ON public.quizzes FOR UPDATE TO authenticated
  USING (
    module_id IN (
      SELECT id FROM public.modules
      WHERE establishment_id = public.get_user_establishment_id(auth.uid())
        AND public.has_role(auth.uid(), 'manager')
    )
  );

CREATE POLICY "Managers can delete quizzes"
  ON public.quizzes FOR DELETE TO authenticated
  USING (
    module_id IN (
      SELECT id FROM public.modules
      WHERE establishment_id = public.get_user_establishment_id(auth.uid())
        AND public.has_role(auth.uid(), 'manager')
    )
  );

-- Quiz questions: same pattern
CREATE POLICY "Members can read quiz questions"
  ON public.quiz_questions FOR SELECT TO authenticated
  USING (
    quiz_id IN (
      SELECT q.id FROM public.quizzes q
      JOIN public.modules m ON m.id = q.module_id
      WHERE m.establishment_id = public.get_user_establishment_id(auth.uid())
    )
  );

CREATE POLICY "Managers can insert quiz questions"
  ON public.quiz_questions FOR INSERT TO authenticated
  WITH CHECK (
    quiz_id IN (
      SELECT q.id FROM public.quizzes q
      JOIN public.modules m ON m.id = q.module_id
      WHERE m.establishment_id = public.get_user_establishment_id(auth.uid())
        AND public.has_role(auth.uid(), 'manager')
    )
  );

CREATE POLICY "Managers can update quiz questions"
  ON public.quiz_questions FOR UPDATE TO authenticated
  USING (
    quiz_id IN (
      SELECT q.id FROM public.quizzes q
      JOIN public.modules m ON m.id = q.module_id
      WHERE m.establishment_id = public.get_user_establishment_id(auth.uid())
        AND public.has_role(auth.uid(), 'manager')
    )
  );

CREATE POLICY "Managers can delete quiz questions"
  ON public.quiz_questions FOR DELETE TO authenticated
  USING (
    quiz_id IN (
      SELECT q.id FROM public.quizzes q
      JOIN public.modules m ON m.id = q.module_id
      WHERE m.establishment_id = public.get_user_establishment_id(auth.uid())
        AND public.has_role(auth.uid(), 'manager')
    )
  );

-- Staff module progress: staff can manage own, managers can read for their establishment
CREATE POLICY "Staff can read own progress"
  ON public.staff_module_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can upsert own progress"
  ON public.staff_module_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can update own progress"
  ON public.staff_module_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Managers can read staff progress"
  ON public.staff_module_progress FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'manager') AND
    module_id IN (
      SELECT id FROM public.modules WHERE establishment_id = public.get_user_establishment_id(auth.uid())
    )
  );

-- Staff quiz attempts: staff can manage own, managers can read
CREATE POLICY "Staff can read own attempts"
  ON public.staff_quiz_attempts FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can insert own attempts"
  ON public.staff_quiz_attempts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Managers can read staff attempts"
  ON public.staff_quiz_attempts FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'manager') AND
    quiz_id IN (
      SELECT q.id FROM public.quizzes q
      JOIN public.modules m ON m.id = q.module_id
      WHERE m.establishment_id = public.get_user_establishment_id(auth.uid())
    )
  );

-- Invite codes: managers can create/read for own establishment, anyone authenticated can read by code
CREATE POLICY "Managers can create invite codes"
  ON public.invite_codes FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'manager') AND
    establishment_id = public.get_user_establishment_id(auth.uid())
  );

CREATE POLICY "Managers can read own invite codes"
  ON public.invite_codes FOR SELECT TO authenticated
  USING (establishment_id = public.get_user_establishment_id(auth.uid()));

CREATE POLICY "Staff can read invite code by code value"
  ON public.invite_codes FOR SELECT TO authenticated
  USING (used_by IS NULL);

CREATE POLICY "Staff can claim invite code"
  ON public.invite_codes FOR UPDATE TO authenticated
  USING (used_by IS NULL)
  WITH CHECK (auth.uid() = used_by);
