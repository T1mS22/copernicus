"use client";

import cronstrue from "cronstrue";
import { useState } from "react";
import { ErrorMessage, Panel } from "@/components/ui";
import { type Cron, CRON_MACROS, nextRuns, parseCron } from "@/lib/cron";

const EXAMPLES: [string, string][] = [
  ["*/15 9-17 * * MON-FRI", "Every 15 min, office hours"],
  ["0 2 * * *", "Nightly at 02:00"],
  ["0 30 9 * * 1-5", "Azure Functions (with seconds)"],
  ["0 0 1 * *", "First of the month"],
  ["@hourly", "Macro"],
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// "0,1,2,3,7" → "0–3, 7"
function summarize(
  values: Set<number>,
  total: number,
  label?: (v: number) => string,
): string {
  if (values.size === total) return "every";
  const sorted = [...values].sort((a, b) => a - b);
  const name = label ?? String;
  const parts: string[] = [];
  for (let i = 0; i < sorted.length; i++) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j] + 1) j++;
    parts.push(
      j - i >= 2
        ? `${name(sorted[i])}–${name(sorted[j])}`
        : sorted
            .slice(i, j + 1)
            .map(name)
            .join(", "),
    );
    i = j;
  }
  return parts.join(", ");
}

function describe(expression: string): string | null {
  try {
    return cronstrue.toString(
      CRON_MACROS[expression.trim().toLowerCase()] ?? expression,
      {
        use24HourTimeFormat: true,
        throwExceptionOnParseError: true,
      },
    );
  } catch {
    return null;
  }
}

function parse(expression: string): {
  cron: Cron | null;
  error: string | null;
} {
  try {
    return { cron: parseCron(expression), error: null };
  } catch (error) {
    return { cron: null, error: (error as Error).message };
  }
}

export default function CronExplainer() {
  const [expression, setExpression] = useState(EXAMPLES[0][0]);
  const { cron, error } = expression.trim()
    ? parse(expression)
    : { cron: null, error: null };
  const description = cron ? describe(expression) : null;
  const runs = cron ? nextRuns(cron, new Date(), 10) : [];

  const fields: [string, string][] = cron
    ? [
        ...(cron.hasSeconds
          ? [["Second", summarize(cron.seconds, 60)] as [string, string]]
          : []),
        ["Minute", summarize(cron.minutes, 60)],
        ["Hour", summarize(cron.hours, 24)],
        ["Day of month", summarize(cron.days, 31)],
        ["Month", summarize(cron.months, 12, (m) => MONTHS[m - 1])],
        ["Day of week", summarize(cron.weekdays, 7, (d) => WEEKDAYS[d])],
      ]
    : [];

  return (
    <div className="space-y-5">
      <div>
        <input
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
          aria-label="Cron expression"
          spellCheck={false}
          autoComplete="off"
          className="input input-lg w-full font-mono"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setExpression(value)}
              title={label}
              className="btn btn-ghost btn-xs border-line font-mono"
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {cron && (
        <>
          <Panel>
            <p className="text-lg font-semibold">
              {description ?? "Valid schedule"}
            </p>
            <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              {fields.map(([label, value]) => (
                <div key={label} className="flex gap-3">
                  <dt className="w-28 shrink-0 text-muted">{label}</dt>
                  <dd className="font-mono break-all">{value}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel title="Next runs">
            {runs.length === 0 ? (
              <p className="text-sm text-muted">
                This schedule never runs in the next few years (for example 30
                February).
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Local time</th>
                      <th>UTC</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {runs.map((run) => (
                      <tr key={run.getTime()}>
                        <td className="whitespace-nowrap">
                          {run.toLocaleString("en-GB", {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: cron.hasSeconds ? "2-digit" : undefined,
                          })}
                        </td>
                        <td className="whitespace-nowrap text-muted">
                          {run
                            .toISOString()
                            .replace("T", " ")
                            .slice(0, cron.hasSeconds ? 19 : 16)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </>
      )}

      <p className="text-xs text-faint">
        Five fields (minute hour day month weekday) is classic cron. Six fields
        add seconds at the front, as Azure Functions timer triggers use; those
        run in UTC unless WEBSITE_TIME_ZONE is set. If both day of month and day
        of week are set, either one matching is enough.
      </p>
    </div>
  );
}
