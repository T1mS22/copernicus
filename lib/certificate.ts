import {
  type Asn1,
  bitLength,
  decodeOid,
  decodeString,
  decodeTime,
  integerHex,
  parseDer,
  TAG,
  toHex,
} from "./asn1.ts";
import { base64ToBytes } from "./base64.ts";
import { formatIPv4 } from "./subnet.ts";
import { compressIPv6 } from "./ipv6.ts";

export type PemBlock = { label: string; der: Uint8Array };

// Finds PEM blocks; without markers, the whole input is read as Base64 DER
// (as Azure Key Vault and many APIs return certificates).
export function parsePem(text: string): PemBlock[] {
  if (/PRIVATE KEY-----/.test(text)) {
    throw new Error(
      "That's a private key. Never paste private keys into a website; this tool only needs the certificate.",
    );
  }
  const blocks: PemBlock[] = [];
  const pattern = /-----BEGIN ([A-Z0-9 ]+)-----([\s\S]*?)-----END \1-----/g;
  for (const match of text.matchAll(pattern)) {
    blocks.push({ label: match[1], der: base64ToBytes(match[2]) });
  }
  if (blocks.length === 0 && text.trim()) {
    blocks.push({ label: "CERTIFICATE", der: base64ToBytes(text) });
  }
  return blocks;
}

const NAME_ATTRIBUTES: Record<string, string> = {
  "2.5.4.3": "CN",
  "2.5.4.5": "serialNumber",
  "2.5.4.6": "C",
  "2.5.4.7": "L",
  "2.5.4.8": "ST",
  "2.5.4.9": "street",
  "2.5.4.10": "O",
  "2.5.4.11": "OU",
  "2.5.4.97": "organizationIdentifier",
  "1.2.840.113549.1.9.1": "emailAddress",
  "0.9.2342.19200300.100.1.25": "DC",
  "1.3.6.1.4.1.311.60.2.1.3": "jurisdictionC",
  "2.5.4.15": "businessCategory",
};

const ALGORITHMS: Record<string, string> = {
  "1.2.840.113549.1.1.1": "RSA",
  "1.2.840.113549.1.1.5": "SHA-1 with RSA",
  "1.2.840.113549.1.1.10": "RSA-PSS",
  "1.2.840.113549.1.1.11": "SHA-256 with RSA",
  "1.2.840.113549.1.1.12": "SHA-384 with RSA",
  "1.2.840.113549.1.1.13": "SHA-512 with RSA",
  "1.2.840.10045.2.1": "EC",
  "1.2.840.10045.4.3.2": "ECDSA with SHA-256",
  "1.2.840.10045.4.3.3": "ECDSA with SHA-384",
  "1.2.840.10045.4.3.4": "ECDSA with SHA-512",
  "1.3.101.112": "Ed25519",
  "1.3.101.113": "Ed448",
};

const CURVES: Record<string, string> = {
  "1.2.840.10045.3.1.7": "P-256",
  "1.3.132.0.34": "P-384",
  "1.3.132.0.35": "P-521",
};

const KEY_USAGES = [
  "Digital signature",
  "Non-repudiation",
  "Key encipherment",
  "Data encipherment",
  "Key agreement",
  "Certificate signing",
  "CRL signing",
  "Encipher only",
  "Decipher only",
];

const EXTENDED_KEY_USAGES: Record<string, string> = {
  "1.3.6.1.5.5.7.3.1": "TLS server authentication",
  "1.3.6.1.5.5.7.3.2": "TLS client authentication",
  "1.3.6.1.5.5.7.3.3": "Code signing",
  "1.3.6.1.5.5.7.3.4": "Email protection (S/MIME)",
  "1.3.6.1.5.5.7.3.8": "Time stamping",
  "1.3.6.1.5.5.7.3.9": "OCSP signing",
  "1.3.6.1.4.1.311.20.2.2": "Smart card logon",
  "2.5.29.37.0": "Any purpose",
};

const POLICIES: Record<string, string> = {
  "2.23.140.1.2.1": "Domain validated (DV)",
  "2.23.140.1.2.2": "Organization validated (OV)",
  "2.23.140.1.2.3": "Individual validated (IV)",
  "2.23.140.1.1": "Extended validation (EV)",
};

