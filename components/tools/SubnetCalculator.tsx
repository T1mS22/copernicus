"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import {
  CopyButton,
  ErrorMessage,
  OutputRow,
  Panel,
  Segmented,
} from "@/components/ui";
import {
  addressType,
  allocateByHosts,
  describeSubnet,
  formatBinary,
  formatIPv4,
  type HostRequest,
  MAX_LISTED_SUBNETS,
  parseCidr,
  splitByPrefix,
  type Subnet,
  usableHosts,
} from "@/lib/subnet";

type SplitMode = "equal" | "hosts";

const cidr = (subnet: Subnet) =>
  `${formatIPv4(subnet.network)}/${subnet.prefix}`;
const range = (subnet: Subnet) =>
  `${formatIPv4(subnet.firstHost)} – ${formatIPv4(subnet.lastHost)}`;
const count = (value: number) => value.toLocaleString("en-US");

function toCsv(rows: string[][]): string {
  return rows.map((row) => row.join(",")).join("\n");
}

function SubnetTable({ rows, head }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-sm">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="font-mono">
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, i) => (
                <td key={i} className="whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EqualSplit({ base }: { base: Subnet }) {
  const [newPrefix, setNewPrefix] = useState(Math.min(32, base.prefix + 2));
  const prefix = Math.max(newPrefix, base.prefix);
  const { subnets, total } = splitByPrefix(base.network, base.prefix, prefix);

  const head = ["#", "Subnet", "Usable range", "Broadcast", "Hosts"];
  const rows = subnets.map((s, i) => [
    String(i + 1),
    cidr(s),
    range(s),
    formatIPv4(s.broadcast),
    count(s.hosts),
  ]);

  const options = [];
  for (let p = base.prefix; p <= Math.min(32, base.prefix + 16); p++) {
    options.push(p);
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={prefix}
          onChange={(event) => setNewPrefix(Number(event.target.value))}
          aria-label="Subnet size"
          className="select select-sm w-80"
        >
          {options.map((p) => (
            <option key={p} value={p}>
              /{p} · {count(2 ** (p - base.prefix))} subnets ·{" "}
              {count(usableHosts(p))} hosts each
            </option>
          ))}
        </select>
        <CopyButton value={toCsv([head, ...rows])} label="Copy as CSV" />
      </div>
      <div className="mt-4">
        <SubnetTable head={head} rows={rows} />
      </div>
      {total > MAX_LISTED_SUBNETS && (
        <p className="mt-2 text-xs text-faint">
          Showing the first {count(MAX_LISTED_SUBNETS)} of {count(total)}{" "}
          subnets.
        </p>
      )}
    </>
  );
}

