// IPv4 subnet math. Addresses are unsigned 32-bit integers; `>>> 0` keeps
// bitwise results unsigned.

const OCTET = /^(0|[1-9]\d{0,2})$/;

export function parseIPv4(text: string): number | null {
  const parts = text.trim().split(".");
  if (parts.length !== 4 || !parts.every((part) => OCTET.test(part))) {
    return null;
  }
  const octets = parts.map(Number);
  if (octets.some((octet) => octet > 255)) return null;
  return (
    ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0
  );
}

export function formatIPv4(address: number): string {
  return [
    address >>> 24,
    (address >>> 16) & 255,
    (address >>> 8) & 255,
    address & 255,
  ].join(".");
}

export function formatBinary(address: number): string {
  return formatIPv4(address)
    .split(".")
    .map((octet) => Number(octet).toString(2).padStart(8, "0"))
    .join(".");
}

export function prefixToMask(prefix: number): number {
  return prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
}

export function maskToPrefix(mask: number): number | null {
  const inverted = ~mask >>> 0;
  // A valid mask is ones followed by zeros, so its inverse plus one is a
  // power of two.
  if ((inverted & (inverted + 1)) !== 0) return null;
  return 32 - Math.log2(inverted + 1);
}

// Accepts "10.0.0.0/24", "10.0.0.0/255.255.255.0", "10.0.0.0 255.255.255.0"
// and a bare address (treated as /32).
export function parseCidr(
  text: string,
): { address: number; prefix: number } | null {
  const [addressText, maskText, ...rest] = text.trim().split(/\s*\/\s*|\s+/);
  if (rest.length > 0) return null;
  const address = parseIPv4(addressText ?? "");
  if (address === null) return null;
  if (maskText === undefined) return { address, prefix: 32 };
  if (/^\d{1,2}$/.test(maskText)) {
    const prefix = Number(maskText);
    return prefix <= 32 ? { address, prefix } : null;
  }
  const mask = parseIPv4(maskText);
  const prefix = mask === null ? null : maskToPrefix(mask);
  return prefix === null ? null : { address, prefix };
}

export function blockSize(prefix: number): number {
  return 2 ** (32 - prefix);
}

// Usable hosts. /31 is a point-to-point link with two usable addresses
// (RFC 3021) and /32 is a single host.
export function usableHosts(prefix: number): number {
  if (prefix === 32) return 1;
  if (prefix === 31) return 2;
  return blockSize(prefix) - 2;
}

const SPECIAL_RANGES: [string, number, string][] = [
  ["255.255.255.255", 32, "Limited broadcast"],
  ["0.0.0.0", 8, "“This network” (RFC 1122)"],
  ["10.0.0.0", 8, "Private (RFC 1918)"],
  ["100.64.0.0", 10, "Shared address space / CGNAT (RFC 6598)"],
  ["127.0.0.0", 8, "Loopback"],
  ["169.254.0.0", 16, "Link-local (APIPA)"],
  ["172.16.0.0", 12, "Private (RFC 1918)"],
  ["192.0.0.0", 24, "IETF protocol assignments"],
  ["192.0.2.0", 24, "Documentation (TEST-NET-1)"],
  ["192.168.0.0", 16, "Private (RFC 1918)"],
  ["198.18.0.0", 15, "Benchmarking (RFC 2544)"],
  ["198.51.100.0", 24, "Documentation (TEST-NET-2)"],
  ["203.0.113.0", 24, "Documentation (TEST-NET-3)"],
  ["224.0.0.0", 4, "Multicast"],
  ["240.0.0.0", 4, "Reserved"],
];

export function addressType(address: number): string {
  for (const [network, prefix, label] of SPECIAL_RANGES) {
    const mask = prefixToMask(prefix);
    if ((address & mask) >>> 0 === parseIPv4(network)) return label;
  }
  return "Public";
}

export type Subnet = {
  network: number;
  prefix: number;
  mask: number;
  wildcard: number;
  broadcast: number;
  firstHost: number;
  lastHost: number;
  size: number;
  hosts: number;
};

export function describeSubnet(address: number, prefix: number): Subnet {
  const mask = prefixToMask(prefix);
  const network = (address & mask) >>> 0;
  const size = blockSize(prefix);
  const broadcast = network + size - 1;
  const hasNetworkAndBroadcast = prefix <= 30;
  return {
    network,
    prefix,
    mask,
    wildcard: ~mask >>> 0,
    broadcast,
    firstHost: hasNetworkAndBroadcast ? network + 1 : network,
    lastHost: hasNetworkAndBroadcast ? broadcast - 1 : broadcast,
    size,
    hosts: usableHosts(prefix),
  };
}

