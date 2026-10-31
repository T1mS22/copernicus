// Minimal DER reader: enough of ASN.1 to read X.509 certificates and CSRs.

export type Asn1 = {
  // Full identifier byte: class (2 bits), constructed (1 bit), number (5 bits).
  tag: number;
  constructed: boolean;
  content: Uint8Array;
  children: Asn1[];
  // The element including its header, for hashing.
  der: Uint8Array;
};

export const TAG = {
  BOOLEAN: 0x01,
  INTEGER: 0x02,
  BIT_STRING: 0x03,
  OCTET_STRING: 0x04,
  OID: 0x06,
  UTF8_STRING: 0x0c,
  PRINTABLE_STRING: 0x13,
  T61_STRING: 0x14,
  IA5_STRING: 0x16,
  UTC_TIME: 0x17,
  GENERALIZED_TIME: 0x18,
  BMP_STRING: 0x1e,
  SEQUENCE: 0x30,
  SET: 0x31,
} as const;

function readElement(bytes: Uint8Array, offset: number): [Asn1, number] {
  if (offset + 2 > bytes.length)
    throw new Error("The DER data ends unexpectedly.");
  const tag = bytes[offset];
  if ((tag & 0x1f) === 0x1f)
    throw new Error("Multi-byte ASN.1 tags aren't supported.");
  let length = bytes[offset + 1];
  let header = 2;
  if (length & 0x80) {
    const count = length & 0x7f;
    if (count === 0 || count > 4) throw new Error("Unsupported ASN.1 length.");
    length = 0;
    for (let i = 0; i < count; i++)
      length = length * 256 + bytes[offset + 2 + i];
    header += count;
  }
  const end = offset + header + length;
  if (end > bytes.length) throw new Error("The DER data ends unexpectedly.");

  const constructed = (tag & 0x20) !== 0;
  const content = bytes.subarray(offset + header, end);
  const children: Asn1[] = [];
  if (constructed) {
    let position = 0;
    while (position < content.length) {
      const [child, next] = readElement(content, position);
      children.push(child);
      position = next;
    }
  }
  return [
    { tag, constructed, content, children, der: bytes.subarray(offset, end) },
    end,
  ];
}

export function parseDer(bytes: Uint8Array): Asn1 {
  const [element, end] = readElement(bytes, 0);
  if (end !== bytes.length)
    throw new Error("Unexpected data after the DER structure.");
  return element;
}

export function decodeOid(node: Asn1): string {
  const bytes = node.content;
  const parts = [Math.floor(bytes[0] / 40), bytes[0] % 40];
  let value = 0;
  for (let i = 1; i < bytes.length; i++) {
    value = value * 128 + (bytes[i] & 0x7f);
    if ((bytes[i] & 0x80) === 0) {
      parts.push(value);
      value = 0;
    }
  }
  return parts.join(".");
}

export function decodeString(node: Asn1): string {
  if (node.tag === TAG.BMP_STRING) {
    let text = "";
    for (let i = 0; i + 1 < node.content.length; i += 2) {
      text += String.fromCharCode((node.content[i] << 8) | node.content[i + 1]);
    }
    return text;
  }
  if (node.tag === TAG.T61_STRING) return String.fromCharCode(...node.content);
  return new TextDecoder().decode(node.content);
}

export function decodeTime(node: Asn1): Date {
  const text = decodeString(node);
  const match =
    node.tag === TAG.UTC_TIME
      ? /^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})?Z$/.exec(text)
      : /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})?(?:\.\d+)?Z$/.exec(text);
  if (!match) throw new Error(`Unsupported time format: ${text}`);
  let year = Number(match[1]);
  // RFC 5280: two-digit years 50–99 are 19xx, 00–49 are 20xx.
  if (node.tag === TAG.UTC_TIME) year += year >= 50 ? 1900 : 2000;
  return new Date(
    Date.UTC(
      year,
      Number(match[2]) - 1,
      Number(match[3]),
      Number(match[4]),
      Number(match[5]),
      Number(match[6] ?? 0),
    ),
  );
}

export function toHex(bytes: Uint8Array, separator = ""): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    separator,
  );
}

// INTEGER as hex without the sign-padding zero byte.
export function integerHex(node: Asn1): string {
  const bytes =
    node.content[0] === 0 && node.content.length > 1
      ? node.content.subarray(1)
      : node.content;
  return toHex(bytes);
}

export function bitLength(bytes: Uint8Array): number {
  let start = 0;
  while (start < bytes.length - 1 && bytes[start] === 0) start++;
  return (bytes.length - start - 1) * 8 + (32 - Math.clz32(bytes[start]));
}
