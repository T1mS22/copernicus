import assert from "node:assert/strict";
import { test } from "node:test";
import { searchStatuses, HTTP_STATUSES } from "./httpstatus.ts";
import { inRange, parseAddress, parseRange, splitLines } from "./iprange.ts";
import {
  addressType6,
  compressIPv6,
  describeSubnet6,
  embeddedIPv4,
  expandIPv6,
  formatCount,
  parseCidr6,
  parseIPv6,
  reverseDns6,
  splitSubnet6,
} from "./ipv6.ts";
import {
  eui64InterfaceId,
  macFlags,
  macFormats,
  parseMac,
  randomMac,
} from "./mac.ts";
import { parseUserAgent } from "./useragent.ts";
import {
  checkBic,
  checkGtin,
  checkVatId,
  germanVatCheckDigit,
  gtinCheckDigit,
} from "./validators.ts";

const ip6 = (text: string) => parseIPv6(text)!;

test("IPv6 parsing and RFC 5952 formatting", () => {
  assert.equal(
    compressIPv6(ip6("2001:0db8:0000:0000:0000:ff00:0042:8329")),
    "2001:db8::ff00:42:8329",
  );
  assert.equal(
    expandIPv6(ip6("2001:db8::1")),
    "2001:0db8:0000:0000:0000:0000:0000:0001",
  );
  assert.equal(compressIPv6(ip6("::")), "::");
  assert.equal(compressIPv6(ip6("::1")), "::1");
  assert.equal(compressIPv6(ip6("1::")), "1::");
  // Longest zero run wins; a single zero group isn't compressed.
  assert.equal(compressIPv6(ip6("2001:db8:0:1:0:0:0:1")), "2001:db8:0:1::1");
  assert.equal(
    compressIPv6(ip6("2001:db8:0:1:1:1:1:1")),
    "2001:db8:0:1:1:1:1:1",
  );
  // First run on a tie.
  assert.equal(compressIPv6(ip6("2001:0:0:1:0:0:1:1")), "2001::1:0:0:1:1");
  assert.equal(compressIPv6(ip6("[fe80::1%eth0]")), "fe80::1");
  assert.equal(compressIPv6(ip6("::ffff:192.0.2.1")), "::ffff:c000:201");
  for (const bad of [
    "1::2::3",
    "12345::",
    "1:2:3:4:5:6:7",
    "1:2:3:4:5:6:7:8:9",
    "g::1",
    ":::1",
    "::1.2.3.256",
  ]) {
    assert.equal(parseIPv6(bad), null, bad);
  }
});

test("IPv6 subnets, types and reverse DNS", () => {
  const cidr = parseCidr6("2001:db8:abcd:12::5/48")!;
  const subnet = describeSubnet6(cidr.address, cidr.prefix);
  assert.equal(compressIPv6(subnet.network), "2001:db8:abcd::");
  assert.equal(
    compressIPv6(subnet.last),
    "2001:db8:abcd:ffff:ffff:ffff:ffff:ffff",
  );
  assert.equal(formatCount(subnet.size), "2^80");
  assert.equal(formatCount(256n), "256");

  const { subnets, total } = splitSubnet6(subnet, 64);
  assert.equal(total, 65536n);
  assert.equal(subnets.length, 256);
  assert.equal(compressIPv6(subnets[1].network), "2001:db8:abcd:1::");

  assert.equal(addressType6(ip6("2001:db8::1")), "Documentation (RFC 3849)");
  assert.equal(
    addressType6(ip6("fd12:3456::1")),
    "Unique local (ULA, private)",
  );
  assert.equal(addressType6(ip6("fe80::1")), "Link-local");
  assert.equal(
    addressType6(ip6("2a00:1450:4001::1")),
    "Global unicast (public)",
  );
  assert.equal(addressType6(ip6("::1")), "Loopback");
  assert.equal(embeddedIPv4(ip6("::ffff:192.0.2.1")), "192.0.2.1");
  assert.equal(
    reverseDns6(ip6("2001:db8::567:89ab")),
    "b.a.9.8.7.6.5.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.8.b.d.0.1.0.0.2.ip6.arpa",
  );
  assert.equal(parseCidr6("::/129"), null);
});

