import {
  Binary,
  Braces,
  Clock,
  Fingerprint,
  Hash,
  KeyRound,
  Landmark,
  Link2,
  Lock,
  type LucideIcon,
  Network,
  Ruler,
  ScanText,
} from "lucide-react";

export const CATEGORIES = [
  "Security",
  "Encoding",
  "Data",
  "Generators",
  "Time",
  "Network",
  "Finance",
  "Units",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Tool = {
  slug: string;
  name: string;
  description: string;
  category: Category;
  icon: LucideIcon;
  // Extra search terms that aren't in the name or description.
  keywords: string[];
  // Tools with a backend live on their own subdomain.
  href?: string;
};

// The hub page and every tool page are generated from this list. Adding a
// tool means one entry here plus app/<slug>/page.tsx.
export const TOOLS: Tool[] = [
  {
    slug: "password-generator",
    name: "Password generator",
    description: "Random passwords and passphrases with adjustable rules.",
    category: "Security",
    icon: KeyRound,
    keywords: ["passphrase", "diceware", "random", "secure"],
  },
  {
    slug: "one-time-secret",
    name: "One-time secret sharing",
    description:
      "Send a password through a link that works once, encrypted in your browser.",
    category: "Security",
    icon: Lock,
    keywords: ["share", "send", "burn", "link", "credentials"],
    href: "https://secret.t-s.dev",
  },
  {
    slug: "hash-generator",
    name: "Hash generator",
    description: "SHA-1, SHA-256, SHA-384 and SHA-512 for text and files.",
    category: "Security",
    icon: Fingerprint,
    keywords: ["checksum", "digest", "sha", "verify", "file"],
  },
  {
    slug: "jwt-decoder",
    name: "JWT decoder",
    description:
      "Read a token's header, claims and expiry without sending it anywhere.",
    category: "Security",
    icon: ScanText,
    keywords: ["token", "bearer", "oauth", "claims", "entra", "azure"],
  },
  {
    slug: "base64",
    name: "Base64 encode / decode",
    description:
      "Text and files to Base64 and back, including URL-safe Base64.",
    category: "Encoding",
    icon: Binary,
    keywords: ["encode", "decode", "base64url", "file"],
  },
  {
    slug: "url-encoder",
    name: "URL encode / decode",
    description:
      "Percent-encoding and a breakdown of a URL's parts and query parameters.",
    category: "Encoding",
    icon: Link2,
    keywords: ["percent", "query", "uri", "escape", "parameters"],
  },
  {
    slug: "json-formatter",
    name: "JSON formatter",
    description:
      "Format, minify and validate JSON, with the position of any error.",
    category: "Data",
    icon: Braces,
    keywords: ["pretty", "minify", "validate", "beautify", "lint"],
  },
  {
    slug: "uuid-generator",
    name: "UUID / GUID generator",
    description:
      "Version 4 and time-ordered version 7 UUIDs in several formats.",
    category: "Generators",
    icon: Hash,
    keywords: ["guid", "id", "v4", "v7", "dotnet"],
  },
  {
    slug: "timestamp-converter",
    name: "Unix timestamp converter",
    description:
      "Epoch seconds and milliseconds to dates and back, local and UTC.",
    category: "Time",
    icon: Clock,
    keywords: ["epoch", "unix", "date", "time", "utc", "iso"],
  },
  {
    slug: "subnet-calculator",
    name: "IPv4 subnet calculator",
    description:
      "Network ranges for a CIDR block, split into equal subnets or by host count.",
    category: "Network",
    icon: Network,
    keywords: ["cidr", "ip", "netmask", "vlsm", "segmentation", "split"],
  },
  {
    slug: "iban-validator",
    name: "IBAN validator",
    description: "Checks length and check digits and shows the bank code.",
    category: "Finance",
    icon: Landmark,
    keywords: ["bank", "account", "blz", "sepa", "check"],
  },
  {
    slug: "unit-converter",
    name: "Unit converter",
    description: "Length, mass, temperature, volume, data sizes and more.",
    category: "Units",
    icon: Ruler,
    keywords: ["convert", "metric", "imperial", "bytes", "kib", "temperature"],
  },
];

export function getTool(slug: string): Tool {
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) throw new Error(`Unknown tool: ${slug}`);
  return tool;
}
