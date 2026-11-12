import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { journals } from "@/lib/content";
import { LOCALES, setPrefs, translate, usePrefs, useI18n, type Locale } from "@/lib/i18n";

export const Route = createFileRoute("/preferencias")({
  head: () => ({
    meta: [
      { title: "Preferências — Language Journal" },
      { name: "description", content: "Escolha o idioma da interface e o idioma das explicações do Language Journal." },
      { property: "og:title", content: "Preferências — Language Journal" },
      { property: "og:description", content: "Idioma da interface e das explicações, separados do idioma das histórias." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

const sel = "w-full max-w-sm rounded-md border bg-card px-3 py-2 focus-visible:outline-2 focus-visible:outline-ring";

function SettingsPage() {
  const p = usePrefs();
  const { t, langName } = useI18n();
  const update = (next: Parameters<typeof setPrefs>[0]) => {
    setPrefs(next);
    toast.success(translate(next.interface ?? p.interface, "settings.saved"));
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-5xl">{t("settings.title")}</h1>
      <p className="mt-4 font-serif text-xl text-muted-foreground">{t("settings.intro")}</p>

      <div className="mt-10 divide-y rounded-xl border bg-card">
        <div className="p-6">
          <label htmlFor="p-ui" className="font-display text-xl">{t("settings.interface")}</label>
          <p className="mt-1 text-sm text-muted-foreground">{t("settings.interfaceHint")}</p>
          <select id="p-ui" className={`mt-3 ${sel}`} value={p.interface} onChange={(e) => update({ interface: e.target.value as Locale })}>
            {LOCALES.map((l) => <option key={l.code} value={l.code} lang={l.code}>{l.native}</option>)}
          </select>
        </div>
        <div className="p-6">
          <label htmlFor="p-ex" className="font-display text-xl">{t("settings.explanation")}</label>
          <p className="mt-1 text-sm text-muted-foreground">{t("settings.explanationHint")}</p>
          <select id="p-ex" className={`mt-3 ${sel}`} value={p.explanation ?? ""} onChange={(e) => update({ explanation: (e.target.value || null) as Locale | null })}>
            <option value="">{t("settings.followInterface")}</option>
            {LOCALES.map((l) => <option key={l.code} value={l.code} lang={l.code}>{l.native}</option>)}
          </select>
        </div>
        <div className="p-6">
          <p className="font-display text-xl">{t("settings.stories")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("settings.storiesHint")}</p>
          <ul className="mt-3 space-y-1">
            {journals.map((j) => <li key={j.id}><span lang={j.languageCode} className="italic">{j.title}</span> · {langName(j.languageCode)}</li>)}
          </ul>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{t("settings.storage")}</p>
    </div>
  );
}
