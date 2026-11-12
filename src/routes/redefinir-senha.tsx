import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/redefinir-senha")({
  head: () => ({
    meta: [
      { title: "Nova senha — Language Journal" },
      { name: "description", content: "Escolha uma nova senha para sua conta do Language Journal." },
      { property: "og:title", content: "Nova senha — Language Journal" },
      { property: "og:description", content: "Recupere o acesso ao seu diário de idiomas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [ready, setReady] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const isRecovery = window.location.hash.includes("type=recovery");
    const { data } = supabase.auth.onAuthStateChange((event) => { if (event === "PASSWORD_RECOVERY") setReady(true); });
    supabase.auth.getSession().then(({ data: s }) => setReady((r) => r ?? (isRecovery || !!s.session)));
    return () => data.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) { toast.error(error.message || t("auth.error")); return; }
    toast.success(t("auth.resetDone"));
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-4xl">{t("auth.resetTitle")}</h1>
      {ready === false ? <p className="mt-6 text-muted-foreground">{t("auth.resetInvalid")}</p> : (
        <form onSubmit={submit} className="mt-8 space-y-4 rounded-xl border bg-card p-8">
          <label className="block text-sm">{t("account.newPassword")}<Input type="password" required minLength={8} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" className="mt-1" /></label>
          <Button type="submit" disabled={busy || !ready} className="w-full">{t("auth.resetSave")}</Button>
        </form>
      )}
    </div>
  );
}
