"use client";

import { useState } from "react";
import { OutputRow, Panel } from "@/components/ui";
import {
  formatHumanDuration,
  formatIsoDuration,
  formatTimeSpan,
  parseAnyDuration,
} from "@/lib/duration";

const EXAMPLES = [
  "PT1H30M",
  "P7D",
  "P1DT12H",
  "PT30S",
  "01:30:00",
  "1.12:00:00",
  "90 min",
  "P1M",
];

const number = (value: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 }).format(value);

export default function DurationConverter() {
  const [input, setInput] = useState("PT1H30M");
  const parsed = input.trim() ? parseAnyDuration(input) : null;

  return (
    <div className="space-y-5">
      <div>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="PT1H30M, 01:30:00, 90 min or seconds"
          aria-label="Duration"
          spellCheck={false}
          autoComplete="off"
          className="input input-lg w-full font-mono"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setInput(example)}
              className="btn btn-ghost btn-xs border-line font-mono"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {input.trim() && !parsed && (
        <p className="text-sm text-error">
          Not a duration. Try ISO 8601 (PT1H30M), a .NET TimeSpan (01:30:00),
          text (1h 30m) or a number of seconds.
        </p>
      )}

      {parsed && (
        <Panel title={`Read as ${parsed.source}`}>
          {parsed.approximate && (
            <p className="mb-3 text-sm text-warning">
              Years and months vary in length, so they&apos;re converted with
              averages (1 month = 30.44 days, 1 year = 365.24 days).
            </p>
          )}
          <OutputRow
            label="ISO 8601"
            value={formatIsoDuration(parsed.seconds)}
          />
          <OutputRow
            label=".NET TimeSpan"
            value={formatTimeSpan(parsed.seconds)}
          />
          <OutputRow
            label="In words"
            value={formatHumanDuration(parsed.seconds)}
            mono={false}
          />
          <OutputRow
            label="Milliseconds"
            value={number(parsed.seconds * 1000)}
          />
          <OutputRow label="Seconds" value={number(parsed.seconds)} />
          <OutputRow label="Minutes" value={number(parsed.seconds / 60)} />
          <OutputRow label="Hours" value={number(parsed.seconds / 3600)} />
          <OutputRow label="Days" value={number(parsed.seconds / 86400)} />
        </Panel>
      )}

      <p className="text-xs text-faint">
        Azure uses ISO 8601 durations in many places: retention periods, Logic
        Apps and Data Factory timeouts, Service Bus TTLs, Key Vault rotation
        policies. host.json and .NET options usually take TimeSpan strings like
        00:05:00.
      </p>
    </div>
  );
}
