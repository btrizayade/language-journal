import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { useSync } from "@/lib/sync";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar — Language Journal" },
      { name: "description", content: "Entre ou crie sua conta para guardar escritas, vocabulário e progresso em todos os dispositivos." },
      { property: "og:title", content: "Entrar — Language Journal" },
      { property: "og:description", content: "Sua biblioteca de histórias e escritas, sincronizada entre dispositivos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

type Mode = "in" | "up" | "forgot";

function AuthPage() {
  const { t } = useI18n();
  const { user } = useSync();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) navigate({ to: "/", replace: true }); }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
      } else if (mode === "up") {
        const { data, error } = await supabase.auth.signUp({ email, password: pw, options: { emailRedirectTo: window.location.origin, data: { display_name: name.trim() } } });
        if (error) throw error;
        if (!data.session) setMsg({ kind: "ok", text: t("auth.checkEmail", { email }) });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/redefinir-senha` });
        if (error) throw error;
        setMsg({ kind: "ok", text: t("auth.resetSent") });
      }
    } catch (err) {
      setMsg({ kind: "err", text: (err as Error).message || t("auth.error") });
    } finally { setBusy(false); }
  };

  const tab = (m: Mode, label: string) => (
    <button type="button" role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setMsg(null); }}
      className={`rounded-full px-4 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-ring ${mode === m ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{label}</button>
  );

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Language Journal</p>
        <h1 className="mt-3 text-5xl leading-tight">{t("auth.title")}</h1>
        <p className="mt-5 font-serif text-xl text-muted-foreground">{t("auth.intro")}</p>
        <p className="mt-6 text-sm text-muted-foreground">{t("auth.guestNote")} <Link to="/" className="underline">{t("auth.back")}</Link></p>
      </div>
      <form onSubmit={submit} className="rounded-xl border bg-card p-8 shadow-[var(--shadow-book)]">
        <div role="tablist" className="mb-6 flex gap-1">{tab("in", t("auth.signIn"))}{tab("up", t("auth.signUp"))}</div>
        <div className="space-y-4">
          {mode === "up" && <label className="block text-sm">{t("auth.name")}<Input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="name" className="mt-1" /></label>}
          <label className="block text-sm">{t("auth.email")}<Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="mt-1" /></label>
          {mode !== "forgot" && <label className="block text-sm">{t("auth.password")}<Input type="password" required minLength={mode === "up" ? 8 : undefined} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete={mode === "up" ? "new-password" : "current-password"} className="mt-1" />
            {mode === "up" && <span className="mt-1 block text-xs text-muted-foreground">{t("auth.passwordHint")}</span>}</label>}
        </div>
        {msg && <p role={msg.kind === "err" ? "alert" : "status"} className={`mt-4 text-sm ${msg.kind === "err" ? "text-destructive" : "text-foreground"}`}>{msg.text}</p>}
        <Button type="submit" disabled={busy} className="mt-6 w-full">{mode === "in" ? t("auth.signIn") : mode === "up" ? t("auth.signUp") : t("auth.sendReset")}</Button>
        {mode === "in" && <button type="button" onClick={() => { setMode("forgot"); setMsg(null); }} className="mt-4 text-sm text-muted-foreground underline">{t("auth.forgot")}</button>}
        {mode === "forgot" && <button type="button" onClick={() => { setMode("in"); setMsg(null); }} className="mt-4 text-sm text-muted-foreground underline">{t("auth.signIn")}</button>}
      </form>
    </div>
  );
}
