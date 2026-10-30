"use client";

import { useState } from "react";
import {
  CopyButton,
  ErrorMessage,
  OutputRow,
  Panel,
  Segmented,
} from "@/components/ui";
import { decodeUrl, encodeUrl, parseUrl, type UrlEncodeMode } from "@/lib/url";

type Direction = "encode" | "decode";

function convert(
  direction: Direction,
  input: string,
  mode: UrlEncodeMode,
  plusAsSpace: boolean,
) {
  if (!input) return { output: "", error: null };
  try {
    return {
      output:
        direction === "encode"
          ? encodeUrl(input, mode)
          : decodeUrl(input, plusAsSpace),
      error: null,
    };
  } catch (error) {
    return { output: "", error: (error as Error).message };
  }
}

export default function UrlEncoder() {
  const [direction, setDirection] = useState<Direction>("decode");
  const [mode, setMode] = useState<UrlEncodeMode>("component");
  const [plusAsSpace, setPlusAsSpace] = useState(true);
  const [input, setInput] = useState("");

  const { output, error } = convert(direction, input, mode, plusAsSpace);
  const parts = parseUrl(input);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <Segmented
          label="Direction"
          value={direction}
          onChange={(next) => {
            setDirection(next);
            if (output && !error) setInput(output);
          }}
          options={[
            { value: "decode", label: "Decode" },
            { value: "encode", label: "Encode" },
          ]}
        />
        {direction === "encode" ? (
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as UrlEncodeMode)}
            aria-label="What to encode"
            className="select select-sm w-64"
          >
            <option value="component">
              A value (query parameter, path part)
            </option>
            <option value="full">A whole URL (keeps : / ? &amp; #)</option>
          </select>
        ) : (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={plusAsSpace}
              onChange={(event) => setPlusAsSpace(event.target.checked)}
              className="checkbox checkbox-sm checkbox-primary"
            />
            Treat + as a space (form encoding)
          </label>
        )}
      </div>

      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={
          direction === "encode"
            ? "Text to encode…"
            : "Encoded text or a full URL, e.g. https://example.com/?q=a%20b"
        }
        aria-label="Input"
        rows={5}
        spellCheck={false}
        className="textarea w-full font-mono text-sm break-all"
      />

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Panel title="Result" actions={<CopyButton value={output} />}>
        <textarea
          readOnly
          value={output}
          rows={5}
          aria-label="Result"
          spellCheck={false}
          className="textarea w-full font-mono text-sm break-all"
        />
      </Panel>

      {parts && (
        <Panel title="URL parts">
          <OutputRow label="Scheme" value={parts.protocol} />
          {parts.username && <OutputRow label="User" value={parts.username} />}
          {parts.password && (
            <OutputRow label="Password" value={parts.password} />
          )}
          <OutputRow label="Host" value={parts.hostname} />
          {parts.port && <OutputRow label="Port" value={parts.port} />}
          <OutputRow label="Path" value={parts.pathname} />
          {parts.hash && <OutputRow label="Fragment" value={parts.hash} />}
          {parts.params.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Value (decoded)</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {parts.params.map(([key, value], index) => (
                    <tr key={`${key}-${index}`}>
                      <td className="break-all">{key}</td>
                      <td className="break-all">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      )}
    </div>
  );
}
