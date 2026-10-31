import assert from "node:assert/strict";
import { test } from "node:test";
import { parseOctal, parseSymbolic, toOctal, toSymbolic } from "./chmod.ts";
import {
  contrastRatio,
  parseColor,
  toHex,
  toHslString,
  toOklchString,
  toRgbString,
  wcagLevels,
} from "./color.ts";
import { nextRuns, parseCron } from "./cron.ts";
import {
  addToDate,
  businessDays,
  calendarDifference,
  dayOfYear,
  daysBetween,
  isoWeek,
  parseIsoDate,
} from "./datecalc.ts";
import { decodeKey, hmac, signatureMatches } from "./hmac.ts";
import {
  detectBase,
  formatInBase,
  parseInBase,
  twosComplement,
} from "./numberbase.ts";
import { formatOffset, zonedTimeToUtc, zoneOffsetMinutes } from "./timezone.ts";
import { generateUlids, isUlid, ulidTime, ulidToUuid } from "./ulid.ts";

const date = (text: string) => parseIsoDate(text)!;

test("cron parsing", () => {
  const cron = parseCron("*/15 9-17 * * MON-FRI");
  assert.deepEqual([...cron.minutes], [0, 15, 30, 45]);
  assert.deepEqual([...cron.hours].length, 9);
  assert.deepEqual([...cron.weekdays], [1, 2, 3, 4, 5]);
  assert.equal(cron.hasSeconds, false);

  const azure = parseCron("0 30 2 * * 0,7");
  assert.equal(azure.hasSeconds, true);
  assert.deepEqual([...azure.weekdays], [0]);
  assert.deepEqual([...parseCron("5/20 * * * *").minutes], [5, 25, 45]);
  assert.deepEqual([...parseCron("@weekly").weekdays], [0]);

  assert.throws(() => parseCron("* * *"), /Expected 5 fields/);
  assert.throws(() => parseCron("60 * * * *"), /valid minute/);
  assert.throws(() => parseCron("0 0 L * *"), /Quartz/);
  assert.throws(() => parseCron("@reboot"), /startup/);
  assert.throws(() => parseCron("0 0 * * 5-1"), /backwards/);
});

test("cron next runs", () => {
  const from = new Date(2026, 9, 30, 10, 7, 30); // Fri 30 Oct 2026, local time
  const runs = nextRuns(parseCron("0 9 * * MON"), from, 2);
  assert.deepEqual(
    runs.map((d) => [
      d.getFullYear(),
      d.getMonth() + 1,
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
    ]),
    [
      [2026, 11, 2, 9, 0],
      [2026, 11, 9, 9, 0],
    ],
  );
  const everyTen = nextRuns(parseCron("*/10 * * * * *"), from, 2);
  assert.deepEqual(
    everyTen.map((d) => d.getSeconds()),
    [40, 50],
  );
  // Day of month OR weekday when both are restricted: 1st or any Sunday.
  const either = nextRuns(parseCron("0 0 1 * 0"), from, 2);
  assert.deepEqual(
    either.map((d) => d.getDate()),
    [1, 8],
  );
  assert.equal(nextRuns(parseCron("0 0 30 2 *"), from, 1).length, 0);
});

test("time zones", () => {
  const winter = new Date(Date.UTC(2026, 0, 15, 12));
  const summer = new Date(Date.UTC(2026, 6, 15, 12));
  assert.equal(zoneOffsetMinutes(winter, "Europe/Berlin"), 60);
  assert.equal(zoneOffsetMinutes(summer, "Europe/Berlin"), 120);
  assert.equal(zoneOffsetMinutes(winter, "Asia/Kolkata"), 330);
  assert.equal(zoneOffsetMinutes(summer, "America/New_York"), -240);
  assert.equal(formatOffset(330), "UTC+05:30");
  assert.equal(formatOffset(-240), "UTC−04:00");

  const wall = { year: 2026, month: 10, day: 30, hour: 9, minute: 0 };
  assert.equal(
    zonedTimeToUtc(wall, "Europe/Berlin").toISOString(),
    "2026-10-30T08:00:00.000Z",
  );
  assert.equal(
    zonedTimeToUtc(wall, "America/Los_Angeles").toISOString(),
    "2026-10-30T16:00:00.000Z",
  );
  // Right after the switch back to winter time in Berlin (25 Oct 2026).
  assert.equal(
    zonedTimeToUtc(
      { year: 2026, month: 10, day: 25, hour: 4, minute: 0 },
      "Europe/Berlin",
    ).toISOString(),
    "2026-10-25T03:00:00.000Z",
  );
});

test("date differences and ISO weeks", () => {
  assert.equal(parseIsoDate("2026-02-30"), null);
  assert.equal(daysBetween(date("2026-01-01"), date("2026-12-31")), 364);
  assert.deepEqual(calendarDifference(date("2024-01-31"), date("2026-03-01")), {
    years: 2,
    months: 1,
    days: 1,
  });
  assert.deepEqual(calendarDifference(date("2026-05-10"), date("2026-05-10")), {
    years: 0,
    months: 0,
    days: 0,
  });
  // Mon 26 Oct to Mon 2 Nov 2026: five working days.
  assert.equal(businessDays(date("2026-10-26"), date("2026-11-02")), 5);
  assert.equal(businessDays(date("2026-10-31"), date("2026-11-01")), 0);
  assert.equal(
    addToDate(date("2026-01-31"), 1, "months").toISOString().slice(0, 10),
    "2026-02-28",
  );
  assert.equal(
    addToDate(date("2024-02-29"), 1, "years").toISOString().slice(0, 10),
    "2025-02-28",
  );
  assert.equal(
    addToDate(date("2026-10-31"), -10, "days").toISOString().slice(0, 10),
    "2026-10-21",
  );
  assert.deepEqual(isoWeek(date("2026-10-31")), { year: 2026, week: 44 });
  assert.deepEqual(isoWeek(date("2027-01-01")), { year: 2026, week: 53 });
  assert.deepEqual(isoWeek(date("2024-12-30")), { year: 2025, week: 1 });
  assert.equal(dayOfYear(date("2026-12-31")), 365);
});

