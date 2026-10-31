"use client";

import { useState } from "react";
import { OutputRow, Panel } from "@/components/ui";
import {
  detectBase,
  formatInBase,
  parseInBase,
  twosComplement,
} from "@/lib/numberbase";

const BASES = [
  { value: "auto", label: "Detect (0x, 0b, 0o)" },
  { value: "2", label: "Binary (2)" },
  { value: "8", label: "Octal (8)" },
  { value: "10", label: "Decimal (10)" },
  { value: "16", label: "Hexadecimal (16)" },
];

export default function NumberBaseConverter() {
  const [input, setInput] = useState("0xFF7A00");
  const [inputBase, setInputBase] = useState("auto");
  const [customBase, setCustomBase] = useState(36);

  const base = inputBase === "auto" ? detectBase(input) : Number(inputBase);
  const value = input.trim() ? parseInBase(input, base) : null;
  const bits =
    value === null ? 0 : (value < 0n ? -value : value).toString(2).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          aria-label="Number"
          spellCheck={false}
          autoComplete="off"
          className="input input-lg flex-1 font-mono"
        />
        <select
          value={inputBase}
          onChange={(event) => setInputBase(event.target.value)}
          aria-label="Input base"
          className="select select-lg sm:w-64"
        >
          {BASES.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </div>
      {input.trim() && value === null && (
        <p className="text-sm text-error">
          That isn&apos;t a valid base-{base} number.
        </p>
      )}

      {value !== null && (
        <Panel>
          <OutputRow label="Decimal" value={formatInBase(value, 10)} />
          <OutputRow label="Hexadecimal" value={formatInBase(value, 16)} />
          <OutputRow label="Octal" value={formatInBase(value, 8)} />
          <OutputRow label="Binary" value={formatInBase(value, 2, 4)} />
          <div className="flex flex-col gap-1 border-b border-line py-2.5 sm:flex-row sm:items-center sm:gap-4">
            <label className="flex w-44 shrink-0 items-center gap-2 text-sm text-muted">
              Base
              <input
                type="number"
                min={2}
                max={36}
                value={customBase}
                onChange={(event) =>
                  setCustomBase(
                    Math.min(36, Math.max(2, Number(event.target.value) || 2)),
                  )
                }
                className="input input-xs w-16"
              />
            </label>
            <span className="min-w-0 flex-1 font-mono text-sm break-all">
              {formatInBase(value, customBase)}
            </span>
          </div>
          <OutputRow label="Bit length" value={String(bits)} />
          {value < 0n &&
            [8, 16, 32, 64].map((size) => {
              const pattern = twosComplement(value, size);
              return pattern === null ? null : (
                <OutputRow
                  key={size}
                  label={`Two's complement (${size}-bit)`}
                  value={`${formatInBase(pattern, 16)} · ${formatInBase(pattern, 2, 4)}`}
                />
              );
            })}
        </Panel>
      )}

      <p className="text-xs text-faint">
        Works with numbers of any size. Underscores and spaces between digits
        are ignored, so 1111_0000 and FF 7A 00 both work.
      </p>
    </div>
  );
}
