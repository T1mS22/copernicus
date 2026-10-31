"use client";

import { Shuffle } from "lucide-react";
import { useState } from "react";
import { OutputRow, Panel } from "@/components/ui";
import {
  eui64InterfaceId,
  macFlags,
  macFormats,
  parseMac,
  randomMac,
} from "@/lib/mac";

export default function MacAddressFormatter() {
  const [input, setInput] = useState("");
  const mac = input.trim() ? parseMac(input) : null;
  const flags = mac ? macFlags(mac) : null;

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="e.g. 00:1A:2B:3C:4D:5E or 001a.2b3c.4d5e"
          aria-label="MAC address"
          autoComplete="off"
          spellCheck={false}
          className="input input-lg flex-1 font-mono"
        />
        <button
          type="button"
          className="btn btn-lg"
          onClick={() => setInput(randomMac().match(/../g)!.join(":"))}
        >
          <Shuffle className="size-4" />
          Random
        </button>
      </div>
      {input.trim() && !mac && (
        <p className="text-sm text-error">
          A MAC address has 12 hex digits, with or without : - or . between
          them.
        </p>
      )}

      {mac && flags && (
        <>
          <Panel title="Formats">
            {macFormats(mac).map((format) => (
              <OutputRow
                key={format.label}
                label={format.label}
                value={format.value}
              />
            ))}
          </Panel>
          <Panel title="Details">
            <OutputRow label="OUI (manufacturer ID)" value={flags.oui} />
            <OutputRow
              label="Type"
              value={
                flags.broadcast
                  ? "Broadcast"
                  : flags.multicast
                    ? "Multicast (group address)"
                    : "Unicast (single device)"
              }
              mono={false}
            />
            <OutputRow
              label="Administration"
              value={
                flags.locallyAdministered
                  ? "Locally administered: a randomized (private) Wi-Fi address or a virtual NIC, so no real manufacturer"
                  : "Universally administered: assigned by the manufacturer"
              }
              mono={false}
            />
            <OutputRow
              label="IPv6 link-local (EUI-64)"
              value={`fe80::${eui64InterfaceId(mac)}`}
            />
          </Panel>
        </>
      )}

      <p className="text-xs text-faint">
        The manufacturer lookup isn&apos;t included: the IEEE list is several
        megabytes. Search the OUI on the IEEE site if you need the vendor.
        Random addresses are locally administered unicast, safe for VMs and
        tests.
      </p>
    </div>
  );
}
