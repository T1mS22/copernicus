"use client";

import { useState } from "react";
import { OutputRow, Panel } from "@/components/ui";
import {
  addToDate,
  businessDays,
  calendarDifference,
  type DateUnit,
  dayOfYear,
  daysBetween,
  formatIsoDate,
  isLeapYear,
  isoWeek,
  parseIsoDate,
  todayIso,
} from "@/lib/datecalc";

const number = (value: number) => value.toLocaleString("en-US");
const plural = (value: number, unit: string) =>
  `${number(value)} ${unit}${Math.abs(value) === 1 ? "" : "s"}`;

function longDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function DateCalculator() {
  const today = todayIso();
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(() =>
    formatIsoDate(addToDate(parseIsoDate(today)!, 30, "days")),
  );
  const [amount, setAmount] = useState("14");
  const [unit, setUnit] = useState<DateUnit>("days");
  const [operation, setOperation] = useState<"add" | "subtract">("add");

  const from = parseIsoDate(start);
  const to = parseIsoDate(end);
  const total = from && to ? daysBetween(from, to) : null;
  const parts = from && to ? calendarDifference(from, to) : null;

  const amountValue = Number(amount);
  const shifted =
    from && Number.isInteger(amountValue)
      ? addToDate(from, operation === "add" ? amountValue : -amountValue, unit)
      : null;

  const week = from ? isoWeek(from) : null;

  return (
    <div className="space-y-5">
      <Panel title="Between two dates">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted">Start</span>
            <input
              type="date"
              value={start}
              onChange={(event) => setStart(event.target.value)}
              className="input w-full"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted">End</span>
            <input
              type="date"
              value={end}
              onChange={(event) => setEnd(event.target.value)}
              className="input w-full"
            />
          </label>
        </div>
        {from && to && total !== null && parts && (
          <div className="mt-4">
            <OutputRow label="Days" value={number(total)} />
            <OutputRow
              label="Weeks"
              value={`${plural(Math.trunc(total / 7), "week")}, ${plural(total % 7, "day")}`}
              mono={false}
            />
            <OutputRow
              label="Calendar"
              value={`${plural(parts.years, "year")}, ${plural(parts.months, "month")}, ${plural(parts.days, "day")}`}
              mono={false}
            />
            <OutputRow
              label="Working days (Mon–Fri)"
              value={number(businessDays(from, to))}
            />
            <OutputRow label="Hours" value={number(total * 24)} />
          </div>
        )}
        <p className="mt-3 text-xs text-faint">
          The end date isn&apos;t counted (1 to 2 March is one day). Working
          days ignore public holidays.
        </p>
      </Panel>

      <Panel title="Add or subtract">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">Start date</span>
          <select
            value={operation}
            onChange={(event) =>
              setOperation(event.target.value as "add" | "subtract")
            }
            aria-label="Add or subtract"
            className="select select-sm w-24"
          >
            <option value="add">plus</option>
            <option value="subtract">minus</option>
          </select>
          <input
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            aria-label="Amount"
            className="input input-sm w-24"
          />
          <select
            value={unit}
            onChange={(event) => setUnit(event.target.value as DateUnit)}
            aria-label="Unit"
            className="select select-sm w-28"
          >
            <option value="days">days</option>
            <option value="weeks">weeks</option>
            <option value="months">months</option>
            <option value="years">years</option>
          </select>
        </div>
        {shifted && (
          <div className="mt-4">
            <OutputRow label="Result" value={formatIsoDate(shifted)} />
            <OutputRow label="Weekday" value={longDate(shifted)} mono={false} />
          </div>
        )}
      </Panel>

      {from && week && (
        <Panel title="About the start date">
          <OutputRow label="Date" value={longDate(from)} mono={false} />
          <OutputRow
            label="ISO week (KW)"
            value={`${week.year}-W${String(week.week).padStart(2, "0")}`}
          />
          <OutputRow label="Day of the year" value={String(dayOfYear(from))} />
          <OutputRow
            label="Quarter"
            value={`Q${Math.floor(from.getUTCMonth() / 3) + 1}`}
          />
          <OutputRow
            label="Leap year"
            value={isLeapYear(from.getUTCFullYear()) ? "Yes" : "No"}
            mono={false}
          />
        </Panel>
      )}
    </div>
  );
}
