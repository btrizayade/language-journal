import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { journals, languageCodes, getJournal, getEpisode } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { useStore, updateVocab, deleteVocab, dueVocab, type SavedVocab, type VocabStatus, type VocabCategory } from "@/lib/store";

export const Route = createFileRoute("/vocabulario")({
  head: () => ({
    meta: [
      { title: "Meu caderno de vocabulário — Language Journal" },
      { name: "description", content: "Palavras e expressões guardadas dos episódios, com notas pessoais e revisão." },
      { property: "og:title", content: "Meu caderno de vocabulário — Language Journal" },
      { property: "og:description", content: "Seu caderno de palavras descobertas nas histórias." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VocabPage,
});

const sel = "rounded-md border bg-card px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-ring";
const STATUSES: VocabStatus[] = ["new", "learning", "mastered"];

function VocabPage() {
  const s = useStore();
  const { t, langName } = useI18n();
  const [q, setQ] = useState("");
  const [lang, setLang] = useState("all");
  const [journal, setJournal] = useState("all");
  const [cat, setCat] = useState<"all" | VocabCategory>("all");
  const [status, setStatus] = useState<"all" | VocabStatus>("all");
  const due = dueVocab(s).length;

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return s.vocab
      .filter((v) => (lang === "all" || v.languageCode === lang) && (journal === "all" || v.journalId === journal)
        && (cat === "all" || v.category === cat) && (status === "all" || v.status === status)
        && (!needle || [v.term, v.translation, v.note, v.example].some((x) => x.toLowerCase().includes(needle))))
      .sort((a, b) => b.savedAt.localeCompare(a.savedAt));
  }, [s.vocab, q, lang, journal, cat, status]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl">{t("vocab.title")}</h1>
          <p className="mt-4 font-serif text-xl text-muted-foreground">{t("vocab.intro")}</p>
        </div>
        <Link to="/revisao" className="rounded-full bg-primary px-5 py-2.5 text-primary-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          {due ? t("review.startDue", { n: due }) : t("review.start")}
        </Link>
      </div>

      <div className="mt-10 flex flex-wrap gap-3" role="group" aria-label={t("entries.filters")}>
        <label className="sr-only" htmlFor="v-q">{t("vocab.search")}</label>
        <input id="v-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("vocab.search")} className={`${sel} min-w-56 flex-1`} />
        <label className="sr-only" htmlFor="v-l">{t("entries.language")}</label>
        <select id="v-l" className={sel} value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="all">{t("entries.allLanguages")}</option>
          {languageCodes.map((l) => <option key={l} value={l}>{langName(l)}</option>)}
        </select>
        <label className="sr-only" htmlFor="v-j">{t("entries.journal")}</label>
        <select id="v-j" className={sel} value={journal} onChange={(e) => setJournal(e.target.value)}>
          <option value="all">{t("entries.allJournals")}</option>
          {journals.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
        <label className="sr-only" htmlFor="v-c">{t("vocab.category")}</label>
        <select id="v-c" className={sel} value={cat} onChange={(e) => setCat(e.target.value as typeof cat)}>
          <option value="all">{t("vocab.allCategories")}</option>
          <option value="word">{t("vocab.cat.word")}</option>
          <option value="expression">{t("vocab.cat.expression")}</option>
        </select>
        <label className="sr-only" htmlFor="v-s">{t("vocab.status")}</label>
        <select id="v-s" className={sel} value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
          <option value="all">{t("vocab.allStatuses")}</option>
          {STATUSES.map((x) => <option key={x} value={x}>{t(`vocab.status.${x}`)}</option>)}
        </select>
      </div>

      {s.vocab.length === 0 ? (
        <div className="mt-16 rounded-xl border border-dashed p-12 text-center">
          <p className="font-display text-2xl">{t("vocab.emptyTitle")}</p>
          <p className="mt-2 text-muted-foreground">{t("progress.vocabEmpty")}</p>
          <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2 text-primary-foreground">{t("entries.goLibrary")}</Link>
        </div>
      ) : list.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">{t("vocab.noMatch")}</p>
      ) : (
        <ul className="mt-10 grid gap-4 md:grid-cols-2">{list.map((v) => <VocabCard key={v.key} v={v} />)}</ul>
      )}
    </div>
  );
}

function VocabCard({ v }: { v: SavedVocab }) {
  const { t, langName } = useI18n();
  const [editing, setEditing] = useState(false);
  const j = getJournal(v.journalId);
  const ep = j && getEpisode(j, v.episodeId);
  return (
    <li className="flex flex-col rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{langName(v.languageCode)} · {t(`vocab.cat.${v.category}`)}</p>
          <p lang={v.languageCode} className="mt-1 font-display text-2xl break-words">{v.term}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs ${v.status === "mastered" ? "bg-sage/50" : v.status === "learning" ? "bg-secondary" : "border"}`}>{t(`vocab.status.${v.status}`)}</span>
      </div>
      {editing ? (
        <form className="mt-3 space-y-3 text-sm" onSubmit={(e) => {
          e.preventDefault(); const f = new FormData(e.currentTarget);
          updateVocab(v.key, { translation: String(f.get("tr")), note: String(f.get("note")), status: f.get("status") as VocabStatus, category: f.get("cat") as VocabCategory });
          setEditing(false); toast.success(t("vocab.updated"));
        }}>
          <label className="block">{t("vocab.meaning")}<input name="tr" defaultValue={v.translation} className="mt-1 w-full rounded-md border bg-background px-2 py-1.5" /></label>
          <label className="block">{t("vocab.note")}<textarea name="note" defaultValue={v.note} rows={2} className="mt-1 w-full rounded-md border bg-background px-2 py-1.5" /></label>
          <div className="flex flex-wrap gap-3">
            <label className="flex flex-col">{t("vocab.status")}<select name="status" defaultValue={v.status} className="mt-1 rounded-md border bg-background px-2 py-1.5">{STATUSES.map((x) => <option key={x} value={x}>{t(`vocab.status.${x}`)}</option>)}</select></label>
            <label className="flex flex-col">{t("vocab.category")}<select name="cat" defaultValue={v.category} className="mt-1 rounded-md border bg-background px-2 py-1.5"><option value="word">{t("vocab.cat.word")}</option><option value="expression">{t("vocab.cat.expression")}</option></select></label>
          </div>
          <div className="flex gap-2"><button className="rounded-full bg-primary px-4 py-1.5 text-primary-foreground">{t("common.save")}</button><button type="button" onClick={() => setEditing(false)} className="rounded-full border px-4 py-1.5">{t("common.cancel")}</button></div>
        </form>
      ) : (
        <>
          <p lang="pt-BR" className="mt-2 text-muted-foreground">{v.translation}</p>
          {v.example && <p lang={v.languageCode} className="mt-2 font-serif italic">« {v.example} »</p>}
          {v.note && <p className="mt-3 rounded-md bg-muted px-3 py-2 font-serif">{v.note}</p>}
        </>
      )}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t pt-3 mt-4 text-sm">
        {j && ep ? <Link to="/episodio/$journalId/$episodeId" params={{ journalId: j.id, episodeId: ep.id }} className="text-muted-foreground hover:text-foreground underline">{j.title} · {t("common.epShort", { n: ep.number })}</Link> : <span />}
        {!editing && <div className="flex gap-3">
          <button onClick={() => setEditing(true)} className="underline">{t("common.edit")}</button>
          <button onClick={() => { if (confirm(t("vocab.confirmDelete", { term: v.term }))) { deleteVocab(v.key); toast.success(t("vocab.deleted")); } }} className="text-destructive underline">{t("common.delete")}</button>
        </div>}
      </div>
    </li>
  );
}
