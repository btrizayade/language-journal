import { createFileRoute, Link } from "@tanstack/react-router";
import { journals } from "@/lib/content";
import { useStore, completedEpisodes } from "@/lib/store";
import { ProgressBar } from "@/components/BookCard";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/progresso")({
  head: () => ({
    meta: [
      { title: "Meu progresso — Language Journal" },
      { name: "description", content: "Diários ativos, episódios concluídos, textos escritos e vocabulário guardado." },
      { property: "og:title", content: "Meu progresso — Language Journal" },
      { property: "og:description", content: "Um retrato calmo do seu percurso de leitura e escrita." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const s = useStore();
  const { t, langName, locale, num } = useI18n();
  const active = journals.filter((j) => s.lastVisit[j.id]);
  const completed = journals.reduce((n, j) => n + completedEpisodes(s, j.id).size, 0);
  const saved = s.entries.filter((e) => e.status === "complete").length;

  // last 8 weeks of writing activity
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const end = new Date(); end.setHours(23, 59, 59); end.setDate(end.getDate() - 7 * (7 - i));
    const start = new Date(end); start.setDate(start.getDate() - 6); start.setHours(0, 0, 0);
    const count = s.entries.filter((e) => { const d = new Date(e.createdAt); return d >= start && d <= end; }).length
      + s.entries.reduce((n, e) => n + e.revisions.filter((r) => { const d = new Date(r.date); return d >= start && d <= end; }).length, 0);
    return { label: start.toLocaleDateString(locale, { day: "numeric", month: "short" }), count };
  });
  const maxW = Math.max(1, ...weeks.map((w) => w.count));

  const stats = [
    [t("progress.active"), active.length], [t("progress.completed"), completed],
    [t("progress.saved"), saved], [t("progress.words"), s.vocab.length],
  ] as const;

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <h1 className="text-5xl">{t("nav.progress")}</h1>
      <p className="mt-4 font-serif text-xl text-muted-foreground">{t("progress.intro")}</p>
      {!active.length && !s.entries.length && !s.vocab.length && <div className="mt-6"><p className="text-muted-foreground">{t("onboard.write")}</p><Button asChild className="mt-4 h-auto whitespace-normal"><Link to="/episodio/$journalId/$episodeId" params={{ journalId: "les-jours-de-camille", episodeId: "la-lettre" }}>{t("onboard.start")}</Link></Button></div>}

      <dl className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map(([k, v]) => (
          <div key={k} className="rounded-xl border bg-card p-5"><dt className="text-sm text-muted-foreground">{k}</dt><dd className="mt-2 font-display text-4xl">{num(v)}</dd></div>
        ))}
      </dl>

      <section className="mt-14" aria-labelledby="atividade">
        <h2 id="atividade" className="text-3xl">{t("progress.activity")}</h2>
        <p className="text-sm text-muted-foreground">{t("progress.activityHint")}</p>
        <div className="mt-6 flex h-40 items-end gap-3 border-b pb-1">
          {weeks.map((w) => (
            <div key={w.label} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs text-muted-foreground">{w.count || ""}</span>
              <div className="w-full rounded-t bg-lavender/80" style={{ height: `${(w.count / maxW) * 100}%`, minHeight: w.count ? 6 : 2 }} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-3">{weeks.map((w) => <span key={w.label} className="flex-1 text-center text-[11px] text-muted-foreground">{w.label}</span>)}</div>
      </section>

      <section className="mt-14" aria-labelledby="por-diario">
        <h2 id="por-diario" className="text-3xl">{t("progress.byJournal")}</h2>
        <ul className="mt-6 space-y-4">
          {journals.map((j) => {
            const d = completedEpisodes(s, j.id).size;
            return (
              <li key={j.id} className="flex items-center gap-5 rounded-xl border bg-card p-4">
                <img src={j.cover} alt="" width={768} height={1024} className="w-14 aspect-[3/4] rounded-sm object-cover" />
                <div className="flex-1">
                  <Link to="/diario/$journalId" params={{ journalId: j.id }} className="font-display text-xl hover:underline">{j.title}</Link>
                  <p className="text-sm text-muted-foreground mb-2">{langName(j.languageCode)} {j.level} · {t("common.episodes", { done: d, total: j.episodes.length })}</p>
                  <ProgressBar value={d / j.episodes.length} label={t("common.progressIn", { title: j.title })} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="vocab">
        <h2 id="vocab" className="text-3xl">{t("progress.vocab")}</h2>
        {s.vocab.length === 0 ? <p className="mt-4 text-muted-foreground">{t("progress.vocabEmpty")}</p> : (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {s.vocab.map((v) => {
              const j = journals.find((x) => x.id === v.journalId);
              return (
                <li key={v.key} className="rounded-lg border bg-card p-4">
                  <p lang={j?.languageCode} className="font-display text-lg">{v.term} <span className="font-sans text-sm text-muted-foreground">· {v.translation}</span></p>
                  <p lang={j?.languageCode} className="mt-1 font-serif italic text-muted-foreground">« {v.example} »</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
