export const MIN_BPM = 30;
export const MAX_BPM = 300;

// Taps more than two seconds apart start a new measurement.
const TAP_RESET_MS = 2000;

// Average tempo of the most recent run of taps (timestamps in ms).
export function tapTempo(times: number[]): number | null {
  const recent: number[] = [];
  for (let i = times.length - 1; i >= 0; i--) {
    if (recent.length && recent[0] - times[i] > TAP_RESET_MS) break;
    recent.unshift(times[i]);
  }
  const taps = recent.slice(-8);
  if (taps.length < 2) return null;
  const interval = (taps[taps.length - 1] - taps[0]) / (taps.length - 1);
  return Math.round(Math.min(MAX_BPM, Math.max(MIN_BPM, 60000 / interval)));
}

const TEMPO_NAMES: [number, string][] = [
  [40, "Grave"],
  [55, "Largo"],
  [66, "Larghetto"],
  [76, "Adagio"],
  [108, "Andante"],
  [120, "Moderato"],
  [156, "Allegro"],
  [176, "Vivace"],
  [200, "Presto"],
];

export function tempoName(bpm: number): string {
  return TEMPO_NAMES.find(([limit]) => bpm < limit)?.[1] ?? "Prestissimo";
}
