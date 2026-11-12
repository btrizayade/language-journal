import { createFileRoute, Link } from "@tanstack/react-router";
import { journals } from "@/lib/content";
import { useLocalizedJournals } from "@/lib/content-l10n";
import { useStore, completedEpisodes } from "@/lib/store";
import { ContinueLearning } from "@/components/ContinueLearning";
import { BookCard } from "@/components/BookCard";
import { useI18n } from "@/lib/i18n";
import { WashiTape, StampBadge } from "@/components/ui/scrapbook";
import libraryHero from "@/assets/library-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Minha biblioteca — Language Journal" },
      { name: "description", content: "Escolha um diário, acompanhe uma história em francês ou alemão e escreva a sua parte." },
      { property: "og:title", content: "Minha biblioteca — Language Journal" },
      { property: "og:description", content: "Histórias seriadas para aprender idiomas lendo, ouvindo e escrevendo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Library,
});

function Library() {
  const s = useStore();
  const loc = Object.fromEntries(useLocalizedJournals().map((x) => [x.journal.id, x.journal]));
  const { t } = useI18n();
  const started = journals.filter((j) => s.lastVisit[j.id]).sort((a, b) => (s.lastVisit[b.id] ?? "").localeCompare(s.lastVisit[a.id] ?? ""));
  const discover = journals.filter((j) => !s.lastVisit[j.id]);

  return (
    <div className="mx-auto max-w-6xl px-6">
      <section className="relative py-12 md:py-20">
        <img src={libraryHero} alt="" aria-hidden="true" width={1920} height={960} fetchPriority="high"
          className="pointer-events-none absolute inset-y-0 right-[-18%] hidden h-full w-auto max-w-none object-contain opacity-95 md:block [mask-image:linear-gradient(to_right,transparent,black_30%)]" />
        <img src={libraryHero} alt="" aria-hidden="true" width={1920} height={960}
          className="mb-8 w-full rounded-lg md:hidden" />
        <div className="relative max-w-lg animate-fade-up">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("library.kicker")}</p>
          <h1 className="mt-4 text-5xl md:text-6xl leading-[1.05]">{t("library.title1")} <em className="text-sage-deep">{t("library.title2")}</em></h1>
          <p className="mt-6 font-serif text-xl leading-relaxed text-muted-foreground">{t("library.intro")}</p>
        </div>
      </section>

      <ContinueLearning />

      {started.length > 0 && (
        <section aria-labelledby="continuar" className="mb-20">
          <h2 id="continuar" className="text-3xl mb-6">{t("library.continue")}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {started.map((j) => {
              const done = completedEpisodes(s, j.id);
              const next = j.episodes.find((e) => !done.has(e.id)) ?? j.episodes[j.episodes.length - 1]!;
              return (
                <Link key={j.id} to="/episodio/$journalId/$episodeId" params={{ journalId: j.id, episodeId: next.id }}
                  className="paper-card lift relative flex gap-5 p-5 focus-visible:outline-2 focus-visible:outline-ring">
                  <WashiTape tint={j.languageCode === "fr" ? "pink" : "powder"} className="absolute -top-3 left-8" />
                  <img src={j.cover} alt="" width={768} height={1024} className="w-20 aspect-[3/4] rounded-sm object-cover shadow-[var(--shadow-book)] -rotate-2" />
                  <div>
                    <StampBadge tint="butter">{j.title}</StampBadge>
                    <p lang={j.languageCode} className="mt-2 font-display text-xl">{t("common.epShort", { n: next.number })} · {next.title}</p>
                    <p className="mt-1 font-serif text-muted-foreground line-clamp-2">{next.intro}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section aria-labelledby="diarios" className="mb-20">
        <h2 id="diarios" className="text-3xl mb-8">{started.length ? t("library.mine") : t("library.shelf")}</h2>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {(started.length ? started : journals).map((j) => <BookCard key={j.id} journal={loc[j.id] ?? j} done={completedEpisodes(s, j.id).size} />)}
        </div>
      </section>

      {started.length > 0 && discover.length > 0 && (
        <section aria-labelledby="descobrir" className="mb-10">
          <h2 id="descobrir" className="text-3xl mb-8">{t("library.discover")}</h2>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {discover.map((j) => <BookCard key={j.id} journal={loc[j.id] ?? j} done={0} />)}
          </div>
        </section>
      )}
    </div>
  );
}
