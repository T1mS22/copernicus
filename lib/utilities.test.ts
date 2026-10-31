import assert from "node:assert/strict";
import { test } from "node:test";
import { parseConnectionString } from "./connectionstring.ts";
import {
  formatHumanDuration,
  formatIsoDuration,
  formatShortDuration,
  formatTimeSpan,
  parseAnyDuration,
  parseIsoDuration,
  parseTimeSpan,
} from "./duration.ts";
import { readExif } from "./exif.ts";
import { easterSunday, holidays, holidaysBetween } from "./holidays.ts";
import { buildGermanIban, checkIban } from "./iban.ts";
import { portAnchor, searchPorts, PORTS } from "./ports.ts";
import {
  requiredBitsPerSecond,
  transferSeconds,
  formatBitRate,
} from "./transfer.ts";
import { cleanText, inspect, mixedScriptWords } from "./unicode.ts";

const iso = (date: Date) => date.toISOString().slice(0, 10);

test("ISO 8601 durations", () => {
  assert.equal(parseIsoDuration("PT1H30M")?.seconds, 5400);
  assert.equal(parseIsoDuration("P1DT12H")?.seconds, 129600);
  assert.equal(parseIsoDuration("P2W")?.seconds, 1209600);
  assert.equal(parseIsoDuration("PT0.5S")?.seconds, 0.5);
  assert.equal(parseIsoDuration("-PT5M")?.seconds, -300);
  assert.equal(parseIsoDuration("P1M")?.approximate, true);
  for (const bad of ["P", "PT", "P1DT", "1H", "PT1H30"])
    assert.equal(parseIsoDuration(bad), null, bad);
  assert.equal(formatIsoDuration(5400), "PT1H30M");
  assert.equal(formatIsoDuration(129600), "P1DT12H");
  assert.equal(formatIsoDuration(0), "PT0S");
  assert.equal(formatIsoDuration(86400), "P1D");
  assert.equal(formatIsoDuration(90.25), "PT1M30.25S");
});

test(".NET TimeSpan and text durations", () => {
  assert.equal(parseTimeSpan("01:30:00")?.seconds, 5400);
  assert.equal(parseTimeSpan("1.02:03:04.5")?.seconds, 93784.5);
  assert.equal(parseTimeSpan("00:61:00"), null);
  assert.equal(formatTimeSpan(5400), "01:30:00");
  assert.equal(formatTimeSpan(93784.5), "1.02:03:04.5000000");
  assert.equal(formatTimeSpan(-30), "-00:00:30");
  assert.equal(parseAnyDuration("1h 30m")?.seconds, 5400);
  assert.equal(parseAnyDuration("90 min")?.seconds, 5400);
  assert.equal(parseAnyDuration("1.5 hours")?.seconds, 5400);
  assert.equal(parseAnyDuration("2 days and 4 hours")?.seconds, 187200);
  assert.equal(parseAnyDuration("3600")?.source, "Seconds");
  assert.equal(parseAnyDuration("1 fortnight"), null);
  assert.equal(
    formatHumanDuration(93784),
    "1 day, 2 hours, 3 minutes, 4 seconds",
  );
  assert.equal(formatShortDuration(8000), "2 h 13 min");
  assert.equal(formatShortDuration(45), "45 s");
});

test("transfer time", () => {
  // 50 GB at 100 Mbit/s without overhead: 4000 s.
  assert.equal(transferSeconds(50e9, 100e6, 0), 4000);
  assert.equal(Math.round(transferSeconds(50e9, 100e6, 20)), 5000);
  assert.equal(requiredBitsPerSecond(50e9, 4000, 0), 100e6);
  assert.equal(formatBitRate(1.5e9), "1.5 Gbit/s");
  assert.equal(formatBitRate(250e6), "250 Mbit/s");
});

test("connection strings: SQL Server", () => {
  const info = parseConnectionString(
    "Server=tcp:contoso.database.windows.net,1433;Initial Catalog=orders;User ID=app;Password='p;a''ss';Encrypt=True;TrustServerCertificate=True",
  );
  assert.equal(info.kind, "Azure SQL Database");
  assert.equal(info.parts.find((p) => p.key === "Password")?.value, "p;a'ss");
  assert.ok(info.parts.find((p) => p.key === "Password")?.secret);
  assert.deepEqual(info.summary.slice(0, 4), [
    ["Server", "contoso.database.windows.net"],
    ["Port", "1433"],
    ["Database", "orders"],
    ["Authentication", "SQL login"],
  ]);
  assert.ok(info.warnings.some((w) => w.includes("TrustServerCertificate")));
  assert.ok(info.warnings.some((w) => w.includes("plain text")));
  assert.ok(info.masked.includes("Password=***"));
  assert.ok(!info.masked.includes("a'ss"));

  const mi = parseConnectionString(
    "Server=x.database.windows.net;Database=db;Authentication=Active Directory Managed Identity",
  );
  assert.equal(
    mi.summary.find(([k]) => k === "Authentication")?.[1],
    "Active Directory Managed Identity",
  );
  assert.equal(mi.warnings.length, 0);
});

