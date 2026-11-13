import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const SPEEDS = [0.75, 1, 1.25, 1.5] as const;
const fmt = (s: number) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");

function SpeedSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const { t } = useI18n();
  return (
    <label className="flex items-center gap-2 text-sm">{t("reading.speed")}
      <select value={value} onChange={(e) => onChange(Number(e.target.value))} className="rounded-md border bg-card px-2 py-1">
        {SPEEDS.map((v) => <option key={v} value={v}>{v}×</option>)}
      </select>
    </label>
  );
}

/** Audio player with play/pause, progress, time and speed. Only rendered when a real media URL exists. */
export function AudioPlayer({ src, speed, onSpeed }: { src: string; speed: number; onSpeed: (v: number) => void }) {
  const { t } = useI18n();
  const a = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [volume, setVolume] = useState(1);
  async function play() {
    try { await a.current?.play(); } catch { setError(true); }
  }
  function seek(value: number) {
    if (!a.current || !Number.isFinite(dur)) return;
    a.current.currentTime = Math.max(0, Math.min(dur, value));
    setTime(a.current.currentTime);
  }
  useEffect(() => { if (a.current) a.current.playbackRate = speed; }, [speed]);
  // Metadata can arrive before hydration attaches event listeners.
  useEffect(() => {
    const audio = a.current;
    if (!audio || audio.readyState < 1) return;
    setDur(audio.duration);
    setLoading(false);
  }, [src]);
  return (
    <div className="rounded-lg border bg-secondary p-4">
      <audio ref={a} src={src} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onError={() => { setError(true); setLoading(false); }} onWaiting={() => setLoading(true)} onCanPlay={() => setLoading(false)} onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)} onLoadedMetadata={(e) => { setDur(e.currentTarget.duration); e.currentTarget.playbackRate = speed; setLoading(false); }} />
      {error && <p role="alert" className="mb-3 text-sm">{t("media.error")} <Button variant="link" onClick={() => { setError(false); setLoading(true); a.current?.load(); }}>{t("lesson.retry")}</Button></p>}
      <div className="flex flex-wrap items-center gap-3" aria-busy={loading}>
        <Button size="icon" disabled={error} onClick={() => (playing ? a.current?.pause() : void play())} aria-label={playing ? t("media.pause") : t("media.play")}>
          {playing ? <Pause className="size-5" aria-hidden /> : <Play className="size-5" aria-hidden />}
        </Button>
        <input type="range" min={0} max={dur || 0} step={0.1} value={time} aria-label={t("media.seek")}
          onChange={(e) => seek(Number(e.target.value))} className="min-w-20 flex-1 accent-primary" />
        <span className="tabular-nums text-sm text-muted-foreground">{fmt(time)} / {fmt(dur)}</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="icon" aria-label={t("media.back")} title={t("media.back")} onClick={() => seek(time - 10)}><RotateCcw /></Button>
        <Button variant="ghost" size="icon" aria-label={t("media.forward")} title={t("media.forward")} onClick={() => seek(time + 10)}><RotateCw /></Button>
        <SpeedSelect value={speed} onChange={onSpeed} />
        <label className="flex items-center gap-2 text-sm">{t("media.volume")}<input className="w-20 accent-primary" type="range" min={0} max={1} step={0.05} value={volume} onChange={(e) => { const v = Number(e.target.value); setVolume(v); if (a.current) a.current.volume = v; }} /></label>
      </div>
    </div>
  );
}

/** Native video player (keyboard-accessible controls), with original-language subtitles when provided. */
export function VideoPlayer({ src, subtitles, lang, speed, onSpeed }: { src: string; subtitles?: string | undefined; lang: string; speed: number; onSpeed: (v: number) => void }) {
  const v = useRef<HTMLVideoElement>(null);
  const { t } = useI18n();
  const [error, setError] = useState(false);
  useEffect(() => { if (v.current) v.current.playbackRate = speed; }, [speed]);
  return (
    <div>
      {error && <p role="alert">{t("media.error")}</p>}
      <video ref={v} controls preload="metadata" src={src} onError={() => setError(true)} onLoadedMetadata={(e) => { e.currentTarget.playbackRate = speed; }} className="aspect-video w-full rounded-lg bg-muted" crossOrigin="anonymous">
        {subtitles && <track kind="subtitles" src={subtitles} srcLang={lang} label={lang} default />}
      </video>
      <div className="mt-3"><SpeedSelect value={speed} onChange={onSpeed} /></div>
    </div>
  );
}
