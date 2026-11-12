import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getJournal } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { useStore, dueVocab, reviewVocab, type ReviewAnswer } from "@/lib/store";

export const Route = createFileRoute("/revisao")({
  head: () => ({
    meta: [
      { title: "Revisão de vocabulário — Language Journal" },
      { name: "description", content: "Cartões simples para revisar as palavras guardadas, no seu ritmo." },
      { property: "og:title", content: "Revisão de vocabulário — Language Journal" },
      { property: "og:description", content: "Revise suas palavras com calma, sem pontos nem pressa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReviewPage,
});

function ReviewPage() {
  const s = useStore();
  const { t, langName } = useI18n();
  // Queue is fixed when the session starts so cards don't jump while reviewing.
  const [queue, setQueue] = useState<string[] | null>(null);
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(false);
  const due = dueVocab(s);

  const start = (all: boolean) => { setQueue((all ? [...s.vocab].sort(() => Math.random() - 0.5) : due).map((v) => v.key)); setI(0); setShown(false); };
  const card = queue ? s.vocab.find((v) => v.key === queue[i]) : undefined;
  const answer = (a: ReviewAnswer) => { if (!card) return; reviewVocab(card.key, a); setShown(false); setI((n) => n + 1); };

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <Link to="/vocabulario" className="text-sm text-muted-foreground hover:text-foreground">← {t("vocab.title")}</Link>
      <h1 className="mt-6 text-5xl">{t("review.title")}</h1>
      <p className="mt-4 font-serif text-xl text-muted-foreground">{t("review.intro")}</p>

      {!queue ? (
        <div className="mt-10 rounded-xl border bg-card p-8 text-center">
          {s.vocab.length === 0 ? (
            <><p className="font-display text-2xl">{t("vocab.emptyTitle")}</p><p className="mt-2 text-muted-foreground">{t("progress.vocabEmpty")}</p></>
          ) : (
            <>
              <p className="font-display text-2xl">{due.length ? t("review.dueCount", { n: due.length }) : t("review.nothingDue")}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {due.length > 0 && <button onClick={() => start(false)} className="rounded-full bg-primary px-5 py-2.5 text-primary-foreground">{t("review.start")}</button>}
                <button onClick={() => start(true)} className="rounded-full border px-5 py-2.5 hover:bg-muted">{t("review.all", { n: s.vocab.length })}</button>
              </div>
            </>
          )}
        </div>
      ) : !card ? (
        <div className="mt-10 rounded-xl border bg-card p-8 text-center">
          <p className="font-display text-2xl">{t("review.done")}</p>
          <p className="mt-2 text-muted-foreground">{t("review.doneHint")}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={() => setQueue(null)} className="rounded-full border px-5 py-2 hover:bg-muted">{t("common.close")}</button>
            <Link to="/" className="rounded-full bg-primary px-5 py-2 text-primary-foreground">{t("entries.goLibrary")}</Link>
          </div>
        </div>
      ) : (
        <div className="mt-10">
          <p className="text-sm text-muted-foreground">{t("review.position", { n: i + 1, total: queue.length })}</p>
          <div className="mt-3 rounded-sm border bg-card px-8 py-12 text-center shadow-[var(--shadow-book)]">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{langName(card.languageCode)} · {getJournal(card.journalId)?.title}</p>
            <p lang={card.languageCode} className="mt-4 font-display text-5xl break-words">{card.term}</p>
            {shown ? (
              <div className="mt-8 space-y-3 border-t pt-6">
                <p lang="pt-BR" className="text-xl">{card.translation}</p>
                {card.example && <p lang={card.languageCode} className="font-serif text-lg italic">« {card.example} »</p>}
                {card.note && <p className="font-serif text-muted-foreground">{card.note}</p>}
              </div>
            ) : (
              <button onClick={() => setShown(true)} autoFocus className="mt-8 rounded-full border px-6 py-2.5 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring">{t("review.reveal")}</button>
            )}
          </div>
          {shown && (
            <div className="mt-6" role="group" aria-label={t("review.how")}>
              <p className="text-center text-sm text-muted-foreground">{t("review.how")}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <button onClick={() => answer("hard")} className="rounded-full border bg-pink/40 px-4 py-2.5 hover:opacity-90">{t("review.hard")}</button>
                <button onClick={() => answer("familiar")} className="rounded-full border bg-secondary px-4 py-2.5 hover:opacity-90">{t("review.familiar")}</button>
                <button onClick={() => answer("easy")} className="rounded-full border bg-sage/40 px-4 py-2.5 hover:opacity-90">{t("review.easy")}</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
