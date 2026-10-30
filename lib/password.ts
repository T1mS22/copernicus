import wordlist from "diceware-wordlist-en-eff";
import { pick, randomInt, shuffle } from "./random.ts";

export const CHARACTER_SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!#$%&()*+-./:;<=>?@[]^_{}~",
} as const;

// Characters that are easy to mix up when reading or typing a password.
const AMBIGUOUS = /[Il1O0o]/g;

export const MIN_PASSWORD_LENGTH = 4;
export const MAX_PASSWORD_LENGTH = 128;

export type PasswordOptions = {
  length: number;
  lower: boolean;
  upper: boolean;
  digits: boolean;
  symbols: boolean;
  avoidAmbiguous: boolean;
};

function selectedSets(options: PasswordOptions): string[] {
  return (Object.keys(CHARACTER_SETS) as (keyof typeof CHARACTER_SETS)[])
    .filter((set) => options[set])
    .map((set) =>
      options.avoidAmbiguous
        ? CHARACTER_SETS[set].replace(AMBIGUOUS, "")
        : CHARACTER_SETS[set],
    );
}

export function generatePassword(options: PasswordOptions): string {
  const sets = selectedSets(options);
  if (sets.length === 0) throw new Error("Pick at least one character set.");
  if (options.length < sets.length || options.length > MAX_PASSWORD_LENGTH) {
    throw new RangeError("Password length is out of range.");
  }

  // One character from every chosen set guarantees each one appears; the
  // rest come from the combined alphabet.
  const alphabet = sets.join("");
  const chars = sets.map((set) => pick(set));
  while (chars.length < options.length) chars.push(pick(alphabet));
  return shuffle(chars).join("");
}

export function passwordEntropy(options: PasswordOptions): number {
  const size = selectedSets(options).join("").length;
  return size === 0 ? 0 : options.length * Math.log2(size);
}

// The EFF large wordlist: 7776 words, about 12.9 bits each.
export const WORDS: readonly string[] = Object.values(wordlist);

export const MIN_PASSPHRASE_WORDS = 3;
export const MAX_PASSPHRASE_WORDS = 12;

export type PassphraseOptions = {
  words: number;
  separator: string;
  capitalize: boolean;
  addNumber: boolean;
};

export function generatePassphrase(options: PassphraseOptions): string {
  if (
    options.words < MIN_PASSPHRASE_WORDS ||
    options.words > MAX_PASSPHRASE_WORDS
  ) {
    throw new RangeError("Word count is out of range.");
  }

  const words = Array.from({ length: options.words }, () => {
    const word = pick(WORDS);
    return options.capitalize ? word[0].toUpperCase() + word.slice(1) : word;
  });
  if (options.addNumber) {
    const index = randomInt(words.length);
    words[index] += String(randomInt(10));
  }
  return words.join(options.separator);
}

export function passphraseEntropy(options: PassphraseOptions): number {
  const bits = options.words * Math.log2(WORDS.length);
  return options.addNumber
    ? bits + Math.log2(10) + Math.log2(options.words)
    : bits;
}

export function strengthLabel(bits: number): string {
  if (bits < 50) return "Weak";
  if (bits < 75) return "Fair";
  if (bits < 100) return "Strong";
  return "Very strong";
}
