import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Languages } from "lucide-react";
import { LOCALES, setPrefs, useI18n, type Locale } from "@/lib/i18n";
import { useSync } from "@/lib/sync";

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
  const { user } = useSync();
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    let lastScrolled: boolean | undefined;
    const update = () => {
      const scrolled = window.scrollY > 32;
      if (scrolled === lastScrolled) return;
      lastScrolled = scrolled;
      headerRef.current?.setAttribute("data-scrolled", String(scrolled));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <header ref={headerRef} className="site-chrome storybook-topbar sticky top-0 z-40">
      <div className="topbar-inner mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3">
        <Link to="/" className="topbar-brand flex shrink-0 items-center gap-2 font-display text-2xl italic">
          <img src="/favicon.png" width={34} height={34} alt="" aria-hidden />Language Journal
        </Link>
        <div className="topbar-controls flex flex-wrap items-center gap-2">
          <nav aria-label={t("nav.label")} className="topbar-nav flex flex-wrap gap-1 text-sm">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
                className="nav-link px-2 py-2 text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                activeProps={{ "aria-current": "page" }}>{t(n.key)}</Link>
            ))}
          </nav>
          {user
            ? <Link to="/preferencias" className="rounded-full border px-3 py-1 text-sm focus-visible:outline-2 focus-visible:outline-ring">{t("nav.myAccount")}</Link>
            : <Link to="/entrar" className="rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring">{t("nav.account")}</Link>}
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
