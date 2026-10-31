import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { type CsvDelimiter, parseCsv, toCsv } from "./csv.ts";

export type DataFormat = "json" | "yaml" | "csv";

export type CsvOptions = {
  delimiter: CsvDelimiter;
  // The first row holds column names; rows become objects.
  header: boolean;
  // Turns "42", "true" and "null" into numbers, booleans and null.
  inferTypes: boolean;
};

const NUMBER = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/;

function inferValue(value: string): unknown {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (NUMBER.test(value) && Number.isSafeInteger(Math.trunc(Number(value)))) {
    return Number(value);
  }
  return value;
}

export function parseData(
  text: string,
  format: DataFormat,
  csv: CsvOptions,
): unknown {
  if (format === "json") return JSON.parse(text);
  if (format === "yaml") return parseYaml(text);

  const rows = parseCsv(text, csv.delimiter);
  const cell = (value: string) => (csv.inferTypes ? inferValue(value) : value);
  if (!csv.header) return rows.map((row) => row.map(cell));
  const [head = [], ...body] = rows;
  return body.map((row) =>
    Object.fromEntries(head.map((name, i) => [name, cell(row[i] ?? "")])),
  );
}

function cellText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function toRows(value: unknown): string[][] {
  const items = Array.isArray(value) ? value : [value];
  if (items.every(Array.isArray)) {
    return (items as unknown[][]).map((row) => row.map(cellText));
  }
  if (
    !items.every(
      (item) =>
        item !== null && typeof item === "object" && !Array.isArray(item),
    )
  ) {
    throw new Error(
      "CSV needs a list of objects (one per row) or a list of lists.",
    );
  }
  // Columns are the union of all keys, in order of first appearance.
  const columns: string[] = [];
  for (const item of items as Record<string, unknown>[]) {
    for (const key of Object.keys(item)) {
      if (!columns.includes(key)) columns.push(key);
    }
  }
  return [
    columns,
    ...(items as Record<string, unknown>[]).map((item) =>
      columns.map((column) => cellText(item[column])),
    ),
  ];
}

export function serializeData(
  value: unknown,
  format: DataFormat,
  csv: CsvOptions,
): string {
  if (format === "json") return JSON.stringify(value, null, 2);
  if (format === "yaml") return stringifyYaml(value);
  return toCsv(toRows(value), csv.delimiter);
}
