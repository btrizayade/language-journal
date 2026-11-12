import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { signOut, useSync } from "@/lib/sync";
import { deleteAccount } from "@/lib/account.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function AccountSection() {
  const { t, date } = useI18n();
  const { user, status } = useSync();
  const navigate = useNavigate();
  const del = useServerFn(deleteAccount);
  const [name, setName] = useState("");
  const [cur, setCur] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle().then(({ data }) => setName(data?.display_name ?? ""));
  }, [user]);

  if (!user) return (
    <section className="mt-10 rounded-xl border bg-card p-6">
      <h2 className="font-display text-2xl">{t("account.title")}</h2>
      <p className="mt-2 text-muted-foreground">{t("account.guest")}</p>
      <Button asChild className="mt-4"><Link to="/entrar">{t("auth.signIn")}</Link></Button>
    </section>
  );

  const saveName = async () => {
    const { error } = await supabase.from("profiles").update({ display_name: name.trim(), updated_at: new Date().toISOString() }).eq("id", user.id);
    error ? toast.error(t("auth.error")) : toast.success(t("settings.saved"));
  };
  const changePw = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    // Confirm the current password first, so an unattended open session can't be used to change it.
    const check = await supabase.auth.signInWithPassword({ email: user.email ?? "", password: cur });
    if (check.error) { setBusy(false); toast.error(t("account.wrongPassword")); return; }
    const { error } = await supabase.auth.updateUser({ password: pw, current_password: cur } as never);
    setBusy(false);
    if (error) { toast.error(error.message || t("auth.error")); return; }
    setCur(""); setPw(""); toast.success(t("auth.resetDone"));
  };
  const out = async () => { await signOut(); navigate({ to: "/", replace: true }); };
  const remove = async () => {
    setBusy(true);
    try { await del(); await supabase.auth.signOut(); toast.success(t("account.deleted")); navigate({ to: "/", replace: true }); }
    catch { toast.error(t("auth.error")); }
    finally { setBusy(false); }
  };

  return (
    <section className="mt-10 divide-y rounded-xl border bg-card" aria-labelledby="acc-h">
      <div className="p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="acc-h" className="font-display text-2xl">{t("account.title")}</h2>
          <span className="text-xs text-muted-foreground" role="status">{status === "saving" || status === "loading" ? t("sync.saving") : status === "error" ? t("sync.error") : t("sync.saved")}</span>
        </div>
        <p className="mt-2 text-muted-foreground">{user.email}</p>
        <p className="text-sm text-muted-foreground">{t("account.since", { date: date(user.created_at) })}</p>
      </div>
      <div className="p-6">
        <label htmlFor="acc-name" className="font-display text-xl">{t("account.name")}</label>
        <div className="mt-3 flex max-w-md gap-2">
          <Input id="acc-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
          <Button variant="outline" onClick={saveName}>{t("account.saveName")}</Button>
        </div>
      </div>
      <form className="space-y-3 p-6" onSubmit={changePw}>
        <h3 className="font-display text-xl">{t("account.changePassword")}</h3>
        <label className="block max-w-md text-sm">{t("account.currentPassword")}<Input type="password" autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} required className="mt-1" /></label>
        <label className="block max-w-md text-sm">{t("account.newPassword")}<Input type="password" autoComplete="new-password" minLength={8} value={pw} onChange={(e) => setPw(e.target.value)} required className="mt-1" /></label>
        <Button type="submit" variant="outline" disabled={busy}>{t("account.changePassword")}</Button>
      </form>
      <div className="flex flex-wrap gap-3 p-6">
        <Button variant="outline" onClick={out}>{t("account.signOut")}</Button>
        <AlertDialog onOpenChange={() => setConfirm("")}>
          <AlertDialogTrigger asChild><Button variant="ghost" className="text-destructive">{t("account.delete")}</Button></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("account.delete")}</AlertDialogTitle>
              <AlertDialogDescription>{t("account.deleteBody")}</AlertDialogDescription>
            </AlertDialogHeader>
            <Input aria-label={t("account.deleteWord")} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            <AlertDialogFooter>
              <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
              <AlertDialogAction disabled={confirm.trim().toUpperCase() !== t("account.deleteWord") || busy} onClick={remove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t("account.delete")}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
}
