import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { WritingStudio } from "./WritingStudio";
import { journals } from "@/lib/content";
import { emptyState, getState, GUEST_KEY, swapState } from "@/lib/store";
import { toast } from "sonner";
vi.mock("@/lib/sync", () => ({ useSync: () => ({ user: null, ready: false, status: "guest" }) }));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
const j = journals[0]; const a = j?.episodes[0]; const b = j?.episodes[1];
beforeEach(() => { vi.useFakeTimers(); localStorage.clear(); swapState(emptyState, GUEST_KEY); });
afterEach(() => { cleanup(); vi.useRealTimers(); });
it("flushes captured text to the original episode during rapid identity navigation", () => {
  if (!j || !a || !b) throw Error("Missing fixtures");
  const view = render(<WritingStudio journal={j} episode={a} />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "first episode text" } });
  view.rerender(<WritingStudio journal={j} episode={b} />);
  expect(screen.getByRole("textbox")).toHaveValue("");
  act(() => { vi.advanceTimersByTime(1500); });
  expect(getState().entries.map((e) => [e.episodeId, e.content])).toEqual([[a.id, "first episode text"]]);
});
it("flushes on unmount before the timer without duplicate drafts", () => {
  if (!j || !a) throw Error("Missing fixtures");
  const view = render(<WritingStudio journal={j} episode={a} />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "latest text" } }); view.unmount();
  act(() => { vi.runAllTimers(); }); expect(getState().entries).toHaveLength(1);
  expect(getState().entries[0]?.content).toBe("latest text");
});
it("flushes latest typing when the page is hidden", () => {
  if (!j || !a) throw Error("Missing fixtures");
  render(<WritingStudio journal={j} episode={a} />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "hidden text" } });
  Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
  fireEvent(document, new Event("visibilitychange"));
  expect(getState().entries[0]?.content).toBe("hidden text");
});
it("keeps an intentionally cleared draft empty through component reload", () => {
  if (!j || !a) throw Error("Missing fixtures");
  const view = render(<WritingStudio journal={j} episode={a} />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "saved draft" } });
  act(() => { vi.advanceTimersByTime(1200); });
  const saved = getState().entries[0];
  view.rerender(<WritingStudio journal={j} episode={a} entry={saved} />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "" } });
  act(() => { vi.advanceTimersByTime(1200); }); view.unmount();
  const restored = JSON.parse(localStorage.getItem(GUEST_KEY) ?? "{}"); swapState(restored, GUEST_KEY);
  render(<WritingStudio journal={j} episode={a} entry={restored.entries[0]} />);
  expect(screen.getByRole("textbox")).toHaveValue("");
});
it("does not acknowledge success on quota failure and retry keeps one draft", () => {
  if (!j || !a) throw Error("Missing fixtures");
  vi.mocked(toast.success).mockClear();
  render(<WritingStudio journal={j} episode={a} />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "recoverable latest" } });
  const fail = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new DOMException("full", "QuotaExceededError"); });
  act(() => { vi.advanceTimersByTime(1200); });
  expect(toast.success).not.toHaveBeenCalled(); expect(getState().entries).toHaveLength(1);
  fail.mockRestore(); fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
  expect(JSON.parse(localStorage.getItem(GUEST_KEY) ?? "{}").entries).toHaveLength(1);
});