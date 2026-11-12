import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { Bookmark, BookmarkCheck, BookOpen, Headphones, Clapperboard } from "lucide-react";
import { getJournal, getEpisode, FORMAT_LABEL, type Episode, type Journal } from "@/lib/content";
import { useStore, markOpened, toggleVocab } from "@/lib/store";
import { WritingStudio } from "@/components/WritingStudio";

export const Route = createFileRoute("/episodio/$journalId/$episodeId")({
  loader: ({ params }) => {
    const j = getJournal(params.journalId);
    const e = j && getEpisode(j, params.episodeId);
    if (!j || !e) throw notFound();
    return { title: `${e.title} — ${j.title}`, intro: e.intro };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.title} · Language Journal` },
      { name: "description", content: loaderData.intro },
      { property: "og:title", content: loaderData.title },
      { property: "og:description", content: loaderData.intro },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ] : [{ title: "Episódio indisponível" }, { name: "robots", content: "noindex" }],
  }),
  component: EpisodePage,
});

const FormatIcon = { reading: BookOpen, listening: Headphones, watching: Clapperboard };

function EpisodePage() {
  const { journalId, episodeId } = Route.useParams();
  const j = getJournal(journalId)!;
  const e = getEpisode(j, episodeId)!;
  const s = useStore();
  useEffect(() => { markOpened(j.id, e.id); }, [j.id, e.id]);
  const idx = j.episodes.indexOf(e);
  const prev = j.episodes[idx - 1], next = j.episodes[idx + 1];
  const entry = s.entries.find((x) => x.journalId === j.id && x.episodeId === e.id);
  const Icon = FormatIcon[e.format];

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Link to="/diario/$journalId" params={{ journalId: j.id }} className="text-sm text-muted-foreground hover:text-foreground">← {j.title}</Link>

      <header className="mt-8 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Episódio {e.number} de {j.episodes.length}</p>
        <h1 lang={j.languageCode} className="mt-3 text-5xl md:text-6xl">{e.title}</h1>
        <p className="mt-5 font-serif text-xl text-muted-foreground">{e.intro}</p>
        <div className="mt-6 flex justify-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1"><Icon className="size-4" aria-hidden /> {FORMAT_LABEL[e.format]}</span>
          <span className="rounded-full border px-3 py-1">{e.minutes} min</span>
          <span className="rounded-full border px-3 py-1">{j.language} {j.level}</span>
        </div>
        <p className="mx-auto mt-8 max-w-xl border-y py-4 font-serif italic">{e.context}</p>
      </header>

      <section aria-label="Conteúdo do episódio" className="mt-12"><Media journal={j} episode={e} /></section>

      <Section title="Descobrir a língua" kicker="Vocabulário · expressões · gramática">
        <ul className="grid gap-3 sm:grid-cols-2">
          {e.vocabulary.map((v) => {
            const saved = s.vocab.some((x) => x.key === `${j.id}:${v.term}`);
            return (
              <li key={v.term} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p lang={j.languageCode} className="font-display text-xl">{v.term}</p>
                    <p className="text-muted-foreground">{v.translation}</p>
                  </div>
                  <button onClick={() => toggleVocab({ journalId: j.id, episodeId: e.id, ...v })} aria-pressed={saved}
                    aria-label={saved ? `Remover ${v.term} do vocabulário salvo` : `Salvar ${v.term}`}
                    className="rounded-full p-2 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring">
                    {saved ? <BookmarkCheck className="size-5 text-sage-deep" /> : <Bookmark className="size-5" />}
                  </button>
                </div>
                <p lang={j.languageCode} className="mt-2 font-serif italic">« {v.example} »</p>
              </li>
            );
          })}
        </ul>
        <h3 className="mt-10 text-2xl">Expressões úteis</h3>
        <dl className="mt-4 divide-y border-y">
          {e.expressions.map((x) => (
            <div key={x.term} className="grid gap-1 py-3 sm:grid-cols-2">
              <dt lang={j.languageCode} className="font-serif text-lg italic">{x.term}</dt><dd className="text-muted-foreground">{x.meaning}</dd>
            </div>
          ))}
        </dl>
        <h3 className="mt-10 text-2xl">Gramática em contexto</h3>
        <div className="mt-4 space-y-6">
          {e.grammar.map((g) => (
            <div key={g.title}>
              <p className="font-semibold">{g.title}</p>
              <p className="mt-1 font-serif text-lg leading-relaxed">{g.explanation}</p>
              <ul className="mt-2 space-y-1">{g.examples.map((x) => <li key={x} lang={j.languageCode} className="font-serif italic text-sage-deep">— {x}</li>)}</ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Notas culturais" kicker="O mundo ao redor da história">
        <div className="space-y-4">
          {e.culture.map((c) => (
            <aside key={c.title} className="rounded-lg bg-pink/40 p-6">
              <p className="font-display text-xl">{c.title}</p>
              <p className="mt-2 font-serif text-lg leading-relaxed">{c.text}</p>
            </aside>
          ))}
        </div>
      </Section>

      <Section title="Escrever" kicker="Sua parte da história">
        <WritingStudio journal={j} episode={e} entry={entry} />
        {entry && <p className="mt-3 text-sm text-muted-foreground">Você já tem uma entrada para este episódio ({entry.status === "complete" ? "concluída" : "rascunho"}). Ao editar, a versão anterior fica guardada em <Link to="/entradas" className="underline">Minhas entradas</Link>.</p>}
      </Section>

      <nav aria-label="Episódios" className="mt-16 flex justify-between gap-4 border-t pt-8">
        {prev ? <Link to="/episodio/$journalId/$episodeId" params={{ journalId: j.id, episodeId: prev.id }} className="hover:underline">← Ép. {prev.number} · {prev.title}</Link> : <span />}
        {next ? <Link to="/episodio/$journalId/$episodeId" params={{ journalId: j.id, episodeId: next.id }} className="text-right font-semibold hover:underline">Ép. {next.number} · {next.title} →</Link>
          : <Link to="/diario/$journalId" params={{ journalId: j.id }} className="hover:underline">Fim desta temporada · voltar ao diário</Link>}
      </nav>
    </article>
  );
}

function Section({ title, kicker, children }: { title: string; kicker: string; children: React.ReactNode }) {
  return (
    <section className="mt-20">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{kicker}</p>
      <h2 className="mt-2 mb-6 text-4xl">{title}</h2>
      {children}
    </section>
  );
}

function Transcript({ journal, episode }: { journal: Journal; episode: Episode }) {
  return (
    <div className="mt-6 rounded-lg border bg-card p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">Transcrição</p>
      <dl lang={journal.languageCode} className="space-y-4">
        {episode.transcript?.map((t, i) => (
          <div key={i} className="grid gap-1 sm:grid-cols-[8rem_1fr]">
            <dt className="text-sm font-semibold text-muted-foreground">{t.speaker}</dt>
            <dd className="font-serif text-xl leading-relaxed">{t.line}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Media({ journal, episode }: { journal: Journal; episode: Episode }) {
  if (episode.format === "reading") {
    return (
      <div className="rounded-sm border bg-card px-6 py-10 md:px-14 md:py-14 shadow-[var(--shadow-book)]">
        {episode.documentLabel && <p className="mb-8 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">{episode.documentLabel}</p>}
        <div lang={journal.languageCode} className="space-y-6 font-serif text-[1.3rem] leading-[1.85] first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:leading-none">
          {episode.body?.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
    );
  }
  const isAudio = episode.format === "listening";
  return (
    <div>
      {episode.mediaUrl ? (
        isAudio ? <audio controls src={episode.mediaUrl} className="w-full" /> : <video controls src={episode.mediaUrl} className="w-full rounded-lg" />
      ) : (
        <div role="note" className={`grid place-items-center rounded-lg border border-dashed text-center p-8 ${isAudio ? "bg-secondary min-h-40" : "bg-sage/30 aspect-video"}`}>
          <div>
            {isAudio ? <Headphones className="mx-auto size-8" aria-hidden /> : <Clapperboard className="mx-auto size-8" aria-hidden />}
            <p className="mt-3 font-semibold">{isAudio ? "Áudio de demonstração" : "Vídeo de demonstração"} — mídia ainda não disponível</p>
            <p className="mt-1 text-sm text-muted-foreground">Acompanhe a cena pela transcrição abaixo, lendo em voz alta se quiser.</p>
          </div>
        </div>
      )}
      <Transcript journal={journal} episode={episode} />
    </div>
  );
}