export type CertificateInfo = {
  kind: "certificate" | "csr";
  subject: string;
  commonName?: string;
  issuer?: string;
  serialNumber?: string;
  notBefore?: Date;
  notAfter?: Date;
  signatureAlgorithm: string;
  publicKey: string;
  subjectAltNames: string[];
  keyUsage: string[];
  extendedKeyUsage: string[];
  isCa?: boolean;
  pathLength?: number;
  subjectKeyId?: string;
  authorityKeyId?: string;
  crlUrls: string[];
  ocspUrls: string[];
  issuerUrls: string[];
  policies: string[];
  hasSct: boolean;
  selfSigned: boolean;
  der: Uint8Array;
};

function nameToString(name: Asn1): { text: string; cn?: string } {
  const parts: string[] = [];
  let cn: string | undefined;
  for (const set of name.children) {
    for (const attribute of set.children) {
      const oid = decodeOid(attribute.children[0]);
      const value = decodeString(attribute.children[1]);
      const label = NAME_ATTRIBUTES[oid] ?? oid;
      if (label === "CN") cn = value;
      parts.push(`${label}=${value}`);
    }
  }
  return { text: parts.join(", "), cn };
}

const algorithmName = (node: Asn1) => {
  const oid = decodeOid(node.children[0]);
  return ALGORITHMS[oid] ?? oid;
};

function describePublicKey(spki: Asn1): string {
  const [algorithm, key] = spki.children;
  const oid = decodeOid(algorithm.children[0]);
  if (oid === "1.2.840.113549.1.1.1") {
    // BIT STRING: one byte of unused-bit count, then RSAPublicKey.
    const rsa = parseDer(key.content.subarray(1));
    return `RSA ${bitLength(rsa.children[0].content)} bit`;
  }
  if (oid === "1.2.840.10045.2.1") {
    const curveOid = algorithm.children[1]
      ? decodeOid(algorithm.children[1])
      : "";
    return `EC ${CURVES[curveOid] ?? curveOid}`;
  }
  return ALGORITHMS[oid] ?? oid;
}

function generalName(node: Asn1): string | null {
  switch (node.tag) {
    case 0x81:
      return `Email: ${decodeString(node)}`;
    case 0x82:
      return `DNS: ${decodeString(node)}`;
    case 0x86:
      return `URI: ${decodeString(node)}`;
    case 0x87: {
      const bytes = node.content;
      if (bytes.length === 4) {
        return `IP: ${formatIPv4(((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0)}`;
      }
      return `IP: ${compressIPv6(BigInt(`0x${toHex(bytes)}`))}`;
    }
    default:
      return null;
  }
}

function urisIn(node: Asn1): string[] {
  if (node.tag === 0x86) return [decodeString(node)];
  return node.children.flatMap(urisIn);
}

type Extensions = Omit<
  CertificateInfo,
  | "kind"
  | "subject"
  | "commonName"
  | "issuer"
  | "serialNumber"
  | "notBefore"
  | "notAfter"
  | "signatureAlgorithm"
  | "publicKey"
  | "selfSigned"
  | "der"
>;

function readExtensions(list: Asn1 | undefined): Extensions {
  const result: Extensions = {
    subjectAltNames: [],
    keyUsage: [],
    extendedKeyUsage: [],
    crlUrls: [],
    ocspUrls: [],
    issuerUrls: [],
    policies: [],
    hasSct: false,
  };
  for (const extension of list?.children ?? []) {
    const oid = decodeOid(extension.children[0]);
    const value = parseDer(
      extension.children[extension.children.length - 1].content,
    );
    switch (oid) {
      case "2.5.29.17":
        result.subjectAltNames = value.children
          .map(generalName)
          .filter((n): n is string => n !== null);
        break;
      case "2.5.29.15": {
        const bits = value.content;
        result.keyUsage = KEY_USAGES.filter((_, i) => {
          const byte = bits[1 + (i >> 3)];
          return byte !== undefined && ((byte >> (7 - (i & 7))) & 1) === 1;
        });
        break;
      }
      case "2.5.29.37":
        result.extendedKeyUsage = value.children.map((node) => {
          const usage = decodeOid(node);
          return EXTENDED_KEY_USAGES[usage] ?? usage;
        });
        break;
      case "2.5.29.19": {
        const ca = value.children.find((node) => node.tag === TAG.BOOLEAN);
        const path = value.children.find((node) => node.tag === TAG.INTEGER);
        result.isCa = ca ? ca.content[0] !== 0 : false;
        if (path) result.pathLength = Number(`0x${integerHex(path)}`);
        break;
      }
      case "2.5.29.14":
        result.subjectKeyId = toHex(value.content, ":").toUpperCase();
        break;
      case "2.5.29.35": {
        const id = value.children.find((node) => node.tag === 0x80);
        if (id) result.authorityKeyId = toHex(id.content, ":").toUpperCase();
        break;
      }
      case "2.5.29.31":
        result.crlUrls = urisIn(value);
        break;
      case "1.3.6.1.5.5.7.1.1":
        for (const access of value.children) {
          const method = decodeOid(access.children[0]);
          const uris = urisIn(access.children[1]);
          if (method === "1.3.6.1.5.5.7.48.1") result.ocspUrls.push(...uris);
          if (method === "1.3.6.1.5.5.7.48.2") result.issuerUrls.push(...uris);
        }
        break;
      case "2.5.29.32":
        result.policies = value.children.map((policy) => {
          const id = decodeOid(policy.children[0]);
          return POLICIES[id] ?? id;
        });
        break;
      case "1.3.6.1.4.1.11129.2.4.2":
        result.hasSct = true;
        break;
    }
  }
  return result;
}

