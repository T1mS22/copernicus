"use client";

import { useState } from "react";
import { CopyButton, ErrorMessage, Panel } from "@/components/ui";
import {
  formatAddress,
  inRange,
  type IpRange,
  parseAddress,
  parseRange,
  splitLines,
} from "@/lib/iprange";

export default function IpRangeChecker() {
  const [addresses, setAddresses] = useState(
    "10.20.30.40\n192.168.1.15\n8.8.8.8\n2001:db8:5::1",
  );
  const [ranges, setRanges] = useState(
    "10.0.0.0/8      # office network\n192.168.1.10 - 192.168.1.20\n2001:db8::/32   # IPv6 site",
  );

  const rangeLines = splitLines(ranges);
  const parsedRanges = rangeLines.map((line) => ({
    line,
    range: parseRange(line),
  }));
  const validRanges = parsedRanges
    .map((r) => r.range)
    .filter((r): r is IpRange => r !== null);
  const badRanges = parsedRanges
    .filter((r) => r.range === null)
    .map((r) => r.line);

  const results = splitLines(addresses).map((line) => {
    const address = parseAddress(line);
    return {
      line,
      address,
      matches: address
        ? validRanges.filter((range) => inRange(address, range))
        : [],
    };
  });
  const summary = results
    .map(
      (r) =>
        `${r.line}\t${r.address ? (r.matches.length ? r.matches.map((m) => m.label).join(", ") : "no match") : "invalid"}`,
    )
    .join("\n");

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">IP addresses, one per line</span>
          <textarea
            value={addresses}
            onChange={(event) => setAddresses(event.target.value)}
            rows={8}
            spellCheck={false}
            className="textarea w-full font-mono text-sm"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">
            Ranges: CIDR, single IPs or start - end (# for comments)
          </span>
          <textarea
            value={ranges}
            onChange={(event) => setRanges(event.target.value)}
            rows={8}
            spellCheck={false}
            className="textarea w-full font-mono text-sm"
          />
        </label>
      </div>

      {badRanges.length > 0 && (
        <ErrorMessage>
          <span>
            Couldn&apos;t read these ranges:{" "}
            <span className="font-mono">{badRanges.join(", ")}</span>
          </span>
        </ErrorMessage>
      )}

      {results.length > 0 && (
        <Panel
          title="Results"
          actions={<CopyButton value={summary} label="Copy as text" />}
        >
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Matching ranges</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, i) => (
                  <tr key={i}>
                    <td className="font-mono whitespace-nowrap">
                      {result.address
                        ? formatAddress(result.address)
                        : result.line}
                    </td>
                    <td>
                      {!result.address ? (
                        <span className="badge badge-error badge-soft">
                          Not an IP address
                        </span>
                      ) : result.matches.length === 0 ? (
                        <span className="badge badge-ghost">No match</span>
                      ) : (
                        <span className="flex flex-wrap gap-1.5">
                          {result.matches.map((match) => (
                            <span
                              key={match.label}
                              className="badge badge-success badge-soft font-mono"
                            >
                              {match.label}
                            </span>
                          ))}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <p className="text-xs text-faint">
        Paste an allow-list, NSG rule or firewall export as ranges. IPv4 and
        IPv6 are compared separately, so an IPv4-mapped address like
        ::ffff:10.0.0.1 doesn&apos;t match 10.0.0.0/8.
      </p>
    </div>
  );
}
