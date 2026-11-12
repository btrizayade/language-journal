import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
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
  useEffect(() => { if (a.current) a.current.playbackRate = speed; }, [speed]);
  return (
    <div className="rounded-lg border bg-secondary p-4">
      <audio ref={a} src={src} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)} onLoadedMetadata={(e) => { setDur(e.currentTarget.duration); e.currentTarget.playbackRate = speed; }} />
      <div className="flex items-center gap-4">
        <button onClick={() => (playing ? a.current?.pause() : a.current?.play())} aria-label={playing ? t("media.pause") : t("media.play")}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          {playing ? <Pause className="size-5" aria-hidden /> : <Play className="size-5" aria-hidden />}
        </button>
        <input type="range" min={0} max={dur || 0} step={0.1} value={time} aria-label={t("media.seek")}
          onChange={(e) => { if (a.current) a.current.currentTime = Number(e.target.value); }} className="flex-1 accent-primary" />
        <span className="tabular-nums text-sm text-muted-foreground">{fmt(time)} / {fmt(dur)}</span>
      </div>
      <div className="mt-3"><SpeedSelect value={speed} onChange={onSpeed} /></div>
    </div>
  );
}

/** Native video player (keyboard-accessible controls), with original-language subtitles when provided. */
export function VideoPlayer({ src, subtitles, lang, speed, onSpeed }: { src: string; subtitles?: string | undefined; lang: string; speed: number; onSpeed: (v: number) => void }) {
  const v = useRef<HTMLVideoElement>(null);
  useEffect(() => { if (v.current) v.current.playbackRate = speed; }, [speed]);
  return (
    <div>
      <video ref={v} controls preload="metadata" src={src} className="aspect-video w-full rounded-lg bg-muted" crossOrigin="anonymous">
        {subtitles && <track kind="subtitles" src={subtitles} srcLang={lang} label={lang} default />}
      </video>
      <div className="mt-3"><SpeedSelect value={speed} onChange={onSpeed} /></div>
    </div>
  );
}
