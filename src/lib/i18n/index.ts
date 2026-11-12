import { useSyncExternalStore } from "react";
import { pt, type MessageKey, type Dictionary } from "./pt";
import { en } from "./en";
import { fr } from "./fr";
import { de } from "./de";
import { es } from "./es";

/** Add a locale here (plus its dictionary) to support another interface language. */
export const LOCALES = [
  { code: "pt-BR", short: "pt", native: "Português (Brasil)", dict: pt as Dictionary },
  { code: "en", short: "en", native: "English", dict: en },
  { code: "fr", short: "fr", native: "Français", dict: fr },
  { code: "de", short: "de", native: "Deutsch", dict: de },
  { code: "es", short: "es", native: "Español", dict: es },
] as const;
export type Locale = (typeof LOCALES)[number]["code"];
export const DEFAULT_LOCALE: Locale = "pt-BR";
export type { MessageKey };

export interface Prefs { interface: Locale; explanation: Locale | null } // null = follow interface
const KEY = "language-journal:prefs";
const defaults: Prefs = { interface: DEFAULT_LOCALE, explanation: null };
let prefs = defaults;
let loaded = false;
const listeners = new Set<() => void>();
const isLocale = (x: unknown): x is Locale => LOCALES.some((l) => l.code === x);

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (raw) prefs = { interface: isLocale(raw.interface) ? raw.interface : DEFAULT_LOCALE, explanation: isLocale(raw.explanation) ? raw.explanation : null };
  } catch { /* ignore */ }
}
export function setPrefs(next: Partial<Prefs>) {
  load();
  prefs = { ...prefs, ...next };
  try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch { /* ignore */ }
  if (typeof document !== "undefined") document.documentElement.lang = prefs.interface;
  listeners.forEach((l) => l());
}
export function usePrefs(): Prefs {
  return useSyncExternalStore(
    (l) => { load(); listeners.add(l); l(); return () => listeners.delete(l); },
    () => { load(); return prefs; },
    () => defaults,
  );
}

/** Translate with pt-BR fallback and {var} interpolation. */
export function translate(locale: Locale, key: MessageKey, vars?: Record<string, string | number>) {
  const dict = LOCALES.find((l) => l.code === locale)?.dict ?? pt;
  const s: string = dict[key] ?? pt[key] ?? key;
  return vars ? s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`)) : s;
}

export function useI18n() {
  const p = usePrefs();
  const locale = p.interface;
  const t = (key: MessageKey, vars?: Record<string, string | number>) => translate(locale, key, vars);
  return {
    locale,
    explanation: p.explanation ?? locale,
    t,
    date: (d: string | Date, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) => new Date(d).toLocaleDateString(locale, opts),
    num: (n: number) => n.toLocaleString(locale),
    /** Language name (e.g. "fr") in the interface language. */
    langName: (code: string) => { try { return new Intl.DisplayNames([locale], { type: "language" }).of(code) ?? code; } catch { return code; } },
  };
}
