import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { lessons, checkAnswers, learningText } from "@/lib/learning";
import { useI18n, translate } from "@/lib/i18n";
import { epKey, saveAssessment, useStore } from "@/lib/store";

export function ComprehensionPractice({ journalId, episodeId, language }: { journalId: string; episodeId: string; language: string }) {
  const { t, explanation } = useI18n();
  const s = useStore();
  const lesson = lessons[episodeId];
  const [answers, setAnswers] = useState<number[][]>([]);
  const [result, setResult] = useState<boolean[] | null>(null);
  if (!lesson) return null;
  const key = epKey(journalId, episodeId);
  const attempts = s.assessments[key] ?? [];
  const ready = lesson.questions.every((q, i) => answers[i]?.length === q.answer.length);
  const et = (key: Parameters<typeof translate>[1]) => translate(explanation, key);
  function submit() {
    if (!lesson || !ready) return;
    const checked = checkAnswers(lesson, answers);
    setResult(checked);
    saveAssessment(key, { id: crypto.randomUUID(), at: new Date().toISOString(), answers, correct: checked.filter(Boolean).length, total: checked.length });
  }
  return <section className="mt-16 border-y py-8" aria-labelledby="comprehension-title">
    <h2 id="comprehension-title" className="text-3xl">{t("lesson.title")}</h2>
    {attempts.length > 0 && <p className="mt-2 text-sm text-muted-foreground">{t("lesson.attempts", { n: attempts.length })}</p>}
    <div className="mt-6 space-y-8">
      {lesson.questions.map((question, i) => <fieldset key={i} disabled={!!result} className="min-w-0">
        <legend lang={language} className="mb-3 font-serif text-xl">{i + 1}. {question.prompt}</legend>
        {question.type === "sequence" && <p lang={explanation} className="mb-2 text-sm text-muted-foreground">{et("lesson.sequence")}</p>}
        <div className="space-y-2">
          {question.options.map((option, n) => question.type === "sequence"
            ? <Button key={n} variant="outline" className="h-auto min-h-10 w-full justify-start whitespace-normal text-left" disabled={!!result || answers[i]?.includes(n)} onClick={() => setAnswers((old) => { const next = [...old]; next[i] = [...(old[i] ?? []), n]; return next; })}>
                <span className="w-5 shrink-0">{answers[i]?.includes(n) ? (answers[i]?.indexOf(n) ?? 0) + 1 : "—"}</span><span lang={language}>{option}</span>
              </Button>
            : <label key={n} className="flex cursor-pointer items-start gap-3 rounded-md border px-4 py-3 has-[:checked]:bg-secondary">
                <input type="radio" className="mt-1 accent-primary" name={`question-${episodeId}-${i}`} checked={answers[i]?.[0] === n} onChange={() => setAnswers((old) => { const next = [...old]; next[i] = [n]; return next; })} />
                <span lang={language}>{option}</span>
              </label>)}
        </div>
        {question.type === "sequence" && !result && <Button variant="link" onClick={() => setAnswers((old) => { const next = [...old]; next[i] = []; return next; })}>{t("lesson.reset")}</Button>}
        {result && <div lang={explanation} className="mt-3 border-l-2 border-primary pl-4" role="status">
          <p className="font-medium">{et(result[i] ? "lesson.correct" : "lesson.incorrect")}</p>
          <p className="mt-1 text-muted-foreground">{learningText(question.explanation, explanation)}</p>
          <blockquote lang={language} className="mt-2 font-serif italic">« {question.evidence} »</blockquote>
        </div>}
      </fieldset>)}
    </div>
    <div className="mt-6 flex flex-wrap items-center gap-4">
      {result ? <><p role="status">{t("lesson.summary", { n: result.filter(Boolean).length, total: result.length })}</p><Button variant="outline" onClick={() => { setResult(null); setAnswers([]); }}><RotateCcw />{t("lesson.retry")}</Button></>
        : <Button disabled={!ready} onClick={submit}><Check />{t("lesson.check")}</Button>}
    </div>
  </section>;
}