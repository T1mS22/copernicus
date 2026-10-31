"use client";

import { ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import { CopyButton, ErrorMessage, Panel, Segmented } from "@/components/ui";
import { CSV_DELIMITERS, type CsvDelimiter, detectDelimiter } from "@/lib/csv";
import {
  type CsvOptions,
  type DataFormat,
  parseData,
  serializeData,
} from "@/lib/dataconvert";

const FORMATS: { value: DataFormat; label: string }[] = [
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "csv", label: "CSV" },
];

const PLACEHOLDERS: Record<DataFormat, string> = {
  json: '[{"name": "Tim", "city": "Kirchen"}]',
  yaml: "- name: Tim\n  city: Kirchen",
  csv: "name;city\nTim;Kirchen",
};

function convert(
  input: string,
  from: DataFormat,
  to: DataFormat,
  csv: CsvOptions & { autoDelimiter: boolean },
) {
  if (!input.trim())
    return { output: "", error: null, delimiter: csv.delimiter };
  const delimiter =
    from === "csv" && csv.autoDelimiter
      ? detectDelimiter(input)
      : csv.delimiter;
  try {
    const value = parseData(input, from, { ...csv, delimiter });
    return { output: serializeData(value, to, csv), error: null, delimiter };
  } catch (error) {
    return { output: "", error: (error as Error).message, delimiter };
  }
}

export default function DataConverter() {
  const [from, setFrom] = useState<DataFormat>("json");
  const [to, setTo] = useState<DataFormat>("yaml");
  const [input, setInput] = useState("");
  const [delimiter, setDelimiter] = useState<CsvDelimiter>(";");
  const [autoDelimiter, setAutoDelimiter] = useState(true);
  const [header, setHeader] = useState(true);
  const [inferTypes, setInferTypes] = useState(true);

  const usesCsv = from === "csv" || to === "csv";
  const result = convert(input, from, to, {
    delimiter,
    autoDelimiter,
    header,
    inferTypes,
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-2 text-sm">
          <span className="text-muted">From</span>
          <Segmented
            label="From"
            value={from}
            onChange={setFrom}
            options={FORMATS}
          />
        </span>
        <button
          type="button"
          aria-label="Swap formats"
          className="btn btn-ghost btn-sm btn-square"
          onClick={() => {
            setFrom(to);
            setTo(from);
            if (result.output) setInput(result.output);
          }}
        >
          <ArrowLeftRight className="size-4" />
        </button>
        <span className="flex items-center gap-2 text-sm">
          <span className="text-muted">To</span>
          <Segmented label="To" value={to} onChange={setTo} options={FORMATS} />
        </span>
      </div>

      {usesCsv && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-muted">Delimiter</span>
            <select
              value={from === "csv" && autoDelimiter ? "auto" : delimiter}
              onChange={(event) => {
                const value = event.target.value;
                setAutoDelimiter(value === "auto");
                if (value !== "auto") setDelimiter(value as CsvDelimiter);
              }}
              className="select select-sm w-60"
            >
              {from === "csv" && (
                <option value="auto">
                  Detect (
                  {
                    CSV_DELIMITERS.find((d) => d.value === result.delimiter)
                      ?.label
                  }
                  )
                </option>
              )}
              {CSV_DELIMITERS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </label>
          {from === "csv" && (
            <>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={header}
                  onChange={(event) => setHeader(event.target.checked)}
                  className="checkbox checkbox-sm checkbox-primary"
                />
                First row is a header
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={inferTypes}
                  onChange={(event) => setInferTypes(event.target.checked)}
                  className="checkbox checkbox-sm checkbox-primary"
                />
                Detect numbers and true/false
              </label>
            </>
          )}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={PLACEHOLDERS[from]}
          aria-label={`${from.toUpperCase()} input`}
          rows={18}
          spellCheck={false}
          className="textarea w-full font-mono text-sm"
        />
        <Panel
          title={to.toUpperCase()}
          actions={<CopyButton value={result.output} />}
        >
          {result.error ? (
            <ErrorMessage>{result.error}</ErrorMessage>
          ) : (
            <textarea
              readOnly
              value={result.output}
              rows={16}
              aria-label={`${to.toUpperCase()} output`}
              spellCheck={false}
              className="textarea w-full font-mono text-sm"
            />
          )}
        </Panel>
      </div>

      <p className="text-xs text-faint">
        CSV needs a list of objects (one per row). Nested values are written as
        JSON inside the cell. Excel in German uses semicolons, which is the
        default for CSV output.
      </p>
    </div>
  );
}
