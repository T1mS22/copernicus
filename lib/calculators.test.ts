import assert from "node:assert/strict";
import { test } from "node:test";
import { checkIban, formatIban, ibanChecksum, normalizeIban } from "./iban.ts";
import {
  addressType,
  allocateByHosts,
  describeSubnet,
  formatIPv4,
  maskToPrefix,
  parseCidr,
  parseIPv4,
  prefixForCount,
  prefixForHosts,
  splitByPrefix,
} from "./subnet.ts";
import { detectUnit, parseDate, parseTimestamp } from "./timestamp.ts";
import {
  convert,
  findUnit,
  formatNumber,
  parseNumber,
  UNIT_CATEGORIES,
} from "./units.ts";

const ip = (text: string) => parseIPv4(text)!;

test("IPv4 parsing is strict", () => {
  assert.equal(formatIPv4(ip("192.168.1.10")), "192.168.1.10");
  assert.equal(ip("255.255.255.255"), 0xffffffff);
  for (const bad of [
    "256.0.0.1",
    "1.2.3",
    "01.2.3.4",
    "1.2.3.4.5",
    "a.b.c.d",
  ]) {
    assert.equal(parseIPv4(bad), null, bad);
  }
});

test("CIDR parsing accepts prefixes and masks", () => {
  assert.deepEqual(parseCidr("10.0.0.5/24"), {
    address: ip("10.0.0.5"),
    prefix: 24,
  });
  assert.deepEqual(parseCidr("10.0.0.5 255.255.252.0"), {
    address: ip("10.0.0.5"),
    prefix: 22,
  });
  assert.deepEqual(parseCidr("10.0.0.5"), {
    address: ip("10.0.0.5"),
    prefix: 32,
  });
  assert.equal(parseCidr("10.0.0.5/33"), null);
  assert.equal(parseCidr("10.0.0.5/255.0.255.0"), null);
  assert.equal(maskToPrefix(0), 0);
});

test("describes a /24", () => {
  const subnet = describeSubnet(ip("192.168.1.130"), 24);
  assert.equal(formatIPv4(subnet.network), "192.168.1.0");
  assert.equal(formatIPv4(subnet.broadcast), "192.168.1.255");
  assert.equal(formatIPv4(subnet.firstHost), "192.168.1.1");
  assert.equal(formatIPv4(subnet.lastHost), "192.168.1.254");
  assert.equal(formatIPv4(subnet.mask), "255.255.255.0");
  assert.equal(formatIPv4(subnet.wildcard), "0.0.0.255");
  assert.equal(subnet.hosts, 254);
});

test("handles /0, /31 and /32", () => {
  const all = describeSubnet(ip("8.8.8.8"), 0);
  assert.equal(formatIPv4(all.network), "0.0.0.0");
  assert.equal(formatIPv4(all.broadcast), "255.255.255.255");
  assert.equal(all.size, 2 ** 32);

  const p2p = describeSubnet(ip("10.0.0.1"), 31);
  assert.equal(p2p.hosts, 2);
  assert.equal(formatIPv4(p2p.firstHost), "10.0.0.0");
  assert.equal(formatIPv4(p2p.lastHost), "10.0.0.1");

  const host = describeSubnet(ip("10.0.0.1"), 32);
  assert.equal(host.hosts, 1);
  assert.equal(host.firstHost, host.lastHost);
});

test("classifies address ranges", () => {
  assert.equal(addressType(ip("10.1.2.3")), "Private (RFC 1918)");
  assert.equal(addressType(ip("172.31.255.1")), "Private (RFC 1918)");
  assert.equal(addressType(ip("172.32.0.1")), "Public");
  assert.equal(
    addressType(ip("100.100.0.1")),
    "Shared address space / CGNAT (RFC 6598)",
  );
  assert.equal(addressType(ip("255.255.255.255")), "Limited broadcast");
  assert.equal(addressType(ip("1.1.1.1")), "Public");
});