test("IP range matching for both families", () => {
  const ranges = splitLines(
    "10.0.0.0/8  # office\n192.168.1.10 - 192.168.1.20\n2001:db8::/32\n\n# comment",
  ).map(parseRange);
  assert.equal(ranges.length, 3);
  assert.ok(ranges.every(Boolean));
  const check = (text: string) =>
    ranges.map((r) => inRange(parseAddress(text)!, r!));
  assert.deepEqual(check("10.200.3.4"), [true, false, false]);
  assert.deepEqual(check("192.168.1.15"), [false, true, false]);
  assert.deepEqual(check("192.168.1.21"), [false, false, false]);
  assert.deepEqual(check("2001:db8:1::9"), [false, false, true]);
  assert.equal(parseRange("10.0.0.9 - 10.0.0.1"), null);
  assert.equal(parseRange("2001:db8::/"), null);
  assert.equal(parseRange("1.2.3.4")?.end, parseRange("1.2.3.4")?.start);
});

test("MAC formats, flags and EUI-64", () => {
  const mac = parseMac("00-1A-2B-3C-4D-5E")!;
  assert.equal(mac, "001a2b3c4d5e");
  assert.deepEqual(
    macFormats(mac).map((f) => f.value),
    [
      "00:1a:2b:3c:4d:5e",
      "00:1A:2B:3C:4D:5E",
      "00-1A-2B-3C-4D-5E",
      "001a.2b3c.4d5e",
      "001a2b3c4d5e",
    ],
  );
  assert.equal(parseMac("001a.2b3c.4d5e"), mac);
  assert.equal(parseMac("00:1a:2b"), null);
  assert.deepEqual(macFlags(mac), {
    broadcast: false,
    multicast: false,
    locallyAdministered: false,
    oui: "00:1A:2B",
  });
  assert.equal(macFlags("da1a2b3c4d5e").locallyAdministered, true);
  assert.equal(macFlags("01005e000001").multicast, true);
  assert.equal(eui64InterfaceId(mac), "21a:2bff:fe3c:4d5e");
  const random = randomMac();
  assert.equal(macFlags(random).locallyAdministered, true);
  assert.equal(macFlags(random).multicast, false);
});

test("BIC validation", () => {
  assert.ok(checkBic("DEUTDEFF").valid);
  assert.ok(checkBic("deut de ff 500").valid);
  assert.ok(
    checkBic("COBADEFFXXX").details.some(([, v]) => v === "XXX (head office)"),
  );
  assert.match(checkBic("DEUTDEF").errors[0], /8 or 11/);
  assert.match(checkBic("DEUTXXFF").errors.join(), /country code/);
  assert.match(checkBic("1EUTDEFF").errors.join(), /letters/);
});

test("VAT ID validation", () => {
  assert.equal(germanVatCheckDigit("13669597"), 6);
  assert.ok(checkVatId("DE 136 695 976").valid);
  assert.match(checkVatId("DE136695975").errors[0], /check digit/);
  assert.match(checkVatId("DE036695976").errors[0], /start with 0/);
  assert.ok(checkVatId("ATU12345678").valid);
  assert.ok(checkVatId("NL123456789B01").valid);
  assert.match(checkVatId("GR123456789").errors[0], /EL/);
  assert.match(checkVatId("FR123").errors[0], /format/);
  assert.match(checkVatId("US123").errors[0], /EU VAT prefix/);
});

test("EAN/GTIN validation", () => {
  assert.equal(gtinCheckDigit("400638133393"), 1);
  const ean = checkGtin("4006381333931");
  assert.ok(ean.valid);
  assert.deepEqual(ean.details.at(-1), ["GS1 prefix", "400: Germany"]);
  assert.ok(checkGtin("96385074").valid);
  assert.ok(checkGtin("036000291452").valid);
  assert.match(checkGtin("4006381333932").errors[0], /should be 1/);
  assert.equal(checkGtin("400638133393").suggestedCheckDigit, 1);
  assert.ok(
    checkGtin("9783161484100").details.some(([, v]) => v.includes("ISBN")),
  );
});

