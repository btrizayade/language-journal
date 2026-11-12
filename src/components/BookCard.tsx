import { Link } from "@tanstack/react-router";
import type { Journal } from "@/lib/content";
import { useI18n } from "@/lib/i18n";
import { useTilt } from "@/components/interactions";
import { magicalAssets } from "@/components/decorations/assets";
import { RibbonBookmark, StampBadge } from "@/components/ui/scrapbook";

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="h-2 w-full rounded-full border border-cocoa/30 bg-paper" role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className="h-full rounded-full bg-sage" style={{ width: `${value * 100}%` }} />
      </div>
    </div>
  );
}

export function BookCard({ journal, done }: { journal: Journal; done: number }) {
  const { t, langName } = useI18n();
  const main = journal.characters.find((c) => c.main);
  const total = journal.episodes.length;
  const tilt = useTilt<HTMLAnchorElement>();
  return (
    <Link ref={tilt} to="/diario/$journalId" params={{ journalId: journal.id }} className="tilt-card group block paper-card lift p-4 pb-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
      <div className="relative">
      {done > 0 && <RibbonBookmark tint="butter" className="tilt-ribbon absolute -top-1 right-5 z-10" />}
      <img src={magicalAssets.sparkleSmall} alt="" aria-hidden="true" width={18} height={18} className="tilt-sparkle pointer-events-none absolute -left-2 top-6 z-10 w-[18px]" />
      <img src={magicalAssets.starEight} alt="" aria-hidden="true" width={14} height={14} className="tilt-sparkle pointer-events-none absolute -right-1 bottom-10 z-10 w-[14px]" />
      <div className="tilt-book overflow-hidden rounded-r-md rounded-l-sm border border-cocoa/30 shadow-[var(--shadow-book)]">
        <img src={journal.cover} alt="" width={768} height={1024} loading="lazy" className="aspect-[3/4] w-full object-cover" />
        <span className="tilt-light" aria-hidden="true" />
      </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex flex-wrap gap-2"><StampBadge tint="lavender">{langName(journal.languageCode)}</StampBadge><StampBadge tint="sage">{journal.level}</StampBadge></div>
        <h3 className="text-2xl leading-tight">{journal.title}</h3>
        <p className="text-sm text-muted-foreground">{t("common.with", { name: main?.name ?? "" })}</p>
        <p className="font-serif text-[15px] leading-relaxed">{journal.tagline}</p>
        <ProgressBar value={done / total} label={t("common.progressIn", { title: journal.title })} />
        <p className="text-xs text-muted-foreground">{t("common.episodes", { done, total })}</p>
      </div>
    </Link>
  );
}
