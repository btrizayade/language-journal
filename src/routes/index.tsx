import { createFileRoute, Link } from "@tanstack/react-router";
import { journals } from "@/lib/content";
import { useStore, completedEpisodes } from "@/lib/store";
import { BookCard } from "@/components/BookCard";
import { useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();
  const started = journals.filter((j) => s.lastVisit[j.id]).sort((a, b) => (s.lastVisit[b.id] ?? "").localeCompare(s.lastVisit[a.id] ?? ""));
  const discover = journals.filter((j) => !s.lastVisit[j.id]);

  return (
    <div className="mx-auto max-w-6xl px-6">
      <section className="py-16 md:py-24 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("library.kicker")}</p>
        <h1 className="mt-4 text-5xl md:text-6xl leading-[1.05]">{t("library.title1")} <em className="text-sage-deep">{t("library.title2")}</em></h1>
        <p className="mt-6 font-serif text-xl leading-relaxed text-muted-foreground">{t("library.intro")}</p>
      </section>

      {started.length > 0 && (
        <section aria-labelledby="continuar" className="mb-20">
          <h2 id="continuar" className="text-3xl mb-6">{t("library.continue")}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {started.map((j) => {
              const done = completedEpisodes(s, j.id);
              const next = j.episodes.find((e) => !done.has(e.id)) ?? j.episodes[j.episodes.length - 1]!;
              return (
                <Link key={j.id} to="/episodio/$journalId/$episodeId" params={{ journalId: j.id, episodeId: next.id }}
                  className="flex gap-5 rounded-lg border bg-card p-4 hover:border-lavender focus-visible:outline-2 focus-visible:outline-ring">
                  <img src={j.cover} alt="" width={768} height={1024} className="w-20 aspect-[3/4] rounded-sm object-cover" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{j.title}</p>
                    <p className="mt-1 font-display text-xl">{t("common.epShort", { n: next.number })} · {next.title}</p>
                    <p className="mt-1 font-serif text-muted-foreground">{next.intro}</p>
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
          {(started.length ? started : journals).map((j) => <BookCard key={j.id} journal={j} done={completedEpisodes(s, j.id).size} />)}
        </div>
      </section>

      {started.length > 0 && discover.length > 0 && (
        <section aria-labelledby="descobrir" className="mb-10">
          <h2 id="descobrir" className="text-3xl mb-8">{t("library.discover")}</h2>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {discover.map((j) => <BookCard key={j.id} journal={j} done={0} />)}
          </div>
        </section>
      )}
    </div>
  );
}
