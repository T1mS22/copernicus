"use client";

import { Minus, Pause, Play, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Panel, Segmented } from "@/components/ui";
import { MAX_BPM, MIN_BPM, tapTempo, tempoName } from "@/lib/metronome";

// Clicks are scheduled ahead on the audio clock ("A Tale of Two Clocks"),
// so timing stays exact even when the page is busy.
const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD_S = 0.1;

const SUBDIVISIONS = [
  { value: "1", label: "♩" },
  { value: "2", label: "♫" },
  { value: "3", label: "3" },
  { value: "4", label: "♬" },
];

type Settings = {
  bpm: number;
  beats: number;
  subdivision: number;
  accent: boolean;
  volume: number;
};

export default function Metronome() {
  const [bpm, setBpm] = useState(100);
  const [beats, setBeats] = useState(4);
  const [subdivision, setSubdivision] = useState("1");
  const [accent, setAccent] = useState(true);
  const [volume, setVolume] = useState(70);
  const [running, setRunning] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [tapCount, setTapCount] = useState(0);
  const taps = useRef<number[]>([]);

  const settings = useRef<Settings>({
    bpm,
    beats,
    subdivision: 1,
    accent,
    volume,
  });
  const audio = useRef<AudioContext | null>(null);
  const timer = useRef<number | null>(null);
  const frame = useRef<number | null>(null);
  const next = useRef({ time: 0, tick: 0 });
  const queue = useRef<{ time: number; beat: number }[]>([]);

  useEffect(() => {
    settings.current = {
      bpm,
      beats,
      subdivision: Number(subdivision),
      accent,
      volume,
    };
  }, [bpm, beats, subdivision, accent, volume]);

  const click = useCallback(
    (context: AudioContext, time: number, kind: "accent" | "beat" | "sub") => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value =
        kind === "accent" ? 1600 : kind === "beat" ? 1000 : 700;
      const level =
        (settings.current.volume / 100) * (kind === "sub" ? 0.35 : 1);
      gain.gain.setValueAtTime(Math.max(level, 0.0001), time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(time);
      oscillator.stop(time + 0.06);
    },
    [],
  );

  const schedule = useCallback(() => {
    const context = audio.current!;
    const {
      bpm: tempo,
      beats: perBar,
      subdivision: sub,
      accent: accented,
    } = settings.current;
    while (next.current.time < context.currentTime + SCHEDULE_AHEAD_S) {
      const { tick, time } = next.current;
      const isBeat = tick % sub === 0;
      const beat = Math.floor(tick / sub) % perBar;
      click(
        context,
        time,
        isBeat ? (beat === 0 && accented ? "accent" : "beat") : "sub",
      );
      if (isBeat) queue.current.push({ time, beat });
      next.current = {
        time: time + 60 / tempo / sub,
        tick: (tick + 1) % (perBar * sub),
      };
    }
  }, [click]);

  const stop = useCallback(() => {
    if (timer.current !== null) clearInterval(timer.current);
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    timer.current = frame.current = null;
    queue.current = [];
    setRunning(false);
    setCurrentBeat(-1);
  }, []);

  const start = useCallback(async () => {
    audio.current ??= new AudioContext();
    const context = audio.current;
    await context.resume();
    next.current = { time: context.currentTime + 0.05, tick: 0 };
    timer.current = window.setInterval(schedule, LOOKAHEAD_MS);
    // Light up each beat when the audio clock reaches it.
    const draw = () => {
      while (
        queue.current.length &&
        queue.current[0].time <= context.currentTime
      ) {
        setCurrentBeat(queue.current.shift()!.beat);
      }
      frame.current = requestAnimationFrame(draw);
    };
    frame.current = requestAnimationFrame(draw);
    setRunning(true);
  }, [schedule]);

  const toggle = useCallback(
    () => (running ? stop() : start()),
    [running, start, stop],
  );

  const tap = useCallback(() => {
    taps.current = [...taps.current, performance.now()].slice(-12);
    const tempo = tapTempo(taps.current);
    if (tempo) setBpm(tempo);
    setTapCount(taps.current.length);
  }, []);

  const changeBpm = (value: number) =>
    setBpm(Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(value))));

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLSelectElement
      )
        return;
      if (event.code === "Space") {
        event.preventDefault();
        toggle();
      } else if (event.key.toLowerCase() === "t") tap();
      else if (event.key === "ArrowUp") changeBpm(settings.current.bpm + 1);
      else if (event.key === "ArrowDown") changeBpm(settings.current.bpm - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, tap]);

  useEffect(
    () => () => {
      stop();
      audio.current?.close();
    },
    [stop],
  );

  return (
    <div className="space-y-5">
      <Panel>
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Slower"
              className="btn btn-circle btn-ghost"
              onClick={() => changeBpm(bpm - 1)}
            >
              <Minus className="size-5" />
            </button>
            <div className="text-center">
              <p className="font-mono text-6xl tabular-nums">{bpm}</p>
              <p className="text-sm text-muted">BPM · {tempoName(bpm)}</p>
            </div>
            <button
              type="button"
              aria-label="Faster"
              className="btn btn-circle btn-ghost"
              onClick={() => changeBpm(bpm + 1)}
            >
              <Plus className="size-5" />
            </button>
          </div>
          <input
            type="range"
            min={MIN_BPM}
            max={MAX_BPM}
            value={bpm}
            onChange={(event) => changeBpm(Number(event.target.value))}
            aria-label="Tempo"
            className="range range-primary range-sm w-full max-w-md"
          />
          <div className="flex gap-2" aria-hidden>
            {Array.from({ length: beats }, (_, i) => (
              <span
                key={i}
                className={`size-4 rounded-full transition-colors ${
                  i === currentBeat
                    ? i === 0 && accent
                      ? "bg-primary"
                      : "bg-base-content"
                    : "bg-base-300"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-primary btn-wide"
              onClick={toggle}
            >
              {running ? (
                <Pause className="size-4" />
              ) : (
                <Play className="size-4" />
              )}
              {running ? "Stop" : "Start"}
            </button>
            <button type="button" className="btn" onClick={tap}>
              Tap{tapCount > 1 ? ` (${Math.min(tapCount, 8)})` : ""}
            </button>
          </div>
        </div>
      </Panel>

      <Panel title="Options">
        <div className="flex flex-wrap items-end gap-5 text-sm">
          <label className="flex flex-col gap-1.5">
            <span className="text-muted">Beats per bar</span>
            <select
              value={beats}
              onChange={(event) => setBeats(Number(event.target.value))}
              className="select select-sm w-24"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-col gap-1.5">
            <span className="text-muted">Clicks per beat</span>
            <Segmented
              label="Clicks per beat"
              value={subdivision}
              onChange={setSubdivision}
              options={SUBDIVISIONS}
            />
          </div>
          <label className="flex items-center gap-2 pb-1">
            <input
              type="checkbox"
              checked={accent}
              onChange={(event) => setAccent(event.target.checked)}
              className="checkbox checkbox-sm checkbox-primary"
            />
            Accent the first beat
          </label>
          <label className="flex min-w-40 flex-1 flex-col gap-1.5">
            <span className="text-muted">Volume</span>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              className="range range-sm w-full"
            />
          </label>
        </div>
      </Panel>

      <p className="text-xs text-faint">
        Keyboard: Space starts and stops, T taps the tempo, ↑ and ↓ change it by
        one. Tapping averages your last taps; pause for two seconds to start
        over.
      </p>
    </div>
  );
}
