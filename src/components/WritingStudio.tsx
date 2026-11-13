import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { countWords, type Episode, type Journal } from "@/lib/content";
import { autosave, completeEpisode, epKey, persistEntry, setGoal, useStore, type Entry } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Check, Save } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Link } from "@tanstack/react-router";
import { useSync } from "@/lib/sync";

export function WritingStudio({ journal, episode, entry, explLang = "pt-BR" }: { journal: Journal; episode: Episode; entry?: Entry | undefined; explLang?: string }) {
  const { t, langName } = useI18n();
  const { user, ready } = useSync();
  const s = useStore();
  const pending = entry ? s.pending[entry.id] : undefined;
  const [text, setText] = useState(pending?.content ?? entry?.content ?? "");
  const [id, setId] = useState(entry?.id);
  const [autoState, setAutoState] = useState<"idle" | "saving" | "saved">("idle");
  const typed = useRef(false);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => { setText((entry && s.pending[entry.id]?.content) ?? entry?.content ?? ""); setId(entry?.id); typed.current = false; }, [entry?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Autosave 1.2s after the learner stops typing.
  useEffect(() => {
    if (!typed.current) return;
    setAutoState("saving");
    autoTimer.current = setTimeout(() => { const newId = autosave(journal.id, episode.id, text, id); if (newId) setId(newId); setAutoState("saved"); }, 1200);
    return () => clearTimeout(autoTimer.current);
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

  const p = episode.prompt;
  const words = countWords(text);
  const custom = s.goals[epKey(journal.id, episode.id)];
  const [min, max] = custom ?? p.words;
  const [editGoal, setEditGoal] = useState(false);
  const lang = langName(journal.languageCode);
  const current = id ? s.entries.find((e) => e.id === id) : undefined;

  function save(status: Entry["status"]) {
    if (!text.trim()) { toast.error(t("studio.empty")); return; }
    clearTimeout(autoTimer.current);
    const e = persistEntry(journal.id, episode.id, text, status, id);
    setId(e.id); typed.current = false; setAutoState("idle");
    toast.success(status === "complete" ? t("studio.savedComplete") : t("studio.savedDraft"));
  }
  function saveGoal(form: HTMLFormElement) {
    const f = new FormData(form);
    const a = Number(f.get("min")), b = Number(f.get("max"));
    if (a > 0 && b >= a) { setGoal(journal.id, episode.id, [a, b]); setEditGoal(false); }
    else toast.error(t("studio.goalInvalid"));
  }

  return (
    <div className="rounded-xl border bg-card">
      <div className="border-b p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t("studio.kicker")} · {t(`activity.${p.type}`)}</p>
        <h3 className="mt-2 text-3xl">{p.title}</h3>
        <blockquote lang={journal.languageCode} className="mt-4 border-l-2 border-lavender pl-4 font-serif text-xl italic">{p.prompt}</blockquote>
        <p lang={explLang} className="mt-4 text-muted-foreground">{p.instructions}</p>
        {editGoal ? (
          <form className="mt-3 flex flex-wrap items-end gap-2 text-sm" onSubmit={(ev) => { ev.preventDefault(); saveGoal(ev.currentTarget); }}>
            <label className="flex flex-col gap-1">{t("studio.goalMin")}<input name="min" type="number" min={1} defaultValue={min} className="w-24 rounded-md border bg-background px-2 py-1" /></label>
            <label className="flex flex-col gap-1">{t("studio.goalMax")}<input name="max" type="number" min={1} defaultValue={max} className="w-24 rounded-md border bg-background px-2 py-1" /></label>
            <button className="rounded-full bg-primary px-4 py-1.5 text-primary-foreground">{t("studio.goalSave")}</button>
            {custom && <button type="button" onClick={() => { setGoal(journal.id, episode.id, null); setEditGoal(false); }} className="rounded-full border px-4 py-1.5">{t("studio.goalReset")}</button>}
            <button type="button" onClick={() => setEditGoal(false)} className="px-2 py-1.5 underline">{t("common.cancel")}</button>
          </form>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            {t(custom ? "studio.writeInGoal" : "studio.writeIn", { lang, min, max })}{" "}
            <button onClick={() => setEditGoal(true)} className="underline hover:text-foreground">{t("studio.goalEdit")}</button>
          </p>
        )}
      </div>
      {pending && current?.status === "complete" && (
        <p role="note" className="border-b bg-muted px-6 py-3 text-sm text-muted-foreground md:px-8">{t("studio.pendingNote")}</p>
      )}
      <label htmlFor={`editor-${episode.id}`} className="sr-only">{t("studio.editorLabel", { lang })}</label>
      <textarea id={`editor-${episode.id}`} lang={journal.languageCode} value={text} onChange={(e) => { typed.current = true; setText(e.target.value); }}
        spellCheck rows={16} placeholder={t("studio.placeholder")}
        className="block w-full min-h-[24rem] resize-y bg-transparent p-6 md:p-8 font-serif text-xl leading-[1.8] outline-none focus-visible:bg-muted/40 placeholder:text-muted-foreground/70" />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4 md:px-8">
        <div className="text-sm text-muted-foreground">
          <p aria-live="polite">
            {t("common.words", { n: words })} {words >= min && words <= max ? `· ${t("studio.within")}` : words > max ? `· ${t("studio.above")}` : words > 0 ? `· ${t("studio.toGo", { n: min - words })}` : ""}
          </p>
          <p className="text-xs" aria-live="polite">{autoState === "saving" ? t("studio.autosaving") : autoState === "saved" ? <><span key={current?.updatedAt} className="pen-scribble" aria-hidden="true">✒︎</span> {t("studio.autosaved")}</> : current ? `${current.status === "complete" ? t("entries.complete") : t("entries.draft")} · ${t("studio.lastSaved", { time: new Date(current.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })}` : ""}</p>
          <p className="text-xs">{t("studio.range", { min, max })}</p>
        </div>
        <p className="basis-full text-xs text-muted-foreground md:order-last">{t("studio.completeHint")}</p>
        {ready && !user && <p className="basis-full text-xs text-muted-foreground md:order-last"><Link to="/entrar" className="underline">{t("guest.nudge")}</Link></p>}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => save("draft")}><Save />{t("studio.saveDraft")}</Button>
          <Button onClick={() => save("complete")}><Save />{t("studio.saveFinal")}</Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4 md:px-8">
        <p className="text-sm text-muted-foreground">{s.completed[epKey(journal.id, episode.id)] ? t("status.completed") : t("studio.finishHint")}</p>
        <Button variant="outline" disabled={current?.status !== "complete" || !!pending || text !== current.content || !!s.completed[epKey(journal.id, episode.id)]} onClick={() => {
          if (window.confirm(t("studio.confirmFinish"))) { completeEpisode(journal.id, episode.id); toast.success(t("status.completed")); }
        }}><Check />{t("studio.complete")}</Button>
      </div>
    </div>
  );
}
