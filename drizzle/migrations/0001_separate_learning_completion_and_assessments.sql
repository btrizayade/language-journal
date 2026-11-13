ALTER TABLE public.user_state ADD COLUMN completed jsonb NOT NULL DEFAULT '{}'::jsonb, ADD COLUMN assessments jsonb NOT NULL DEFAULT '{}'::jsonb;
INSERT INTO public.user_state (user_id, completed)
SELECT user_id, jsonb_object_agg(journal_id || '/' || episode_id, updated_at::text)
FROM public.writing_entries WHERE status = 'complete' GROUP BY user_id
ON CONFLICT (user_id) DO UPDATE SET completed = public.user_state.completed || EXCLUDED.completed;