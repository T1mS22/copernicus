"use client";

import { useState } from "react";
import {
  CopyButton,
  ErrorMessage,
  formatBytes,
  Panel,
  Segmented,
} from "@/components/ui";
import { formatXml, minifyXml } from "@/lib/xml";

type Mode = "2" | "4" | "tab" | "minify";

// The browser's XML parser reports well-formedness errors that the
// formatter's tokenizer doesn't check, such as mismatched tags.
function validationError(xml: string): string | null {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const error = doc.querySelector("parsererror");
  if (!error) return null;
  return (
    error.textContent
      ?.replace(/^This page contains the following errors:/, "")
      .replace(/Below is a rendering of the page up to the first error\.$/, "")
      .trim() ?? "The XML isn't well-formed."
  );
}

function format(input: string, mode: Mode) {
  if (!input.trim()) return { output: "", error: null };
  const error = validationError(input);
  if (error) return { output: "", error };
  try {
    const output =
      mode === "minify"
        ? minifyXml(input)
        : formatXml(input, mode === "tab" ? "\t" : " ".repeat(Number(mode)));
    return { output, error: null };
  } catch (e) {
    return { output: "", error: (e as Error).message };
  }
}

export default function XmlFormatter() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("2");
  const { output, error } = format(input, mode);

  return (
    <div className="space-y-5">
      <Segmented
        label="Indentation"
        value={mode}
        onChange={setMode}
        options={[
          { value: "2", label: "2 spaces" },
          { value: "4", label: "4 spaces" },
          { value: "tab", label: "Tabs" },
          { value: "minify", label: "Minify" },
        ]}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder='<project><item id="1">Paste XML here</item></project>'
            aria-label="XML input"
            rows={18}
            spellCheck={false}
            className="textarea w-full font-mono text-sm"
          />
          {error && (
            <div className="mt-3">
              <ErrorMessage>
                <span className="whitespace-pre-wrap">{error}</span>
              </ErrorMessage>
            </div>
          )}
          {output && (
            <p className="mt-2 text-sm text-success">Well-formed XML.</p>
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
            aria-label="Formatted XML"
            spellCheck={false}
            className="textarea w-full font-mono text-sm"
          />
        </Panel>
      </div>
    </div>
  );
}
