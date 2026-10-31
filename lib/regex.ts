export const REGEX_FLAGS = [
  { flag: "g", label: "Global", description: "Find all matches" },
  { flag: "i", label: "Ignore case", description: "a matches A" },
  {
    flag: "m",
    label: "Multiline",
    description: "^ and $ match at line breaks",
  },
  { flag: "s", label: "Dot all", description: ". also matches line breaks" },
  { flag: "u", label: "Unicode", description: "Full Unicode, \\p{…} classes" },
] as const;

export const MAX_MATCHES = 1000;

export type RegexGroup = { name: string; value: string | undefined };

export type RegexMatch = {
  index: number;
  end: number;
  text: string;
  groups: RegexGroup[];
};

export function buildRegex(pattern: string, flags: string): RegExp {
  try {
    return new RegExp(pattern, flags);
  } catch (error) {
    throw new Error(
      (error as Error).message
        .replace(/^Invalid regular expression: /, "")
        .replace(/^\/.*\/[a-z]*: /s, ""),
    );
  }
}

// Always iterates globally (matchAll requires it); without the g flag only
// the first match is returned, like String.prototype.match.
export function findMatches(
  regex: RegExp,
  text: string,
): { matches: RegexMatch[]; truncated: boolean } {
  const global = regex.flags.includes("g")
    ? regex
    : new RegExp(regex.source, regex.flags + "g");
  const limit = regex.flags.includes("g") ? MAX_MATCHES : 1;

  const matches: RegexMatch[] = [];
  for (const match of text.matchAll(global)) {
    if (matches.length === limit) {
      return { matches, truncated: regex.flags.includes("g") };
    }
    const numbered = match
      .slice(1)
      .map((value, i) => ({ name: String(i + 1), value }));
    const named = Object.entries(match.groups ?? {}).map(([name, value]) => ({
      name,
      value,
    }));
    matches.push({
      index: match.index,
      end: match.index + match[0].length,
      text: match[0],
      groups: [...named, ...numbered],
    });
  }
  return { matches, truncated: false };
}

export type HighlightSegment = { text: string; match: number | null };

// Splits text into plain and matched parts for highlighting. Zero-length
// matches can't be shown and are skipped.
export function highlight(
  text: string,
  matches: RegexMatch[],
): HighlightSegment[] {
  const segments: HighlightSegment[] = [];
  let position = 0;
  matches.forEach((match, i) => {
    if (match.end === match.index || match.index < position) return;
    if (match.index > position) {
      segments.push({ text: text.slice(position, match.index), match: null });
    }
    segments.push({ text: match.text, match: i });
    position = match.end;
  });
  if (position < text.length) {
    segments.push({ text: text.slice(position), match: null });
  }
  return segments;
}
