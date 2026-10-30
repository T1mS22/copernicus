import assert from "node:assert/strict";
import { test } from "node:test";
import {
  base64ToBytes,
  bytesToBase64,
  decodeText,
  encodeText,
} from "./base64.ts";
import { digestAll, sameHash } from "./hash.ts";
import { formatJson, parseJson } from "./json.ts";
import { decodeJwt, tokenStatus } from "./jwt.ts";
import { decodeUrl, encodeUrl, parseUrl } from "./url.ts";

test("Base64 round-trips UTF-8 text", () => {
  assert.equal(encodeText("Grüße 👋"), "R3LDvMOfZSDwn5GL");
  assert.equal(decodeText("R3LDvMOfZSDwn5GL"), "Grüße 👋");
});

test("Base64 handles URL-safe input, missing padding and whitespace", () => {
  const bytes = new Uint8Array([251, 255, 191]);
  assert.equal(bytesToBase64(bytes), "+/+/");
  assert.equal(bytesToBase64(bytes, true), "-_-_");
  assert.deepEqual(base64ToBytes("-_-_"), bytes);
  assert.equal(decodeText("aGk"), "hi");
  assert.equal(decodeText(" aGVs\nbG8= "), "hello");
});

test("Base64 rejects invalid input and binary data", () => {
  assert.throws(() => base64ToBytes("ab$c"), /valid Base64/);
  assert.throws(() => base64ToBytes("abcde"), /length/);
  assert.throws(() => decodeText(bytesToBase64(new Uint8Array([255, 0]))));
});

test("SHA digests match known vectors", async () => {
  const digests = await digestAll(new TextEncoder().encode("abc"));
  assert.equal(digests["SHA-1"], "a9993e364706816aba3e25717850c26c9cd0d89d");
  assert.equal(
    digests["SHA-256"],
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
  );
  assert.ok(
    sameHash(" A9993E364706816ABA3E25717850C26C9CD0D89D\n", digests["SHA-1"]),
  );
});

test("JSON errors report line and column", () => {
  const result = parseJson('{\n  "a": 1,\n  b: 2\n}');
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.line, 3);
    assert.equal(result.column, 3);
  }
});

test("JSON formatting, minifying and key sorting", () => {
  const value = { b: [1, { d: 1, c: 2 }], a: "x" };
  assert.equal(formatJson(value, "minify"), '{"b":[1,{"d":1,"c":2}],"a":"x"}');
  assert.equal(
    formatJson(value, "minify", true),
    '{"a":"x","b":[1,{"c":2,"d":1}]}',
  );
  assert.equal(formatJson({ a: 1 }, 2), '{\n  "a": 1\n}');
  assert.equal(formatJson({ a: 1 }, "tab"), '{\n\t"a": 1\n}');
});

// header {"alg":"HS256","typ":"JWT"}, payload {"sub":"1234567890","name":"John Doe","iat":1516239022}
const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

test("JWT decoding", () => {
  const decoded = decodeJwt(`Bearer ${SAMPLE_JWT}`);
  assert.deepEqual(decoded.header, { alg: "HS256", typ: "JWT" });
  assert.equal((decoded.payload as { name: string }).name, "John Doe");
  assert.equal(decoded.claims.iat?.toISOString(), "2018-01-18T01:30:22.000Z");
  assert.equal(tokenStatus(decoded.claims), "no-expiry");
  assert.throws(() => decodeJwt("abc.def"), /three parts/);
  assert.throws(() => decodeJwt("a.b.c.d.e"), /encrypted/);
  assert.throws(() => decodeJwt("e30.!!!.x"), /payload/);
});

test("JWT status from exp and nbf", () => {
  const now = Date.UTC(2026, 0, 1);
  assert.equal(tokenStatus({ exp: new Date(now - 1) }, now), "expired");
  assert.equal(tokenStatus({ exp: new Date(now + 1) }, now), "valid");
  assert.equal(tokenStatus({ nbf: new Date(now + 1) }, now), "not-yet-valid");
});

test("URL encoding and decoding", () => {
  assert.equal(encodeUrl("a b&c=d/é", "component"), "a%20b%26c%3Dd%2F%C3%A9");
  assert.equal(
    encodeUrl("https://x.dev/a b?q=é", "full"),
    "https://x.dev/a%20b?q=%C3%A9",
  );
  assert.equal(decodeUrl("a+b%20c", true), "a b c");
  assert.equal(decodeUrl("a+b", false), "a+b");
  assert.throws(() => decodeUrl("%E0%A4%A"), /malformed/);
});

test("URL parsing", () => {
  const parts = parseUrl("https://user@t-s.dev:8443/a%20b?x=1&y=two#top");
  assert.equal(parts?.hostname, "t-s.dev");
  assert.equal(parts?.port, "8443");
  assert.equal(parts?.pathname, "/a b");
  assert.deepEqual(parts?.params, [
    ["x", "1"],
    ["y", "two"],
  ]);
  assert.equal(parseUrl("not a url"), null);
});

test("JSON error messages drop the duplicated location", () => {
  const result = parseJson('{"a": }');
  assert.equal(result.ok, false);
  if (!result.ok) assert.doesNotMatch(result.message, /position|line \d/);
});
