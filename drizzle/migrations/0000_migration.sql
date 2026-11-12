CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', '')) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Writing entries: one row per entry; revisions keep every earlier saved version.
CREATE TABLE public.writing_entries (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL,
  journal_id text NOT NULL,
  episode_id text NOT NULL,
  content text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','complete')),
  revisions jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX writing_entries_user_idx ON public.writing_entries(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.writing_entries TO authenticated;
GRANT ALL ON public.writing_entries TO service_role;
ALTER TABLE public.writing_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own entries" ON public.writing_entries FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Saved vocabulary: one item per word per language per user.
CREATE TABLE public.saved_vocabulary (
  user_id uuid NOT NULL,
  key text NOT NULL,
  language_code text NOT NULL,
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, key)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_vocabulary TO authenticated;
GRANT ALL ON public.saved_vocabulary TO service_role;
ALTER TABLE public.saved_vocabulary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own vocab" ON public.saved_vocabulary FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.reading_passages (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL,
  journal_id text NOT NULL,
  episode_id text NOT NULL,
  text text NOT NULL,
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, journal_id, episode_id, text)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reading_passages TO authenticated;
GRANT ALL ON public.reading_passages TO service_role;
ALTER TABLE public.reading_passages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own passages" ON public.reading_passages FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.bookmarks (
  user_id uuid NOT NULL,
  episode_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, episode_key)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookmarks TO authenticated;
GRANT ALL ON public.bookmarks TO service_role;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own bookmarks" ON public.bookmarks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Journal progress, goals, pending edits and preferences.
CREATE TABLE public.user_state (
  user_id uuid PRIMARY KEY,
  opened jsonb NOT NULL DEFAULT '{}',
  last_visit jsonb NOT NULL DEFAULT '{}',
  last_episode jsonb,
  goals jsonb NOT NULL DEFAULT '{}',
  pending jsonb NOT NULL DEFAULT '{}',
  prefs jsonb,
  reading jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_state TO authenticated;
GRANT ALL ON public.user_state TO service_role;
ALTER TABLE public.user_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own state" ON public.user_state FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);