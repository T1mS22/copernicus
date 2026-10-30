// Web Crypto only offers the SHA family; MD5 isn't available (and shouldn't
// be used for anything security related).
export const HASH_ALGORITHMS = [
  "SHA-1",
  "SHA-256",
  "SHA-384",
  "SHA-512",
] as const;

export type HashAlgorithm = (typeof HASH_ALGORITHMS)[number];

export function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export async function digestHex(
  algorithm: HashAlgorithm,
  data: BufferSource,
): Promise<string> {
  return toHex(await crypto.subtle.digest(algorithm, data));
}

export async function digestAll(
  data: BufferSource,
): Promise<Record<HashAlgorithm, string>> {
  const digests = await Promise.all(
    HASH_ALGORITHMS.map((algorithm) => digestHex(algorithm, data)),
  );
  return Object.fromEntries(
    HASH_ALGORITHMS.map((algorithm, i) => [algorithm, digests[i]]),
  ) as Record<HashAlgorithm, string>;
}

// Matches a pasted checksum regardless of case and surrounding whitespace.
export function sameHash(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}
