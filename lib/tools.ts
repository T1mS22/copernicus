import {
  ArrowLeftRight,
  Banknote,
  Barcode,
  Binary,
  Braces,
  Calculator,
  CalendarClock,
  CalendarDays,
  CaseSensitive,
  Clock,
  CodeXml,
  Diff,
  EthernetPort,
  Fingerprint,
  Globe,
  Hash,
  KeyRound,
  Landmark,
  Link2,
  ListOrdered,
  Lock,
  type LucideIcon,
  MonitorSmartphone,
  Network,
  Palette,
  QrCode,
  Receipt,
  Regex,
  Ruler,
  ScanText,
  SearchCheck,
  Server,
  ShieldCheck,
  SquareTerminal,
  Waypoints,
  WholeWord,
} from "lucide-react";

export const CATEGORIES = [
  "Security",
  "Text",
  "Data",
  "Encoding",
  "Generators",
  "Time",
  "Network",
  "System",
  "Design",
  "Web",
  "Validation",
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
    slug: "hmac-generator",
    name: "HMAC generator",
    description:
      "HMAC-SHA signatures for webhooks and APIs, with a field to verify one.",
    category: "Security",
    icon: ShieldCheck,
    keywords: ["signature", "webhook", "sha256", "verify", "sign", "secret"],
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
    slug: "text-diff",
    name: "Text diff",
    description: "Compare two texts line by line, with word-level highlights.",
    category: "Text",
    icon: Diff,
    keywords: ["compare", "changes", "difference", "merge", "config"],
  },
  {
    slug: "regex-tester",
    name: "Regex tester",
    description:
      "Test regular expressions with live highlighting, groups and replace.",
    category: "Text",
    icon: Regex,
    keywords: ["regexp", "pattern", "match", "replace", "javascript"],
  },
  {
    slug: "case-converter",
    name: "Case converter",
    description:
      "camelCase, snake_case, kebab-case, Title Case, URL slugs and more.",
    category: "Text",
    icon: CaseSensitive,
    keywords: ["camel", "snake", "kebab", "pascal", "slug", "upper", "lower"],
  },
  {
    slug: "text-counter",
    name: "Word and character counter",
    description: "Characters, words, sentences, lines, bytes and reading time.",
    category: "Text",
    icon: WholeWord,
    keywords: ["count", "length", "words", "characters", "statistics"],
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
    slug: "data-converter",
    name: "JSON / YAML / CSV converter",
    description:
      "Convert between JSON, YAML and CSV, including Excel's semicolon CSV.",
    category: "Data",
    icon: ArrowLeftRight,
    keywords: ["yaml", "csv", "excel", "convert", "table", "spreadsheet"],
  },
  {
    slug: "xml-formatter",
    name: "XML formatter",
    description: "Format, minify and validate XML.",
    category: "Data",
    icon: CodeXml,
    keywords: ["pretty", "beautify", "minify", "validate", "soap", "csproj"],
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
    slug: "number-base-converter",
    name: "Number base converter",
    description: "Binary, octal, decimal, hexadecimal and any base up to 36.",
    category: "Encoding",
    icon: Calculator,
    keywords: ["binary", "hex", "octal", "decimal", "radix", "bits"],
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
    slug: "ulid-generator",
    name: "ULID generator",
    description: "Sortable, URL-safe unique IDs, with timestamp decoding.",
    category: "Generators",
    icon: ListOrdered,
    keywords: ["ulid", "id", "sortable", "unique", "decode"],
  },
  {
    slug: "qr-code-generator",
    name: "QR code generator",
    description: "QR codes for links, text and Wi-Fi, as SVG or PNG.",
    category: "Generators",
    icon: QrCode,
    keywords: ["qr", "wifi", "barcode", "link", "png", "svg"],
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
    slug: "cron-explainer",
    name: "Cron expression explainer",
    description: "Cron schedules in plain English, with the next run times.",
    category: "Time",
    icon: CalendarClock,
    keywords: ["crontab", "schedule", "azure functions", "timer", "ncrontab"],
  },
  {
    slug: "timezone-converter",
    name: "Time zone converter",
    description: "See a date and time across several time zones at once.",
    category: "Time",
    icon: Globe,
    keywords: ["timezone", "utc", "meeting", "world clock", "offset"],
  },
  {
    slug: "date-calculator",
    name: "Date calculator",
    description:
      "Days between dates, working days, adding days and ISO week numbers.",
    category: "Time",
    icon: CalendarDays,
    keywords: ["difference", "week", "kw", "business days", "add", "age"],
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
    slug: "ipv6-subnet-calculator",
    name: "IPv6 subnet calculator",
    description:
      "Prefixes, ranges and address types, compressed or expanded, split into /64s.",
    category: "Network",
    icon: Waypoints,
    keywords: ["ipv6", "cidr", "prefix", "/64", "ula", "link-local", "subnet"],
  },
  {
    slug: "ip-range-checker",
    name: "IP range checker",
    description:
      "Check whether IPs fall inside CIDR ranges or allow-lists, for IPv4 and IPv6.",
    category: "Network",
    icon: SearchCheck,
    keywords: [
      "cidr",
      "allow-list",
      "whitelist",
      "nsg",
      "firewall",
      "contains",
      "match",
    ],
  },
  {
    slug: "mac-address-formatter",
    name: "MAC address formatter",
    description:
      "Convert MAC formats, spot randomized addresses and get the IPv6 EUI-64 ID.",
    category: "Network",
    icon: EthernetPort,
    keywords: ["mac", "ethernet", "oui", "eui-64", "cisco", "random"],
  },
  {
    slug: "chmod-calculator",
    name: "chmod calculator",
    description: "Unix file permissions in octal and symbolic notation.",
    category: "System",
    icon: SquareTerminal,
    keywords: ["permissions", "unix", "linux", "rwx", "755", "644"],
  },
  {
    slug: "color-converter",
    name: "Color converter",
    description: "HEX, RGB, HSL and OKLCH, with a WCAG contrast check.",
    category: "Design",
    icon: Palette,
    keywords: ["colour", "hex", "rgb", "hsl", "oklch", "contrast", "wcag"],
  },
  {
    slug: "http-status-codes",
    name: "HTTP status codes",
    description:
      "Every status code, when to use it and what usually causes it.",
    category: "Web",
    icon: Server,
    keywords: ["http", "status", "error", "404", "500", "502", "rest", "api"],
  },
  {
    slug: "user-agent-parser",
    name: "User agent parser",
    description:
      "Browser, engine, operating system and device from a user agent string.",
    category: "Web",
    icon: MonitorSmartphone,
    keywords: ["user agent", "ua", "browser", "client hints", "device"],
  },
  {
    slug: "iban-validator",
    name: "IBAN validator",
    description: "Checks length and check digits and shows the bank code.",
    category: "Validation",
    icon: Landmark,
    keywords: ["bank", "account", "blz", "sepa", "check"],
  },
  {
    slug: "bic-validator",
    name: "BIC / SWIFT validator",
    description:
      "Checks the structure of a BIC and shows bank, country and branch.",
    category: "Validation",
    icon: Banknote,
    keywords: ["bic", "swift", "bank", "sepa"],
  },
  {
    slug: "vat-id-validator",
    name: "VAT ID validator",
    description: "EU VAT ID formats, with the check digit for German USt-IdNr.",
    category: "Validation",
    icon: Receipt,
    keywords: ["vat", "ust-idnr", "ustid", "tax", "vies", "eu"],
  },
  {
    slug: "ean-validator",
    name: "EAN / GTIN validator",
    description:
      "Check digits for EAN-13, EAN-8, UPC and GTIN-14, plus the GS1 prefix.",
    category: "Validation",
    icon: Barcode,
    keywords: ["ean", "gtin", "upc", "barcode", "isbn", "gs1"],
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
