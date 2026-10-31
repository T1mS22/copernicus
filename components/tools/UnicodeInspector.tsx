"use client";

import { useDeferredValue, useState } from "react";
import { CopyButton, Panel } from "@/components/ui";
import {
  type CharInfo,
  cleanText,
  inspect,
  mixedScriptWords,
  type Severity,
} from "@/lib/unicode";

const SEVERITY: Record<Severity, { label: string; className: string }> = {
  invisible: { label: "Invisible", className: "bg-error/25 text-error" },
  bidi: { label: "Text direction", className: "bg-error/25 text-error" },
  control: { label: "Control", className: "bg-error/25 text-error" },
  lookalike: { label: "Look-alike", className: "bg-warning/25 text-warning" },
};

const MAX_ROWS = 500;

function Visible({ chars }: { chars: CharInfo[] }) {
  return (
    <div className="max-h-72 overflow-auto rounded-field border border-line bg-base-100 p-3 font-mono text-sm break-all whitespace-pre-wrap">
      {chars.map((info, i) =>
        info.severity ? (
          <span
            key={i}
            title={`${info.hex} ${info.name ?? ""}`}
            className={`mx-px rounded-sm px-1 text-xs ${SEVERITY[info.severity].className}`}
          >
            {info.short}
          </span>
        ) : (
          <span key={i}>{info.char}</span>
        ),
      )}
    </div>
  );
}

export default function UnicodeInspector() {
  const [text, setText] = useState("");
  const [showAll, setShowAll] = useState(false);
  const deferred = useDeferredValue(text);
  const chars = inspect(deferred);
  const flagged = chars.filter((c) => c.severity);
  const mixed = mixedScriptWords(deferred);
  const cleaned = cleanText(deferred);

  // One row per distinct unusual character, with how often it occurs.
  const unusual = new Map<number, { info: CharInfo; count: number }>();
  for (const info of chars) {
    if (info.severity || info.codePoint > 0x7e) {
      const entry = unusual.get(info.codePoint);
      if (entry) entry.count++;
      else unusual.set(info.codePoint, { info, count: 1 });
    }
  }
  const rows = showAll
    ? chars.slice(0, MAX_ROWS).map((info) => ({ info, count: 1 }))
    : [...unusual.values()];

  return (
    <div className="space-y-5">
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Paste text that behaves strangely: a config value, a password that won't match, a copied command…"
        aria-label="Text to inspect"
        rows={6}
        spellCheck={false}
        className="textarea w-full font-mono text-sm"
      />

      {deferred && (
        <>
          <div className="flex flex-wrap gap-2 text-sm">
            <span
              className={`badge badge-soft ${flagged.length ? "badge-error" : "badge-success"}`}
            >
              {flagged.length
                ? `${flagged.length} suspicious character${flagged.length === 1 ? "" : "s"}`
                : "No hidden or look-alike characters"}
            </span>
            <span className="badge badge-ghost">
              {chars.length} code points
            </span>
            {deferred.startsWith("﻿") && (
              <span className="badge badge-soft badge-warning">
                Starts with a BOM
              </span>
            )}
          </div>

          {mixed.length > 0 && (
            <p className="text-sm text-error">
              Mixes Latin with Cyrillic or Greek letters, a common look-alike
              trick: <span className="font-mono">{mixed.join(", ")}</span>
            </p>
          )}

          <Panel title="With hidden characters shown">
            <Visible chars={chars} />
          </Panel>

          {flagged.length > 0 && (
            <Panel title="Cleaned" actions={<CopyButton value={cleaned} />}>
              <pre className="max-h-48 overflow-auto font-mono text-sm break-all whitespace-pre-wrap">
                {cleaned}
              </pre>
              <p className="mt-2 text-xs text-faint">
                Invisible and direction characters removed, look-alikes replaced
                with plain ASCII (&quot; &apos; - and spaces).
              </p>
            </Panel>
          )}

          <Panel
            title={
              showAll ? "All characters" : "Non-ASCII and special characters"
            }
            actions={
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show only special" : "Show all"}
              </button>
            }
          >
            {rows.length === 0 ? (
              <p className="text-sm text-muted">Only plain ASCII characters.</p>
            ) : (
              <div className="max-h-96 overflow-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Char</th>
                      <th>Code point</th>
                      <th>Name / type</th>
                      <th>UTF-8</th>
                      {!showAll && <th>Count</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ info, count }, i) => (
                      <tr key={i}>
                        <td className="font-mono">
                          {info.severity ? info.short : info.char}
                        </td>
                        <td className="font-mono whitespace-nowrap">
                          {info.hex}
                        </td>
                        <td>
                          {info.name ?? info.category}
                          {info.script && info.script !== "Latin" && (
                            <span className="ml-1 text-faint">
                              ({info.script})
                            </span>
                          )}
                          {info.severity && (
                            <span
                              className={`ml-2 rounded-sm px-1 text-xs ${SEVERITY[info.severity].className}`}
                            >
                              {SEVERITY[info.severity].label}
                            </span>
                          )}
                        </td>
                        <td className="font-mono text-xs whitespace-nowrap text-muted">
                          {info.utf8}
                        </td>
                        {!showAll && <td className="font-mono">{count}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {showAll && chars.length > MAX_ROWS && (
              <p className="mt-2 text-xs text-faint">
                Showing the first {MAX_ROWS} characters.
              </p>
            )}
          </Panel>
        </>
      )}

      <p className="text-xs text-faint">
        Typical culprits: no-break spaces and zero-width spaces from Teams,
        Outlook or web pages, curly quotes and dashes from Word, a BOM at the
        start of a file, and right-to-left override characters that make code
        look different from what it does (“Trojan Source”).
      </p>
    </div>
  );
}
