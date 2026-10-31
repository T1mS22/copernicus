import { bitLength, toHex } from "./asn1.ts";
import { base64ToBytes, bytesToBase64 } from "./base64.ts";
import { md5 } from "./md5.ts";

export type SshKey = {
  type: string;
  bits?: number;
  comment: string;
  sha256: string;
  md5: string;
};

const KEY_LINE =
  /(ssh-rsa|ssh-ed25519|ssh-dss|ecdsa-sha2-nistp(?:256|384|521)|sk-ssh-ed25519@openssh\.com|sk-ecdsa-sha2-nistp256@openssh\.com)\s+([A-Za-z0-9+/]+={0,2})(?:\s+(.*))?$/;

const KEY_NAMES: Record<string, string> = {
  "ssh-rsa": "RSA",
  "ssh-ed25519": "Ed25519",
  "ssh-dss": "DSA",
  "ecdsa-sha2-nistp256": "ECDSA P-256",
  "ecdsa-sha2-nistp384": "ECDSA P-384",
  "ecdsa-sha2-nistp521": "ECDSA P-521",
  "sk-ssh-ed25519@openssh.com": "Ed25519 (security key)",
  "sk-ecdsa-sha2-nistp256@openssh.com": "ECDSA P-256 (security key)",
};

// The key blob is a list of length-prefixed fields (RFC 4251).
function readFields(blob: Uint8Array): Uint8Array[] {
  const view = new DataView(blob.buffer, blob.byteOffset, blob.byteLength);
  const fields: Uint8Array[] = [];
  let offset = 0;
  while (offset + 4 <= blob.length) {
    const length = view.getUint32(offset);
    if (offset + 4 + length > blob.length)
      throw new Error("The key data is truncated.");
    fields.push(blob.subarray(offset + 4, offset + 4 + length));
    offset += 4 + length;
  }
  return fields;
}

function keyBits(type: string, fields: Uint8Array[]): number | undefined {
  if (type === "ssh-rsa") return bitLength(fields[2]);
  if (type === "ssh-dss") return bitLength(fields[1]);
  if (type.includes("ed25519")) return 256;
  const curve = /nistp(\d+)/.exec(type);
  return curve ? Number(curve[1]) : undefined;
}

export async function parseSshKey(line: string): Promise<SshKey> {
  const match = KEY_LINE.exec(line.trim());
  if (!match)
    throw new Error(
      "Not an OpenSSH public key (ssh-ed25519 AAAA… or ssh-rsa AAAA…).",
    );
  const blob = base64ToBytes(match[2]);
  const fields = readFields(blob);
  const embeddedType = new TextDecoder().decode(fields[0]);
  if (embeddedType !== match[1]) {
    throw new Error(
      `The key says ${match[1]} but its data is ${embeddedType}.`,
    );
  }
  const sha256 = await crypto.subtle.digest("SHA-256", new Uint8Array(blob));
  return {
    type: KEY_NAMES[match[1]] ?? match[1],
    bits: keyBits(match[1], fields),
    comment: match[3]?.trim() ?? "",
    // ssh-keygen -lf shows Base64 without padding.
    sha256: `SHA256:${bytesToBase64(new Uint8Array(sha256)).replace(/=+$/, "")}`,
    md5: `MD5:${toHex(md5(blob), ":")}`,
  };
}

// Reads every key in an authorized_keys file or a list of .pub files;
// options before the key (from="…", command="…") are allowed.
export async function parseSshKeys(
  text: string,
): Promise<{ keys: SshKey[]; errors: string[] }> {
  if (/PRIVATE KEY-----/.test(text)) {
    return {
      keys: [],
      errors: [
        "That's a private key. Only paste the .pub file; never share the private key.",
      ],
    };
  }
  const keys: SshKey[] = [];
  const errors: string[] = [];
  for (const line of text.split("\n").map((l) => l.trim())) {
    if (!line || line.startsWith("#")) continue;
    try {
      keys.push(await parseSshKey(line));
    } catch (error) {
      errors.push(`${line.slice(0, 40)}…: ${(error as Error).message}`);
    }
  }
  return { keys, errors };
}