export function decodeCertificate(der: Uint8Array): CertificateInfo {
  const root = parseDer(der);
  const [tbs, signatureAlgorithm] = root.children;
  if (!tbs || tbs.tag !== TAG.SEQUENCE)
    throw new Error("This isn't an X.509 certificate.");
  // The version field is optional ([0], explicit); skip it if present.
  const fields =
    tbs.children[0].tag === 0xa0 ? tbs.children.slice(1) : tbs.children;
  const [serial, , issuerName, validity, subjectName, spki] = fields;
  const extensions = fields.find((node) => node.tag === 0xa3)?.children[0];

  const subject = nameToString(subjectName);
  const issuer = nameToString(issuerName);
  const info = readExtensions(extensions);
  return {
    kind: "certificate",
    subject: subject.text,
    commonName: subject.cn,
    issuer: issuer.text,
    serialNumber: integerHex(serial).toUpperCase(),
    notBefore: decodeTime(validity.children[0]),
    notAfter: decodeTime(validity.children[1]),
    signatureAlgorithm: algorithmName(signatureAlgorithm),
    publicKey: describePublicKey(spki),
    ...info,
    selfSigned:
      issuer.text === subject.text &&
      (!info.authorityKeyId || info.authorityKeyId === info.subjectKeyId),
    der,
  };
}

export function decodeCsr(der: Uint8Array): CertificateInfo {
  const root = parseDer(der);
  const [requestInfo, signatureAlgorithm] = root.children;
  const [, subjectName, spki, attributes] = requestInfo.children;
  // Requested extensions (SANs etc.) sit in the extensionRequest attribute.
  const extensionRequest = attributes?.children.find(
    (attribute) => decodeOid(attribute.children[0]) === "1.2.840.113549.1.9.14",
  );
  const subject = nameToString(subjectName);
  return {
    kind: "csr",
    subject: subject.text,
    commonName: subject.cn,
    signatureAlgorithm: algorithmName(signatureAlgorithm),
    publicKey: describePublicKey(spki),
    ...readExtensions(extensionRequest?.children[1].children[0]),
    selfSigned: false,
    der,
  };
}

export function decodeBlock(block: PemBlock): CertificateInfo {
  if (/CERTIFICATE REQUEST/.test(block.label)) return decodeCsr(block.der);
  if (/CERTIFICATE/.test(block.label)) return decodeCertificate(block.der);
  throw new Error(
    `“${block.label}” blocks aren't supported; paste a certificate or CSR.`,
  );
}

export async function certificateFingerprints(der: Uint8Array) {
  const data = new Uint8Array(der);
  const [sha1, sha256] = await Promise.all([
    crypto.subtle.digest("SHA-1", data),
    crypto.subtle.digest("SHA-256", data),
  ]);
  const hex = (buffer: ArrayBuffer) =>
    toHex(new Uint8Array(buffer)).toUpperCase();
  return {
    sha1: hex(sha1).match(/../g)!.join(":"),
    sha256: hex(sha256).match(/../g)!.join(":"),
    // Windows and Azure show the SHA-1 fingerprint as a plain "thumbprint".
    thumbprint: hex(sha1),
  };
}
