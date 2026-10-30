export function bytesToBase64(bytes: Uint8Array, urlSafe = false): string {
  let binary = "";
  // Chunked so large files don't overflow the argument limit.
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  const base64 = btoa(binary);
  return urlSafe
    ? base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
    : base64;
}

// Accepts standard and URL-safe Base64, with or without padding and
// whitespace.
export function base64ToBytes(input: string): Uint8Array {
  const clean = input.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(clean)) {
    throw new Error("Contains characters that aren't valid Base64.");
  }
  const unpadded = clean.replace(/=+$/, "");
  if (unpadded.length % 4 === 1) {
    throw new Error("The length isn't valid for Base64.");
  }
  const padded = unpadded + "=".repeat((4 - (unpadded.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

export function encodeText(text: string, urlSafe = false): string {
  return bytesToBase64(new TextEncoder().encode(text), urlSafe);
}

export function bytesToText(bytes: Uint8Array): string {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new Error(
      `The decoded data (${bytes.length} bytes) isn't UTF-8 text. It's probably a binary file.`,
    );
  }
}

export function decodeText(input: string): string {
  return bytesToText(base64ToBytes(input));
}
