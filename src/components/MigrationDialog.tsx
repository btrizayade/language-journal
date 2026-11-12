import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { acceptMigration, declineMigration, useSync } from "@/lib/sync";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function MigrationDialog() {
  const { offer } = useSync();
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);
  if (!offer) return null;
  const go = async () => {
    setBusy(true);
    try { await acceptMigration(); toast.success(t("migrate.done")); } catch { toast.error(t("migrate.failed")); } finally { setBusy(false); }
  };
  return (
    <Dialog open onOpenChange={(o) => { if (!o && !busy) declineMigration(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{t("migrate.title")}</DialogTitle>
          <DialogDescription>{t("migrate.body", { entries: offer.entries.length, vocab: offer.vocab.length, notes: offer.passages.length })}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={declineMigration} disabled={busy}>{t("migrate.decline")}</Button>
          <Button onClick={go} disabled={busy}>{t("migrate.accept")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
