"use client";

import { useState } from "react";
import {
  CopyButton,
  ErrorMessage,
  formatBytes,
  Panel,
  Segmented,
} from "@/components/ui";
import { formatJson, type JsonIndent, parseJson } from "@/lib/json";

const INDENTS: { value: string; label: string }[] = [
  { value: "2", label: "2 spaces" },
  { value: "4", label: "4 spaces" },
  { value: "tab", label: "Tabs" },
  { value: "minify", label: "Minify" },
];

function toIndent(value: string): JsonIndent {
  return value === "2" || value === "4"
    ? (Number(value) as JsonIndent)
    : (value as JsonIndent);
}

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState("2");
  const [sortKeys, setSortKeys] = useState(false);

  const result = input.trim() ? parseJson(input) : null;
  const output =
    result?.ok === true
      ? formatJson(result.value, toIndent(indent), sortKeys)
      : "";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <Segmented
          label="Indentation"
          value={indent}
          onChange={setIndent}
          options={INDENTS}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={sortKeys}
            onChange={(event) => setSortKeys(event.target.checked)}
            className="checkbox checkbox-sm checkbox-primary"
          />
          Sort keys
        </label>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder='Paste JSON, e.g. {"name": "Copernicus"}'
            aria-label="JSON input"
            rows={18}
            spellCheck={false}
            className="textarea w-full font-mono text-sm"
          />
          {result?.ok === false && (
            <div className="mt-3">
              <ErrorMessage>
                <span>
                  {result.line !== undefined && (
                    <strong>
                      Line {result.line}, column {result.column}:{" "}
                    </strong>
                  )}
                  {result.message}
                </span>
              </ErrorMessage>
            </div>
          )}
          {result?.ok === true && (
            <p className="mt-2 text-sm text-success">Valid JSON.</p>
          )}
        </div>

        <Panel
          title="Result"
          actions={
            <span className="flex items-center gap-2 text-xs text-faint">
              {output && formatBytes(new TextEncoder().encode(output).length)}
              <CopyButton value={output} />
            </span>
          }
        >
          <textarea
            readOnly
            value={output}
            rows={16}
            aria-label="Formatted JSON"
            spellCheck={false}
            className="textarea w-full font-mono text-sm"
          />
        </Panel>
      </div>

      <p className="text-xs text-faint">
        Numbers beyond 2^53 (such as some 64-bit IDs) lose precision in
        JavaScript, so very long numeric IDs may change when reformatted.
      </p>
    </div>
  );
}
