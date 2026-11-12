import { Decoration, type DecorationProps } from "./Decoration";

type Accent = Omit<DecorationProps, "alt">;
const compositions: Record<"transition" | "closing" | "notebook" | "quiet", Accent[]> = {
  transition: [
    { asset: "bookTeal", size: 62, pos: { top: "6%", left: "4%" }, rotate: -12, delay: 2 },
    { asset: "starTwin", size: 32, pos: { top: "15%", left: "22%" }, motion: "twinkle", delay: 1 },
    { asset: "cometSmall", size: 40, pos: { top: "16%", right: "32%" }, motion: "none" },
    { asset: "potionAntique", size: 56, pos: { top: "4%", right: "5%" }, motion: "potion", delay: 4 },
  ],
  closing: [
    { asset: "bookStack", size: 92, pos: { bottom: "8%", left: "10%" }, motion: "none" },
    { asset: "scroll", size: 58, pos: { top: "5%", left: "40%" }, rotate: 10, duration: 14 },
    { asset: "starBurst", size: 26, pos: { top: "24%", right: "26%" }, motion: "twinkle", delay: 3 },
    { asset: "lantern", size: 72, pos: { bottom: "5%", right: "9%" }, motion: "none" },
  ],
  notebook: [
    { asset: "bookRose", size: 62, pos: { top: "12%", left: "5%" }, rotate: -8, motion: "none" },
    { asset: "starBotanical", size: 24, pos: { top: "28%", left: "28%" }, motion: "twinkle", delay: 4 },
    { asset: "quillMagic", size: 65, pos: { top: "4%", right: "9%" }, rotate: 8, motion: "none" },
    { asset: "starTeal", size: 24, pos: { top: "35%", right: "30%" }, motion: "twinkle", delay: 2 },
    { asset: "botanical", size: 48, pos: { top: "4%", left: "45%" }, motion: "none" },
  ],
  quiet: [
    { asset: "moonRose", size: 36, pos: { top: "20%", left: "8%" }, motion: "none" },
    { asset: "starEight", size: 20, pos: { top: "35%", right: "12%" }, motion: "none" },
  ],
};

/** Reserved, content-free section boundaries keep illustrations outside controls and text. */
export function IllustratedBoundary({ variant = "transition" }: { variant?: keyof typeof compositions }) {
  return <div className={`illustrated-boundary relative ${variant === "quiet" ? "h-16" : "h-24 md:h-28"}`} aria-hidden="true">
    {compositions[variant].map((accent, i) => <Decoration key={i} {...accent} className={i > 1 ? "hidden sm:block" : ""} />)}
  </div>;
}