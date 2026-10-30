"use client";

import { useState } from "react";
import { CopyButton, Panel } from "@/components/ui";
import {
  convert,
  findUnit,
  formatNumber,
  parseNumber,
  UNIT_CATEGORIES,
} from "@/lib/units";

const DEFAULT_UNITS: Record<string, string> = {
  length: "m",
  mass: "kg",
  temperature: "c",
  area: "m2",
  volume: "l",
  speed: "kmh",
  time: "h",
  data: "GB",
  pressure: "bar",
  energy: "kwh",
};

export default function UnitConverter() {
  const [categoryId, setCategoryId] = useState(UNIT_CATEGORIES[0].id);
  const [fromId, setFromId] = useState(DEFAULT_UNITS[categoryId]);
  const [input, setInput] = useState("1");

  const category =
    UNIT_CATEGORIES.find((c) => c.id === categoryId) ?? UNIT_CATEGORIES[0];
  const from = findUnit(category, fromId);
  const value = parseNumber(input);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {UNIT_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={c.id === categoryId}
            onClick={() => {
              setCategoryId(c.id);
              setFromId(DEFAULT_UNITS[c.id] ?? c.units[0].id);
            }}
            className={`btn btn-sm ${c.id === categoryId ? "btn-primary" : "btn-ghost border-line"}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          aria-label="Value"
          inputMode="decimal"
          spellCheck={false}
          className="input input-lg flex-1 font-mono"
        />
        <select
          value={from.id}
          onChange={(event) => setFromId(event.target.value)}
          aria-label="From unit"
          className="select select-lg sm:w-72"
        >
          {category.units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label} ({u.symbol})
            </option>
          ))}
        </select>
      </div>
      {input.trim() && value === null && (
        <p className="text-sm text-error">
          That isn&apos;t a number. Both 1.5 and 1,5 work.
        </p>
      )}

      <Panel>
        <div className="overflow-x-auto">
          <table className="table">
            <tbody>
              {category.units.map((to) => {
                const result =
                  value === null ? "" : formatNumber(convert(value, from, to));
                return (
                  <tr
                    key={to.id}
                    className={to.id === from.id ? "text-primary" : undefined}
                  >
                    <td className="w-full font-mono text-base break-all">
                      {result || "—"}
                    </td>
                    <td className="whitespace-nowrap text-muted">
                      {to.label}{" "}
                      <span className="font-mono text-faint">{to.symbol}</span>
                    </td>
                    <td className="w-0">
                      <CopyButton value={result} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {categoryId === "data" && (
        <p className="text-xs text-faint">
          kB, MB and GB are powers of 1000 (what disk makers use); KiB, MiB and
          GiB are powers of 1024 (what Windows shows, labelled as “GB”).
        </p>
      )}
      {categoryId === "time" && (
        <p className="text-xs text-faint">
          Months and years are averages over the Gregorian calendar (30.44 and
          365.2425 days).
        </p>
      )}
    </div>
  );
}
