import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ACTIVITY_LABEL, countWords, type Episode, type Journal } from "@/lib/content";
import { persistEntry, type Entry } from "@/lib/store";

export function WritingStudio({ journal, episode, entry }: { journal: Journal; episode: Episode; entry?: Entry | undefined }) {
  const [text, setText] = useState(entry?.content ?? "");
  const [id, setId] = useState(entry?.id);
  useEffect(() => { setText(entry?.content ?? ""); setId(entry?.id); }, [entry?.id]);
  const p = episode.prompt;
  const words = countWords(text);
  const [min, max] = p.words;

  function save(status: Entry["status"]) {
    if (!text.trim()) { toast.error("Escreva algo antes de salvar."); return; }
    const e = persistEntry(journal.id, episode.id, text, status, id);
    setId(e.id);
    toast.success(status === "complete" ? "Entrada guardada no seu diário." : "Rascunho salvo.");
  }

  return (
    <div className="rounded-xl border bg-card">
      <div className="border-b p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Ateliê de escrita · {ACTIVITY_LABEL[p.type]}</p>
        <h3 className="mt-2 text-3xl">{p.title}</h3>
        <blockquote lang={journal.languageCode} className="mt-4 border-l-2 border-lavender pl-4 font-serif text-xl italic">{p.prompt}</blockquote>
        <p className="mt-4 text-muted-foreground">{p.instructions}</p>
        <p className="mt-2 text-sm text-muted-foreground">Escreva em {journal.language.toLowerCase()} · sugestão: {min}–{max} palavras</p>
      </div>
      <label htmlFor={`editor-${episode.id}`} className="sr-only">Seu texto em {journal.language}</label>
      <textarea id={`editor-${episode.id}`} lang={journal.languageCode} value={text} onChange={(e) => setText(e.target.value)}
        spellCheck rows={12} placeholder="Comece a escrever aqui…"
        className="block w-full resize-y bg-transparent p-6 md:p-8 font-serif text-xl leading-[1.8] outline-none focus-visible:bg-muted/40 placeholder:text-muted-foreground/70" />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4 md:px-8">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {words} palavras {words >= min && words <= max ? "· dentro da sugestão" : words > max ? "· acima da sugestão" : ""}
        </p>
        <div className="flex gap-2">
          <button onClick={() => save("draft")} className="rounded-full border px-5 py-2 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring">Salvar rascunho</button>
          <button onClick={() => save("complete")} className="rounded-full bg-primary px-5 py-2 text-primary-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">Guardar no diário</button>
        </div>
      </div>
    </div>
  );
}
