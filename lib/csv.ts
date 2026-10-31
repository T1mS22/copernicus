export type CsvDelimiter = "," | ";" | "\t" | "|";

export const CSV_DELIMITERS: { value: CsvDelimiter; label: string }[] = [
  { value: ",", label: "Comma" },
  { value: ";", label: "Semicolon (Excel, German)" },
  { value: "\t", label: "Tab" },
  { value: "|", label: "Pipe" },
];

// Picks the delimiter that appears most often in the first line, ignoring
// quoted text. German Excel exports use semicolons.
export function detectDelimiter(text: string): CsvDelimiter {
  const counts = new Map<CsvDelimiter, number>();
  let quoted = false;
  for (const char of text) {
    if (char === '"') quoted = !quoted;
    else if (!quoted && (char === "\n" || char === "\r")) break;
    else if (!quoted && CSV_DELIMITERS.some((d) => d.value === char)) {
      const delimiter = char as CsvDelimiter;
      counts.set(delimiter, (counts.get(delimiter) ?? 0) + 1);
    }
  }
  let best: CsvDelimiter = ",";
  for (const [delimiter, total] of counts) {
    if (total > (counts.get(best) ?? 0)) best = delimiter;
  }
  return best;
}

// RFC 4180: quoted fields may contain delimiters, line breaks and doubled
// quotes ("").
export function parseCsv(text: string, delimiter: CsvDelimiter): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"' && field === "") {
      quoted = true;
    } else if (char === delimiter) {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (quoted) throw new Error("A quoted field isn't closed.");
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function quote(field: string, delimiter: CsvDelimiter): string {
  return field.includes(delimiter) ||
    /["\r\n]/.test(field) ||
    field !== field.trim()
    ? `"${field.replaceAll('"', '""')}"`
    : field;
}

export function toCsv(rows: string[][], delimiter: CsvDelimiter): string {
  return rows
    .map((row) => row.map((field) => quote(field, delimiter)).join(delimiter))
    .join("\n");
}
