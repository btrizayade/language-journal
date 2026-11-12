import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { journals } from "@/lib/content";
import { setReading, useReading, READING_DEFAULTS } from "@/lib/reading";
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
  const r = useReading();
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
      <h2 className="mt-14 text-3xl">{t("reading.title")}</h2>
      <p className="mt-2 text-muted-foreground">{t("reading.intro")}</p>
      <div className="mt-6 divide-y rounded-xl border bg-card">
        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <label className="block"><span className="font-display text-lg">{t("reading.fontSize")}</span>
            <input type="range" min={1} max={1.8} step={0.05} value={r.fontSize} onChange={(e) => setReading({ fontSize: Number(e.target.value) })} className="mt-3 w-full accent-[var(--lavender)]" />
          </label>
          <label className="block"><span className="font-display text-lg">{t("reading.lineHeight")}</span>
            <input type="range" min={1.4} max={2.3} step={0.05} value={r.lineHeight} onChange={(e) => setReading({ lineHeight: Number(e.target.value) })} className="mt-3 w-full accent-[var(--lavender)]" />
          </label>
        </div>
        <div className="flex flex-wrap gap-6 p-6">
          <label className="flex flex-col gap-2"><span className="font-display text-lg">{t("reading.width")}</span>
            <select className={sel} value={r.width} onChange={(e) => setReading({ width: e.target.value as typeof r.width })}>
              <option value="narrow">{t("reading.narrow")}</option><option value="medium">{t("reading.medium")}</option><option value="wide">{t("reading.wide")}</option>
            </select>
          </label>
          <label className="flex flex-col gap-2"><span className="font-display text-lg">{t("reading.theme")}</span>
            <select className={sel} value={r.theme} onChange={(e) => setReading({ theme: e.target.value as typeof r.theme })}>
              <option value="light">{t("reading.light")}</option><option value="dark">{t("reading.dark")}</option>
            </select>
          </label>
        </div>
        <div className="space-y-3 p-6">
          <label className="flex items-center gap-3"><input type="checkbox" checked={r.contrast} onChange={(e) => setReading({ contrast: e.target.checked })} className="size-4" /> {t("reading.contrast")}</label>
          <label className="flex items-center gap-3"><input type="checkbox" checked={r.focus} onChange={(e) => setReading({ focus: e.target.checked })} className="size-4" /> {t("reading.focusLong")}</label>
          <label className="flex items-center gap-3"><input type="checkbox" checked={r.transcript} onChange={(e) => setReading({ transcript: e.target.checked })} className="size-4" /> {t("reading.transcriptDefault")}</label>
        </div>
        <div className="p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t("reading.preview")}</p>
          <p lang="fr" className="reading-text reading-width mt-3 font-serif">Camille pousse la porte de la librairie. Il pleut doucement sur Montmartre, et l'odeur du papier ancien remplit la pièce.</p>
          <button onClick={() => setReading(READING_DEFAULTS)} className="mt-4 text-sm underline">{t("reading.reset")}</button>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{t("settings.storage")}</p>
    </div>
  );
}
