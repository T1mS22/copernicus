"use client";

import { useState } from "react";
import { CopyButton, OutputRow, Panel } from "@/components/ui";
import {
  addressType6,
  compressIPv6,
  describeSubnet6,
  embeddedIPv4,
  expandIPv6,
  formatCount,
  MAX_LISTED_SUBNETS6,
  parseCidr6,
  reverseDns6,
  splitSubnet6,
  type Subnet6,
} from "@/lib/ipv6";

const cidr = (subnet: Subnet6) =>
  `${compressIPv6(subnet.network)}/${subnet.prefix}`;

function Split({ base }: { base: Subnet6 }) {
  const options: number[] = [];
  for (let p = base.prefix + 1; p <= Math.min(128, base.prefix + 16); p++) {
    options.push(p);
  }
  const [prefix, setPrefix] = useState(
    base.prefix < 64 && options.includes(64) ? 64 : (options[3] ?? options[0]),
  );
  const { subnets, total } = splitSubnet6(base, prefix);
  const csv = [
    "Subnet,First,Last",
    ...subnets.map(
      (s) => `${cidr(s)},${compressIPv6(s.network)},${compressIPv6(s.last)}`,
    ),
  ].join("\n");

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={prefix}
          onChange={(event) => setPrefix(Number(event.target.value))}
          aria-label="Subnet size"
          className="select select-sm w-72"
        >
          {options.map((p) => (
            <option key={p} value={p}>
              /{p} · {formatCount(1n << BigInt(p - base.prefix))} subnets
            </option>
          ))}
        </select>
        <CopyButton value={csv} label="Copy as CSV" />
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Subnet</th>
              <th>Last address</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {subnets.map((s, i) => (
              <tr key={i}>
                <td className="text-faint">{i + 1}</td>
                <td className="whitespace-nowrap">{cidr(s)}</td>
                <td className="whitespace-nowrap text-muted">
                  {compressIPv6(s.last)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total > BigInt(MAX_LISTED_SUBNETS6) && (
        <p className="mt-2 text-xs text-faint">
          Showing the first {MAX_LISTED_SUBNETS6} of {formatCount(total)}{" "}
          subnets.
        </p>
      )}
    </>
  );
}

export default function Ipv6SubnetCalculator() {
  const [input, setInput] = useState("2001:db8:abcd:12::1/48");
  const parsed = parseCidr6(input);
  const subnet = parsed ? describeSubnet6(parsed.address, parsed.prefix) : null;
  const ipv4 = parsed ? embeddedIPv4(parsed.address) : null;

  return (
    <div className="space-y-5">
      <div>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="e.g. 2001:db8::/32 or fe80::1"
          aria-label="IPv6 address with prefix"
          spellCheck={false}
          autoComplete="off"
          className="input input-lg w-full font-mono"
        />
        {input.trim() && !parsed && (
          <p className="mt-2 text-sm text-error">
            Enter an IPv6 address, optionally with a prefix like /64.
          </p>
        )}
      </div>

      {parsed && subnet && (
        <>
          <Panel title="Address">
            <OutputRow
              label="Compressed"
              value={compressIPv6(parsed.address)}
            />
            <OutputRow label="Expanded" value={expandIPv6(parsed.address)} />
            <OutputRow
              label="Type"
              value={addressType6(parsed.address)}
              mono={false}
            />
            {ipv4 && <OutputRow label="Embedded IPv4" value={ipv4} />}
            <OutputRow
              label="Reverse DNS"
              value={reverseDns6(parsed.address)}
            />
          </Panel>
          <Panel title="Network">
            <OutputRow label="Network" value={cidr(subnet)} />
            <OutputRow
              label="Expanded network"
              value={expandIPv6(subnet.network)}
            />
            <OutputRow
              label="First address"
              value={compressIPv6(subnet.network)}
            />
            <OutputRow label="Last address" value={compressIPv6(subnet.last)} />
            <OutputRow label="Addresses" value={formatCount(subnet.size)} />
            {subnet.prefix <= 64 && (
              <OutputRow
                label="/64 networks"
                value={formatCount(1n << BigInt(64 - subnet.prefix))}
              />
            )}
          </Panel>
          {subnet.prefix < 128 && (
            <Panel title="Split into subnets">
              <Split key={cidr(subnet)} base={subnet} />
            </Panel>
          )}
        </>
      )}

      <p className="text-xs text-faint">
        A /64 is the standard size for one LAN or VLAN (SLAAC needs it). Sites
        usually get a /48 or /56, which leaves room for many /64s.
      </p>
    </div>
  );
}
