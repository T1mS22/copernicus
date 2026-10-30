export type JsonParseResult =
  | { ok: true; value: unknown }
  | { ok: false; message: string; line?: number; column?: number };

function lineAndColumn(text: string, position: number) {
  const before = text.slice(0, position).split("\n");
  return { line: before.length, column: before[before.length - 1].length + 1 };
}

// Browsers word parse errors differently. Chrome reports a character
// position, Firefox a line and column, Safari neither.
export function parseJson(text: string): JsonParseResult {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (error) {
    const raw = error instanceof Error ? error.message : String(error);
    // Drop the location from the message; it's reported separately.
    const message = raw
      .replace(/^JSON\.parse: /, "")
      .replace(/ (in JSON )?at (position|line) \d+.*$/, "");
    const lineColumn = /line (\d+) column (\d+)/.exec(raw);
    if (lineColumn) {
      return {
        ok: false,
        message,
        line: Number(lineColumn[1]),
        column: Number(lineColumn[2]),
      };
    }
    const position = /position (\d+)/.exec(raw);
    if (position) {
      return {
        ok: false,
        message,
        ...lineAndColumn(text, Number(position[1])),
      };
    }
    return { ok: false, message };
  }
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [
          key,
          sortKeysDeep((value as Record<string, unknown>)[key]),
        ]),
    );
  }
  return value;
}

export type JsonIndent = 2 | 4 | "tab" | "minify";

export function formatJson(
  value: unknown,
  indent: JsonIndent,
  sortKeys = false,
): string {
  const data = sortKeys ? sortKeysDeep(value) : value;
  if (indent === "minify") return JSON.stringify(data);
  return JSON.stringify(data, null, indent === "tab" ? "\t" : indent);
}
