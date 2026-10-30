export type TimestampUnit = "s" | "ms" | "us" | "ns";

export const UNIT_LABELS: Record<TimestampUnit, string> = {
  s: "Seconds",
  ms: "Milliseconds",
  us: "Microseconds",
  ns: "Nanoseconds",
};

const UNIT_DIVISOR: Record<TimestampUnit, number> = {
  s: 1e-3,
  ms: 1,
  us: 1e3,
  ns: 1e6,
};

// Guesses the unit from the number of integer digits. Seconds stay at 11 or
// fewer digits until the year 5138, so the ranges don't overlap in practice.
export function detectUnit(input: string): TimestampUnit {
  const digits = input.replace(/^-/, "").split(".")[0].length;
  if (digits <= 11) return "s";
  if (digits <= 14) return "ms";
  if (digits <= 17) return "us";
  return "ns";
}

export function parseTimestamp(
  input: string,
  unit: TimestampUnit | "auto",
): { date: Date; unit: TimestampUnit } | null {
  const text = input.trim().replace(/[\s_,]/g, "");
  if (!/^-?\d+(\.\d+)?$/.test(text)) return null;
  const resolved = unit === "auto" ? detectUnit(text) : unit;
  const date = new Date(Number(text) / UNIT_DIVISOR[resolved]);
  return Number.isNaN(date.getTime()) ? null : { date, unit: resolved };
}

// Accepts ISO 8601 and the common "2026-10-30 14:30" form (read as local
// time, like the browser's datetime input).
export function parseDate(input: string): Date | null {
  const text = input.trim();
  if (!text) return null;
  const date = new Date(
    /^\d{4}-\d{2}-\d{2} \d/.test(text) ? text.replace(" ", "T") : text,
  );
  return Number.isNaN(date.getTime()) ? null : date;
}

// Value for <input type="datetime-local">, which has no time zone.
export function toLocalInputValue(date: Date): string {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 19);
}

const RELATIVE_STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_556_952],
  ["month", 2_629_746],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
  ["second", 1],
];

export function relativeTime(date: Date, now = Date.now()): string {
  const seconds = (date.getTime() - now) / 1000;
  const format = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, size] of RELATIVE_STEPS) {
    if (Math.abs(seconds) >= size || unit === "second") {
      return format.format(Math.round(seconds / size), unit);
    }
  }
  return format.format(0, "second");
}
