import { Link } from "@tanstack/react-router";
import { BookOpen, Headphones, PenLine, X } from "lucide-react";
import { Button } from "./ui/button";
import { useI18n, usePrefs, setPrefs } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export function FirstStory() {
  const s = useStore();
  const prefs = usePrefs();
  const { t } = useI18n();
  if (prefs.onboardingDismissed || Object.keys(s.opened).length || s.entries.length) return null;
  return <section className="mb-12 border-y py-8" aria-labelledby="first-story">
    <div className="flex items-center justify-between gap-4"><h2 id="first-story" className="text-3xl">{t("onboard.title")}</h2><Button size="icon" variant="ghost" aria-label={t("onboard.dismiss")} onClick={() => setPrefs({ onboardingDismissed: true })}><X /></Button></div>
    <ol className="my-6 grid gap-6 md:grid-cols-3">
      {[{ Icon: BookOpen, key: "onboard.choose" }, { Icon: Headphones, key: "onboard.explore" }, { Icon: PenLine, key: "onboard.write" }].map(({ Icon, key }, i) => <li key={key} className="flex items-start gap-3"><Icon className="mt-1 size-5 shrink-0 text-sage-deep" aria-hidden /><p>{i + 1}. {t(key as "onboard.choose" | "onboard.explore" | "onboard.write")}</p></li>)}
    </ol>
    <Button asChild className="h-auto min-h-10 whitespace-normal"><Link to="/episodio/$journalId/$episodeId" params={{ journalId: "les-jours-de-camille", episodeId: "la-lettre" }}>{t("onboard.start")}</Link></Button>
  </section>;
}