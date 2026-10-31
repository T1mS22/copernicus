export function timeZones(): string[] {
  const zones = Intl.supportedValuesOf("timeZone");
  return zones.includes("UTC") ? zones : ["UTC", ...zones];
}

export function localTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

const partsFormatters = new Map<string, Intl.DateTimeFormat>();

function wallClock(date: Date, timeZone: string) {
  let formatter = partsFormatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    partsFormatters.set(timeZone, formatter);
  }
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

// Offset from UTC in minutes at that instant (positive east of Greenwich).
export function zoneOffsetMinutes(date: Date, timeZone: string): number {
  const c = wallClock(date, timeZone);
  const asUtc = Date.UTC(
    c.year,
    c.month - 1,
    c.day,
    c.hour,
    c.minute,
    c.second,
  );
  return Math.round((asUtc - Math.floor(date.getTime() / 1000) * 1000) / 60000);
}

export type WallTime = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

// The instant at which a zone's clocks show the given wall time. Uses the
// offset at the guessed instant, then corrects once for DST changes.
export function zonedTimeToUtc(wall: WallTime, timeZone: string): Date {
  const guess = Date.UTC(
    wall.year,
    wall.month - 1,
    wall.day,
    wall.hour,
    wall.minute,
  );
  const first = zoneOffsetMinutes(new Date(guess), timeZone);
  let instant = guess - first * 60000;
  const second = zoneOffsetMinutes(new Date(instant), timeZone);
  if (second !== first) instant = guess - second * 60000;
  return new Date(instant);
}

export function parseWallTime(value: string): WallTime | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value);
  if (!match) return null;
  const [year, month, day, hour, minute] = match.slice(1).map(Number);
  return { year, month, day, hour, minute };
}

export function formatOffset(minutes: number): string {
  const sign = minutes < 0 ? "−" : "+";
  const abs = Math.abs(minutes);
  const hours = String(Math.floor(abs / 60)).padStart(2, "0");
  const rest = String(abs % 60).padStart(2, "0");
  return `UTC${sign}${hours}:${rest}`;
}

// Calendar days between the dates shown in two zones (-1, 0 or +1).
export function dayShift(date: Date, from: string, to: string): number {
  const a = wallClock(date, from);
  const b = wallClock(date, to);
  return Math.round(
    (Date.UTC(b.year, b.month - 1, b.day) -
      Date.UTC(a.year, a.month - 1, a.day)) /
      86_400_000,
  );
}

export function formatInZone(date: Date, timeZone: string) {
  return {
    time: date.toLocaleTimeString("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
    }),
    date: date.toLocaleDateString("en-GB", {
      timeZone,
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    offset: formatOffset(zoneOffsetMinutes(date, timeZone)),
  };
}
