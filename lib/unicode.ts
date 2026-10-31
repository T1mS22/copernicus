// Finds characters that look harmless or invisible but break config files,
// code and comparisons.

export type Severity = "invisible" | "lookalike" | "control" | "bidi";

type Special = {
  name: string;
  short: string;
  severity: Severity;
  replacement: string;
};

const SPECIAL: Record<number, Special> = {
  0x00a0: {
    name: "No-break space",
    short: "NBSP",
    severity: "lookalike",
    replacement: " ",
  },
  0x00ad: {
    name: "Soft hyphen",
    short: "SHY",
    severity: "invisible",
    replacement: "",
  },
  0x034f: {
    name: "Combining grapheme joiner",
    short: "CGJ",
    severity: "invisible",
    replacement: "",
  },
  0x061c: {
    name: "Arabic letter mark",
    short: "ALM",
    severity: "bidi",
    replacement: "",
  },
  0x115f: {
    name: "Hangul choseong filler",
    short: "HCF",
    severity: "invisible",
    replacement: "",
  },
  0x180e: {
    name: "Mongolian vowel separator",
    short: "MVS",
    severity: "invisible",
    replacement: "",
  },
  0x2000: {
    name: "En quad",
    short: "NQSP",
    severity: "lookalike",
    replacement: " ",
  },
  0x2001: {
    name: "Em quad",
    short: "MQSP",
    severity: "lookalike",
    replacement: " ",
  },
  0x2002: {
    name: "En space",
    short: "ENSP",
    severity: "lookalike",
    replacement: " ",
  },
  0x2003: {
    name: "Em space",
    short: "EMSP",
    severity: "lookalike",
    replacement: " ",
  },
  0x2004: {
    name: "Three-per-em space",
    short: "3/MSP",
    severity: "lookalike",
    replacement: " ",
  },
  0x2005: {
    name: "Four-per-em space",
    short: "4/MSP",
    severity: "lookalike",
    replacement: " ",
  },
  0x2006: {
    name: "Six-per-em space",
    short: "6/MSP",
    severity: "lookalike",
    replacement: " ",
  },
  0x2007: {
    name: "Figure space",
    short: "FSP",
    severity: "lookalike",
    replacement: " ",
  },
  0x2008: {
    name: "Punctuation space",
    short: "PSP",
    severity: "lookalike",
    replacement: " ",
  },
  0x2009: {
    name: "Thin space",
    short: "THSP",
    severity: "lookalike",
    replacement: " ",
  },
  0x200a: {
    name: "Hair space",
    short: "HSP",
    severity: "lookalike",
    replacement: " ",
  },
  0x200b: {
    name: "Zero-width space",
    short: "ZWSP",
    severity: "invisible",
    replacement: "",
  },
  0x200c: {
    name: "Zero-width non-joiner",
    short: "ZWNJ",
    severity: "invisible",
    replacement: "",
  },
  0x200d: {
    name: "Zero-width joiner",
    short: "ZWJ",
    severity: "invisible",
    replacement: "",
  },
  0x200e: {
    name: "Left-to-right mark",
    short: "LRM",
    severity: "bidi",
    replacement: "",
  },
  0x200f: {
    name: "Right-to-left mark",
    short: "RLM",
    severity: "bidi",
    replacement: "",
  },
  0x2010: {
    name: "Hyphen",
    short: "‐",
    severity: "lookalike",
    replacement: "-",
  },
  0x2011: {
    name: "Non-breaking hyphen",
    short: "NBHY",
    severity: "lookalike",
    replacement: "-",
  },
  0x2012: {
    name: "Figure dash",
    short: "‒",
    severity: "lookalike",
    replacement: "-",
  },
  0x2013: {
    name: "En dash",
    short: "–",
    severity: "lookalike",
    replacement: "-",
  },
  0x2014: {
    name: "Em dash",
    short: "—",
    severity: "lookalike",
    replacement: "-",
  },
  0x2018: {
    name: "Left single quotation mark",
    short: "‘",
    severity: "lookalike",
    replacement: "'",
  },
  0x2019: {
    name: "Right single quotation mark",
    short: "’",
    severity: "lookalike",
    replacement: "'",
  },
  0x201a: {
    name: "Single low-9 quotation mark",
    short: "‚",
    severity: "lookalike",
    replacement: "'",
  },
  0x201c: {
    name: "Left double quotation mark",
    short: "“",
    severity: "lookalike",
    replacement: '"',
  },
  0x201d: {
    name: "Right double quotation mark",
    short: "”",
    severity: "lookalike",
    replacement: '"',
  },
  0x201e: {
    name: "Double low-9 quotation mark",
    short: "„",
    severity: "lookalike",
    replacement: '"',
  },
  0x2028: {
    name: "Line separator",
    short: "LSEP",
    severity: "control",
    replacement: "\n",
  },
  0x2029: {
    name: "Paragraph separator",
    short: "PSEP",
    severity: "control",
    replacement: "\n",
  },
  0x202a: {
    name: "Left-to-right embedding",
    short: "LRE",
    severity: "bidi",
    replacement: "",
  },
  0x202b: {
    name: "Right-to-left embedding",
    short: "RLE",
    severity: "bidi",
    replacement: "",
  },
  0x202c: {
    name: "Pop directional formatting",
    short: "PDF",
    severity: "bidi",
    replacement: "",
  },
  0x202d: {
    name: "Left-to-right override",
    short: "LRO",
    severity: "bidi",
    replacement: "",
  },
  0x202e: {
    name: "Right-to-left override",
    short: "RLO",
    severity: "bidi",
    replacement: "",
  },
  0x202f: {
    name: "Narrow no-break space",
    short: "NNBSP",
    severity: "lookalike",
    replacement: " ",
  },
  0x205f: {
    name: "Medium mathematical space",
    short: "MMSP",
    severity: "lookalike",
    replacement: " ",
  },
  0x2060: {
    name: "Word joiner",
    short: "WJ",
    severity: "invisible",
    replacement: "",
  },
  0x2061: {
    name: "Function application",
    short: "FA",
    severity: "invisible",
    replacement: "",
  },
  0x2062: {
    name: "Invisible times",
    short: "IT",
    severity: "invisible",
    replacement: "",
  },
  0x2063: {
    name: "Invisible separator",
    short: "IS",
    severity: "invisible",
    replacement: "",
  },
  0x2064: {
    name: "Invisible plus",
    short: "IP",
    severity: "invisible",
    replacement: "",
  },
  0x2066: {
    name: "Left-to-right isolate",
    short: "LRI",
    severity: "bidi",
    replacement: "",
  },
  0x2067: {
    name: "Right-to-left isolate",
    short: "RLI",
    severity: "bidi",
    replacement: "",
  },
  0x2068: {
    name: "First strong isolate",
    short: "FSI",
    severity: "bidi",
    replacement: "",
  },
  0x2069: {
    name: "Pop directional isolate",
    short: "PDI",
    severity: "bidi",
    replacement: "",
  },
  0x2212: {
    name: "Minus sign",
    short: "−",
    severity: "lookalike",
    replacement: "-",
  },
  0x2215: {
    name: "Division slash",
    short: "∕",
    severity: "lookalike",
    replacement: "/",
  },
  0x3000: {
    name: "Ideographic space",
    short: "IDSP",
    severity: "lookalike",
    replacement: " ",
  },
  0x3164: {
    name: "Hangul filler",
    short: "HF",
    severity: "invisible",
    replacement: "",
  },
  0xfeff: {
    name: "Byte order mark / zero-width no-break space",
    short: "BOM",
    severity: "invisible",
    replacement: "",
  },
  0xff0c: {
    name: "Fullwidth comma",
    short: "，",
    severity: "lookalike",
    replacement: ",",
  },
  0xff1a: {
    name: "Fullwidth colon",
    short: "：",
    severity: "lookalike",
    replacement: ":",
  },
};