test("splits a block into equal subnets", () => {
  const { subnets, total } = splitByPrefix(ip("10.0.0.0"), 24, 26);
  assert.equal(total, 4);
  assert.deepEqual(
    subnets.map((s) => formatIPv4(s.network)),
    ["10.0.0.0", "10.0.0.64", "10.0.0.128", "10.0.0.192"],
  );
  assert.equal(prefixForCount(24, 5), 27);
  assert.throws(() => splitByPrefix(ip("10.0.0.0"), 24, 20));
});

test("allocates subnets by required hosts", () => {
  assert.equal(prefixForHosts(1), 30);
  assert.equal(prefixForHosts(2), 30);
  assert.equal(prefixForHosts(62), 26);
  assert.equal(prefixForHosts(63), 25);

  const result = allocateByHosts(ip("192.168.0.0"), 24, [
    { name: "Office", hosts: 50 },
    { name: "Servers", hosts: 100 },
    { name: "Link", hosts: 2 },
  ]);
  assert.deepEqual(
    result.allocations.map((a) => [
      a.name,
      `${formatIPv4(a.subnet.network)}/${a.subnet.prefix}`,
    ]),
    [
      ["Servers", "192.168.0.0/25"],
      ["Office", "192.168.0.128/26"],
      ["Link", "192.168.0.192/30"],
    ],
  );
  assert.equal(result.free, 60);
  assert.throws(
    () => allocateByHosts(ip("192.168.0.0"), 24, [{ name: "Big", hosts: 300 }]),
    /doesn't fit/,
  );
});

test("IBAN checksums for known examples", () => {
  for (const iban of [
    "DE89 3704 0044 0532 0130 00",
    "GB82 WEST 1234 5698 7654 32",
    "AT61 1904 3002 3457 3201",
    "CH93 0076 2011 6238 5295 7",
    "NL91 ABNA 0417 1643 00",
    "FR14 2004 1010 0505 0001 3M02 606",
    "BE68 5390 0754 7034",
  ]) {
    const result = checkIban(iban);
    assert.ok(result.valid, `${iban}: ${result.errors.join(" ")}`);
  }
});

