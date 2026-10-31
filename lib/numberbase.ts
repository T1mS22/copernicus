const PREFIXES: Record<string, number> = { "0x": 16, "0b": 2, "0o": 8 };

export function detectBase(text: string): number {
  const prefix = text.trim().replace(/^-/, "").slice(0, 2).toLowerCase();
  return PREFIXES[prefix] ?? 10;
}

// Arbitrary size via BigInt. Accepts 0x/0b/0o prefixes matching the base,
// underscores and spaces as digit separators, and a leading minus.
export function parseInBase(text: string, base: number): bigint | null {
  let digits = text.trim().replace(/[\s_]/g, "").toLowerCase();
  const negative = digits.startsWith("-");
  if (negative) digits = digits.slice(1);
  const prefix = digits.slice(0, 2);
  if (PREFIXES[prefix] === base) digits = digits.slice(2);
  if (!digits) return null;

  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz".slice(0, base);
  let value = 0n;
  for (const digit of digits) {
    const index = alphabet.indexOf(digit);
    if (index === -1) return null;
    value = value * BigInt(base) + BigInt(index);
  }
  return negative ? -value : value;
}

export function formatInBase(
  value: bigint,
  base: number,
  groupSize = 0,
): string {
  const negative = value < 0n;
  let digits = (negative ? -value : value).toString(base);
  if (base === 16) digits = digits.toUpperCase();
  if (groupSize > 0) {
    digits = digits
      .padStart(Math.ceil(digits.length / groupSize) * groupSize, "0")
      .replace(new RegExp(`(.{${groupSize}})(?=.)`, "g"), "$1 ");
  }
  return (negative ? "-" : "") + digits;
}

// Two's complement bit pattern of a negative number, if it fits.
export function twosComplement(value: bigint, bits: number): bigint | null {
  const min = -(1n << BigInt(bits - 1));
  if (value >= 0n || value < min) return null;
  return (1n << BigInt(bits)) + value;
}
