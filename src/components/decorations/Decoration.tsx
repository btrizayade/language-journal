import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { magicalAssets, type MagicalAsset } from "./assets";

export type DecorationMotion = "float" | "twinkle" | "potion" | "mirror" | "openBook" | "none";

export interface DecorationProps {
  asset: MagicalAsset;
  /** width in px */
  size: number;
  /** absolute position, e.g. { top: "10%", left: "4%" } */
  pos?: Pick<CSSProperties, "top" | "left" | "right" | "bottom">;
  motion?: DecorationMotion;
  duration?: number;
  delay?: number;
  rotate?: number;
  opacity?: number;
  /** tailwind visibility, e.g. "hidden md:block" */
  className?: string;
  /** set when the image carries meaning; otherwise it is hidden from assistive tech */
  alt?: string;
}

const anim: Record<Exclude<DecorationMotion, "none">, string> = {
  float: "magic-float", potion: "magic-float", mirror: "magic-float", openBook: "magic-float", twinkle: "magic-twinkle",
};

/** Pauses animations while offscreen. */
function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible] as const;
}

export function Decoration({ asset, size, pos, motion = "float", duration, delay = 0, rotate = 0, opacity = 1, className, alt }: DecorationProps) {
  const [ref, visible] = useInView<HTMLDivElement>();
  const dur = duration ?? (motion === "twinkle" ? 3 : 9);
  const style: CSSProperties = {
    ...pos, width: size, opacity, ["--rot" as string]: `${rotate}deg`,
    animation: motion === "none" ? undefined : `${anim[motion]} ${dur}s ease-in-out ${-delay}s infinite`,
  };
  return (
    <div ref={ref} className={cn("magic-layer absolute", !visible && "magic-paused", className)} style={style} aria-hidden={alt ? undefined : true}>
      {motion === "potion" || motion === "openBook" ? (
        <span className="absolute inset-[15%] rounded-full bg-butter/50 blur-xl" style={{ animation: `magic-glow ${dur * 0.6}s ease-in-out ${-delay}s infinite` }} />
      ) : null}
      <img src={magicalAssets[asset]} alt={alt ?? ""} width={size} height={size} loading="lazy" decoding="async" draggable={false} className="relative block h-auto w-full" />
      {motion === "potion" && [0, 1, 2].map((i) => (
        <span key={i} className="absolute rounded-full border border-butter bg-background/60"
          style={{ width: 6 + i * 2, height: 6 + i * 2, left: `${38 + i * 10}%`, top: "8%", animation: `magic-bubble ${3 + i}s ease-out ${-(i * 1.3 + delay)}s infinite` }} />
      ))}
      {motion === "mirror" && (
        <span className="absolute inset-x-[25%] top-[10%] h-[45%] overflow-hidden rounded-full">
          <span className="absolute inset-y-0 left-1/4 w-1/3 bg-background/70" style={{ animation: `magic-shimmer ${dur}s ease-in-out ${-delay}s infinite` }} />
        </span>
      )}
    </div>
  );
}

export interface SparkleSpec { top: string; left: string; size: number; delay: number; rotate?: number }

/** Deterministic sparkle placement: positions come from props, never from Math.random during render. */
export function SparkleField({ sparkles, className }: { sparkles: SparkleSpec[]; className?: string }) {
  return (
    <div className={cn("magic-layer absolute inset-0", className)} aria-hidden="true">
      {sparkles.map((s, i) => (
        <Decoration key={i} asset="sparkleSmall" size={s.size} pos={{ top: s.top, left: s.left }} motion="twinkle"
          duration={2.4 + (i % 3) * 0.7} delay={s.delay} rotate={s.rotate ?? (i * 23) % 40} />
      ))}
    </div>
  );
}
