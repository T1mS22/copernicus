"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import {
  type HttpStatus,
  searchStatuses,
  STATUS_CLASSES,
} from "@/lib/httpstatus";

const CLASS_COLORS: Record<number, string> = {
  1: "badge-neutral",
  2: "badge-success",
  3: "badge-info",
  4: "badge-warning",
  5: "badge-error",
};

function StatusCard({ status }: { status: HttpStatus }) {
  const group = Math.floor(status.code / 100);
  return (
    <article
      id={String(status.code)}
      className="scroll-mt-6 rounded-box border border-line bg-base-200 p-4 target:border-primary sm:p-5"
    >
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={`#${status.code}`}
          className={`badge badge-soft font-mono ${CLASS_COLORS[group]}`}
          aria-label={`Link to ${status.code}`}
        >
          {status.code}
        </a>
        <h3 className="font-semibold">{status.name}</h3>
        {status.unofficial && (
          <span className="badge badge-ghost badge-sm">
            Unofficial · {status.spec}
          </span>
        )}
        {status.deprecated && (
          <span className="badge badge-ghost badge-sm">Deprecated</span>
        )}
      </div>
      <p className="mt-2 text-sm">{status.summary}</p>
      <dl className="mt-3 space-y-2 text-sm">
        {status.use && (
          <div>
            <dt className="text-xs text-faint">When to use</dt>
            <dd className="text-muted">{status.use}</dd>
          </div>
        )}
        {status.causes && (
          <div>
            <dt className="text-xs text-faint">Common causes</dt>
            <dd className="text-muted">{status.causes}</dd>
          </div>
        )}
      </dl>
      {(status.headers || status.link) && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {status.headers?.map((header) => (
            <span
              key={header}
              className="badge badge-outline badge-sm font-mono"
            >
              {header}
            </span>
          ))}
          {status.link && (
            <a
              href={status.link}
              className="ml-auto text-xs text-faint hover:text-muted"
            >
              {status.spec}
            </a>
          )}
        </div>
      )}
    </article>
  );
}

export default function HttpStatusCodes() {
  const [query, setQuery] = useState("");
  const results = searchStatuses(query);

  return (
    <div className="space-y-6">
      <label className="input input-lg w-full">
        <Search className="size-4 text-faint" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search: 429, 5xx, timeout, redirect…"
          aria-label="Search status codes"
        />
      </label>
      <div className="-mt-3 flex flex-wrap gap-2">
        {STATUS_CLASSES.map((group) => (
          <button
            key={group.prefix}
            type="button"
            onClick={() =>
              setQuery(query === `${group.prefix}xx` ? "" : `${group.prefix}xx`)
            }
            aria-pressed={query === `${group.prefix}xx`}
            className={`btn btn-sm ${query === `${group.prefix}xx` ? "btn-primary" : "btn-ghost border-line"}`}
          >
            {group.label}
          </button>
        ))}
      </div>

      {results.length === 0 && (
        <p className="text-center text-muted">
          No status code matches “{query}”.
        </p>
      )}
      {STATUS_CLASSES.map((group) => {
        const items = results.filter(
          (s) => Math.floor(s.code / 100) === group.prefix,
        );
        if (items.length === 0) return null;
        return (
          <section key={group.prefix} className="space-y-3">
            <h2 className="text-sm font-semibold text-muted">{group.label}</h2>
            {items.map((status) => (
              <StatusCard key={status.code} status={status} />
            ))}
          </section>
        );
      })}
    </div>
  );
}
