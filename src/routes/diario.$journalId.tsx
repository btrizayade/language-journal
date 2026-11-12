import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getJournal } from "@/lib/content";
import { useLocalizedJournal } from "@/lib/content-l10n";
import { useI18n } from "@/lib/i18n";
import { useStore, completedEpisodes } from "@/lib/store";
import { ProgressBar } from "@/components/BookCard";
import { Check } from "lucide-react";

export const Route = createFileRoute("/diario/$journalId")({
  loader: ({ params }) => {
    const j = getJournal(params.journalId);
    if (!j) throw notFound();
    return { title: j.title, synopsis: j.synopsis };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.title} — Language Journal` },
      { name: "description", content: loaderData.synopsis.slice(0, 155) },
      { property: "og:title", content: loaderData.title },
      { property: "og:description", content: loaderData.synopsis.slice(0, 155) },
      { property: "og:type", content: "book" },
      { name: "twitter:card", content: "summary_large_image" },
    ] : [{ title: "Diário indisponível" }, { name: "robots", content: "noindex" }],
  }),
  component: JournalPage,
});

function JournalPage() {
  const { journalId } = Route.useParams();
  const lx = useLocalizedJournal(journalId)!;
  const j = lx.journal;
  const s = useStore();
  const { t, langName } = useI18n();
  const done = completedEpisodes(s, j.id);
  const next = j.episodes.find((e) => !done.has(e.id)) ?? j.episodes[0]!;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-12 md:grid-cols-[minmax(0,380px)_1fr]">
        <img src={j.cover} alt={t("journal.cover", { title: j.title })} width={768} height={1024} className="w-full max-w-sm rounded-r-md rounded-l-sm border shadow-[var(--shadow-book)]" />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{langName(j.languageCode)} · {t("journal.level", { level: j.level })}</p>
          <h1 className="mt-3 text-5xl md:text-6xl">{j.title}</h1>
          <p lang={lx.lang} className="mt-6 font-serif text-xl leading-relaxed">{j.synopsis}</p>
          {lx.fallback && <p className="mt-2 text-sm text-muted-foreground">{t("episode.explFallback")}</p>}
          <div className="mt-8 max-w-sm">
            <ProgressBar value={done.size / j.episodes.length} label={t("journal.progress")} />
            <p className="mt-2 text-sm text-muted-foreground">{t("journal.completed", { done: done.size, total: j.episodes.length })}</p>
          </div>
          <Link to="/episodio/$journalId/$episodeId" params={{ journalId: j.id, episodeId: next.id }}
            className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-primary-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            {done.size === 0 ? t("journal.start") : done.size === j.episodes.length ? t("journal.reread") : t("journal.continueEp", { n: next.number })}
          </Link>
          <dl className="mt-10 grid gap-6 sm:grid-cols-2 border-t pt-8">
            <div><dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t("journal.setting")}</dt><dd className="mt-2 font-serif text-lg">{j.setting}</dd></div>
            <div><dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t("journal.culturalContext")}</dt><dd className="mt-2 font-serif text-lg">{j.culturalContext}</dd></div>
          </dl>
        </div>
      </div>

      <section className="mt-20" aria-labelledby="personagens">
        <h2 id="personagens" className="text-3xl">{t("journal.characters")}</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {j.characters.map((c) => (
            <li key={c.name} className={`rounded-lg border p-5 ${c.main ? (j.accent === "sage" ? "bg-sage/30" : "bg-secondary") : "bg-card"}`}>
              <p className="font-display text-xl">{c.name}</p>
              <p className="text-sm text-muted-foreground">{c.role}{c.age ? `, ${t("journal.age", { n: c.age })}` : ""}</p>
              <p className="mt-3 font-serif">{c.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20" aria-labelledby="episodios">
        <h2 id="episodios" className="text-3xl">{t("journal.episodes")}</h2>
        <ol className="mt-6 divide-y border-y">
          {j.episodes.map((e) => (
            <li key={e.id}>
              <Link to="/episodio/$journalId/$episodeId" params={{ journalId: j.id, episodeId: e.id }}
                className="flex items-center gap-6 py-5 hover:bg-muted/60 px-2 focus-visible:outline-2 focus-visible:outline-ring">
                <span className="font-display text-3xl w-10 text-muted-foreground">{e.number}</span>
                <div className="flex-1">
                  <p className="font-display text-xl">{e.title}</p>
                  <p className="font-serif text-muted-foreground">{e.intro}</p>
                </div>
                <span className="hidden sm:inline text-xs uppercase tracking-[0.15em] text-muted-foreground">{t(`format.${e.format}`)} · {e.minutes} min</span>
                <span aria-label={done.has(e.id) ? t("journal.done") : t("journal.notDone")}
                  className={`grid size-7 place-items-center rounded-full border ${done.has(e.id) ? "bg-sage border-sage" : ""}`}>
                  {done.has(e.id) && <Check className="size-4" />}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
