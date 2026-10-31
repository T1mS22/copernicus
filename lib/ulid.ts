const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const ULID_PATTERN = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;

function encodeTime(time: number): string {
  let value = time;
  let out = "";
  for (let i = 0; i < 10; i++) {
    out = CROCKFORD[value % 32] + out;
    value = Math.floor(value / 32);
  }
  return out;
}

function encodeRandom(value: bigint): string {
  let out = "";
  for (let i = 0; i < 16; i++) {
    out = CROCKFORD[Number(value & 31n)] + out;
    value >>= 5n;
  }
  return out;
}

function randomBits80(): bigint {
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return bytes.reduce((acc, byte) => (acc << 8n) | BigInt(byte), 0n);
}

// 48-bit millisecond timestamp + 80 random bits in Crockford Base32. Within
// one batch the random part counts up, so IDs stay strictly ordered
// (the spec's monotonic mode).
export function generateUlids(count: number, time = Date.now()): string[] {
  let random = randomBits80();
  const timePart = encodeTime(time);
  return Array.from({ length: count }, (_, i) => {
    if (i > 0) random = (random + 1n) & ((1n << 80n) - 1n);
    return timePart + encodeRandom(random);
  });
}

export function isUlid(id: string): boolean {
  return ULID_PATTERN.test(id.toUpperCase());
}

export function ulidTime(id: string): Date | null {
  if (!isUlid(id)) return null;
  let time = 0;
  for (const char of id.toUpperCase().slice(0, 10)) {
    time = time * 32 + CROCKFORD.indexOf(char);
  }
  return new Date(time);
}

// The same 128 bits written as a UUID, for databases with a uuid column.
export function ulidToUuid(id: string): string | null {
  if (!isUlid(id)) return null;
  let value = 0n;
  for (const char of id.toUpperCase()) {
    value = value * 32n + BigInt(CROCKFORD.indexOf(char));
  }
  const hex = value.toString(16).padStart(32, "0");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
