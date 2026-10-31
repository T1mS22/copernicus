// German public holidays per federal state, calculated rather than looked
// up: fixed dates plus those that depend on Easter. Dates are UTC midnight,
// like the rest of the date calculator.

export const STATES = [
  { code: "BW", name: "Baden-Württemberg" },
  { code: "BY", name: "Bavaria" },
  { code: "BE", name: "Berlin" },
  { code: "BB", name: "Brandenburg" },
  { code: "HB", name: "Bremen" },
  { code: "HH", name: "Hamburg" },
  { code: "HE", name: "Hesse" },
  { code: "MV", name: "Mecklenburg-Vorpommern" },
  { code: "NI", name: "Lower Saxony" },
  { code: "NW", name: "North Rhine-Westphalia" },
  { code: "RP", name: "Rhineland-Palatinate" },
  { code: "SL", name: "Saarland" },
  { code: "SN", name: "Saxony" },
  { code: "ST", name: "Saxony-Anhalt" },
  { code: "SH", name: "Schleswig-Holstein" },
  { code: "TH", name: "Thuringia" },
] as const;

export type StateCode = (typeof STATES)[number]["code"];
// "DE" means only the nine holidays every state shares.
export type HolidayRegion = StateCode | "DE";

export type Holiday = { date: Date; name: string; german: string };

// Anonymous Gregorian algorithm (Meeus/Jones/Butcher).
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

const utc = (year: number, month: number, day: number) =>
  new Date(Date.UTC(year, month - 1, day));
const plusDays = (date: Date, days: number) =>
  new Date(date.getTime() + days * 86_400_000);

type Rule = {
  name: string;
  german: string;
  date: (year: number, easter: Date) => Date;
  // Undefined means every state.
  states?: StateCode[];
  since?: number;
};

const RULES: Rule[] = [
  { name: "New Year's Day", german: "Neujahr", date: (y) => utc(y, 1, 1) },
  {
    name: "Epiphany",
    german: "Heilige Drei Könige",
    date: (y) => utc(y, 1, 6),
    states: ["BW", "BY", "ST"],
  },
  {
    name: "International Women's Day",
    german: "Internationaler Frauentag",
    date: (y) => utc(y, 3, 8),
    states: ["BE"],
    since: 2019,
  },
  {
    name: "International Women's Day",
    german: "Internationaler Frauentag",
    date: (y) => utc(y, 3, 8),
    states: ["MV"],
    since: 2023,
  },
  {
    name: "Good Friday",
    german: "Karfreitag",
    date: (_, e) => plusDays(e, -2),
  },
  {
    name: "Easter Monday",
    german: "Ostermontag",
    date: (_, e) => plusDays(e, 1),
  },
  { name: "Labour Day", german: "Tag der Arbeit", date: (y) => utc(y, 5, 1) },
  {
    name: "Ascension Day",
    german: "Christi Himmelfahrt",
    date: (_, e) => plusDays(e, 39),
  },
  {
    name: "Whit Monday",
    german: "Pfingstmontag",
    date: (_, e) => plusDays(e, 50),
  },
  {
    name: "Corpus Christi",
    german: "Fronleichnam",
    date: (_, e) => plusDays(e, 60),
    states: ["BW", "BY", "HE", "NW", "RP", "SL"],
  },
  {
    name: "Assumption Day",
    german: "Mariä Himmelfahrt",
    date: (y) => utc(y, 8, 15),
    states: ["SL"],
  },
  {
    name: "World Children's Day",
    german: "Weltkindertag",
    date: (y) => utc(y, 9, 20),
    states: ["TH"],
    since: 2019,
  },
  {
    name: "German Unity Day",
    german: "Tag der Deutschen Einheit",
    date: (y) => utc(y, 10, 3),
  },
  {
    name: "Reformation Day",
    german: "Reformationstag",
    date: (y) => utc(y, 10, 31),
    states: ["BB", "HB", "HH", "MV", "NI", "SN", "ST", "SH", "TH"],
  },
  {
    name: "All Saints' Day",
    german: "Allerheiligen",
    date: (y) => utc(y, 11, 1),
    states: ["BW", "BY", "NW", "RP", "SL"],
  },
  {
    name: "Day of Repentance and Prayer",
    german: "Buß- und Bettag",
    // The Wednesday before 23 November.
    date: (y) => {
      const nov23 = utc(y, 11, 23);
      return plusDays(nov23, -((nov23.getUTCDay() + 4) % 7 || 7));
    },
    states: ["SN"],
  },
  {
    name: "Christmas Day",
    german: "1. Weihnachtstag",
    date: (y) => utc(y, 12, 25),
  },
  {
    name: "Boxing Day",
    german: "2. Weihnachtstag",
    date: (y) => utc(y, 12, 26),
  },
];

// Statewide holidays only. Some apply in parts of a state as well
// (Corpus Christi in parts of Saxony and Thuringia, Assumption Day in
// Catholic parts of Bavaria, Augsburg's Peace Festival).
export function holidays(year: number, region: HolidayRegion): Holiday[] {
  const easter = easterSunday(year);
  return RULES.filter(
    (rule) =>
      (rule.since === undefined || year >= rule.since) &&
      (rule.states === undefined ||
        (region !== "DE" && rule.states.includes(region))),
  )
    .map((rule) => ({
      date: rule.date(year, easter),
      name: rule.name,
      german: rule.german,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function holidaysBetween(
  start: Date,
  end: Date,
  region: HolidayRegion,
): Holiday[] {
  const [from, to] = start <= end ? [start, end] : [end, start];
  const result: Holiday[] = [];
  for (let year = from.getUTCFullYear(); year <= to.getUTCFullYear(); year++) {
    result.push(
      ...holidays(year, region).filter((h) => h.date >= from && h.date < to),
    );
  }
  return result;
}
