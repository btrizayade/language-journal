import { useSyncExternalStore } from "react";

export interface ReadingPrefs {
  fontSize: number; // rem, story text
  lineHeight: number;
  width: "narrow" | "medium" | "wide";
  focus: boolean; // distraction-free: hides header and footer
  contrast: boolean;
  theme: "light" | "dark";
  speed: number; // audio/video playback rate
  transcript: boolean;
}
export const READING_DEFAULTS: ReadingPrefs = { fontSize: 1.3, lineHeight: 1.85, width: "medium", focus: false, contrast: false, theme: "light", speed: 1, transcript: true };
export const WIDTHS = { narrow: "34rem", medium: "42rem", wide: "52rem" } as const;
const KEY = "language-journal:reading";
let prefs = READING_DEFAULTS;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { const r = JSON.parse(localStorage.getItem(KEY) ?? "null"); if (r) prefs = { ...READING_DEFAULTS, ...r }; } catch { /* ignore */ }
}
export function setReading(next: Partial<ReadingPrefs>) {
  load();
  prefs = { ...prefs, ...next };
  try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch { /* ignore */ }
  applyReading();
  listeners.forEach((l) => l());
}
export function useReading(): ReadingPrefs {
  return useSyncExternalStore(
    (l) => { load(); listeners.add(l); l(); return () => listeners.delete(l); },
    () => { load(); return prefs; },
    () => READING_DEFAULTS,
  );
}
/** Pushes the preferences onto <html> as classes and CSS variables. Call from effects only. */
export function applyReading() {
  if (typeof document === "undefined") return;
  load();
  const h = document.documentElement;
  h.classList.toggle("dark", prefs.theme === "dark");
  h.classList.toggle("contrast", prefs.contrast);
  h.classList.toggle("focus-mode", prefs.focus);
  h.style.setProperty("--read-size", `${prefs.fontSize}rem`);
  h.style.setProperty("--read-leading", String(prefs.lineHeight));
  h.style.setProperty("--read-width", WIDTHS[prefs.width]);
}
