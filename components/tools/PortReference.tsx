"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import {
  PORT_CATEGORIES,
  type PortCategory,
  type PortEntry,
  portAnchor,
  searchPorts,
} from "@/lib/ports";

function PortCard({ entry }: { entry: PortEntry }) {
  const anchor = portAnchor(entry);
  return (
    <article
      id={anchor}
      className="scroll-mt-6 rounded-box border border-line bg-base-200 p-4 target:border-primary sm:p-5"
    >
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={`#${anchor}`}
          className="badge badge-soft badge-primary font-mono"
        >
          {entry.port}
        </a>
        <h3 className="font-semibold">{entry.service}</h3>
        <span className="badge badge-ghost badge-sm font-mono">
          {entry.protocol}
        </span>
        {entry.internalOnly && (
          <span className="badge badge-soft badge-error badge-sm">
            Never expose to the internet
          </span>
        )}
        {entry.insecure && (
          <span className="badge badge-soft badge-warning badge-sm">
            Unencrypted
          </span>
        )}
      </div>
      <p className="mt-2 text-sm">{entry.description}</p>
      {entry.notes && (
        <p className="mt-1.5 text-sm text-muted">{entry.notes}</p>
      )}
    </article>
  );
}

export default function PortReference() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PortCategory | null>(null);
  const results = searchPorts(query, category);

  return (
    <div className="space-y-5">
      <label className="input input-lg w-full">
        <Search className="size-4 text-faint" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search: 1433, rdp, kubernetes, azure…"
          aria-label="Search ports"
        />
      </label>
      <div className="-mt-2 flex flex-wrap gap-2">
        {PORT_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(category === c ? null : c)}
            aria-pressed={category === c}
            className={`btn btn-sm ${category === c ? "btn-primary" : "btn-ghost border-line"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {results.length === 0 ? (
        <p className="text-center text-muted">No port matches.</p>
      ) : (
        <div className="space-y-3">
          {results.map((entry) => (
            <PortCard key={entry.port + entry.service} entry={entry} />
          ))}
        </div>
      )}

      <p className="text-xs text-faint">
        Well-known defaults; services can run on any port. “Never expose to the
        internet” marks ports that attackers scan for constantly: put them
        behind a VPN, Azure Bastion or private endpoints.
      </p>
    </div>
  );
}
