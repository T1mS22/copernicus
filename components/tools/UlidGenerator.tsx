"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { CopyButton, OutputRow, Panel } from "@/components/ui";
import { generateUlids, isUlid, ulidTime, ulidToUuid } from "@/lib/ulid";

const MAX_COUNT = 500;

export default function UlidGenerator() {
  const [count, setCount] = useState(5);
  const [lowercase, setLowercase] = useState(false);
  const [ids, setIds] = useState(() => generateUlids(5));
  const [inspect, setInspect] = useState("");

  const output = ids
    .map((id) => (lowercase ? id.toLowerCase() : id))
    .join("\n");
  const inspected = inspect.trim();
  const time = inspected ? ulidTime(inspected) : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">How many</span>
          <input
            type="number"
            min={1}
            max={MAX_COUNT}
            value={count}
            onChange={(event) => {
              const next = Math.min(
                MAX_COUNT,
                Math.max(1, Number(event.target.value) || 1),
              );
              setCount(next);
              setIds(generateUlids(next));
            }}
            className="input input-sm w-24"
          />
        </label>
        <label className="flex items-center gap-2 pb-1.5 text-sm">
          <input
            type="checkbox"
            checked={lowercase}
            onChange={(event) => setLowercase(event.target.checked)}
            className="checkbox checkbox-sm checkbox-primary"
          />
          Lowercase
        </label>
      </div>

      <Panel>
        <textarea
          readOnly
          value={output}
          rows={Math.min(ids.length, 12)}
          aria-label="Generated ULIDs"
          spellCheck={false}
          className="textarea w-full font-mono text-sm"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <CopyButton
            value={output}
            label={ids.length > 1 ? "Copy all" : "Copy"}
            primary
          />
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setIds(generateUlids(count))}
          >
            <RefreshCw className="size-4" />
            Generate new
          </button>
        </div>
      </Panel>

      <Panel title="Inspect a ULID">
        <input
          value={inspect}
          onChange={(event) => setInspect(event.target.value)}
          placeholder="01JB…"
          aria-label="ULID to inspect"
          spellCheck={false}
          className="input w-full font-mono"
        />
        {inspected && !isUlid(inspected) && (
          <p className="mt-3 text-sm text-error">
            A ULID has 26 characters from 0–9 and A–Z without I, L, O and U.
          </p>
        )}
        {time && (
          <div className="mt-3">
            <OutputRow label="Created (UTC)" value={time.toISOString()} />
            <OutputRow
              label="Created (local)"
              value={time.toLocaleString("en-GB", {
                dateStyle: "full",
                timeStyle: "medium",
              })}
              mono={false}
            />
            <OutputRow label="As UUID" value={ulidToUuid(inspected) ?? ""} />
          </div>
        )}
      </Panel>

      <p className="text-xs text-faint">
        ULIDs start with the creation time in milliseconds, so they sort in
        creation order, and use Crockford Base32, so they&apos;re shorter than
        UUIDs and safe in URLs. IDs from one batch count up in order.
      </p>
    </div>
  );
}
