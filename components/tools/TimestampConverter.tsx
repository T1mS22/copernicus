"use client";

import { useState, useSyncExternalStore } from "react";
import { CopyButton, OutputRow, Panel } from "@/components/ui";
import {
  parseDate,
  parseTimestamp,
  relativeTime,
  type TimestampUnit,
  toLocalInputValue,
  UNIT_LABELS,
} from "@/lib/timestamp";

function subscribeToSeconds(callback: () => void) {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
}

// Current Unix time in seconds, ticking. null during the server render.
function useNowSeconds(): number | null {
  return useSyncExternalStore(
    subscribeToSeconds,
    () => Math.floor(Date.now() / 1000),
    () => null,
  );
}

const timeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

function DateDetails({ date }: { date: Date }) {
  const local = date.toLocaleString("en-GB", {
    dateStyle: "full",
    timeStyle: "long",
  });
  return (
    <div className="mt-3">
      <OutputRow label="ISO 8601 (UTC)" value={date.toISOString()} />
      <OutputRow label={`Local (${timeZone()})`} value={local} mono={false} />
      <OutputRow label="RFC 7231 / HTTP" value={date.toUTCString()} />
      <OutputRow label="Relative" value={relativeTime(date)} mono={false} />
      <OutputRow
        label="Unix seconds"
        value={String(Math.floor(date.getTime() / 1000))}
      />
      <OutputRow label="Unix milliseconds" value={String(date.getTime())} />
    </div>
  );
}

export default function TimestampConverter() {
  const now = useNowSeconds();
  const [timestamp, setTimestamp] = useState("");
  const [unit, setUnit] = useState<TimestampUnit | "auto">("auto");
  const [dateInput, setDateInput] = useState("");

  const parsed = timestamp ? parseTimestamp(timestamp, unit) : null;
  const date = dateInput ? parseDate(dateInput) : null;

  return (
    <div className="space-y-5">
      <Panel
        title="Current Unix time"
        actions={<CopyButton value={now === null ? "" : String(now)} />}
      >
        <p className="font-mono text-2xl tabular-nums">{now ?? "…"}</p>
      </Panel>

      <Panel title="Timestamp to date">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={timestamp}
            onChange={(event) => setTimestamp(event.target.value)}
            placeholder="e.g. 1761825600"
            aria-label="Unix timestamp"
            inputMode="numeric"
            spellCheck={false}
            className="input flex-1 font-mono"
          />
          <select
            value={unit}
            onChange={(event) =>
              setUnit(event.target.value as TimestampUnit | "auto")
            }
            aria-label="Unit"
            className="select sm:w-52"
          >
            <option value="auto">
              Detect unit
              {parsed && unit === "auto"
                ? ` (${UNIT_LABELS[parsed.unit].toLowerCase()})`
                : ""}
            </option>
            {Object.entries(UNIT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        {timestamp && !parsed && (
          <p className="mt-3 text-sm text-error">
            That isn&apos;t a number. Enter whole or decimal Unix time.
          </p>
        )}
        {parsed && <DateDetails date={parsed.date} />}
      </Panel>

      <Panel title="Date to timestamp">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="datetime-local"
            step={1}
            value={/^\d{4}-\d{2}-\d{2}T/.test(dateInput) ? dateInput : ""}
            onChange={(event) => setDateInput(event.target.value)}
            aria-label="Date and time (local)"
            className="input flex-1"
          />
          <input
            value={dateInput}
            onChange={(event) => setDateInput(event.target.value)}
            placeholder="or paste ISO 8601, e.g. 2026-10-30T12:00:00Z"
            aria-label="Date as text"
            spellCheck={false}
            className="input flex-1 font-mono text-sm"
          />
          <button
            type="button"
            className="btn"
            onClick={() => setDateInput(toLocalInputValue(new Date()))}
          >
            Now
          </button>
        </div>
        {dateInput && !date && (
          <p className="mt-3 text-sm text-error">
            That date couldn&apos;t be read. Try ISO 8601 like
            2026-10-30T14:30:00+01:00.
          </p>
        )}
        {date && <DateDetails date={date} />}
        <p className="mt-3 text-xs text-faint">
          Dates without a time zone are read as your local time (
          {now !== null ? timeZone() : "…"}).
        </p>
      </Panel>
    </div>
  );
}
