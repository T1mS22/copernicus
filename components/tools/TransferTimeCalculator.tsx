"use client";

import { useState } from "react";
import { Panel } from "@/components/ui";
import { formatShortDuration, parseAnyDuration } from "@/lib/duration";
import {
  formatBitRate,
  requiredBitsPerSecond,
  SIZE_UNITS,
  SPEED_PRESETS,
  SPEED_UNITS,
  transferSeconds,
} from "@/lib/transfer";
import { parseNumber } from "@/lib/units";

export default function TransferTimeCalculator() {
  const [size, setSize] = useState("50");
  const [sizeUnit, setSizeUnit] = useState("GB");
  const [speed, setSpeed] = useState("100");
  const [speedUnit, setSpeedUnit] = useState("Mbit");
  const [overhead, setOverhead] = useState(10);
  const [target, setTarget] = useState("1 hour");

  const bytes =
    (parseNumber(size) ?? NaN) *
    SIZE_UNITS.find((u) => u.id === sizeUnit)!.factor;
  const bps =
    (parseNumber(speed) ?? NaN) *
    SPEED_UNITS.find((u) => u.id === speedUnit)!.factor;
  const valid = bytes > 0 && bps > 0;
  const seconds = valid ? transferSeconds(bytes, bps, overhead) : NaN;
  const targetSeconds = parseAnyDuration(target)?.seconds;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">Amount of data</span>
          <span className="join">
            <input
              value={size}
              onChange={(event) => setSize(event.target.value)}
              inputMode="decimal"
              className="input join-item w-full font-mono"
            />
            <select
              value={sizeUnit}
              onChange={(event) => setSizeUnit(event.target.value)}
              className="select join-item w-28"
            >
              {SIZE_UNITS.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.label}
                </option>
              ))}
            </select>
          </span>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">Connection speed</span>
          <span className="join">
            <input
              value={speed}
              onChange={(event) => setSpeed(event.target.value)}
              inputMode="decimal"
              className="input join-item w-full font-mono"
            />
            <select
              value={speedUnit}
              onChange={(event) => setSpeedUnit(event.target.value)}
              className="select join-item w-28"
            >
              {SPEED_UNITS.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.label}
                </option>
              ))}
            </select>
          </span>
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm">
        <span className="text-muted">Protocol overhead: {overhead} %</span>
        <input
          type="range"
          min={0}
          max={30}
          value={overhead}
          onChange={(event) => setOverhead(Number(event.target.value))}
          className="range range-primary range-sm w-full"
        />
      </label>

      <Panel>
        <p className="text-sm text-muted">Transfer time</p>
        <p className="mt-1 font-mono text-3xl">
          {valid ? formatShortDuration(seconds) : "—"}
        </p>
        {valid && (
          <p className="mt-1 text-sm text-faint">
            at an effective {formatBitRate(bps * (1 - overhead / 100))}
          </p>
        )}
      </Panel>

      {bytes > 0 && (
        <Panel title="At common speeds">
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <tbody>
                {SPEED_PRESETS.map(([label, rate]) => (
                  <tr key={label}>
                    <td className="text-muted">{label}</td>
                    <td className="font-mono">
                      {formatShortDuration(
                        transferSeconds(bytes, rate, overhead),
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <Panel title="Speed needed for a deadline">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">Finish within</span>
          <input
            value={target}
            onChange={(event) => setTarget(event.target.value)}
            aria-label="Deadline"
            className="input input-sm w-40"
          />
          {bytes > 0 && targetSeconds && targetSeconds > 0 ? (
            <span>
              → at least{" "}
              <span className="font-mono text-primary">
                {formatBitRate(
                  requiredBitsPerSecond(bytes, targetSeconds, overhead),
                )}
              </span>
            </span>
          ) : (
            <span className="text-faint">e.g. 8 hours, 2d, PT30M</span>
          )}
        </div>
      </Panel>

      <p className="text-xs text-faint">
        Network speeds are in bits (100 Mbit/s ≈ 12.5 MB/s). Real transfers lose
        5–15 % to TCP/IP and TLS overhead, more with many small files or high
        latency.
      </p>
    </div>
  );
}