// Azure reserves five addresses in every subnet: the network address, .1 for
// the default gateway, .2 and .3 for Azure DNS, and the broadcast address.
// The smallest subnet Azure accepts is a /29.
export const AZURE_RESERVED = 5;
export const AZURE_MIN_PREFIX = 29;

export function azureSubnet(subnet: Subnet): Subnet {
  const supported = subnet.prefix <= AZURE_MIN_PREFIX;
  return {
    ...subnet,
    firstHost: subnet.network + 4,
    lastHost: subnet.broadcast - 1,
    hosts: supported ? subnet.size - AZURE_RESERVED : 0,
  };
}

// Subnets Azure services need under a fixed name, with their minimum size.
export const AZURE_SPECIAL_SUBNETS: {
  name: string;
  prefix: number;
  note: string;
}[] = [
  {
    name: "GatewaySubnet",
    prefix: 27,
    note: "VPN and ExpressRoute gateways. /29 works, but /27 or larger is recommended.",
  },
  {
    name: "AzureBastionSubnet",
    prefix: 26,
    note: "Azure Bastion needs /26 or larger.",
  },
  {
    name: "AzureFirewallSubnet",
    prefix: 26,
    note: "Azure Firewall needs a /26.",
  },
  {
    name: "AzureFirewallManagementSubnet",
    prefix: 26,
    note: "Forced tunnelling and Basic SKU firewalls need it, also a /26.",
  },
  {
    name: "RouteServerSubnet",
    prefix: 26,
    note: "Azure Route Server needs /26 or larger.",
  },
];

export const MAX_LISTED_SUBNETS = 1024;

export function splitByPrefix(
  network: number,
  prefix: number,
  newPrefix: number,
  azure = false,
): { subnets: Subnet[]; total: number } {
  if (newPrefix < prefix || newPrefix > 32) {
    throw new RangeError(`The new prefix must be between /${prefix} and /32.`);
  }
  const total = 2 ** (newPrefix - prefix);
  const size = blockSize(newPrefix);
  const subnets = Array.from(
    { length: Math.min(total, MAX_LISTED_SUBNETS) },
    (_, i) => {
      const subnet = describeSubnet(network + i * size, newPrefix);
      return azure ? azureSubnet(subnet) : subnet;
    },
  );
  return { subnets, total };
}

export function prefixForCount(prefix: number, count: number): number {
  return prefix + Math.ceil(Math.log2(count));
}

// Smallest conventional subnet (/30 or larger) with room for `hosts`.
export function prefixForHosts(hosts: number): number {
  return 32 - Math.max(2, Math.ceil(Math.log2(hosts + 2)));
}

// Smallest Azure subnet (/29 or larger) with room for `hosts` after the five
// reserved addresses.
export function prefixForHostsAzure(hosts: number): number {
  return Math.min(
    AZURE_MIN_PREFIX,
    32 - Math.ceil(Math.log2(hosts + AZURE_RESERVED)),
  );
}

export type HostRequest = { name: string; hosts: number };
export type Allocation = HostRequest & { subnet: Subnet };

// Variable-length subnetting: largest requests first, packed from the start
// of the block. Allocating in descending size keeps every subnet aligned.
export function allocateByHosts(
  network: number,
  prefix: number,
  requests: HostRequest[],
  azure = false,
): { allocations: Allocation[]; used: number; free: number } {
  const sorted = [...requests].sort((a, b) => b.hosts - a.hosts);
  const end = network + blockSize(prefix);
  let next = network;
  const allocations = sorted.map((request) => {
    const subnetPrefix = azure
      ? prefixForHostsAzure(request.hosts)
      : prefixForHosts(request.hosts);
    if (subnetPrefix < prefix || next + blockSize(subnetPrefix) > end) {
      throw new RangeError(
        `“${request.name}” doesn't fit: the /${prefix} block runs out of space.`,
      );
    }
    const plain = describeSubnet(next, subnetPrefix);
    const subnet = azure ? azureSubnet(plain) : plain;
    next += subnet.size;
    return { ...request, subnet };
  });
  return {
    allocations,
    used: next - network,
    free: end - next,
  };
}
