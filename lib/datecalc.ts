// Calendar dates are handled as UTC midnight, so daylight saving time can't
// add or remove an hour from a day count.

const DAY = 86_400_000;

export function parseIsoDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCMonth() === month - 1 ? date : null;
}

export function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function todayIso(now = new Date()): string {
  return formatIsoDate(
    new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())),
  );
}

export function daysBetween(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / DAY);
}

function addMonthsClamped(date: Date, months: number): Date {
  const result = new Date(date.getTime());
  const day = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  // 31 January + 1 month is 28/29 February, not 3 March.
  const lastDay = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0),
  ).getUTCDate();
  result.setUTCDate(Math.min(day, lastDay));
  return result;
}

// Calendar difference as years, months and days (start ≤ end).
export function calendarDifference(start: Date, end: Date) {
  const [from, to] = start <= end ? [start, end] : [end, start];
  let months =
    (to.getUTCFullYear() - from.getUTCFullYear()) * 12 +
    (to.getUTCMonth() - from.getUTCMonth());
  if (addMonthsClamped(from, months) > to) months--;
  const days = daysBetween(addMonthsClamped(from, months), to);
  return { years: Math.floor(months / 12), months: months % 12, days };
}

// Monday to Friday from start up to, but not including, end. Public
// holidays aren't taken into account.
export function businessDays(start: Date, end: Date): number {
  const [from, to] = start <= end ? [start, end] : [end, start];
  const total = daysBetween(from, to);
  let count = Math.floor(total / 7) * 5;
  const startDay = from.getUTCDay();
  for (let i = 0; i < total % 7; i++) {
    const day = (startDay + i) % 7;
    if (day !== 0 && day !== 6) count++;
  }
  return start <= end ? count : -count;
}

export type DateUnit = "days" | "weeks" | "months" | "years";

export function addToDate(date: Date, amount: number, unit: DateUnit): Date {
  switch (unit) {
    case "days":
      return new Date(date.getTime() + amount * DAY);
    case "weeks":
      return new Date(date.getTime() + amount * 7 * DAY);
    case "months":
      return addMonthsClamped(date, amount);
    case "years":
      return addMonthsClamped(date, amount * 12);
  }
}

// ISO 8601 week: weeks start on Monday and week 1 contains the year's first
// Thursday, so early January can belong to the previous year's last week.
export function isoWeek(date: Date): { year: number; week: number } {
  const thursday = new Date(date.getTime());
  thursday.setUTCDate(date.getUTCDate() + 3 - ((date.getUTCDay() + 6) % 7));
  const year = thursday.getUTCFullYear();
  const firstThursday = new Date(Date.UTC(year, 0, 4));
  const week =
    1 +
    Math.round(
      (daysBetween(firstThursday, thursday) -
        3 +
        ((firstThursday.getUTCDay() + 6) % 7)) /
        7,
    );
  return { year, week };
}

export function dayOfYear(date: Date): number {
  return daysBetween(new Date(Date.UTC(date.getUTCFullYear(), 0, 1)), date) + 1;
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
