// Catalog of hand-drawn magical illustrations (2D gouache storybook style, transparent WebP).
import bookFloating from "@/assets/magical/book-floating-01.webp";
import bookOpen from "@/assets/magical/book-open-01.webp";
import potionGolden from "@/assets/magical/potion-golden-01.webp";
import mirrorMagic from "@/assets/magical/mirror-magic-01.webp";
import sparkleSmall from "@/assets/magical/sparkle-small-01.webp";
import moonCrescent from "@/assets/magical/moon-crescent-01.webp";
import keyAntique from "@/assets/magical/key-antique-01.webp";
import quillMagic from "@/assets/magical/quill-magic-01.webp";
import bookSage from "@/assets/magical/book-sage.webp";
import bookStack from "@/assets/magical/book-stack.webp";
import bookTeal from "@/assets/magical/book-teal.webp";
import bookRose from "@/assets/magical/book-rose.webp";
import potionLavender from "@/assets/magical/potion-lavender.webp";
import potionGreen from "@/assets/magical/potion-green.webp";
import potionPink from "@/assets/magical/potion-pink.webp";
import potionAntique from "@/assets/magical/potion-antique.webp";
import mirrorOval from "@/assets/magical/mirror-oval.webp";
import mirrorHand from "@/assets/magical/mirror-hand.webp";

import starEight from "@/assets/magical/star-eight.webp";
import starRose from "@/assets/magical/star-rose.webp";
import starTeal from "@/assets/magical/star-teal.webp";
import dustCluster from "@/assets/magical/dust-cluster.webp";
import moonRose from "@/assets/magical/moon-rose.webp";
import sunSmall from "@/assets/magical/sun-small.webp";
import starBotanical from "@/assets/magical/star-botanical.webp";
import cometSmall from "@/assets/magical/comet-small.webp";
import starBurst from "@/assets/magical/star-burst.webp";
import starTwin from "@/assets/magical/star-twin.webp";
import lantern from "@/assets/magical/lantern.webp";
import scroll from "@/assets/magical/scroll.webp";
import botanical from "@/assets/magical/botanical.webp";
import butterfly from "@/assets/magical/butterfly.webp";
import candle from "@/assets/magical/candle.webp";
import crystal from "@/assets/magical/crystal.webp";

export const magicalAssets = {
  starEight, starRose, starTeal, dustCluster, moonRose, sunSmall, starBotanical, cometSmall, starBurst, starTwin, lantern, scroll, botanical, butterfly, candle, crystal,
  bookSage, bookStack, bookTeal, bookRose,
  potionLavender, potionGreen, potionPink, potionAntique, mirrorOval, mirrorHand,
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