test("IBAN errors and details", () => {
  assert.equal(normalizeIban("iban: de89-3704 0044"), "DE8937040044");
  assert.equal(
    formatIban("DE89370400440532013000"),
    "DE89 3704 0044 0532 0130 00",
  );
  assert.equal(ibanChecksum("DE89370400440532013000"), 1);

  const typo = checkIban("DE89370400440532013001");
  assert.equal(typo.valid, false);
  assert.match(typo.errors[0], /check digits/);

  const short = checkIban("DE8937040044053201300");
  assert.match(short.errors[0], /22 characters/);
  assert.match(checkIban("XX00123").errors[0], /isn't a country/);

  const de = checkIban("DE89370400440532013000");
  assert.deepEqual(de.details.slice(0, 2), [
    ["Bank code (BLZ)", "37040044"],
    ["Account number", "0532013000"],
  ]);
});

test("timestamp unit detection and parsing", () => {
  assert.equal(detectUnit("1761825600"), "s");
  assert.equal(detectUnit("1761825600000"), "ms");
  assert.equal(detectUnit("1761825600000000"), "us");
  assert.equal(detectUnit("1761825600000000000"), "ns");
  const expected = "2025-10-30T12:00:00.000Z";
  for (const input of ["1761825600", "1761825600000", "1761825600000000000"]) {
    assert.equal(parseTimestamp(input, "auto")?.date.toISOString(), expected);
  }
  assert.equal(
    parseTimestamp("1761825600.5", "s")?.date.getUTCMilliseconds(),
    500,
  );
  assert.equal(parseTimestamp("12abc", "auto"), null);
  assert.equal(parseDate("2025-10-30T12:00:00Z")?.toISOString(), expected);
  assert.equal(parseDate("nope"), null);
});

test("unit conversions", () => {
  const category = (id: string) => UNIT_CATEGORIES.find((c) => c.id === id)!;
  const length = category("length");
  assert.equal(
    convert(1, findUnit(length, "mi"), findUnit(length, "km")),
    1.609344,
  );
  assert.equal(
    formatNumber(convert(1, findUnit(length, "ft"), findUnit(length, "in"))),
    "12",
  );

  const temperature = category("temperature");
  assert.equal(
    convert(100, findUnit(temperature, "c"), findUnit(temperature, "f")),
    212,
  );
  assert.equal(
    formatNumber(
      convert(0, findUnit(temperature, "k"), findUnit(temperature, "c")),
    ),
    "-273.15",
  );
  assert.equal(
    formatNumber(
      convert(-40, findUnit(temperature, "f"), findUnit(temperature, "c")),
    ),
    "-40",
  );

  const data = category("data");
  assert.equal(
    convert(1, findUnit(data, "GiB"), findUnit(data, "MB")),
    1073.741824,
  );
  assert.equal(convert(1, findUnit(data, "Gbit"), findUnit(data, "MB")), 125);

  for (const c of UNIT_CATEGORIES) {
    assert.equal(new Set(c.units.map((u) => u.id)).size, c.units.length, c.id);
  }
});

test("number parsing and formatting", () => {
  assert.equal(parseNumber("1,5"), 1.5);
  assert.equal(parseNumber("1 500.25"), 1500.25);
  assert.equal(parseNumber("1,500.25"), 1500.25);
  assert.equal(parseNumber("2e3"), 2000);
  assert.equal(parseNumber("abc"), null);
  assert.equal(formatNumber(0.1 + 0.2), "0.3");
  assert.equal(formatNumber(1e20), "1e+20");
  assert.equal(formatNumber(1234567.891), "1234567.891");
});

test("Azure subnet mode reserves five addresses", async () => {
  const { azureSubnet, prefixForHostsAzure, AZURE_SPECIAL_SUBNETS } =
    await import("./subnet.ts");
  const subnet = azureSubnet(describeSubnet(ip("10.0.1.0"), 24));
  assert.equal(subnet.hosts, 251);
  assert.equal(formatIPv4(subnet.firstHost), "10.0.1.4");
  assert.equal(formatIPv4(subnet.lastHost), "10.0.1.254");
  assert.equal(azureSubnet(describeSubnet(ip("10.0.1.0"), 29)).hosts, 3);
  assert.equal(azureSubnet(describeSubnet(ip("10.0.1.0"), 30)).hosts, 0);

  assert.equal(prefixForHostsAzure(1), 29);
  assert.equal(prefixForHostsAzure(3), 29);
  assert.equal(prefixForHostsAzure(4), 28);
  assert.equal(prefixForHostsAzure(59), 26);
  assert.equal(prefixForHostsAzure(60), 25);

  // 120 hosts fit a normal /25 (126 usable) and also an Azure /25 (123).
  const result = allocateByHosts(
    ip("10.1.0.0"),
    24,
    [
      { name: "App", hosts: 120 },
      { name: "Data", hosts: 28 },
    ],
    true,
  );
  assert.deepEqual(
    result.allocations.map((a) => [
      a.name,
      `${formatIPv4(a.subnet.network)}/${a.subnet.prefix}`,
      a.subnet.hosts,
    ]),
    [
      ["App", "10.1.0.0/25", 123],
      ["Data", "10.1.0.128/26", 59],
    ],
  );
  assert.ok(
    AZURE_SPECIAL_SUBNETS.some(
      (s) => s.name === "AzureBastionSubnet" && s.prefix === 26,
    ),
  );
  assert.equal(
    splitByPrefix(ip("10.0.0.0"), 24, 26, true).subnets[0].hosts,
    59,
  );
});
