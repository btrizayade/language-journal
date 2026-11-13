import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { BookmarkCheck } from "lucide-react";
import { journals, languageCodes, getJournal, getEpisode } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { useStore, updatePassage, deletePassage, toggleBookmark, type Passage } from "@/lib/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/notas")({
  head: () => ({
    meta: [
      { title: "Notas de leitura — Language Journal" },
      { name: "description", content: "Episódios marcados e trechos guardados das histórias, com suas anotações." },
      { property: "og:title", content: "Notas de leitura — Language Journal" },
      { property: "og:description", content: "Seus marcadores e trechos favoritos das histórias." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NotesPage,
});

const sel = "rounded-md border bg-card px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-ring";

function NotesPage() {
  const s = useStore();
  const { t, langName, date } = useI18n();
  const [journal, setJournal] = useState("all");
  const [lang, setLang] = useState("all");
  const keep = (journalId: string) => { const j = getJournal(journalId); return !!j && (journal === "all" || j.id === journal) && (lang === "all" || j.languageCode === lang); };
  const marks = Object.entries(s.bookmarks).map(([k, at]) => { const [jid, eid] = k.split("/") as [string, string]; return { jid, eid, at }; })
    .filter((b) => keep(b.jid)).sort((a, b) => b.at.localeCompare(a.at));
  const passages = s.passages.filter((p) => keep(p.journalId));

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <h1 className="text-5xl">{t("notes.title")}</h1>
      <p className="mt-4 font-serif text-xl text-muted-foreground">{t("notes.intro")}</p>

      <div className="mt-10 flex flex-wrap gap-3" role="group" aria-label={t("entries.filters")}>
        <label className="sr-only" htmlFor="n-j">{t("entries.journal")}</label>
        <select id="n-j" className={sel} value={journal} onChange={(e) => setJournal(e.target.value)}>
          <option value="all">{t("entries.allJournals")}</option>
          {journals.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
        <label className="sr-only" htmlFor="n-l">{t("entries.language")}</label>
        <select id="n-l" className={sel} value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="all">{t("entries.allLanguages")}</option>
          {languageCodes.map((l) => <option key={l} value={l}>{langName(l)}</option>)}
        </select>
      </div>

      {(journal !== "all" || lang !== "all") && <Button className="mt-4" variant="outline" onClick={() => { setJournal("all"); setLang("all"); }}>{t("empty.filters")}</Button>}
      {!s.passages.length && !Object.keys(s.bookmarks).length && <aside className="mt-8 border-l-2 border-primary pl-4"><p className="text-xs text-muted-foreground">{t("empty.example")}</p><blockquote lang="fr" className="mt-2 font-serif text-xl italic">Chaque livre a déjà eu une autre vie.</blockquote><Button asChild variant="link" className="mt-2 h-auto whitespace-normal"><Link to="/episodio/$journalId/$episodeId" params={{ journalId: "les-jours-de-camille", episodeId: "la-lettre" }}>{t("onboard.start")}</Link></Button></aside>}

      <section className="mt-12" aria-labelledby="marks">
        <h2 id="marks" className="text-3xl">{t("notes.bookmarks")}</h2>
        {marks.length === 0 ? <p className="mt-4 text-muted-foreground">{t("notes.bookmarksEmpty")}</p> : (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {marks.map(({ jid, eid, at }) => {
              const j = getJournal(jid), ep = j && getEpisode(j, eid);
              if (!j || !ep) return null;
              return (
                <li key={`${jid}/${eid}`} className="flex items-start gap-3 rounded-lg border bg-card p-4">
                  <button onClick={() => toggleBookmark(jid, eid)} aria-label={t("notes.removeBookmark")} className="rounded-full p-1 hover:bg-muted"><BookmarkCheck className="size-5 text-sage-deep" /></button>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{j.title} · {langName(j.languageCode)}</p>
                    <Link to="/episodio/$journalId/$episodeId" params={{ journalId: jid, episodeId: eid }} className="font-display text-xl hover:underline">{t("common.epShort", { n: ep.number })} · <span lang={j.languageCode}>{ep.title}</span></Link>
                    <p className="text-xs text-muted-foreground">{date(at)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-14" aria-labelledby="passages">
        <h2 id="passages" className="text-3xl">{t("notes.passages")}</h2>
        {passages.length === 0 ? <p className="mt-4 text-muted-foreground">{t("notes.passagesEmpty")}</p> : (
          <ul className="mt-6 space-y-4">{passages.map((p) => <PassageCard key={p.id} p={p} />)}</ul>
        )}
      </section>
    </div>
  );
}

function PassageCard({ p }: { p: Passage }) {
  const { t, date } = useI18n();
  const [note, setNote] = useState(p.note);
  const j = getJournal(p.journalId), ep = j ? getEpisode(j, p.episodeId) : undefined;
  return (
    <li className="rounded-xl border bg-card p-6">
      <blockquote lang={j?.languageCode} className="border-l-2 border-lavender pl-4 font-serif text-xl italic leading-relaxed">{p.text}</blockquote>
      <label className="mt-4 block text-sm text-muted-foreground">{t("notes.yourNote")}
        <textarea value={note} onChange={(e) => setNote(e.target.value)} onBlur={() => { if (note !== p.note) { updatePassage(p.id, note); toast.success(t("notes.noteSaved")); } }}
          rows={2} placeholder={t("notes.notePlaceholder")} className="mt-1 w-full rounded-md border bg-background px-3 py-2 font-serif text-base text-foreground" />
      </label>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        {j && ep ? <Link to="/episodio/$journalId/$episodeId" params={{ journalId: j.id, episodeId: ep.id }} className="text-muted-foreground underline hover:text-foreground">{j.title} · {t("common.epShort", { n: ep.number })} · {date(p.createdAt)}</Link> : <span />}
        <button onClick={() => { if (confirm(t("notes.confirmDelete"))) deletePassage(p.id); }} className="text-destructive underline">{t("common.delete")}</button>
      </div>
    </li>
  );
}
