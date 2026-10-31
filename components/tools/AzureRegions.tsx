"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import DocsLink from "@/components/DocsLink";
import { CopyButton } from "@/components/ui";
import { MICROSOFT_DOCS, searchRegions } from "@/lib/azurereference";

export default function AzureRegions() {
  const [query, setQuery] = useState("");
  const [onlyWithZones, setOnlyWithZones] = useState(false);
  const regions = searchRegions(query, onlyWithZones);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="input flex-1">
          <Search className="size-4 text-faint" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search: germany, westeurope, Frankfurt…"
            aria-label="Search regions"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyWithZones}
            onChange={(event) => setOnlyWithZones(event.target.checked)}
            className="checkbox checkbox-sm checkbox-primary"
          />
          Only with availability zones
        </label>
      </div>

      <div className="overflow-x-auto rounded-box border border-line bg-base-200">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Region</th>
              <th>Programmatic name</th>
              <th>Zones</th>
              <th>Paired region</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((region) => (
              <tr key={region.id}>
                <td className="whitespace-nowrap font-semibold">
                  {region.name}
                </td>
                <td className="whitespace-nowrap">
                  <span className="font-mono">{region.id}</span>{" "}
                  <span className="inline-block align-middle">
                    <CopyButton value={region.id} label="" />
                  </span>
                </td>
                <td>
                  {region.zones ? (
                    region.zones
                  ) : (
                    <span className="text-faint">—</span>
                  )}
                </td>
                <td className="whitespace-nowrap">
                  {region.paired ?? <span className="text-faint">none</span>}
                </td>
                <td className="text-muted">
                  {region.location}, {region.geography}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {regions.length === 0 && (
          <p className="p-4 text-center text-sm text-muted">
            No region matches.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-faint">
          {regions.length} public regions. Newer regions often have no pair and
          rely on availability zones instead. Some pairs, such as Sweden South,
          are restricted regions that aren&apos;t open to every customer.
        </p>
        <DocsLink href={MICROSOFT_DOCS.regions}>
          Source: Azure regions list
        </DocsLink>
      </div>
    </div>
  );
}
