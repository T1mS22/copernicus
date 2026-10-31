import { base64ToBytes, bytesToBase64 } from "./base64.ts";
import { toHex } from "./hash.ts";

export const HMAC_ALGORITHMS = [
  "SHA-256",
  "SHA-384",
  "SHA-512",
  "SHA-1",
] as const;
export type HmacAlgorithm = (typeof HMAC_ALGORITHMS)[number];
export type KeyEncoding = "text" | "hex" | "base64";

export function decodeKey(key: string, encoding: KeyEncoding): Uint8Array {
  if (encoding === "text") return new TextEncoder().encode(key);
  if (encoding === "base64") return base64ToBytes(key);
  const hex = key.replace(/\s+/g, "").replace(/^0x/i, "");
  if (!/^([0-9a-f]{2})*$/i.test(hex)) {
    throw new Error("A hex key needs an even number of 0–9 / a–f digits.");
  }
  return Uint8Array.from(hex.match(/../g) ?? [], (pair) => parseInt(pair, 16));
}

export async function hmac(
  algorithm: HmacAlgorithm,
  key: Uint8Array,
  message: string,
): Promise<{ hex: string; base64: string }> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    // importKey rejects an empty key; one zero byte is equivalent because
    // HMAC pads keys with zeros to the block size.
    key.length > 0 ? new Uint8Array(key) : new Uint8Array(1),
    { name: "HMAC", hash: algorithm },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(message),
  );
  return {
    hex: toHex(signature),
    base64: bytesToBase64(new Uint8Array(signature)),
  };
}

// Compares with a pasted signature in hex or Base64, with or without a
// "sha256=" prefix as GitHub and Stripe-style webhooks send it.
export function signatureMatches(
  expected: string,
  actual: { hex: string; base64: string },
): boolean {
  const value = expected.trim().replace(/^(sha-?\d+|v\d+)=/i, "");
  return (
    value.toLowerCase() === actual.hex ||
    value.replace(/=+$/, "") === actual.base64.replace(/=+$/, "") ||
    value.replace(/=+$/, "") ===
      actual.base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
  );
}
