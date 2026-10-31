import assert from "node:assert/strict";
import { test } from "node:test";
import { detectDelimiter, parseCsv, toCsv } from "./csv.ts";
import { type CsvOptions, parseData, serializeData } from "./dataconvert.ts";
import { formatXml, minifyXml, tokenizeXml } from "./xml.ts";

const csv: CsvOptions = { delimiter: ",", header: true, inferTypes: true };

test("CSV parsing handles quotes, line breaks and CRLF", () => {
  assert.deepEqual(
    parseCsv('a,"b,c","say ""hi"""\r\n1,"two\nlines",3\n', ","),
    [
      ["a", "b,c", 'say "hi"'],
      ["1", "two\nlines", "3"],
    ],
  );
  assert.throws(() => parseCsv('a,"open', ","), /isn't closed/);
  assert.equal(detectDelimiter("name;city;zip\nTim;Kirchen;57548"), ";");
  assert.equal(detectDelimiter('"a;b",c,d'), ",");
  assert.equal(
    toCsv(
      [
        ["a b", "x,y", 'q"'],
        [" pad", "", "ok"],
      ],
      ",",
    ),
    'a b,"x,y","q"""\n" pad",,ok',
  );
});

test("CSV to JSON with headers and type inference", () => {
  const value = parseData(
    "name,age,admin,note\nTim,30,true,\nAnn,07,false,null",
    "csv",
    csv,
  );
  assert.deepEqual(value, [
    { name: "Tim", age: 30, admin: true, note: "" },
    { name: "Ann", age: "07", admin: false, note: null },
  ]);
  assert.deepEqual(
    parseData("a,b\n1,2", "csv", { ...csv, header: false, inferTypes: false }),
    [
      ["a", "b"],
      ["1", "2"],
    ],
  );
});

test("JSON to CSV uses the union of keys and stringifies nested values", () => {
  const text = serializeData(
    [
      { a: 1, b: { c: 2 } },
      { a: 3, d: "x" },
    ],
    "csv",
    csv,
  );
  assert.equal(text, 'a,b,d\n1,"{""c"":2}",\n3,,x');
  assert.throws(() => serializeData("plain", "csv", csv), /list of objects/);
});

test("JSON and YAML round-trip", () => {
  const value = {
    name: "Copernicus",
    planets: ["Galileo", "Brahe"],
    moons: null,
  };
  const yaml = serializeData(value, "yaml", csv);
  assert.equal(
    yaml,
    "name: Copernicus\nplanets:\n  - Galileo\n  - Brahe\nmoons: null\n",
  );
  assert.deepEqual(parseData(yaml, "yaml", csv), value);
  assert.throws(() => parseData("a: [1,", "yaml", csv));
});

test("XML formatting keeps text elements inline", () => {
  const xml =
    '<?xml version="1.0"?><root a="x>y"><!-- c --><item id="1">Text</item><empty/><e></e><p><b>bold</b> tail</p></root>';
  assert.equal(
    formatXml(xml),
    [
      '<?xml version="1.0"?>',
      '<root a="x>y">',
      "  <!-- c -->",
      '  <item id="1">Text</item>',
      "  <empty/>",
      "  <e></e>",
      "  <p>",
      "    <b>bold</b>",
      "    tail",
      "  </p>",
      "</root>",
    ].join("\n"),
  );
  assert.equal(
    minifyXml("<a>\n  <b> x </b>\n  <!-- c -->\n</a>", false),
    "<a><b>x</b></a>",
  );
  assert.equal(tokenizeXml("<![CDATA[<not a tag>]]>")[0].kind, "other");
  assert.throws(() => tokenizeXml('<a href="x'), /isn't closed/);
});

test("Wi-Fi QR payload escapes special characters", async () => {
  const { wifiPayload, qrMatrix } = await import("./qr.ts");
  assert.equal(
    wifiPayload({
      ssid: "Home;Net",
      password: 'p:a"ss',
      security: "WPA",
      hidden: true,
    }),
    'WIFI:T:WPA;S:Home\\;Net;P:p\\:a\\"ss;H:true;;',
  );
  assert.equal(
    wifiPayload({
      ssid: "Guest",
      password: "ignored",
      security: "nopass",
      hidden: false,
    }),
    "WIFI:T:nopass;S:Guest;;",
  );
  // Version 1 (21 modules) plus a 4-module quiet zone on each side.
  assert.equal(qrMatrix("hi", "M").length, 29);
});
