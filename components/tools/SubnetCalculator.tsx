"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import DocsLink from "@/components/DocsLink";
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
  AZURE_MIN_PREFIX,
  AZURE_SPECIAL_SUBNETS,
  azureSubnet,
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
import { MICROSOFT_DOCS } from "@/lib/azurereference";

const SPECIAL_SUBNET_DOCS: Record<string, string> = {
  GatewaySubnet: MICROSOFT_DOCS.gatewaySubnet,
  AzureBastionSubnet: MICROSOFT_DOCS.bastionSubnet,
  AzureFirewallSubnet: MICROSOFT_DOCS.firewallSubnet,
  AzureFirewallManagementSubnet: MICROSOFT_DOCS.firewallSubnet,
  RouteServerSubnet: MICROSOFT_DOCS.routeServerSubnet,
};

type SplitMode = "equal" | "hosts";
type Mode = "standard" | "azure";

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

function EqualSplit({ base, azure }: { base: Subnet; azure: boolean }) {
  // Azure doesn't accept subnets smaller than /29.
  const smallest = azure ? AZURE_MIN_PREFIX : 32;
  const [newPrefix, setNewPrefix] = useState(
    Math.min(smallest, base.prefix + 2),
  );
  const prefix = Math.min(smallest, Math.max(newPrefix, base.prefix));
  const { subnets, total } = splitByPrefix(
    base.network,
    base.prefix,
    prefix,
    azure,
  );

  const head = ["#", "Subnet", "Usable range", "Broadcast", "Hosts"];
  const rows = subnets.map((s, i) => [
    String(i + 1),
    cidr(s),
    range(s),
    formatIPv4(s.broadcast),
    count(s.hosts),
  ]);

  const options = [];
  for (let p = base.prefix; p <= Math.min(smallest, base.prefix + 16); p++) {
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
              {count(azure ? 2 ** (32 - p) - 5 : usableHosts(p))} hosts each
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

function HostSplit({ base, azure }: { base: Subnet; azure: boolean }) {
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
    result = allocateByHosts(base.network, base.prefix, valid, azure);
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
  const [mode, setMode] = useState<Mode>("standard");
  const azure = mode === "azure";

  const parsed = parseCidr(input);
  const plain = parsed ? describeSubnet(parsed.address, parsed.prefix) : null;
  const subnet = plain && azure ? azureSubnet(plain) : plain;
  const azureTooSmall = azure && !!subnet && subnet.prefix > AZURE_MIN_PREFIX;

  return (
    <div className="space-y-5">
      <Segmented
        label="Network type"
        value={mode}
        onChange={setMode}
        options={[
          { value: "standard", label: "Standard" },
          { value: "azure", label: "Azure VNet" },
        ]}
      />
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
            {azureTooSmall && (
              <p className="mb-2 text-sm text-warning">
                Azure doesn&apos;t allow subnets smaller than /29.
              </p>
            )}
            <OutputRow label="Network" value={cidr(subnet)} />
            <OutputRow label="Netmask" value={formatIPv4(subnet.mask)} />
            <OutputRow
              label="Wildcard mask"
              value={formatIPv4(subnet.wildcard)}
            />
            {!azureTooSmall && (
              <OutputRow label="Usable range" value={range(subnet)} />
            )}
            <OutputRow label="Broadcast" value={formatIPv4(subnet.broadcast)} />
            <OutputRow label="Usable hosts" value={count(subnet.hosts)} />
            <OutputRow label="Total addresses" value={count(subnet.size)} />
            {azure && !azureTooSmall && (
              <OutputRow
                label="Reserved by Azure"
                value={[
                  `${formatIPv4(subnet.network)} network`,
                  `${formatIPv4(subnet.network + 1)} default gateway`,
                  `${formatIPv4(subnet.network + 2)}, ${formatIPv4(subnet.network + 3)} Azure DNS`,
                  `${formatIPv4(subnet.broadcast)} broadcast`,
                ].join("\n")}
              />
            )}
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

          {subnet.prefix < (azure ? AZURE_MIN_PREFIX : 32) && (
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
                <EqualSplit
                  key={`${cidr(subnet)}-${mode}`}
                  base={subnet}
                  azure={azure}
                />
              ) : (
                <HostSplit base={subnet} azure={azure} />
              )}
            </Panel>
          )}

          {azure && (
            <Panel title="Subnets Azure services need">
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Minimum</th>
                      <th>Notes</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {AZURE_SPECIAL_SUBNETS.map((special) => (
                      <tr key={special.name}>
                        <td className="font-mono whitespace-nowrap">
                          {special.name}
                        </td>
                        <td className="font-mono whitespace-nowrap">
                          /{special.prefix} (
                          {count(2 ** (32 - special.prefix) - 5)} usable)
                        </td>
                        <td className="text-muted">{special.note}</td>
                        <td className="whitespace-nowrap">
                          <DocsLink href={SPECIAL_SUBNET_DOCS[special.name]}>
                            Docs
                          </DocsLink>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-faint">
                These names are fixed; Azure only accepts the service in a
                subnet with exactly that name. Application Gateway v2 has no
                fixed name but works best in its own /24.
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                <DocsLink href={MICROSOFT_DOCS.vnetFaq}>
                  Reserved addresses (VNet FAQ)
                </DocsLink>
                <DocsLink href={MICROSOFT_DOCS.appGatewaySubnet}>
                  Application Gateway subnet
                </DocsLink>
              </div>
            </Panel>
          )}
        </>
      )}
    </div>
  );
}