function HostSplit({ base }: { base: Subnet }) {
  const [requests, setRequests] = useState<HostRequest[]>([
    { name: "Clients", hosts: 100 },
    { name: "Servers", hosts: 25 },
    { name: "Management", hosts: 10 },
  ]);

  function updateRequest(index: number, change: Partial<HostRequest>) {
    setRequests(
      requests.map((r, i) => (i === index ? { ...r, ...change } : r)),
    );
  }

  const valid = requests.filter((r) => r.hosts > 0);
  let result: ReturnType<typeof allocateByHosts> | null = null;
  let error: string | null = null;
  try {
    result = allocateByHosts(base.network, base.prefix, valid);
  } catch (e) {
    error = (e as Error).message;
  }

  const head = [
    "Name",
    "Needed",
    "Subnet",
    "Usable range",
    "Broadcast",
    "Usable",
  ];
  const rows =
    result?.allocations.map((a) => [
      a.name,
      count(a.hosts),
      cidr(a.subnet),
      range(a.subnet),
      formatIPv4(a.subnet.broadcast),
      count(a.subnet.hosts),
    ]) ?? [];

  return (
    <>
      <div className="space-y-2">
        {requests.map((request, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={request.name}
              onChange={(event) =>
                updateRequest(index, { name: event.target.value })
              }
              placeholder="Name, e.g. VLAN 10"
              aria-label={`Name of subnet ${index + 1}`}
              className="input input-sm flex-1"
            />
            <input
              type="number"
              min={1}
              value={request.hosts || ""}
              onChange={(event) =>
                updateRequest(index, { hosts: Number(event.target.value) })
              }
              placeholder="Hosts"
              aria-label={`Hosts needed in subnet ${index + 1}`}
              className="input input-sm w-28"
            />
            <button
              type="button"
              onClick={() =>
                setRequests(requests.filter((_, i) => i !== index))
              }
              aria-label={`Remove subnet ${index + 1}`}
              className="btn btn-ghost btn-sm btn-square"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            setRequests([
              ...requests,
              { name: `Subnet ${requests.length + 1}`, hosts: 10 },
            ])
          }
          className="btn btn-ghost btn-sm"
        >
          <Plus className="size-4" />
          Add subnet
        </button>
        {result && (
          <CopyButton value={toCsv([head, ...rows])} label="Copy as CSV" />
        )}
      </div>

      {error && (
        <div className="mt-4">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}
      {result && rows.length > 0 && (
        <>
          <div className="mt-4">
            <SubnetTable head={head} rows={rows} />
          </div>
          <p className="mt-2 text-xs text-faint">
            Largest subnets first, packed from the start of {cidr(base)}.{" "}
            {count(result.free)} of {count(base.size)} addresses remain free
            {result.free > 0 &&
              `, starting at ${formatIPv4(base.network + result.used)}`}
            .
          </p>
        </>
      )}
    </>
  );
}

export default function SubnetCalculator() {
  const [input, setInput] = useState("192.168.10.0/24");
  const [splitMode, setSplitMode] = useState<SplitMode>("equal");

  const parsed = parseCidr(input);
  const subnet = parsed ? describeSubnet(parsed.address, parsed.prefix) : null;

  return (
    <div className="space-y-5">
      <div>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="e.g. 10.0.0.0/16 or 10.0.0.0 255.255.0.0"
          aria-label="IPv4 address with prefix or netmask"
          spellCheck={false}
          className="input input-lg w-full font-mono"
        />
        {input.trim() && !parsed && (
          <p className="mt-2 text-sm text-error">
            Enter an IPv4 address with a prefix (/24) or netmask
            (255.255.255.0).
          </p>
        )}
      </div>

      {parsed && subnet && (
        <>
          <Panel title="Network">
            <OutputRow label="Network" value={cidr(subnet)} />
            <OutputRow label="Netmask" value={formatIPv4(subnet.mask)} />
            <OutputRow
              label="Wildcard mask"
              value={formatIPv4(subnet.wildcard)}
            />
            <OutputRow label="Usable range" value={range(subnet)} />
            <OutputRow label="Broadcast" value={formatIPv4(subnet.broadcast)} />
            <OutputRow label="Usable hosts" value={count(subnet.hosts)} />
            <OutputRow label="Total addresses" value={count(subnet.size)} />
            <OutputRow
              label="Address type"
              value={addressType(parsed.address)}
              mono={false}
            />
            <OutputRow
              label="Address in binary"
              value={formatBinary(parsed.address)}
            />
            <OutputRow
              label="Netmask in binary"
              value={formatBinary(subnet.mask)}
            />
          </Panel>

          {subnet.prefix < 32 && (
            <Panel
              title="Split into subnets"
              actions={
                <Segmented
                  label="Split by"
                  value={splitMode}
                  onChange={setSplitMode}
                  options={[
                    { value: "equal", label: "Equal size" },
                    { value: "hosts", label: "By hosts needed" },
                  ]}
                />
              }
            >
              {splitMode === "equal" ? (
                <EqualSplit key={cidr(subnet)} base={subnet} />
              ) : (
                <HostSplit base={subnet} />
              )}
            </Panel>
          )}
        </>
      )}
    </div>
  );
}
