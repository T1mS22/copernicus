export type DiffType = "equal" | "insert" | "delete";

// Myers' O(ND) diff over two sequences. Returns one step per element of the
// edit script: "equal" consumes from both, "delete" from a, "insert" from b.
export function diffSteps<T>(
  a: readonly T[],
  b: readonly T[],
  equals: (x: T, y: T) => boolean = (x, y) => x === y,
): DiffType[] {
  // Common prefix and suffix don't need the expensive search.
  let start = 0;
  while (start < a.length && start < b.length && equals(a[start], b[start])) {
    start++;
  }
  let endA = a.length;
  let endB = b.length;
  while (endA > start && endB > start && equals(a[endA - 1], b[endB - 1])) {
    endA--;
    endB--;
  }

  const middle = myers(a.slice(start, endA), b.slice(start, endB), equals);
  return [
    ...Array<DiffType>(start).fill("equal"),
    ...middle,
    ...Array<DiffType>(a.length - endA).fill("equal"),
  ];
}

function myers<T>(
  a: readonly T[],
  b: readonly T[],
  equals: (x: T, y: T) => boolean,
): DiffType[] {
  const n = a.length;
  const m = b.length;
  if (n === 0) return Array<DiffType>(m).fill("insert");
  if (m === 0) return Array<DiffType>(n).fill("delete");

  const max = n + m;
  const offset = max + 1;
  const v = new Int32Array(2 * max + 3);
  // trace[d] holds the furthest x per diagonal before round d, limited to
  // the diagonals round d can read (-d-1 … d+1), so memory stays O(D²).
  const trace: Int32Array[] = [];

  search: for (let d = 0; d <= max; d++) {
    trace.push(v.slice(offset - d - 1, offset + d + 2));
    for (let k = -d; k <= d; k += 2) {
      let x =
        k === -d || (k !== d && v[offset + k - 1] < v[offset + k + 1])
          ? v[offset + k + 1]
          : v[offset + k - 1] + 1;
      let y = x - k;
      while (x < n && y < m && equals(a[x], b[y])) {
        x++;
        y++;
      }
      v[offset + k] = x;
      if (x >= n && y >= m) break search;
    }
  }

  const steps: DiffType[] = [];
  let x = n;
  let y = m;
  for (let d = trace.length - 1; d >= 0; d--) {
    const row = trace[d];
    const at = (k: number) => row[k + d + 1];
    const k = x - y;
    const prevK =
      k === -d || (k !== d && at(k - 1) < at(k + 1)) ? k + 1 : k - 1;
    const prevX = at(prevK);
    const prevY = prevX - prevK;
    while (x > prevX && y > prevY) {
      steps.push("equal");
      x--;
      y--;
    }
    if (d > 0) steps.push(x === prevX ? "insert" : "delete");
    x = prevX;
    y = prevY;
  }
  return steps.reverse();
}

export type DiffSegment = { type: DiffType; text: string };

export type DiffLine = {
  type: DiffType;
  text: string;
  oldNumber?: number;
  newNumber?: number;
  // Word-level changes for lines that were modified rather than added or
  // removed outright.
  segments?: DiffSegment[];
};

export type DiffOptions = { ignoreWhitespace: boolean; ignoreCase: boolean };

function normalizer(options: DiffOptions) {
  return (line: string) => {
    let value = options.ignoreWhitespace
      ? line.trim().replace(/\s+/g, " ")
      : line;
    if (options.ignoreCase) value = value.toLowerCase();
    return value;
  };
}

const TOKEN = /\s+|[\p{L}\p{N}_]+|[^\s\p{L}\p{N}_]/gu;

function wordSegments(
  oldLine: string,
  newLine: string,
): { old: DiffSegment[]; new: DiffSegment[] } {
  const a = oldLine.match(TOKEN) ?? [];
  const b = newLine.match(TOKEN) ?? [];
  const steps = diffSteps(a, b);
  const oldSegments: DiffSegment[] = [];
  const newSegments: DiffSegment[] = [];
  const push = (list: DiffSegment[], type: DiffType, text: string) => {
    const last = list[list.length - 1];
    if (last?.type === type) last.text += text;
    else list.push({ type, text });
  };
  let i = 0;
  let j = 0;
  for (const step of steps) {
    if (step === "equal") {
      push(oldSegments, "equal", a[i++]);
      push(newSegments, "equal", b[j++]);
    } else if (step === "delete") {
      push(oldSegments, "delete", a[i++]);
    } else {
      push(newSegments, "insert", b[j++]);
    }
  }
  return { old: oldSegments, new: newSegments };
}

export function diffLines(
  oldText: string,
  newText: string,
  options: DiffOptions,
): DiffLine[] {
  const a = oldText.split(/\r?\n/);
  const b = newText.split(/\r?\n/);
  const normalize = normalizer(options);
  const steps = diffSteps(a.map(normalize), b.map(normalize));

  const lines: DiffLine[] = [];
  let i = 0;
  let j = 0;
  let s = 0;
  while (s < steps.length) {
    if (steps[s] === "equal") {
      lines.push({
        type: "equal",
        text: b[j],
        oldNumber: ++i,
        newNumber: ++j,
      });
      s++;
      continue;
    }
    // Collect a block of deletions and insertions, then pair them up line
    // by line so modified lines get word-level highlighting.
    const deleted: number[] = [];
    const inserted: number[] = [];
    while (s < steps.length && steps[s] !== "equal") {
      if (steps[s] === "delete") deleted.push(i++);
      else inserted.push(j++);
      s++;
    }
    const pairs = Math.min(deleted.length, inserted.length);
    deleted.forEach((index, n) => {
      lines.push({
        type: "delete",
        text: a[index],
        oldNumber: index + 1,
        segments:
          n < pairs ? wordSegments(a[index], b[inserted[n]]).old : undefined,
      });
    });
    inserted.forEach((index, n) => {
      lines.push({
        type: "insert",
        text: b[index],
        newNumber: index + 1,
        segments:
          n < pairs ? wordSegments(a[deleted[n]], b[index]).new : undefined,
      });
    });
  }
  return lines;
}

export function diffStats(lines: DiffLine[]) {
  return {
    added: lines.filter((line) => line.type === "insert").length,
    removed: lines.filter((line) => line.type === "delete").length,
  };
}
