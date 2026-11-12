import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { journals, languageCodes, getJournal, getEpisode, countWords } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { useStore, type Entry } from "@/lib/store";
import { WritingStudio } from "@/components/WritingStudio";
import { Decoration } from "@/components/decorations/Decoration";

export const Route = createFileRoute("/entradas")({
  head: () => ({
    meta: [
      { title: "Minhas entradas — Language Journal" },
      { name: "description", content: "Todos os seus textos, organizados por diário, idioma e episódio, com versões anteriores preservadas." },
      { property: "og:title", content: "Minhas entradas — Language Journal" },
      { property: "og:description", content: "Seu arquivo pessoal de escrita em outros idiomas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EntriesPage,
});

const sel = "rounded-md border bg-card px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-ring";

function EntriesPage() {
  const s = useStore();
  const { t, langName, date: fmt } = useI18n();
  const [journal, setJournal] = useState("all");
  const [lang, setLang] = useState("all");
  const [period, setPeriod] = useState<"all" | "7" | "30" | "365">("all");
  const [order, setOrder] = useState<"new" | "old" | "episode">("new");
  const [open, setOpen] = useState<string | null>(null);
  const [compare, setCompare] = useState<string[]>([]);

  const list = useMemo(() => {
    const l = s.entries.filter((e) => {
      const j = getJournal(e.journalId);
      return (journal === "all" || j?.id === journal) && (lang === "all" || j?.languageCode === lang)
        && (period === "all" || Date.now() - new Date(e.updatedAt).getTime() <= Number(period) * 864e5);
    });
    const num = (e: Entry) => { const j = getJournal(e.journalId); return (j && getEpisode(j, e.episodeId)?.number) ?? 0; };
    return l.sort((a, b) => order === "episode" ? a.journalId.localeCompare(b.journalId) || num(a) - num(b)
      : order === "new" ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt));
  }, [s.entries, journal, lang, order, period]);

  const toggleCompare = (id: string) => setCompare((c) => c.includes(id) ? c.filter((x) => x !== id) : [...c.slice(-1), id]);
  const compared = compare.map((id) => s.entries.find((e) => e.id === id)).filter(Boolean) as Entry[];

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <h1 className="relative inline-block text-5xl">{t("nav.entries")}<Decoration asset="quillMagic" size={44} pos={{ top: "-10%", right: "-64px" }} motion="none" rotate={10} className="hidden sm:block" /></h1>
      <p className="mt-4 font-serif text-xl text-muted-foreground">{t("entries.intro")}</p>

      <div className="mt-10 flex flex-wrap gap-3" role="group" aria-label={t("entries.filters")}>
        <label className="sr-only" htmlFor="f-j">{t("entries.journal")}</label>
        <select id="f-j" className={sel} value={journal} onChange={(e) => setJournal(e.target.value)}>
          <option value="all">{t("entries.allJournals")}</option>
          {journals.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
        <label className="sr-only" htmlFor="f-l">{t("entries.language")}</label>
        <select id="f-l" className={sel} value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="all">{t("entries.allLanguages")}</option>
          {languageCodes.map((l) => <option key={l} value={l}>{langName(l)}</option>)}
        </select>
        <label className="sr-only" htmlFor="f-d">{t("entries.period")}</label>
        <select id="f-d" className={sel} value={period} onChange={(e) => setPeriod(e.target.value as typeof period)}>
          <option value="all">{t("entries.anyDate")}</option>
          <option value="7">{t("entries.last7")}</option>
          <option value="30">{t("entries.last30")}</option>
          <option value="365">{t("entries.lastYear")}</option>
        </select>
        <label className="sr-only" htmlFor="f-o">{t("entries.sort")}</label>
        <select id="f-o" className={sel} value={order} onChange={(e) => setOrder(e.target.value as typeof order)}>
          <option value="new">{t("entries.newest")}</option>
          <option value="old">{t("entries.oldest")}</option>
          <option value="episode">{t("entries.byEpisode")}</option>
        </select>
      </div>

      {compared.length === 2 && (
        <section aria-label={t("entries.compareTitle")} className="mt-10 rounded-xl border bg-secondary/50 p-6">
          <div className="flex justify-between"><h2 className="text-2xl">{t("entries.compareTitle")}</h2><button onClick={() => setCompare([])} className="text-sm underline">{t("common.close")}</button></div>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {[...compared].sort((a, b) => a.createdAt.localeCompare(b.createdAt)).map((e) => <Sample key={e.id} e={e} />)}
          </div>
        </section>
      )}

      {list.length === 0 ? (
        <div className="mt-16 rounded-xl border border-dashed p-12 text-center">
          <p className="font-display text-2xl">{t("entries.emptyTitle")}</p>
          <p className="mt-2 text-muted-foreground">{t("entries.emptyBody")}</p>
          <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2 text-primary-foreground">{t("entries.goLibrary")}</Link>
        </div>
      ) : (
        <ul className="mt-10 space-y-4">
          {list.map((e) => {
            const j = getJournal(e.journalId), ep = j && getEpisode(j, e.episodeId);
            if (!j || !ep) return <OrphanEntry key={e.id} e={e} />;
            const isOpen = open === e.id;
            return (
              <li key={e.id} className="rounded-xl border bg-card">
                <div className="flex flex-wrap items-start gap-4 p-5">
                  <div className="flex-1 min-w-60">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{j.title} · {langName(j.languageCode)} · {t("common.epShort", { n: ep.number })}</p>
                    <p className="mt-1 font-display text-xl">{ep.prompt.title}</p>
                    <p className="text-sm text-muted-foreground">{fmt(e.createdAt)} · {t("common.words", { n: countWords(e.content) })} · {e.status === "complete" ? t("entries.complete") : t("entries.draft")}{e.revisions.length ? ` · ${t("entries.revisions", { n: e.revisions.length })}` : ""}</p>
                    {!isOpen && <p lang={j.languageCode} className="mt-3 font-serif text-lg line-clamp-2">{e.content}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={compare.includes(e.id)} onChange={() => toggleCompare(e.id)} /> {t("entries.compare")}</label>
                    <button onClick={() => setOpen(isOpen ? null : e.id)} aria-expanded={isOpen} className="rounded-full border px-4 py-1.5 text-sm hover:bg-muted">{isOpen ? t("common.close") : t("entries.openEdit")}</button>
                  </div>
                </div>
                {isOpen && (
                  <div className="border-t p-5 space-y-6">
                    <WritingStudio journal={j} episode={ep} entry={e} />
                    {e.revisions.length > 0 && (
                      <div>
                        <h3 className="text-xl">{t("entries.previous")}</h3>
                        <ol className="mt-3 space-y-3">
                          {e.revisions.map((r, i) => (
                            <li key={i} className="rounded-lg bg-muted p-4">
                              <p className="text-xs text-muted-foreground">{i === 0 ? t("entries.original") : t("entries.version", { n: i + 1 })} · {fmt(r.date)}</p>
                              <p lang={j.languageCode} className="mt-2 whitespace-pre-wrap font-serif text-lg">{r.content}</p>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Entries whose story or episode no longer exists stay visible and read-only; nothing is deleted. */
function OrphanEntry({ e }: { e: Entry }) {
  const { t, date: fmt } = useI18n();
  return (
    <li className="rounded-xl border border-dashed bg-card p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t("entries.unknownStory")} · {fmt(e.createdAt)} · {t("common.words", { n: countWords(e.content) })}</p>
      <p role="note" className="mt-2 text-sm text-muted-foreground">{t("entries.unavailable")}</p>
      <p className="mt-3 whitespace-pre-wrap font-serif text-lg">{e.content}</p>
      {e.revisions.map((r, i) => <p key={i} className="mt-3 rounded-lg bg-muted p-3 whitespace-pre-wrap font-serif">{fmt(r.date)} — {r.content}</p>)}
    </li>
  );
}

function Sample({ e }: { e: Entry }) {
  const { t, date: fmt } = useI18n();
  const j = getJournal(e.journalId), ep = j && getEpisode(j, e.episodeId);
  if (!j || !ep) return <div className="rounded-lg bg-card p-5 border"><p className="text-xs text-muted-foreground">{t("entries.unknownStory")} · {fmt(e.createdAt)}</p><p className="mt-3 whitespace-pre-wrap font-serif text-lg">{e.content}</p></div>;
  return (
    <div className="rounded-lg bg-card p-5 border">
      <p className="text-xs text-muted-foreground">{j.title} · {t("common.epShort", { n: ep.number })} · {fmt(e.createdAt)} · {t("common.words", { n: countWords(e.content) })}</p>
      <p lang={j.languageCode} className="mt-3 whitespace-pre-wrap font-serif text-lg leading-relaxed">{e.content}</p>
    </div>
  );
}
