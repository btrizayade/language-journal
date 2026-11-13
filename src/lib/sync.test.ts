import { afterEach, beforeEach, expect, it, vi } from "vitest";
const db = vi.hoisted(() => ({ rows: new Map<string, Record<string, unknown>>(), race: false, fail: false, user: null as { id: string } | null }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: {
  auth: { getUser: async () => ({ data: { user: db.user } }), onAuthStateChange: () => {} },
  from: (table: string) => {
    let mode = "read"; let payload: Record<string, unknown> = {}; const filters: [string, unknown][] = [];
    const result = () => {
      if (db.fail) return { data: null, error: { message: "network interruption" } };
      const key = table; const current = db.rows.get(key);
      if (mode === "insert") {
        if (current) return { data: null, error: { code: "23505" } };
        db.rows.set(key, payload); return { data: payload, error: null };
      }
      if (mode === "update") {
        if (db.race && current) { db.race = false; db.rows.set(key, { ...current, updated_at: "2026-01-03", assessments: { "j/e": [{ id: "other", at: "2026-01-02", answers: [[0]], correct: 1, total: 1 }] } }); return { data: null, error: null }; }
        if (!current || filters.some(([k, v]) => current[k] !== v)) return { data: null, error: null };
        const next = { ...current, ...payload }; db.rows.set(key, next); return { data: next, error: null };
      }
      return { data: current ?? null, error: null };
    };
    const chain = {
      select: () => chain, eq: (key: string, value: unknown) => { filters.push([key, value]); return chain; },
      maybeSingle: async () => result(),
      insert: (value: Record<string, unknown>) => { mode = "insert"; payload = value; return chain; },
      update: (value: Record<string, unknown>) => { mode = "update"; payload = value; return chain; },
      upsert: (value: Record<string, unknown>) => { mode = "insert"; payload = value; return chain; },
      then: (resolve: (x: unknown) => void) => resolve({ data: db.fail ? null : [], error: db.fail ? { message: "offline" } : null }),
    }; return chain;
  },
} }));
import { writeWithRetry, startSync, flush } from "./sync";
import { emptyState, getState, GUEST_KEY, persistEntry, swapState } from "./store";
import { mergeStates } from "./merge";
beforeEach(() => { db.rows.clear(); db.race = false; db.fail = false; db.user = null; localStorage.clear(); });
afterEach(() => { vi.useRealTimers(); });
it("retries a raced write and retains both devices' assessment IDs", async () => {
  db.rows.set("user_state", { user_id: "u", updated_at: "2026-01-01", assessments: {}, completed: {} }); db.race = true;
  const attempt = { id: "mine", at: "2026-01-02", answers: [[1]], correct: 0, total: 1 };
  await writeWithRetry("user_state", { user_id: "u" }, (r) => {
    const cloud = { ...emptyState, assessments: (r?.["assessments"] ?? {}) as typeof emptyState.assessments };
    return { assessments: mergeStates(cloud, { ...emptyState, assessments: { "j/e": [attempt] } }).assessments };
  });
  expect((db.rows.get("user_state")?.["assessments"] as typeof emptyState.assessments)["j/e"]?.map((x) => x.id).sort()).toEqual(["mine", "other"]);
});
it("propagates failed cloud writes without marking them persisted", async () => {
  db.fail = true; await expect(writeWithRetry("user_state", { user_id: "u" }, () => ({}))).rejects.toBeTruthy();
  expect(db.rows.size).toBe(0);
});
it("preserves remote completion records while adding another device's record", async () => {
  db.rows.set("user_state", { user_id: "u", updated_at: "2026-01-01", completed: { "j/1": "2026-01-01" } });
  await writeWithRetry("user_state", { user_id: "u" }, (r) => ({ completed: mergeStates({ ...emptyState, completed: r?.["completed"] as typeof emptyState.completed }, { ...emptyState, completed: { "j/2": "2026-01-02" } }).completed }));
  expect(db.rows.get("user_state")?.["completed"]).toEqual({ "j/1": "2026-01-01", "j/2": "2026-01-02" });
});
it("keeps pre-login account edits through loading failure and retry", async () => {
  vi.useFakeTimers(); const key = "language-journal:user:u"; swapState(emptyState, key); persistEntry("j", "e", "offline work", "draft");
  db.user = { id: "u" }; db.fail = true; startSync(); await vi.advanceTimersByTimeAsync(1);
  expect(getState().entries[0]?.content).toBe("offline work");
  await flush(); expect(db.rows.size).toBe(0);
  db.fail = false; await vi.advanceTimersByTimeAsync(8000);
  expect(getState().entries[0]?.content).toBe("offline work");
  // Guest data is not pulled into the account implicitly.
  expect(localStorage.getItem(GUEST_KEY)).toBeNull();
});