test("connection strings: Azure services, URLs and Redis", () => {
  const storage = parseConnectionString(
    "DefaultEndpointsProtocol=https;AccountName=stcopernicus;AccountKey=abc123==;EndpointSuffix=core.windows.net",
  );
  assert.equal(storage.kind, "Azure Storage");
  assert.equal(
    storage.parts.find((p) => p.key === "AccountKey")?.value,
    "abc123==",
  );
  assert.ok(storage.warnings[0].includes("full access"));

  const bus = parseConnectionString(
    "Endpoint=sb://ns-prod.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=xyz=;EntityPath=orders",
  );
  assert.equal(bus.kind, "Azure Service Bus / Event Hubs");
  assert.deepEqual(bus.summary[0], [
    "Namespace",
    "ns-prod.servicebus.windows.net",
  ]);
  assert.ok(bus.warnings.some((w) => w.includes("RootManageSharedAccessKey")));

  const pg = parseConnectionString(
    "postgres://admin:s3cret@db.example.com:5432/app?sslmode=require",
  );
  assert.equal(pg.kind, "PostgreSQL");
  assert.equal(
    pg.masked,
    "postgres://admin:***@db.example.com:5432/app?sslmode=require",
  );

  const redis = parseConnectionString(
    "cache.redis.cache.windows.net:6380,password=k3y=,ssl=True,abortConnect=False",
  );
  assert.equal(redis.kind, "Azure Cache for Redis");
  assert.equal(
    redis.masked,
    "cache.redis.cache.windows.net:6380,password=***,ssl=True,abortConnect=False",
  );
  assert.ok(!redis.warnings.some((w) => w.includes("TLS")));

  assert.throws(() => parseConnectionString("just text"), /No key=value/);
});

test("German public holidays", () => {
  assert.equal(iso(easterSunday(2026)), "2026-04-05");
  assert.equal(iso(easterSunday(2027)), "2027-03-28");
  assert.equal(iso(easterSunday(2000)), "2000-04-23");
  const nationwide = holidays(2026, "DE");
  assert.equal(nationwide.length, 9);
  assert.deepEqual(
    holidays(2026, "RP").map((h) => `${iso(h.date)} ${h.german}`),
    [
      "2026-01-01 Neujahr",
      "2026-04-03 Karfreitag",
      "2026-04-06 Ostermontag",
      "2026-05-01 Tag der Arbeit",
      "2026-05-14 Christi Himmelfahrt",
      "2026-05-25 Pfingstmontag",
      "2026-06-04 Fronleichnam",
      "2026-10-03 Tag der Deutschen Einheit",
      "2026-11-01 Allerheiligen",
      "2026-12-25 1. Weihnachtstag",
      "2026-12-26 2. Weihnachtstag",
    ],
  );
  assert.equal(
    iso(holidays(2026, "SN").find((h) => h.german === "Buß- und Bettag")!.date),
    "2026-11-18",
  );
  assert.ok(
    holidays(2026, "BE").some((h) => h.german === "Internationaler Frauentag"),
  );
  assert.ok(
    !holidays(2018, "BE").some((h) => h.german === "Internationaler Frauentag"),
  );
  const between = holidaysBetween(
    new Date("2026-12-20T00:00Z"),
    new Date("2027-01-07T00:00Z"),
    "BY",
  );
  assert.deepEqual(
    between.map((h) => iso(h.date)),
    ["2026-12-25", "2026-12-26", "2027-01-01", "2027-01-06"],
  );
});

test("German IBAN builder", () => {
  assert.equal(
    buildGermanIban("37040044", "532013000"),
    "DE89370400440532013000",
  );
  assert.ok(checkIban(buildGermanIban("50010517", "123456789")).valid);
  assert.throws(() => buildGermanIban("1234", "1"), /8 digits/);
  assert.throws(() => buildGermanIban("37040044", "12345678901"), /10 digits/);
});

