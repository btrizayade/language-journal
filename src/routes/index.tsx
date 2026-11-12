import { createFileRoute, Link } from "@tanstack/react-router";
import { journals } from "@/lib/content";
import { useLocalizedJournals } from "@/lib/content-l10n";
import { useStore, completedEpisodes } from "@/lib/store";
import { ContinueLearning } from "@/components/ContinueLearning";
import { BookCard } from "@/components/BookCard";
import { useI18n } from "@/lib/i18n";
import { WashiTape, StampBadge } from "@/components/ui/scrapbook";
import libraryHero from "@/assets/library-panorama.jpg";
import { Decoration, SparkleField } from "@/components/decorations/Decoration";
import { IllustratedBoundary } from "@/components/decorations/IllustratedBoundary";

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
    <div>
      <section className="library-scene relative isolate overflow-clip">
        <img src={libraryHero} alt="" aria-hidden="true" width={1920} height={960} fetchPriority="high"
          className="library-scene-art pointer-events-none absolute inset-0 h-full w-full" />
        <SparkleField className="hidden md:block" sparkles={[
          { top: "12%", left: "58%", size: 22, delay: 0 }, { top: "30%", left: "92%", size: 16, delay: 1.1 },
          { top: "70%", left: "64%", size: 18, delay: 2 }, { top: "84%", left: "88%", size: 14, delay: 0.6 },
          { top: "8%", left: "40%", size: 12, delay: 1.7 },
        ]} />
        <Decoration asset="bookSage" size={76} pos={{ top: "10%", right: "6%" }} rotate={-8} className="hidden lg:block" />
        <Decoration asset="potionLavender" size={64} pos={{ bottom: "12%", left: "36%" }} motion="potion" delay={3} rotate={6} className="hidden lg:block" />
        <Decoration asset="moonCrescent" size={44} pos={{ top: "5%", left: "47%" }} duration={12} delay={5} className="hidden md:block" />
        <Decoration asset="bookRose" size={54} pos={{ top: "15%", left: "36%" }} rotate={15} delay={2} className="hidden lg:block" />
        <Decoration asset="starRose" size={24} pos={{ top: "8%", left: "24%" }} motion="twinkle" delay={3} className="hidden md:block" />
        <Decoration asset="starTeal" size={30} pos={{ bottom: "8%", left: "18%" }} motion="twinkle" delay={1} className="hidden md:block" />
        <Decoration asset="potionGreen" size={54} pos={{ top: "52%", right: "3%" }} motion="potion" duration={13} delay={6} className="hidden lg:block" />
        <Decoration asset="dustCluster" size={56} pos={{ top: "45%", right: "18%" }} motion="twinkle" duration={7} delay={2} className="hidden md:block" />
        <Decoration asset="starEight" size={22} pos={{ bottom: "14%", right: "34%" }} motion="none" className="hidden md:block" />
        <div className="library-scene-copy relative">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("library.kicker")}</p>
          <h1 className="mt-3 leading-[1.1]">Language Journal</h1>
          <p className="mt-4 font-display text-xl leading-snug">{t("library.title1")} <em className="text-sage-deep">{t("library.title2")}</em></p>
          <p className="mt-5 font-serif text-lg leading-relaxed text-muted-foreground">{t("library.intro")}</p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-6">
      <IllustratedBoundary variant="transition" />
      <ContinueLearning />

      {started.length > 0 && (
        <section aria-labelledby="continuar" className="mb-20">
          <h2 id="continuar" className="text-3xl mb-6">{t("library.continue")}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {started.map((j) => {
              const done = completedEpisodes(s, j.id);
              const next = j.episodes.find((e) => !done.has(e.id)) ?? j.episodes[j.episodes.length - 1];
              if (!next) return null;
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

      <section aria-labelledby="diarios" className="relative mb-20">
        <Decoration asset="starBotanical" size={32} pos={{ top: "-6px", right: "8%" }} motion="none" />
        <Decoration asset="potionPink" size={80} pos={{ bottom: "16%", right: "7%" }} motion="potion" duration={12} className="hidden lg:block" />
        <Decoration asset="mirrorOval" size={98} pos={{ top: "26%", right: "13%" }} motion="mirror" duration={15} className="hidden lg:block" />
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
    </div>
  );
}
