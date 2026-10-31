import assert from "node:assert/strict";
import { test } from "node:test";
import { CASE_STYLES, convertLines, slugify, splitWords } from "./case.ts";
import { diffLines, diffStats, diffSteps } from "./diff.ts";
import { buildRegex, findMatches, highlight } from "./regex.ts";
import { textStats, topWords } from "./textstats.ts";

function apply(a: string[], b: string[]) {
  // Rebuilds b from a and the edit script to prove the script is valid.
  const steps = diffSteps(a, b);
  const out: string[] = [];
  let i = 0;
  let j = 0;
  for (const step of steps) {
    if (step === "equal") {
      assert.equal(a[i], b[j]);
      out.push(a[i++]);
      j++;
    } else if (step === "delete") i++;
    else out.push(b[j++]);
  }
  assert.equal(i, a.length);
  return out;
}

test("diff edit scripts rebuild the target", () => {
  const cases: [string, string][] = [
    ["abcabba", "cbabac"],
    ["", "abc"],
    ["abc", ""],
    ["same", "same"],
    ["kitten", "sitting"],
  ];
  for (const [a, b] of cases) {
    assert.deepEqual(apply([...a], [...b]), [...b], `${a} → ${b}`);
  }
  // Myers finds the shortest script: abcabba → cbabac needs 5 edits.
  const steps = diffSteps([..."abcabba"], [..."cbabac"]);
  assert.equal(steps.filter((s) => s !== "equal").length, 5);
});

test("line diff with numbers and word-level changes", () => {
  const lines = diffLines("one\ntwo\nthree", "one\n2\nthree\nfour", {
    ignoreWhitespace: false,
    ignoreCase: false,
  });
  assert.deepEqual(
    lines.map((l) => [l.type, l.text, l.oldNumber, l.newNumber]),
    [
      ["equal", "one", 1, 1],
      ["delete", "two", 2, undefined],
      ["insert", "2", undefined, 2],
      ["equal", "three", 3, 3],
      ["insert", "four", undefined, 4],
    ],
  );
  assert.deepEqual(diffStats(lines), { added: 2, removed: 1 });

  const changed = diffLines("const a = 1;", "const b = 1;", {
    ignoreWhitespace: false,
    ignoreCase: false,
  });
  assert.deepEqual(changed[0].segments, [
    { type: "equal", text: "const " },
    { type: "delete", text: "a" },
    { type: "equal", text: " = 1;" },
  ]);
});

test("line diff can ignore whitespace and case", () => {
  const lines = diffLines("Hello  World", "hello world ", {
    ignoreWhitespace: true,
    ignoreCase: true,
  });
  assert.deepEqual(diffStats(lines), { added: 0, removed: 0 });
});

test("regex matches, groups and highlighting", () => {
  const regex = buildRegex("(?<user>\\w+)@(\\w+)\\.dev", "g");
  const { matches } = findMatches(regex, "tim@t.dev, ann@corp.dev");
  assert.equal(matches.length, 2);
  assert.deepEqual(matches[1].groups, [
    { name: "user", value: "ann" },
    { name: "1", value: "ann" },
    { name: "2", value: "corp" },
  ]);
  assert.equal(findMatches(buildRegex("\\w+", ""), "a b").matches.length, 1);
  assert.deepEqual(highlight("xaby", findMatches(/ab/g, "xaby").matches), [
    { text: "x", match: null },
    { text: "ab", match: 0 },
    { text: "y", match: null },
  ]);
  assert.throws(() => buildRegex("(", ""), /Unterminated group|missing \)/i);
  // Zero-length matches don't loop forever.
  assert.equal(findMatches(/x*/g, "abc").matches.length, 4);
});

test("case conversions", () => {
  assert.deepEqual(splitWords("XMLHttpRequest userId_v2"), [
    "XML",
    "Http",
    "Request",
    "user",
    "Id",
    "v2",
  ]);
  const convert = (id: string, text: string) =>
    CASE_STYLES.find((s) => s.id === id)!.convert(text);
  assert.equal(convert("camel", "Hello big world"), "helloBigWorld");
  assert.equal(convert("pascal", "hello_big-world"), "HelloBigWorld");
  assert.equal(convert("snake", "helloBigWorld"), "hello_big_world");
  assert.equal(convert("constant", "hello big world"), "HELLO_BIG_WORLD");
  assert.equal(convert("kebab", "HelloBigWorld"), "hello-big-world");
  assert.equal(convert("title", "hello BIG world"), "Hello Big World");
  assert.equal(convert("sentence", "HELLO big World"), "Hello big world");
  assert.equal(slugify("Größe & Übersicht: Café!"), "groesse-uebersicht-cafe");
  assert.equal(
    convertLines("first name\nlast name", CASE_STYLES[0]),
    "firstName\nlastName",
  );
});

test("text statistics", () => {
  const stats = textStats("Hello world! How are you?\n\nI'm fine 👍🏽.");
  assert.equal(stats.words, 7);
  assert.equal(stats.sentences, 3);
  assert.equal(stats.lines, 3);
  assert.equal(stats.paragraphs, 2);
  assert.equal(stats.characters, 38);
  assert.ok(stats.bytes > stats.characters);
  assert.deepEqual(topWords("the cat and the hat and the bat", 2), [
    ["the", 3],
    ["and", 2],
  ]);
  assert.equal(textStats("").lines, 0);
});

test("regex errors drop the engine's prefix", () => {
  assert.throws(
    () => buildRegex("(abc", "g"),
    (error: Error) => !error.message.includes("/(abc/"),
  );
});
