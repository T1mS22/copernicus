"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { CopyButton, Panel, Segmented } from "@/components/ui";
import {
  formatUuid,
  generateUuids,
  type UuidFormat,
  type UuidVersion,
} from "@/lib/uuid";

const FORMATS: { value: UuidFormat; label: string }[] = [
  { value: "standard", label: "Lowercase" },
  { value: "uppercase", label: "Uppercase" },
  { value: "braces", label: "{Braces}" },
  { value: "compact", label: "No hyphens" },
];

const MAX_COUNT = 500;

export default function UuidGenerator() {
  const [version, setVersion] = useState<UuidVersion>(4);
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState<UuidFormat>("standard");
  const [ids, setIds] = useState(() => generateUuids(4, 5));

  function regenerate(nextVersion = version, nextCount = count) {
    setIds(generateUuids(nextVersion, nextCount));
  }

  const output = ids.map((id) => formatUuid(id, format)).join("\n");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">Version</span>
          <Segmented
            label="Version"
            value={String(version)}
            onChange={(value) => {
              const next = Number(value) as UuidVersion;
              setVersion(next);
              regenerate(next);
            }}
            options={[
              { value: "4", label: "v4 (random)" },
              { value: "7", label: "v7 (time-ordered)" },
            ]}
          />
        </div>
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
              regenerate(version, next);
            }}
            className="input input-sm w-24"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">Format</span>
          <select
            value={format}
            onChange={(event) => setFormat(event.target.value as UuidFormat)}
            className="select select-sm w-40"
          >
            {FORMATS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Panel>
        <textarea
          readOnly
          value={output}
          rows={Math.min(ids.length, 12)}
          aria-label="Generated UUIDs"
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
            onClick={() => regenerate()}
          >
            <RefreshCw className="size-4" />
            Generate new
          </button>
        </div>
      </Panel>

      <p className="text-xs text-faint">
        v4 is fully random. v7 starts with the creation time, so new IDs sort
        after older ones, which keeps database indexes compact. .NET 9+ creates
        them with <code className="font-mono">Guid.CreateVersion7()</code>.
      </p>
    </div>
  );
}