const CONTROL_NAMES: Record<number, string> = {
  0x00: "Null",
  0x09: "Tab",
  0x0a: "Line feed (LF)",
  0x0b: "Vertical tab",
  0x0c: "Form feed",
  0x0d: "Carriage return (CR)",
  0x1b: "Escape",
  0x7f: "Delete",
};

export type CharInfo = {
  char: string;
  codePoint: number;
  hex: string;
  utf8: string;
  category: string;
  name?: string;
  short?: string;
  severity?: Severity;
  script?: string;
};

function category(char: string): string {
  if (/\p{L}/u.test(char)) return "Letter";
  if (/\p{N}/u.test(char)) return "Number";
  if (/\p{Zs}/u.test(char)) return "Space";
  if (/\p{P}/u.test(char)) return "Punctuation";
  if (/\p{S}/u.test(char)) return "Symbol";
  if (/\p{M}/u.test(char)) return "Combining mark";
  if (/\p{Cc}/u.test(char)) return "Control";
  if (/\p{Cf}/u.test(char)) return "Format";
  return "Other";
}

function script(char: string): string | undefined {
  if (/\p{Script=Latin}/u.test(char)) return "Latin";
  if (/\p{Script=Cyrillic}/u.test(char)) return "Cyrillic";
  if (/\p{Script=Greek}/u.test(char)) return "Greek";
  return undefined;
}

export function inspect(text: string): CharInfo[] {
  return Array.from(text, (char) => {
    const codePoint = char.codePointAt(0)!;
    const special = SPECIAL[codePoint];
    const control = CONTROL_NAMES[codePoint];
    const unusualControl =
      /\p{Cc}/u.test(char) && ![0x09, 0x0a, 0x0d].includes(codePoint);
    return {
      char,
      codePoint,
      hex: `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`,
      utf8: Array.from(new TextEncoder().encode(char), (b) =>
        b.toString(16).toUpperCase().padStart(2, "0"),
      ).join(" "),
      category: category(char),
      name: special?.name ?? control,
      short: special?.short ?? (unusualControl ? "CTRL" : undefined),
      severity: special?.severity ?? (unusualControl ? "control" : undefined),
      script: script(char),
    };
  });
}

// Words that mix Latin with Cyrillic or Greek letters, a common trick for
// look-alike domains and identifiers ("pаypal" with a Cyrillic а).
export function mixedScriptWords(text: string): string[] {
  const words = text.match(/[\p{L}\p{N}_.-]+/gu) ?? [];
  return [
    ...new Set(
      words.filter((word) => {
        const scripts = new Set(Array.from(word, script).filter(Boolean));
        return scripts.size > 1;
      }),
    ),
  ];
}

// Replaces look-alikes with ASCII and removes invisible and bidi
// characters. Line endings become LF.
export function cleanText(text: string): string {
  return Array.from(text.replace(/\r\n?/g, "\n"), (char) => {
    const special = SPECIAL[char.codePointAt(0)!];
    if (special) return special.replacement;
    if (/\p{Cc}/u.test(char) && char !== "\n" && char !== "\t") return "";
    return char;
  }).join("");
}