test("user agent parsing", () => {
  const chrome = parseUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  );
  assert.deepEqual(
    [
      chrome.browser.name,
      chrome.browser.version,
      chrome.engine,
      chrome.os.name,
      chrome.os.version,
      chrome.device,
    ],
    ["Chrome", "141.0.0.0", "Blink", "Windows", "10 or 11", "Desktop"],
  );
  assert.ok(chrome.notes.some((n) => n.includes("Windows 11")));

  const edge = parseUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0",
  );
  assert.equal(edge.browser.name, "Microsoft Edge");

  const iphone = parseUserAgent(
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0 Mobile/15E148 Safari/604.1",
  );
  assert.deepEqual(
    [
      iphone.browser.name,
      iphone.engine,
      iphone.os.name,
      iphone.os.version,
      iphone.device,
    ],
    ["Chrome", "WebKit", "iOS", "18.1", "Mobile"],
  );
  assert.ok(iphone.notes.some((n) => n.includes("WebKit")));

  const firefox = parseUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0",
  );
  assert.deepEqual(
    [firefox.browser.name, firefox.engine, firefox.os.name],
    ["Firefox", "Gecko", "Linux"],
  );

  const safari = parseUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15",
  );
  assert.deepEqual(
    [safari.browser.name, safari.browser.version, safari.os.name],
    ["Safari", "26.0", "macOS"],
  );

  const tablet = parseUserAgent(
    "Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  );
  assert.equal(tablet.device, "Tablet");

  const curl = parseUserAgent("curl/8.7.1");
  assert.deepEqual([curl.browser.name, curl.device], ["curl", "Bot or tool"]);
});

test("HTTP status search", () => {
  assert.equal(
    new Set(HTTP_STATUSES.map((s) => s.code)).size,
    HTTP_STATUSES.length,
  );
  assert.deepEqual(
    searchStatuses("404").map((s) => s.code),
    [404],
  );
  assert.ok(searchStatuses("4xx").every((s) => s.code >= 400 && s.code < 500));
  assert.ok(searchStatuses("5").every((s) => String(s.code).startsWith("5")));
  assert.ok(searchStatuses("rate limit").some((s) => s.code === 429));
  assert.ok(searchStatuses("retry-after").some((s) => s.code === 503));
  assert.deepEqual(searchStatuses("zzzz"), []);
});

test("Azure reference data", async () => {
  const { searchRoles, searchRegions, regionByName, roleDocsUrl } =
    await import("./azurereference.ts");
  const { AZURE_ROLES } = await import("./data/azure-roles.ts");
  const { AZURE_REGIONS } = await import("./data/azure-regions.ts");
  assert.equal(new Set(AZURE_ROLES.map((r) => r.id)).size, AZURE_ROLES.length);
  assert.equal(
    new Set(AZURE_REGIONS.map((r) => r.id)).size,
    AZURE_REGIONS.length,
  );
  const owner = searchRoles("owner", "Privileged").find(
    (r) => r.name === "Owner",
  )!;
  assert.equal(owner.id, "8e3af657-a8ff-443c-a75c-2fe8c4bcb635");
  assert.equal(searchRoles("acdd72a7", null)[0].name, "Reader");
  assert.match(roleDocsUrl(owner), /built-in-roles#owner$/);
  assert.equal(regionByName("Germany West Central")?.paired, "Germany North");
  assert.ok(
    searchRegions("frankfurt", true).some((r) => r.id === "germanywestcentral"),
  );
  assert.ok(searchRegions("", true).every((r) => r.zones > 0));
  // Pairs outside the public list are restricted regions (e.g. Sweden South).
  const missing = AZURE_REGIONS.filter(
    (r) => r.paired && !regionByName(r.paired),
  );
  assert.ok(missing.length < 10);
});
