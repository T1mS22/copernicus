export type RateUnit = { id: string; label: string; factor: number };

// Sizes in bytes.
export const SIZE_UNITS: RateUnit[] = [
  { id: "MB", label: "MB", factor: 1e6 },
  { id: "GB", label: "GB", factor: 1e9 },
  { id: "TB", label: "TB", factor: 1e12 },
  { id: "MiB", label: "MiB", factor: 1024 ** 2 },
  { id: "GiB", label: "GiB", factor: 1024 ** 3 },
  { id: "TiB", label: "TiB", factor: 1024 ** 4 },
];

// Speeds in bits per second. Network speeds are quoted in bits, disk and
// download speeds usually in bytes.
export const SPEED_UNITS: RateUnit[] = [
  { id: "Mbit", label: "Mbit/s", factor: 1e6 },
  { id: "Gbit", label: "Gbit/s", factor: 1e9 },
  { id: "kbit", label: "kbit/s", factor: 1e3 },
  { id: "MBs", label: "MB/s", factor: 8e6 },
  { id: "GBs", label: "GB/s", factor: 8e9 },
];

// Real throughput is lower than the line rate: TCP/IP headers, TLS and
// protocol chatter typically cost 5–15 %.
export function transferSeconds(
  bytes: number,
  bitsPerSecond: number,
  overheadPercent: number,
): number {
  const effective = bitsPerSecond * (1 - overheadPercent / 100);
  return effective > 0 ? (bytes * 8) / effective : Infinity;
}

export function requiredBitsPerSecond(
  bytes: number,
  seconds: number,
  overheadPercent: number,
): number {
  return (bytes * 8) / seconds / (1 - overheadPercent / 100);
}

export function formatBitRate(bitsPerSecond: number): string {
  const units: [number, string][] = [
    [1e9, "Gbit/s"],
    [1e6, "Mbit/s"],
    [1e3, "kbit/s"],
  ];
  for (const [factor, label] of units) {
    if (bitsPerSecond >= factor) {
      return `${Number((bitsPerSecond / factor).toPrecision(3))} ${label}`;
    }
  }
  return `${Math.round(bitsPerSecond)} bit/s`;
}

export const SPEED_PRESETS: [string, number][] = [
  ["DSL 16", 16e6],
  ["50 Mbit", 50e6],
  ["100 Mbit", 100e6],
  ["250 Mbit", 250e6],
  ["1 Gbit", 1e9],
  ["10 Gbit", 10e9],
];
