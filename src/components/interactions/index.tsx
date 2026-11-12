import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";
import { cn } from "@/lib/utils";
import { magicalAssets } from "@/components/decorations/assets";

/** True only on devices with a precise hover pointer and no reduced-motion request. */
export function richPointer() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    && !document.documentElement.classList.contains("reduce-motion") && !document.documentElement.classList.contains("focus-mode");
}

const NO_TRAIL = "a,button,input,textarea,select,nav,form,label,[data-no-trail]";
const TRAIL_ASSETS = [magicalAssets.sparkleSmall, magicalAssets.starEight, magicalAssets.starRose];

/**
 * Interactive scene: writes --mx/--my (-1..1) and --lx/--ly (px) as CSS vars via rAF,
 * so depth layers (Decoration depth) and the paper light move without React re-renders.
 * Optionally drops a sparse, capped sparkle trail.
 */
export function useInteractiveScene<T extends HTMLElement>(opts: { trail?: boolean } = {}) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !richPointer()) return;
    el.classList.add("scene-live");
    let raf = 0, last = 0, live = 0, px = 0, py = 0, rect = el.getBoundingClientRect();
    const apply = () => {
      raf = 0;
      el.style.setProperty("--mx", ((px / rect.width) * 2 - 1).toFixed(3));
      el.style.setProperty("--my", ((py / rect.height) * 2 - 1).toFixed(3));
      el.style.setProperty("--lx", `${px}px`); el.style.setProperty("--ly", `${py}px`);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      rect = el.getBoundingClientRect(); px = e.clientX - rect.left; py = e.clientY - rect.top;
      if (!raf) raf = requestAnimationFrame(apply);
      const now = performance.now();
      if (opts.trail && now - last > 140 && live < 7 && !(e.target as Element)?.closest?.(NO_TRAIL)) {
        last = now; live++;
        const s = document.createElement("img");
        s.src = TRAIL_ASSETS[Math.floor(Math.random() * TRAIL_ASSETS.length)] ?? "";
        s.alt = ""; s.setAttribute("aria-hidden", "true"); s.className = "trail-sparkle";
        const size = 8 + Math.random() * 10;
        s.style.cssText = `left:${px + (Math.random() * 16 - 8)}px;top:${py + (Math.random() * 16 - 8)}px;width:${size}px`;
        el.appendChild(s);
        setTimeout(() => { s.remove(); live--; }, 900);
      }
    };
    const leave = () => { el.style.setProperty("--mx", "0"); el.style.setProperty("--my", "0"); };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => { cancelAnimationFrame(raf); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); el.classList.remove("scene-live"); };
  }, [opts.trail]);
  return ref;
}

/** Book tilt: max ~2.5deg, writes --rx/--ry/--lx/--ly on the element. */
export function useTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !richPointer()) return;
    el.classList.add("tilt-live");
    let raf = 0, x = 0.5, y = 0.5, w = 1, h = 1;
    const apply = () => {
      raf = 0;
      el.style.setProperty("--ry", `${((x - 0.5) * 5).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${((0.5 - y) * 5).toFixed(2)}deg`);
      el.style.setProperty("--lx", `${(x * w).toFixed(0)}px`); el.style.setProperty("--ly", `${(y * h).toFixed(0)}px`);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect(); w = r.width; h = r.height;
      x = (e.clientX - r.left) / r.width; y = (e.clientY - r.top) / r.height;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const leave = () => { el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => { cancelAnimationFrame(raf); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, []);
  return ref;
}

/** Magnetic primary action: drifts at most 3px toward the pointer. */
export function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !richPointer()) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = ((e.clientX - r.left) / r.width - 0.5) * 6, dy = ((e.clientY - r.top) / r.height - 0.5) * 4;
      el.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
    };
    const leave = () => { el.style.translate = ""; };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, []);
  return ref;
}

/**
 * Reveal-once on scroll. Content that is already on screen at mount is never hidden;
 * only sections starting below the fold fade up when they arrive.
 */
export function Reveal({ children, as: Tag = "div", className, delay = 0 }: { children: ReactNode; as?: ElementType; className?: string; delay?: number }) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"idle" | "pending" | "shown">("idle");
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setState("pending");
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setState("shown"); io.disconnect(); } }, { rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className={cn(state === "pending" && "reveal-pending", state === "shown" && "reveal-shown", className)} style={delay ? { animationDelay: `${delay}ms` } : undefined}>{children}</Tag>;
}

/** Thin ribbon showing how far the reader has scrolled through a target element. Not episode completion. */
export function ReadingProgress({ targetId, label }: { targetId: string; label: string }) {
  const bar = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const t = document.getElementById(targetId);
      if (!t || !bar.current || !wrap.current) return;
      const r = t.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total <= 0 ? (r.top <= 0 ? 1 : 0) : Math.min(1, Math.max(0, -r.top / total));
      bar.current.style.transform = `scaleX(${p})`;
      wrap.current.setAttribute("aria-valuenow", String(Math.round(p * 100)));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, [targetId]);
  return (
    <div ref={wrap} className="reading-ribbon" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
      <div ref={bar} className="reading-ribbon-fill" />
    </div>
  );
}

/** Small sparkle burst rendered once when `show` flips true (after the app confirmed success). */
export function SparkleBurst({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="sparkle-burst" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => <img key={i} src={TRAIL_ASSETS[i % 3]} alt="" style={{ ["--i" as string]: i }} />)}
    </span>
  );
}
