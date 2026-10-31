// Splits identifiers and phrases into words: "XMLHttpRequest" → XML Http
// Request, "user_id-v2" → user id v2.
export function splitWords(text: string): string[] {
  return text
    .replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, "$1 $2")
    .replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, "$1 $2")
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

const capitalize = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

const GERMAN = {
  ä: "ae",
  ö: "oe",
  ü: "ue",
  Ä: "Ae",
  Ö: "Oe",
  Ü: "Ue",
  ß: "ss",
};

// URL slug: German umlauts become ae/oe/ue, other accents are dropped.
export function slugify(text: string): string {
  return text
    .replace(/[äöüÄÖÜß]/g, (char) => GERMAN[char as keyof typeof GERMAN])
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type CaseStyle = {
  id: string;
  label: string;
  convert: (text: string) => string;
};

const fromWords =
  (join: (words: string[]) => string) =>
  (text: string): string =>
    join(splitWords(text));

export const CASE_STYLES: CaseStyle[] = [
  {
    id: "camel",
    label: "camelCase",
    convert: fromWords((w) =>
      w
        .map((word, i) => (i === 0 ? word.toLowerCase() : capitalize(word)))
        .join(""),
    ),
  },
  {
    id: "pascal",
    label: "PascalCase",
    convert: fromWords((w) => w.map(capitalize).join("")),
  },
  {
    id: "snake",
    label: "snake_case",
    convert: fromWords((w) => w.join("_").toLowerCase()),
  },
  {
    id: "constant",
    label: "CONSTANT_CASE",
    convert: fromWords((w) => w.join("_").toUpperCase()),
  },
  {
    id: "kebab",
    label: "kebab-case",
    convert: fromWords((w) => w.join("-").toLowerCase()),
  },
  {
    id: "dot",
    label: "dot.case",
    convert: fromWords((w) => w.join(".").toLowerCase()),
  },
  {
    id: "title",
    label: "Title Case",
    convert: fromWords((w) => w.map(capitalize).join(" ")),
  },
  {
    id: "sentence",
    label: "Sentence case",
    convert: fromWords((w) =>
      w
        .map((word, i) => (i === 0 ? capitalize(word) : word.toLowerCase()))
        .join(" "),
    ),
  },
  { id: "lower", label: "lower case", convert: (text) => text.toLowerCase() },
  { id: "upper", label: "UPPER CASE", convert: (text) => text.toUpperCase() },
  { id: "slug", label: "URL slug", convert: slugify },
];

// Each line is converted on its own, so lists of names work.
export function convertLines(text: string, style: CaseStyle): string {
  return text
    .split("\n")
    .map((line) => style.convert(line))
    .join("\n");
}
