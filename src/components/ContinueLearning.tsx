import { Link } from "@tanstack/react-router";
import { journals, getJournal, getEpisode } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { useStore, dueVocab } from "@/lib/store";

/** Personal "pick up where you left off" panel. Shows nothing for brand-new learners. */
export function ContinueLearning() {
  const s = useStore();
  const { t, date } = useI18n();
  const last = s.lastEpisode;
  const lj = last && getJournal(last.journalId);
  const le = lj && getEpisode(lj, last.episodeId);
  const drafts = s.entries.filter((e) => e.status === "draft").sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3);
  const doneKeys = new Set(s.entries.filter((e) => e.status === "complete").map((e) => `${e.journalId}/${e.episodeId}`));
  const draftKeys = new Set(s.entries.map((e) => `${e.journalId}/${e.episodeId}`));
  const pendingActs = journals.flatMap((j) => (s.opened[j.id] ?? []).map((eid) => ({ j, ep: getEpisode(j, eid) })))
    .filter((x) => x.ep && !doneKeys.has(`${x.j.id}/${x.ep.id}`) && !draftKeys.has(`${x.j.id}/${x.ep.id}`)).slice(0, 3);
  const recent = [...s.vocab].sort((a, b) => b.savedAt.localeCompare(a.savedAt)).slice(0, 6);
  const due = dueVocab(s).length;
  if (!le && !drafts.length && !recent.length) return null;

  const card = "rounded-xl border bg-card p-5";
  const kicker = "text-xs uppercase tracking-[0.18em] text-muted-foreground";
  return (
    <section aria-labelledby="continue-learning" className="mb-20">
      <h2 id="continue-learning" className="text-3xl">{t("cont.title")}</h2>
      <p className="mt-1 text-muted-foreground">{t("cont.hint")}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lj && le && (
          <Link to="/episodio/$journalId/$episodeId" params={{ journalId: lj.id, episodeId: le.id }} className={`${card} flex gap-4 hover:border-lavender focus-visible:outline-2 focus-visible:outline-ring lg:col-span-1`}>
            <img src={lj.cover} alt="" width={768} height={1024} className="w-16 aspect-[3/4] rounded-sm object-cover" />
            <div className="min-w-0">
              <p className={kicker}>{t("cont.lastRead")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{lj.title}</p>
              <p lang={lj.languageCode} className="font-display text-xl">{t("common.epShort", { n: le.number })} · {le.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{date(last!.at)}</p>
            </div>
          </Link>
        )}
        <div className={card}>
          <p className={kicker}>{t("cont.drafts")}</p>
          {drafts.length || pendingActs.length ? (
            <ul className="mt-2 space-y-2">
              {drafts.map((d) => { const j = getJournal(d.journalId)!, ep = getEpisode(j, d.episodeId)!; return (
                <li key={d.id}><Link to="/episodio/$journalId/$episodeId" params={{ journalId: j.id, episodeId: ep.id }} hash="escrever" className="hover:underline">{ep.prompt.title}</Link> <span className="text-xs text-muted-foreground">· {t("status.draft")}</span></li>
              ); })}
              {pendingActs.map(({ j, ep }) => (
                <li key={`${j.id}/${ep!.id}`}><Link to="/episodio/$journalId/$episodeId" params={{ journalId: j.id, episodeId: ep!.id }} hash="escrever" className="hover:underline">{ep!.prompt.title}</Link> <span className="text-xs text-muted-foreground">· {t("cont.toWrite")}</span></li>
              ))}
            </ul>
          ) : <p className="mt-2 text-sm text-muted-foreground">{t("cont.noDrafts")}</p>}
        </div>
        <div className={card}>
          <p className={kicker}>{t("cont.recentWords")}</p>
          {recent.length ? (
            <>
              <ul className="mt-2 flex flex-wrap gap-2">{recent.map((v) => <li key={v.key} lang={v.languageCode} className="rounded-full bg-secondary px-3 py-1 font-serif">{v.term}</li>)}</ul>
              <Link to={due ? "/revisao" : "/vocabulario"} className="mt-3 inline-block text-sm underline">{due ? t("review.startDue", { n: due }) : t("cont.openNotebook")}</Link>
            </>
          ) : <p className="mt-2 text-sm text-muted-foreground">{t("progress.vocabEmpty")}</p>}
        </div>
      </div>
    </section>
  );
}
