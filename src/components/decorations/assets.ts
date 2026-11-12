// Catalog of hand-drawn magical illustrations (2D gouache storybook style, transparent WebP).
import bookFloating from "@/assets/magical/book-floating-01.webp";
import bookOpen from "@/assets/magical/book-open-01.webp";
import potionGolden from "@/assets/magical/potion-golden-01.webp";
import mirrorMagic from "@/assets/magical/mirror-magic-01.webp";
import sparkleSmall from "@/assets/magical/sparkle-small-01.webp";
import moonCrescent from "@/assets/magical/moon-crescent-01.webp";
import keyAntique from "@/assets/magical/key-antique-01.webp";
import quillMagic from "@/assets/magical/quill-magic-01.webp";

export const magicalAssets = {
  bookFloating, // floating hero accent
  bookOpen, // open book with stars, hero/empty states
  potionGolden, // potion with bubbles
  mirrorMagic, // mirror with shimmer
  sparkleSmall, // twinkle accents
  moonCrescent, // celestial corner accent
  keyAntique, // journal detail accent
  quillMagic, // writing/entries headers (static near writing)
} as const;
export type MagicalAsset = keyof typeof magicalAssets;
