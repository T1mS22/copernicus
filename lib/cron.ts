type FieldSpec = {
  name: string;
  min: number;
  max: number;
  names?: string[];
};

const SECOND: FieldSpec = { name: "second", min: 0, max: 59 };
const MINUTE: FieldSpec = { name: "minute", min: 0, max: 59 };
const HOUR: FieldSpec = { name: "hour", min: 0, max: 23 };
const DAY: FieldSpec = { name: "day of month", min: 1, max: 31 };
const MONTH: FieldSpec = {
  name: "month",
  min: 1,
  max: 12,
  names: [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ],
};
// 0 and 7 are both Sunday.
const WEEKDAY: FieldSpec = {
  name: "day of week",
  min: 0,
  max: 7,
  names: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
};

export const CRON_MACROS: Record<string, string> = {
  "@yearly": "0 0 1 1 *",
  "@annually": "0 0 1 1 *",
  "@monthly": "0 0 1 * *",
  "@weekly": "0 0 * * 0",
  "@daily": "0 0 * * *",
  "@midnight": "0 0 * * *",
  "@hourly": "0 * * * *",
};

export type Cron = {
  seconds: Set<number>;
  minutes: Set<number>;
  hours: Set<number>;
  days: Set<number>;
  months: Set<number>;
  weekdays: Set<number>;
  hasSeconds: boolean;
  dayRestricted: boolean;
  weekdayRestricted: boolean;
};

function parseValue(text: string, spec: FieldSpec): number {
  const nameIndex = spec.names?.indexOf(text.toUpperCase()) ?? -1;
  const value =
    nameIndex >= 0
      ? nameIndex + (spec === MONTH ? 1 : 0)
      : /^\d+$/.test(text)
        ? Number(text)
        : NaN;
  if (Number.isNaN(value) || value < spec.min || value > spec.max) {
    throw new Error(
      `“${text}” isn't a valid ${spec.name} (${spec.min}–${spec.max}).`,
    );
  }
  return value;
}

function parseField(text: string, spec: FieldSpec): Set<number> {
  if (/[LW#]/i.test(text.replace(/[A-Z]{3}/gi, ""))) {
    throw new Error(
      "L, W and # are Quartz-specific and aren't supported here.",
    );
  }
  const values = new Set<number>();
  for (const part of text.split(",")) {
    const [range, stepText] = part.split("/");
    const step = stepText === undefined ? 1 : Number(stepText);
    if (!Number.isInteger(step) || step < 1) {
      throw new Error(`“${part}” has an invalid step.`);
    }
    let from: number;
    let to: number;
    if (range === "*" || range === "?") {
      from = spec.min;
      to = spec.max;
    } else if (range.includes("-")) {
      const [a, b] = range.split("-");
      from = parseValue(a, spec);
      to = parseValue(b, spec);
      if (from > to) throw new Error(`“${range}” goes backwards.`);
    } else {
      from = parseValue(range, spec);
      // "5/15" means from 5 to the end in steps of 15.
      to = stepText === undefined ? from : spec.max;
    }
    for (let value = from; value <= to; value += step) values.add(value);
  }
  if (spec === WEEKDAY && values.has(7)) {
    values.delete(7);
    values.add(0);
  }
  return values;
}

// Standard five-field cron, or six fields with seconds first (as used by
// Azure Functions and Spring).
export function parseCron(expression: string): Cron {
  const trimmed = expression.trim();
  if (trimmed.toLowerCase() === "@reboot") {
    throw new Error("@reboot runs once at startup and has no schedule.");
  }
  const expanded = CRON_MACROS[trimmed.toLowerCase()] ?? trimmed;
  const fields = expanded.split(/\s+/);
  if (fields.length !== 5 && fields.length !== 6) {
    throw new Error(
      `Expected 5 fields (or 6 with seconds), found ${fields.length}.`,
    );
  }
  const hasSeconds = fields.length === 6;
  const [second, minute, hour, day, month, weekday] = hasSeconds
    ? fields
    : ["0", ...fields];
  const isAll = (field: string) => field === "*" || field === "?";

  return {
    seconds: parseField(second, SECOND),
    minutes: parseField(minute, MINUTE),
    hours: parseField(hour, HOUR),
    days: parseField(day, DAY),
    months: parseField(month, MONTH),
    weekdays: parseField(weekday, WEEKDAY),
    hasSeconds,
    dayRestricted: !isAll(day),
    weekdayRestricted: !isAll(weekday),
  };
}

function dayMatches(cron: Cron, date: Date): boolean {
  const day = cron.days.has(date.getDate());
  const weekday = cron.weekdays.has(date.getDay());
  // Classic cron rule: if both fields are restricted, either may match.
  if (cron.dayRestricted && cron.weekdayRestricted) return day || weekday;
  if (cron.dayRestricted) return day;
  if (cron.weekdayRestricted) return weekday;
  return true;
}

// Next run times in the local time zone, jumping over whole months, days
// and hours that can't match.
export function nextRuns(cron: Cron, from: Date, count: number): Date[] {
  const runs: Date[] = [];
  const date = new Date(from.getTime());
  date.setMilliseconds(0);
  date.setSeconds(date.getSeconds() + 1);
  const limit = from.getFullYear() + 8;

  while (runs.length < count && date.getFullYear() <= limit) {
    if (!cron.months.has(date.getMonth() + 1)) {
      date.setMonth(date.getMonth() + 1, 1);
      date.setHours(0, 0, 0);
    } else if (!dayMatches(cron, date)) {
      date.setDate(date.getDate() + 1);
      date.setHours(0, 0, 0);
    } else if (!cron.hours.has(date.getHours())) {
      date.setHours(date.getHours() + 1, 0, 0);
    } else if (!cron.minutes.has(date.getMinutes())) {
      date.setMinutes(date.getMinutes() + 1, 0);
    } else if (!cron.seconds.has(date.getSeconds())) {
      date.setSeconds(date.getSeconds() + 1);
    } else {
      runs.push(new Date(date.getTime()));
      date.setSeconds(date.getSeconds() + 1);
    }
  }
  return runs;
}
