import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { VideoPlayer } from "./MediaPlayer";
import { journals } from "@/lib/content";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it("does not report a loading failure when a pause cancels pending playback", async () => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockRejectedValue(new DOMException("Paused", "AbortError"));
  render(<VideoPlayer src="/silent.mp4" lang="fr" speed={1} onSpeed={vi.fn()} silent />);
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Reproduzir" })); });
  expect(screen.queryByRole("alert")).toBeNull();
});
it("keeps silent videos muted with defaultMuted and zero volume across playback events", () => {
  const { container } = render(<VideoPlayer src="/silent.mp4" lang="fr" speed={1} onSpeed={vi.fn()} silent />);
  const video = container.querySelector("video");
  if (!video) throw Error("Video missing");
  expect(video.muted).toBe(true);
  expect(video.defaultMuted).toBe(true);
  expect(video.volume).toBe(0);
  for (const event of ["loadedmetadata", "play", "pause", "seeking", "seeked", "volumechange"]) {
    video.muted = false; video.defaultMuted = false; video.volume = 1;
    fireEvent(video, new Event(event));
    expect(video.muted).toBe(true);
    expect(video.defaultMuted).toBe(true);
    expect(video.volume).toBe(0);
  }
});
it.each([["marche-lepic", 10], ["in-der-baeckerei", 9.916667]])("configures %s as a silent illustration with measured duration", (id, seconds) => {
  const episode = journals.flatMap((j) => j.episodes).find((e) => e.id === id);
  expect(episode?.silentVideo).toBe(true);
  expect(episode?.mediaSeconds).toBe(seconds);
  expect(episode?.mediaUrl).toMatch(/\.mp4$/);
  expect(episode?.subtitlesUrl).toBeUndefined();
});