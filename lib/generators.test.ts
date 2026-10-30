import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CHARACTER_SETS,
  generatePassphrase,
  generatePassword,
  passwordEntropy,
  WORDS,
} from "./password.ts";
import { randomInt, shuffle } from "./random.ts";
import {
  formatUuid,
  generateUuids,
  UUID_PATTERN,
  uuidV4,
  uuidV7,
  uuidV7Timestamp,
} from "./uuid.ts";

const allSets = {
  length: 24,
  lower: true,
  upper: true,
  digits: true,
  symbols: true,
  avoidAmbiguous: false,
};

test("randomInt stays in range and covers every value", () => {
  const seen = new Set<number>();
  for (let i = 0; i < 2000; i++) {
    const value = randomInt(6);
    assert.ok(value >= 0 && value < 6);
    seen.add(value);
  }
  assert.equal(seen.size, 6);
  assert.throws(() => randomInt(0));
});

test("shuffle keeps all items", () => {
  assert.deepEqual(shuffle([1, 2, 3, 4, 5]).sort(), [1, 2, 3, 4, 5]);
});

test("passwords have the requested length and every chosen set", () => {
  for (let i = 0; i < 200; i++) {
    const password = generatePassword({ ...allSets, length: 4 });
    assert.equal(password.length, 4);
    for (const set of Object.values(CHARACTER_SETS)) {
      assert.ok([...password].some((char) => set.includes(char)));
    }
  }
});

test("passwords respect disabled sets and ambiguous characters", () => {
  for (let i = 0; i < 200; i++) {
    const password = generatePassword({
      ...allSets,
      symbols: false,
      avoidAmbiguous: true,
    });
    assert.match(password, /^[A-Za-z0-9]+$/);
    assert.doesNotMatch(password, /[Il1O0o]/);
  }
  assert.throws(() =>
    generatePassword({
      ...allSets,
      lower: false,
      upper: false,
      digits: false,
      symbols: false,
    }),
  );
});

test("password entropy uses the alphabet size", () => {
  const bits = passwordEntropy({ ...allSets, length: 10, symbols: false });
  assert.equal(bits, 10 * Math.log2(62));
});

test("passphrases use the EFF wordlist", () => {
  assert.equal(WORDS.length, 7776);
  const phrase = generatePassphrase({
    words: 6,
    separator: "-",
    capitalize: false,
    addNumber: false,
  });
  const words = phrase.split("-");
  assert.equal(words.length, 6);
  assert.ok(words.every((word) => WORDS.includes(word)));

  const withExtras = generatePassphrase({
    words: 5,
    separator: " ",
    capitalize: true,
    addNumber: true,
  });
  assert.match(withExtras, /^([A-Z][a-z-]*\d? ){4}[A-Z][a-z-]*\d?$/);
  assert.equal(withExtras.match(/\d/g)?.length, 1);
});

test("UUID v4 has the right version and variant", () => {
  const id = uuidV4();
  assert.match(id, UUID_PATTERN);
  assert.equal(id[14], "4");
  assert.match(id[19], /[89ab]/);
});

test("UUID v7 embeds the timestamp and sorts by time", () => {
  const time = Date.UTC(2026, 9, 30, 12, 0, 0);
  const id = uuidV7(time);
  assert.match(id, UUID_PATTERN);
  assert.equal(id[14], "7");
  assert.match(id[19], /[89ab]/);
  assert.equal(uuidV7Timestamp(id)?.getTime(), time);
  assert.ok(uuidV7(time) < uuidV7(time + 1));

  const batch = generateUuids(7, 20);
  assert.deepEqual(batch, [...batch].sort());
  assert.equal(new Set(batch).size, 20);
});

test("UUID formats", () => {
  const id = "0192f2a4-7c1e-7d3a-9b2c-1234567890ab";
  assert.equal(formatUuid(id, "uppercase"), id.toUpperCase());
  assert.equal(formatUuid(id, "braces"), `{${id}}`);
  assert.equal(formatUuid(id, "compact"), id.replaceAll("-", ""));
});
