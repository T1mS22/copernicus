import { formatIPv4, parseIPv4 } from "./subnet.ts";

// IPv6 addresses are 128-bit BigInts.

export const MAX_IPV6 = (1n << 128n) - 1n;

// Accepts full and compressed forms, an embedded IPv4 tail
// (::ffff:192.0.2.1), brackets and a zone ID (fe80::1%eth0, ignored).
export function parseIPv6(input: string): bigint | null {
  let text = input
    .trim()
    .replace(/^\[|\]$/g, "")
    .replace(/%.*$/, "");
  if (!/^[0-9a-fA-F:.]+$/.test(text) || text.split("::").length > 2) {
    return null;
  }

  // An IPv4 tail counts as two groups.
  const ipv4 = /(\d+\.\d+\.\d+\.\d+)$/.exec(text);
  if (ipv4) {
    const value = parseIPv4(ipv4[1]);
    if (value === null) return null;
    text =
      text.slice(0, -ipv4[1].length) +
      `${(value >>> 16).toString(16)}:${(value & 0xffff).toString(16)}`;
  }

  const [head, tail] = text.split("::");
  const headGroups = head ? head.split(":") : [];
  const tailGroups = tail ? tail.split(":") : [];
  const missing = 8 - headGroups.length - tailGroups.length;
  if (tail === undefined ? missing !== 0 : missing < 1) return null;

  const groups = [
    ...headGroups,
    ...Array<string>(tail === undefined ? 0 : missing).fill("0"),
    ...tailGroups,
  ];
  if (!groups.every((group) => /^[0-9a-fA-F]{1,4}$/.test(group))) return null;
  return groups.reduce(
    (acc, group) => (acc << 16n) | BigInt(parseInt(group, 16)),
    0n,
  );
}

function groupsOf(value: bigint): number[] {
  return Array.from({ length: 8 }, (_, i) =>
    Number((value >> BigInt((7 - i) * 16)) & 0xffffn),
  );
}

export function expandIPv6(value: bigint): string {
  return groupsOf(value)
    .map((group) => group.toString(16).padStart(4, "0"))
    .join(":");
}

// RFC 5952: lowercase, no leading zeros, and the longest run of two or more
// zero groups (the first one on a tie) replaced by "::".
export function compressIPv6(value: bigint): string {
  const groups = groupsOf(value);
  let bestStart = -1;
  let bestLength = 1;
  for (let i = 0; i < 8; i++) {
    let j = i;
    while (j < 8 && groups[j] === 0) j++;
    if (j - i > bestLength) {
      bestStart = i;
      bestLength = j - i;
    }
    i = j;
  }
  const hex = groups.map((group) => group.toString(16));
  if (bestStart === -1) return hex.join(":");
  return `${hex.slice(0, bestStart).join(":")}::${hex.slice(bestStart + bestLength).join(":")}`;
}

export function parseCidr6(
  text: string,
): { address: bigint; prefix: number } | null {
  const [addressText, prefixText, ...rest] = text.trim().split("/");
  if (rest.length > 0) return null;
  const address = parseIPv6(addressText);
  if (address === null) return null;
  if (prefixText === undefined) return { address, prefix: 128 };
  if (!/^\d{1,3}$/.test(prefixText) || Number(prefixText) > 128) return null;
  return { address, prefix: Number(prefixText) };
}

export function prefixMask6(prefix: number): bigint {
  return prefix === 0
    ? 0n
    : (MAX_IPV6 >> BigInt(128 - prefix)) << BigInt(128 - prefix);
}

export type Subnet6 = {
  network: bigint;
  last: bigint;
  prefix: number;
  size: bigint;
};

export function describeSubnet6(address: bigint, prefix: number): Subnet6 {
  const network = address & prefixMask6(prefix);
  const size = 1n << BigInt(128 - prefix);
  return { network, last: network + size - 1n, prefix, size };
}

export const MAX_LISTED_SUBNETS6 = 256;

export function splitSubnet6(
  base: Subnet6,
  newPrefix: number,
): { subnets: Subnet6[]; total: bigint } {
  if (newPrefix < base.prefix || newPrefix > 128) {
    throw new RangeError(
      `The new prefix must be between /${base.prefix} and /128.`,
    );
  }
  const total = 1n << BigInt(newPrefix - base.prefix);
  const size = 1n << BigInt(128 - newPrefix);
  const count =
    total < BigInt(MAX_LISTED_SUBNETS6) ? Number(total) : MAX_LISTED_SUBNETS6;
  return {
    subnets: Array.from({ length: count }, (_, i) =>
      describeSubnet6(base.network + BigInt(i) * size, newPrefix),
    ),
    total,
  };
}

const SPECIAL_RANGES6: [string, number, string][] = [
  ["::", 128, "Unspecified"],
  ["::1", 128, "Loopback"],
  ["::ffff:0:0", 96, "IPv4-mapped"],
  ["64:ff9b::", 96, "NAT64 (RFC 6052)"],
  ["2001::", 32, "Teredo tunnelling"],
  ["2001:db8::", 32, "Documentation (RFC 3849)"],
  ["2002::", 16, "6to4"],
  ["fc00::", 7, "Unique local (ULA, private)"],
  ["fe80::", 10, "Link-local"],
  ["ff00::", 8, "Multicast"],
  ["2000::", 3, "Global unicast (public)"],
];

export function addressType6(address: bigint): string {
  for (const [network, prefix, label] of SPECIAL_RANGES6) {
    if ((address & prefixMask6(prefix)) === parseIPv6(network)) return label;
  }
  return "Reserved";
}

// The IPv4 address inside an IPv4-mapped address, if there is one.
export function embeddedIPv4(address: bigint): string | null {
  if (address >> 32n !== 0xffffn) return null;
  return formatIPv4(Number(address & 0xffffffffn));
}

// Reverse DNS name, one label per hex digit (nibble).
export function reverseDns6(address: bigint): string {
  return `${expandIPv6(address).replace(/:/g, "").split("").reverse().join(".")}.ip6.arpa`;
}

export function formatCount(value: bigint): string {
  if (value < 10n ** 15n) return value.toLocaleString("en-US");
  const exponent = value.toString(2).length - 1;
  return (value & (value - 1n)) === 0n
    ? `2^${exponent}`
    : value.toLocaleString("en-US");
}
