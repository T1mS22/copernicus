export type TextStats = {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  lines: number;
  paragraphs: number;
  bytes: number;
  readingMinutes: number;
};

function count(
  text: string,
  granularity: "grapheme" | "word" | "sentence",
  keep: (segment: Intl.SegmentData) => boolean = () => true,
): number {
  let total = 0;
  for (const segment of new Intl.Segmenter("en", { granularity }).segment(
    text,
  )) {
    if (keep(segment)) total++;
  }
  return total;
}

// Characters are counted as graphemes, so an emoji or "é" counts once even
// when it's made of several code points.
export function textStats(text: string): TextStats {
  const words = count(text, "word", (s) => s.isWordLike === true);
  return {
    characters: count(text, "grapheme"),
    charactersNoSpaces: count(
      text,
      "grapheme",
      (s) => !/^\s+$/.test(s.segment),
    ),
    words,
    sentences: count(text, "sentence", (s) => /[\p{L}\p{N}]/u.test(s.segment)),
    lines: text ? text.split("\n").length : 0,
    paragraphs: text.split(/\n\s*\n/).filter((p) => p.trim()).length,
    bytes: new TextEncoder().encode(text).length,
    // About 230 words per minute for silent reading.
    readingMinutes: words / 230,
  };
}

export function topWords(text: string, limit = 10): [string, number][] {
  const counts = new Map<string, number>();
  for (const segment of new Intl.Segmenter("en", {
    granularity: "word",
  }).segment(text.toLowerCase())) {
    if (segment.isWordLike && segment.segment.length > 2) {
      counts.set(segment.segment, (counts.get(segment.segment) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit);
}
