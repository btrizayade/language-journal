import { Link } from "@tanstack/react-router";
import type { Journal } from "@/lib/content";

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="h-1 w-full rounded-full bg-border" role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className="h-1 rounded-full bg-lavender" style={{ width: `${value * 100}%` }} />
      </div>
    </div>
  );
}

export function BookCard({ journal, done }: { journal: Journal; done: number }) {
  const main = journal.characters.find((c) => c.main);
  const total = journal.episodes.length;
  return (
    <Link to="/diario/$journalId" params={{ journalId: journal.id }} className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring rounded-md">
      <div className="overflow-hidden rounded-r-md rounded-l-sm border shadow-[var(--shadow-book)] transition-transform duration-300 group-hover:-translate-y-1">
        <img src={journal.cover} alt="" width={768} height={1024} loading="lazy" className="aspect-[3/4] w-full object-cover" />
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{journal.language} · {journal.level}</p>
        <h3 className="text-2xl leading-tight">{journal.title}</h3>
        <p className="text-sm text-muted-foreground">com {main?.name}</p>
        <p className="font-serif text-[15px] leading-relaxed">{journal.tagline}</p>
        <ProgressBar value={done / total} label={`Progresso em ${journal.title}`} />
        <p className="text-xs text-muted-foreground">{done} de {total} episódios</p>
      </div>
    </Link>
  );
}
