export type UuidVersion = 4 | 7;
export type UuidFormat = "standard" | "uppercase" | "braces" | "compact";

export const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

function hex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

function fromBytes(bytes: Uint8Array): string {
  const h = hex(bytes);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export function uuidV4(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return fromBytes(bytes);
}

// RFC 9562 version 7: a 48-bit Unix timestamp in milliseconds followed by
// random bits, so IDs sort by creation time (good for database keys).
export function uuidV7(now = Date.now()): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let time = now;
  for (let i = 5; i >= 0; i--) {
    bytes[i] = time % 256;
    time = Math.floor(time / 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return fromBytes(bytes);
}

export function generateUuids(version: UuidVersion, count: number): string[] {
  const ids = Array.from({ length: count }, () =>
    version === 7 ? uuidV7() : uuidV4(),
  );
  // v7 IDs from the same millisecond only differ in their random part, so
  // sort them to keep the batch in order.
  return version === 7 ? ids.sort() : ids;
}

export function formatUuid(uuid: string, format: UuidFormat): string {
  switch (format) {
    case "uppercase":
      return uuid.toUpperCase();
    case "braces":
      return `{${uuid}}`;
    case "compact":
      return uuid.replaceAll("-", "");
    default:
      return uuid;
  }
}

export function uuidV7Timestamp(uuid: string): Date | null {
  if (!UUID_PATTERN.test(uuid) || uuid[14] !== "7") return null;
  return new Date(parseInt(uuid.replace("-", "").slice(0, 12), 16));
}