test("Unicode inspector", () => {
  const text = "key: value​ “quoted” – x‮";
  const chars = inspect(text);
  assert.equal(chars.find((c) => c.codePoint === 0x200b)?.short, "ZWSP");
  assert.equal(chars.find((c) => c.codePoint === 0x202e)?.severity, "bidi");
  assert.equal(chars.find((c) => c.char === "😀") ?? null, null);
  assert.equal(inspect("😀")[0].hex, "U+1F600");
  assert.equal(inspect("😀")[0].utf8, "F0 9F 98 80");
  assert.equal(cleanText(text), 'key: value "quoted" - x');
  assert.deepEqual(mixedScriptWords("login at pаypal.com or paypal.com"), [
    "pаypal.com",
  ]);
  assert.equal(cleanText("a\r\nb"), "a\nb");
});

test("EXIF reader", () => {
  // Builds a minimal JPEG with an APP1 Exif segment (big-endian TIFF):
  // Make, Model and a GPS IFD with 52°31'12" N, 13°24'36" E.
  const bytes: number[] = [];
  const u16 = (v: number) => bytes.push((v >> 8) & 255, v & 255);
  const u32 = (v: number) =>
    bytes.push((v >>> 24) & 255, (v >> 16) & 255, (v >> 8) & 255, v & 255);
  const tiff: number[] = [];
  const t16 = (v: number) => tiff.push((v >> 8) & 255, v & 255);
  const t32 = (v: number) =>
    tiff.push((v >>> 24) & 255, (v >> 16) & 255, (v >> 8) & 255, v & 255);
  // Header: "MM", 42, IFD0 at 8.
  tiff.push(0x4d, 0x4d);
  t16(42);
  t32(8);
  // IFD0 with 3 entries: Make (inline "Ab"), Model (inline "Cam"), GPS pointer.
  t16(3);
  t16(0x010f);
  t16(2);
  t32(3);
  tiff.push(0x41, 0x62, 0, 0);
  t16(0x0110);
  t16(2);
  t32(4);
  tiff.push(0x43, 0x61, 0x6d, 0);
  const gpsOffset = 8 + 2 + 3 * 12 + 4;
  t16(0x8825);
  t16(4);
  t32(1);
  t32(gpsOffset);
  t32(0);
  // GPS IFD: LatRef, Lat, LonRef, Lon. Rationals stored after the IFD.
  const dataStart = gpsOffset + 2 + 4 * 12 + 4;
  t16(4);
  t16(0x0001);
  t16(2);
  t32(2);
  tiff.push(0x4e, 0, 0, 0);
  t16(0x0002);
  t16(5);
  t32(3);
  t32(dataStart);
  t16(0x0003);
  t16(2);
  t32(2);
  tiff.push(0x45, 0, 0, 0);
  t16(0x0004);
  t16(5);
  t32(3);
  t32(dataStart + 24);
  t32(0);
  for (const [n, d] of [
    [52, 1],
    [31, 1],
    [12, 1],
    [13, 1],
    [24, 1],
    [36, 1],
  ]) {
    t32(n);
    t32(d);
  }
  u16(0xffd8);
  u16(0xffe1);
  u16(2 + 6 + tiff.length);
  u32(0x45786966);
  u16(0);
  bytes.push(...tiff);
  u16(0xffd9);

  const exif = readExif(new Uint8Array(bytes).buffer)!;
  assert.equal(exif.make, "Ab");
  assert.equal(exif.model, "Cam");
  assert.equal(exif.gps?.latitude.toFixed(4), "52.5200");
  assert.equal(exif.gps?.longitude.toFixed(4), "13.4100");
  assert.equal(readExif(new Uint8Array([0x89, 0x50, 0x4e, 0x47]).buffer), null);
});

test("port reference", () => {
  assert.deepEqual(
    searchPorts("3389", null).map((p) => p.service),
    ["RDP"],
  );
  assert.ok(searchPorts("138", null).some((p) => p.service === "NetBIOS"));
  assert.ok(searchPorts("azure files", null).some((p) => p.port === "445"));
  assert.ok(
    searchPorts("", "Databases").every((p) => p.category === "Databases"),
  );
  assert.equal(portAnchor(PORTS.find((p) => p.service === "FTP")!), "port-20");
  assert.equal(new Set(PORTS.map(portAnchor)).size, PORTS.length);
});

test("metronome helpers", async () => {
  const { tapTempo, tempoName } = await import("./metronome.ts");
  assert.equal(tapTempo([0, 500, 1000, 1500]), 120);
  // A long pause starts a new measurement.
  assert.equal(tapTempo([0, 500, 4000, 4600]), 100);
  assert.equal(tapTempo([0]), null);
  assert.equal(tempoName(60), "Larghetto");
  assert.equal(tempoName(120), "Allegro");
  assert.equal(tempoName(220), "Prestissimo");
});
