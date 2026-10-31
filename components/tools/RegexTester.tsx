"use client";

import { useDeferredValue, useState } from "react";
import { CopyButton, ErrorMessage, Panel } from "@/components/ui";
import {
  buildRegex,
  findMatches,
  highlight,
  MAX_MATCHES,
  REGEX_FLAGS,
} from "@/lib/regex";

function evaluate(pattern: string, flags: string) {
  if (!pattern) return { regex: null, error: null };
  try {
    return { regex: buildRegex(pattern, flags), error: null };
  } catch (error) {
    return { regex: null, error: (error as Error).message };
  }
}

export default function RegexTester() {
  const [pattern, setPattern] = useState(
    "(?<user>[\\w.+-]+)@(?<domain>[\\w-]+(?:\\.[\\w-]+)+)",
  );
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState(
    "Write to tim@t-s.dev or support@example.com.\nNot an address: tim@localhost",
  );
  const [replacement, setReplacement] = useState("");

  const deferredText = useDeferredValue(text);
  const { regex, error } = evaluate(pattern, flags);
  const { matches, truncated } = regex
    ? findMatches(regex, deferredText)
    : { matches: [], truncated: false };
  const segments = highlight(deferredText, matches);
  const replaced =
    regex && replacement !== "" ? deferredText.replace(regex, replacement) : "";

  function toggleFlag(flag: string) {
    setFlags(
      flags.includes(flag)
        ? flags.replace(flag, "")
        : [...(flags + flag)].sort().join(""),
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="input w-full font-mono">
          <span className="text-faint">/</span>
          <input
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            placeholder="pattern"
            aria-label="Regular expression"
            spellCheck={false}
            autoComplete="off"
          />
          <span className="text-faint">/{flags}</span>
        </label>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {REGEX_FLAGS.map(({ flag, label, description }) => (
            <label
              key={flag}
              className="flex items-center gap-2"
              title={description}
            >
              <input
                type="checkbox"
                checked={flags.includes(flag)}
                onChange={() => toggleFlag(flag)}
                className="checkbox checkbox-sm checkbox-primary"
              />
              <span>
                {label} <span className="font-mono text-faint">{flag}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div className="grid gap-5 lg:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">Test text</span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={10}
            spellCheck={false}
            className="textarea w-full font-mono text-sm"
          />
        </label>
        <div className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">
            {matches.length === 0
              ? "No matches"
              : `${matches.length}${truncated ? "+" : ""} match${matches.length === 1 ? "" : "es"}`}
          </span>
          <div className="min-h-60 flex-1 overflow-auto rounded-field border border-line bg-base-200 p-3 font-mono text-sm break-all whitespace-pre-wrap">
            {segments.map((segment, i) =>
              segment.match === null ? (
                <span key={i}>{segment.text}</span>
              ) : (
                <mark
                  key={i}
                  className={`rounded-sm text-base-content ${segment.match % 2 ? "bg-accent/45" : "bg-primary/35"}`}
                >
                  {segment.text}
                </mark>
              ),
            )}
          </div>
        </div>
      </div>
      {truncated && (
        <p className="text-xs text-faint">
          Only the first {MAX_MATCHES} matches are shown.
        </p>
      )}

      {matches.length > 0 && (
        <Panel title="Matches">
          <div className="max-h-80 overflow-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Match</th>
                  <th>Position</th>
                  <th>Groups</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {matches.slice(0, 200).map((match, i) => (
                  <tr key={i}>
                    <td className="text-faint">{i + 1}</td>
                    <td className="break-all">
                      {match.text || (
                        <span className="text-faint">(empty)</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap text-faint">
                      {match.index}–{match.end}
                    </td>
                    <td className="text-xs">
                      {match.groups.map((group) => (
                        <div key={group.name} className="break-all">
                          <span className="text-faint">{group.name}:</span>{" "}
                          {group.value ?? (
                            <span className="text-faint">undefined</span>
                          )}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <Panel title="Replace" actions={<CopyButton value={replaced} />}>
        <input
          value={replacement}
          onChange={(event) => setReplacement(event.target.value)}
          placeholder="Replacement, e.g. $<user> at $<domain> or $1"
          aria-label="Replacement"
          spellCheck={false}
          className="input w-full font-mono text-sm"
        />
        {replaced && (
          <pre className="mt-3 overflow-x-auto font-mono text-sm whitespace-pre-wrap break-all">
            {replaced}
          </pre>
        )}
      </Panel>

      <p className="text-xs text-faint">
        Uses your browser&apos;s JavaScript regex engine. Syntax is close to
        .NET and PCRE, but lookbehind support and some features differ.
      </p>
    </div>
  );
}
