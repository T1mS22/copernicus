// Durations as seconds. ISO 8601 years and months have no fixed length, so
// they're converted with Gregorian averages and flagged as approximate.

const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;
const WEEK = 7 * DAY;
const MONTH = 2_629_746; // 30.436875 days
const YEAR = 31_556_952; // 365.2425 days

const ISO =
  /^(-)?P(?:(\d+(?:[.,]\d+)?)Y)?(?:(\d+(?:[.,]\d+)?)M)?(?:(\d+(?:[.,]\d+)?)W)?(?:(\d+(?:[.,]\d+)?)D)?(?:T(?:(\d+(?:[.,]\d+)?)H)?(?:(\d+(?:[.,]\d+)?)M)?(?:(\d+(?:[.,]\d+)?)S)?)?$/i;

export type ParsedDuration = {
  seconds: number;
  approximate: boolean;
  source: "ISO 8601" | ".NET TimeSpan" | "Text" | "Seconds";
};

const num = (value?: string) => (value ? Number(value.replace(",", ".")) : 0);

export function parseIsoDuration(text: string): ParsedDuration | null {
  const value = text.trim();
  const match = ISO.exec(value);
  // "P" and "PT" alone aren't valid, and T needs at least one time part.
  if (!match || !match.slice(2).some(Boolean) || /T$/i.test(value)) return null;
  const [, sign, y, mo, w, d, h, mi, s] = match;
  const seconds =
    num(y) * YEAR +
    num(mo) * MONTH +
    num(w) * WEEK +
    num(d) * DAY +
    num(h) * HOUR +
    num(mi) * MINUTE +
    num(s);
  return {
    seconds: sign ? -seconds : seconds,
    approximate: Boolean(y || mo),
    source: "ISO 8601",
  };
}

// .NET TimeSpan "c" format: [-][d.]hh:mm[:ss[.fffffff]]
export function parseTimeSpan(text: string): ParsedDuration | null {
  const match =
    /^(-)?(?:(\d+)\.)?(\d{1,2}):(\d{2})(?::(\d{2})(?:\.(\d{1,7}))?)?$/.exec(
      text.trim(),
    );
  if (!match) return null;
  const [, sign, d, h, m, s, fraction] = match;
  if (Number(h) > 23 || Number(m) > 59 || Number(s ?? 0) > 59) return null;
  const seconds =
    num(d) * DAY +
    num(h) * HOUR +
    num(m) * MINUTE +
    num(s) +
    (fraction ? Number(`0.${fraction}`) : 0);
  return {
    seconds: sign ? -seconds : seconds,
    approximate: false,
    source: ".NET TimeSpan",
  };
}

const UNITS: [RegExp, number][] = [
  [/^(ms|msec|millis(econds?)?)$/, 0.001],
  [/^(s|sec|secs|seconds?)$/, 1],
  [/^(m|min|mins|minutes?)$/, MINUTE],
  [/^(h|hr|hrs|hours?)$/, HOUR],
  [/^(d|days?)$/, DAY],
  [/^(w|wk|weeks?)$/, WEEK],
];

// "1h 30m", "90 min", "1.5 hours", "2 days 4 hours"
export function parseHumanDuration(text: string): ParsedDuration | null {
  const value = text.trim().toLowerCase();
  const pattern = /(\d+(?:[.,]\d+)?)\s*([a-z]+)/g;
  let total = 0;
  let consumed = "";
  for (const match of value.matchAll(pattern)) {
    const unit = UNITS.find(([regex]) => regex.test(match[2]));
    if (!unit) return null;
    total += num(match[1]) * unit[1];
    consumed += match[0];
  }
  if (
    !consumed ||
    value.replace(/[\s,]|and/g, "") !== consumed.replace(/\s/g, "")
  )
    return null;
  return { seconds: total, approximate: false, source: "Text" };
}

export function parseAnyDuration(text: string): ParsedDuration | null {
  const value = text.trim();
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return { seconds: Number(value), approximate: false, source: "Seconds" };
  }
  return (
    parseIsoDuration(value) ?? parseTimeSpan(value) ?? parseHumanDuration(value)
  );
}

function split(seconds: number) {
  let rest = Math.abs(seconds);
  const days = Math.floor(rest / DAY);
  rest -= days * DAY;
  const hours = Math.floor(rest / HOUR);
  rest -= hours * HOUR;
  const minutes = Math.floor(rest / MINUTE);
  rest -= minutes * MINUTE;
  return { days, hours, minutes, seconds: Math.round(rest * 1e7) / 1e7 };
}

// Days, hours, minutes and seconds only, so the result is exact.
export function formatIsoDuration(seconds: number): string {
  const p = split(seconds);
  const date = p.days ? `${p.days}D` : "";
  const time = `${p.hours ? `${p.hours}H` : ""}${p.minutes ? `${p.minutes}M` : ""}${p.seconds ? `${p.seconds}S` : ""}`;
  if (!date && !time) return "PT0S";
  return `${seconds < 0 ? "-" : ""}P${date}${time ? `T${time}` : ""}`;
}

export function formatTimeSpan(seconds: number): string {
  const p = split(seconds);
  const pad = (n: number) => String(n).padStart(2, "0");
  const whole = Math.floor(p.seconds);
  const fraction = Math.round((p.seconds - whole) * 1e7);
  return (
    (seconds < 0 ? "-" : "") +
    (p.days ? `${p.days}.` : "") +
    `${pad(p.hours)}:${pad(p.minutes)}:${pad(whole)}` +
    (fraction ? `.${String(fraction).padStart(7, "0")}` : "")
  );
}

export function formatHumanDuration(seconds: number): string {
  if (seconds === 0) return "0 seconds";
  const p = split(seconds);
  const parts = [
    [p.days, "day"],
    [p.hours, "hour"],
    [p.minutes, "minute"],
    [p.seconds, "second"],
  ]
    .filter(([value]) => value)
    .map(([value, unit]) => `${value} ${unit}${value === 1 ? "" : "s"}`);
  return (seconds < 0 ? "minus " : "") + parts.join(", ");
}

// Short form for results like transfer times: "2 h 13 min", "45 s".
export function formatShortDuration(seconds: number): string {
  if (!Number.isFinite(seconds)) return "—";
  if (seconds < 1) return `${Math.round(seconds * 1000)} ms`;
  const p = split(Math.round(seconds));
  const parts: string[] = [];
  if (p.days) parts.push(`${p.days} d`);
  if (p.hours) parts.push(`${p.hours} h`);
  if (p.minutes && !p.days) parts.push(`${p.minutes} min`);
  if (p.seconds && !p.days && !p.hours) parts.push(`${p.seconds} s`);
  return parts.join(" ");
}
