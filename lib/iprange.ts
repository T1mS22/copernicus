import { compressIPv6, parseIPv6, prefixMask6 } from "./ipv6.ts";
import { formatIPv4, parseCidr, parseIPv4, prefixToMask } from "./subnet.ts";

export type IpFamily = 4 | 6;
export type IpAddress = { family: IpFamily; value: bigint };
export type IpRange = {
  family: IpFamily;
  start: bigint;
  end: bigint;
  label: string;
};

export function parseAddress(text: string): IpAddress | null {
  const v4 = parseIPv4(text);
  if (v4 !== null) return { family: 4, value: BigInt(v4) };
  const v6 = parseIPv6(text);
  return v6 === null ? null : { family: 6, value: v6 };
}

export function formatAddress(address: IpAddress): string {
  return address.family === 4
    ? formatIPv4(Number(address.value))
    : compressIPv6(address.value);
}

// Accepts CIDR (10.0.0.0/8, 2001:db8::/32), a single address, or a span
// written as "start - end".
export function parseRange(input: string): IpRange | null {
  const text = input.trim();
  if (!text) return null;

  const span = text.split(/\s*[-–]\s*/);
  if (span.length === 2 && !text.includes("/")) {
    const start = parseAddress(span[0]);
    const end = parseAddress(span[1]);
    if (
      !start ||
      !end ||
      start.family !== end.family ||
      start.value > end.value
    ) {
      return null;
    }
    return {
      family: start.family,
      start: start.value,
      end: end.value,
      label: text,
    };
  }

  const v4 = parseCidr(text);
  if (v4 && !text.includes(":")) {
    const network = BigInt((v4.address & prefixToMask(v4.prefix)) >>> 0);
    return {
      family: 4,
      start: network,
      end: network + (1n << BigInt(32 - v4.prefix)) - 1n,
      label: text,
    };
  }

  const [addressText, prefixText] = text.split("/");
  const v6 = parseIPv6(addressText);
  const prefix = prefixText === undefined ? 128 : Number(prefixText);
  if (
    v6 === null ||
    (prefixText !== undefined && !/^\d{1,3}$/.test(prefixText)) ||
    prefix > 128
  ) {
    return null;
  }
  const network = v6 & prefixMask6(prefix);
  return {
    family: 6,
    start: network,
    end: network + (1n << BigInt(128 - prefix)) - 1n,
    label: text,
  };
}

export function inRange(address: IpAddress, range: IpRange): boolean {
  return (
    address.family === range.family &&
    address.value >= range.start &&
    address.value <= range.end
  );
}

// Lines may carry comments after "#", as in allow-list files.
export function splitLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/#.*$/, "").trim())
    .filter(Boolean);
}
