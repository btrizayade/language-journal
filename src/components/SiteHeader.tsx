import { Link } from "@tanstack/react-router";
import { Languages } from "lucide-react";
import { LOCALES, setPrefs, useI18n, type Locale } from "@/lib/i18n";

const nav = [
  { to: "/", key: "nav.library" },
  { to: "/vocabulario", key: "nav.vocab" },
  { to: "/notas", key: "nav.notes" },
  { to: "/entradas", key: "nav.entries" },
  { to: "/progresso", key: "nav.progress" },
  { to: "/preferencias", key: "nav.settings" },
] as const;

export function SiteHeader() {
  const { t, locale } = useI18n();
  return (
    <header className="site-chrome border-b bg-background/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Link to="/" className="font-display text-2xl italic">Language Journal</Link>
        <div className="flex flex-wrap items-center gap-2">
          <nav aria-label={t("nav.label")} className="flex flex-wrap gap-1 text-sm">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
                className="rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                activeProps={{ className: "bg-secondary text-foreground" }}>{t(n.key)}</Link>
            ))}
          </nav>
          <label className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm text-muted-foreground focus-within:outline-2 focus-within:outline-ring">
            <Languages className="size-4" aria-hidden />
            <span className="sr-only">{t("nav.interfaceLanguage")}</span>
            <select value={locale} onChange={(e) => setPrefs({ interface: e.target.value as Locale })}
              className="bg-transparent text-foreground outline-none">
              {LOCALES.map((l) => <option key={l.code} value={l.code} lang={l.code}>{l.native}</option>)}
            </select>
          </label>
        </div>
      </div>
    </header>
  );
}
