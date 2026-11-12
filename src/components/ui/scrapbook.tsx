import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Scrapbook primitives for the enchanted-library look.
 * Illustration rule: hand-drawn vector, cocoa outlines, rounded shapes, pastel fills,
 * soft shading, sticker-like edges. Decorative pieces are aria-hidden.
 */
export type Tint = "lavender" | "pink" | "sage" | "butter" | "powder";
const tintBg: Record<Tint, string> = {
  lavender: "bg-secondary", pink: "bg-pink", sage: "bg-sage", butter: "bg-butter", powder: "bg-powder",
};

export function WashiTape({ tint = "pink", rotate = -4, className }: { tint?: Tint; rotate?: number; className?: string }) {
  return (
    <span aria-hidden="true" style={{ transform: `rotate(${rotate}deg)` }}
      className={cn("pointer-events-none inline-block h-6 w-24 opacity-85 shadow-sm",
        "[mask-image:linear-gradient(90deg,transparent_0,#000_4px,#000_calc(100%-4px),transparent_100%)]",
        "bg-[repeating-linear-gradient(45deg,transparent_0_6px,color-mix(in_oklab,var(--paper)_45%,transparent)_6px_9px)]",
        tintBg[tint], className)} />
  );
}

export function StampBadge({ tint = "lavender", children, className }: { tint?: Tint; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md border-[1.5px] border-dashed border-cocoa/60 px-2 py-0.5",
      "font-sans text-xs font-semibold uppercase tracking-wider text-plum", tintBg[tint], className)}>
      {children}
    </span>
  );
}

export function RibbonBookmark({ tint = "pink", className, label }: { tint?: Tint; className?: string; label?: string }) {
  return (
    <span role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}
      className={cn("inline-block h-12 w-5 border-x-[1.5px] border-t-[1.5px] border-cocoa/50 [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)]",
        tintBg[tint], className)} />
  );
}

export function PaperCard({ stacked, className, ...props }: HTMLAttributes<HTMLDivElement> & { stacked?: boolean }) {
  return <div className={cn("paper-card p-5", stacked && "paper-stack", className)} {...props} />;
}

/** Short decorative annotations only — never instructions or long text. */
export function HandwrittenNote({ children, className, rotate = -2 }: { children: ReactNode; className?: string; rotate?: number }) {
  return <span className={cn("hand-note inline-block", className)} style={{ transform: `rotate(${rotate}deg)` }}>{children}</span>;
}

export function Sparkle({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={cn("animate-sparkle h-4 w-4", className)} style={{ animationDelay: `${delay}s` }}>
      <path d="M12 2c.8 5 2 6.2 7 7-5 .8-6.2 2-7 7-.8-5-2-6.2-7-7 5-.8 6.2-2 7-7z"
        fill="var(--butter)" stroke="var(--cocoa)" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