test("color parsing and conversion", () => {
  const red = parseColor("#f00")!;
  assert.deepEqual(red, { r: 255, g: 0, b: 0, a: 1 });
  assert.equal(toRgbString(red), "rgb(255 0 0)");
  assert.equal(toHslString(red), "hsl(0 100% 50%)");
  assert.equal(toOklchString(red), "oklch(62.8% 0.2577 29.2)");
  assert.equal(toHex(parseColor("rgb(255, 122, 0)")!), "#ff7a00");
  assert.equal(toHex(parseColor("hsl(28.7 100% 50%)")!), "#ff7a00");
  assert.equal(toHex(parseColor("oklch(62.8% 0.2577 29.23)")!), "#ff0000");
  assert.equal(toHex(parseColor("#ff7a0080")!), "#ff7a0080");
  assert.equal(parseColor("rgb(0 0 0 / 50%)")!.a, 0.5);
  assert.equal(parseColor("nope"), null);
});

test("WCAG contrast", () => {
  const black = parseColor("#000")!;
  const white = parseColor("#fff")!;
  assert.equal(contrastRatio(black, white), 21);
  const ratio = contrastRatio(parseColor("#767676")!, white);
  assert.ok(ratio > 4.5 && ratio < 4.6);
  assert.deepEqual(wcagLevels(ratio), {
    aaNormal: true,
    aaLarge: true,
    aaaNormal: false,
    aaaLarge: true,
  });
});

test("number bases", () => {
  assert.equal(parseInBase("0xFF", 16), 255n);
  assert.equal(parseInBase("1111_0000", 2), 240n);
  assert.equal(parseInBase("-777", 8), -511n);
  assert.equal(parseInBase("12", 2), null);
  assert.equal(parseInBase("zz", 36), 1295n);
  assert.equal(detectBase("0b101"), 2);
  assert.equal(detectBase("-0x1f"), 16);
  assert.equal(formatInBase(255n, 2, 4), "1111 1111");
  assert.equal(formatInBase(5n, 2, 4), "0101");
  assert.equal(formatInBase(48879n, 16), "BEEF");
  assert.equal(formatInBase(2n ** 70n, 10), "1180591620717411303424");
  assert.equal(twosComplement(-1n, 8), 255n);
  assert.equal(twosComplement(-129n, 8), null);
  assert.equal(twosComplement(5n, 8), null);
});

test("HMAC matches RFC 4231", async () => {
  const result = await hmac(
    "SHA-256",
    decodeKey("Jefe", "text"),
    "what do ya want for nothing?",
  );
  assert.equal(
    result.hex,
    "5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843",
  );
  assert.ok(signatureMatches(`sha256=${result.hex}`, result));
  assert.ok(signatureMatches(result.base64, result));
  assert.ok(!signatureMatches("abc", result));
  assert.deepEqual(decodeKey("0a0B", "hex"), new Uint8Array([10, 11]));
  assert.throws(() => decodeKey("abc", "hex"), /even number/);
  const empty = await hmac("SHA-256", new Uint8Array(0), "");
  assert.equal(
    empty.hex,
    "b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad",
  );
});

test("ULIDs", () => {
  const time = Date.UTC(2026, 9, 31, 12);
  const ids = generateUlids(50, time);
  assert.ok(ids.every(isUlid));
  assert.deepEqual(ids, [...ids].sort());
  assert.equal(new Set(ids).size, 50);
  assert.equal(ulidTime(ids[0])?.getTime(), time);
  // Example from the ULID spec.
  assert.equal(
    ulidTime("01ARYZ6S41TSV4RRFFQ69G5FAV")?.getTime(),
    1469918176385,
  );
  const uuid = ulidToUuid(ids[0])!;
  assert.match(
    uuid,
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
  );
  assert.equal(
    uuid.replace(/-/g, "").slice(0, 12),
    time.toString(16).padStart(12, "0"),
  );
  assert.equal(isUlid("8ZZZZZZZZZZZZZZZZZZZZZZZZZ"), false);
});

test("chmod", () => {
  const p = parseOctal("755")!;
  assert.equal(toSymbolic(p), "rwxr-xr-x");
  assert.equal(toOctal(parseSymbolic("-rw-r--r--")!), "644");
  assert.equal(toSymbolic(parseOctal("4755")!), "rwsr-xr-x");
  assert.equal(toSymbolic(parseOctal("1777")!), "rwxrwxrwt");
  assert.equal(toSymbolic(parseOctal("2640")!), "rw-r-S---");
  assert.equal(toOctal(parseSymbolic("drwxrwsr-T")!), "3774");
  assert.equal(parseOctal("800"), null);
  assert.equal(parseSymbolic("rwxrwxrw"), null);
});
