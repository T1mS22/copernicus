"use client";

import { useState } from "react";
import {
  CopyButton,
  ErrorMessage,
  formatBytes,
  Panel,
  Segmented,
} from "@/components/ui";
import { bytesToBase64, decodeText, encodeText } from "@/lib/base64";

type Mode = "encode" | "decode";

const MAX_FILE_BYTES = 10 * 1024 * 1024;

function convert(mode: Mode, input: string, urlSafe: boolean) {
  if (!input) return { output: "", error: null };
  try {
    return {
      output:
        mode === "encode" ? encodeText(input, urlSafe) : decodeText(input),
      error: null,
    };
  } catch (error) {
    return { output: "", error: (error as Error).message };
  }
}

export default function Base64Tool() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [urlSafe, setUrlSafe] = useState(false);
  const [file, setFile] = useState<{ name: string; base64: string } | null>(
    null,
  );
  const [fileError, setFileError] = useState<string | null>(null);

  const { output, error } = file
    ? { output: file.base64, error: null }
    : convert(mode, input, urlSafe);

  async function readFile(selected: File | undefined) {
    setFileError(null);
    if (!selected) return;
    if (selected.size > MAX_FILE_BYTES) {
      setFileError(
        `That file is ${formatBytes(selected.size)}. Files up to ${formatBytes(MAX_FILE_BYTES)} are supported.`,
      );
      return;
    }
    const bytes = new Uint8Array(await selected.arrayBuffer());
    setFile({ name: selected.name, base64: bytesToBase64(bytes, urlSafe) });
    setMode("encode");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <Segmented
          label="Direction"
          value={mode}
          onChange={(next) => {
            setMode(next);
            setFile(null);
            // Swap so the previous result can be converted back.
            if (output && !error && !file) setInput(output);
          }}
          options={[
            { value: "encode", label: "Encode" },
            { value: "decode", label: "Decode" },
          ]}
        />
        {mode === "encode" && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(event) => {
                setUrlSafe(event.target.checked);
                setFile(null);
              }}
              className="checkbox checkbox-sm checkbox-primary"
            />
            URL-safe (Base64url, no padding)
          </label>
        )}
      </div>

      {file ? (
        <Panel
          title={`File: ${file.name}`}
          actions={
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setFile(null)}
            >
              Back to text
            </button>
          }
        >
          <p className="text-sm text-muted">
            Encoded to {formatBytes(file.base64.length)} of Base64.
          </p>
        </Panel>
      ) : (
        <div>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={
              mode === "encode" ? "Text to encode…" : "Base64 to decode…"
            }
            aria-label="Input"
            rows={6}
            spellCheck={false}
            className="textarea w-full font-mono text-sm"
          />
          {mode === "encode" && (
            <label className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
              Or encode a file:
              <input
                type="file"
                onChange={(event) => readFile(event.target.files?.[0])}
                className="file-input file-input-sm"
              />
            </label>
          )}
        </div>
      )}

      {fileError && <ErrorMessage>{fileError}</ErrorMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Panel title="Result" actions={<CopyButton value={output} />}>
        <textarea
          readOnly
          value={output}
          rows={6}
          aria-label="Result"
          spellCheck={false}
          className="textarea w-full font-mono text-sm"
        />
      </Panel>
    </div>
  );
}
