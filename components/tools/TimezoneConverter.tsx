"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Panel } from "@/components/ui";
import { toLocalInputValue } from "@/lib/timestamp";
import {
  dayShift,
  formatInZone,
  localTimeZone,
  parseWallTime,
  timeZones,
  zonedTimeToUtc,
} from "@/lib/timezone";

const DEFAULT_ZONES = [
  "UTC",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const label = (zone: string) => zone.replace(/_/g, " ").replace("/", " / ");

export default function TimezoneConverter() {
  const zones = timeZones();
  const local = localTimeZone();
  const [sourceZone, setSourceZone] = useState(local);
  const [wallTime, setWallTime] = useState(() =>
    toLocalInputValue(new Date()).slice(0, 16),
  );
  const [targets, setTargets] = useState(() => [
    local,
    ...DEFAULT_ZONES.filter((zone) => zone !== local),
  ]);
  const [adding, setAdding] = useState("");

  const wall = parseWallTime(wallTime);
  const instant = wall ? zonedTimeToUtc(wall, sourceZone) : null;

  function addZone(zone: string) {
    if (zones.includes(zone) && !targets.includes(zone)) {
      setTargets([...targets, zone]);
    }
    setAdding("");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="datetime-local"
          value={wallTime}
          onChange={(event) => setWallTime(event.target.value)}
          aria-label="Date and time"
          className="input flex-1"
        />
        <select
          value={sourceZone}
          onChange={(event) => setSourceZone(event.target.value)}
          aria-label="Time zone of that date and time"
          className="select sm:w-72"
        >
          {zones.map((zone) => (
            <option key={zone} value={zone}>
              {label(zone)}
              {zone === local ? " (yours)" : ""}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setSourceZone(local);
            setWallTime(toLocalInputValue(new Date()).slice(0, 16));
          }}
        >
          Now
        </button>
      </div>

      {instant && (
        <Panel>
          <ul>
            {targets.map((zone) => {
              const shown = formatInZone(instant, zone);
              const shift = dayShift(instant, sourceZone, zone);
              return (
                <li
                  key={zone}
                  className="flex items-center gap-4 border-b border-line py-3 last:border-b-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      {label(zone)}
                      {zone === local && (
                        <span className="ml-2 badge badge-ghost badge-sm">
                          yours
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-faint">{shown.offset}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xl tabular-nums">
                      {shown.time}
                      {shift !== 0 && (
                        <span
                          className={`ml-1.5 text-xs ${shift > 0 ? "text-success" : "text-warning"}`}
                        >
                          {shift > 0 ? `+${shift}` : shift}d
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted">{shown.date}</p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${label(zone)}`}
                    onClick={() =>
                      setTargets(targets.filter((z) => z !== zone))
                    }
                    className="btn btn-ghost btn-sm btn-square"
                  >
                    <X className="size-4" />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-3 flex gap-2">
            <input
              list="time-zones"
              value={adding}
              onChange={(event) => setAdding(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && addZone(adding)}
              placeholder="Add a time zone, e.g. Asia/Singapore"
              aria-label="Add a time zone"
              className="input input-sm flex-1"
            />
            <datalist id="time-zones">
              {zones.map((zone) => (
                <option key={zone} value={zone} />
              ))}
            </datalist>
            <button
              type="button"
              onClick={() => addZone(adding)}
              disabled={!zones.includes(adding)}
              className="btn btn-sm"
            >
              <Plus className="size-4" />
              Add
            </button>
          </div>
        </Panel>
      )}

      <p className="text-xs text-faint">
        Offsets include daylight saving time for the chosen date. “+1d” means
        it&apos;s already the next day there.
      </p>
    </div>
  );
}
