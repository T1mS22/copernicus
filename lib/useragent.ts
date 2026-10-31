export type ParsedUserAgent = {
  browser: { name: string; version?: string };
  engine: string;
  os: { name: string; version?: string };
  device: "Desktop" | "Mobile" | "Tablet" | "Bot or tool";
  notes: string[];
};

type Rule = [RegExp, string];

// Order matters: Chromium-based browsers also say "Chrome" and "Safari", and
// Chrome also says "Safari", so the more specific tokens come first.
const BROWSERS: Rule[] = [
  [/Edg(?:e|A|iOS)?\/([\d.]+)/, "Microsoft Edge"],
  [/(?:OPR|OPiOS|Opera)\/([\d.]+)/, "Opera"],
  [/SamsungBrowser\/([\d.]+)/, "Samsung Internet"],
  [/Vivaldi\/([\d.]+)/, "Vivaldi"],
  [/YaBrowser\/([\d.]+)/, "Yandex Browser"],
  [/(?:Firefox|FxiOS)\/([\d.]+)/, "Firefox"],
  [/(?:Chrome|CriOS)\/([\d.]+)/, "Chrome"],
  [/Version\/([\d.]+).*Safari\//, "Safari"],
  [/(?:MSIE |Trident\/.*rv:)([\d.]+)/, "Internet Explorer"],
];

const BOTS: Rule[] = [
  [/Googlebot\/?([\d.]*)/i, "Googlebot"],
  [/bingbot\/?([\d.]*)/i, "Bingbot"],
  [/curl\/([\d.]+)/, "curl"],
  [/Wget\/([\d.]+)/, "Wget"],
  [/PostmanRuntime\/([\d.]+)/, "Postman"],
  [/python-requests\/([\d.]+)/, "Python requests"],
  [/okhttp\/([\d.]+)/, "OkHttp"],
  [/axios\/([\d.]+)/, "axios"],
  [/Go-http-client\/([\d.]+)/, "Go HTTP client"],
  [/(?:bot|crawler|spider)\b/i, "Bot"],
];

const WINDOWS: Record<string, string> = {
  "10.0": "10 or 11",
  "6.3": "8.1",
  "6.2": "8",
  "6.1": "7",
  "6.0": "Vista",
  "5.1": "XP",
};

function match(ua: string, rules: Rule[]) {
  for (const [pattern, name] of rules) {
    const found = pattern.exec(ua);
    if (found) return { name, version: found[1] || undefined };
  }
  return null;
}

function parseOs(ua: string): ParsedUserAgent["os"] {
  let m: RegExpExecArray | null;
  if ((m = /Windows NT ([\d.]+)/.exec(ua))) {
    return { name: "Windows", version: WINDOWS[m[1]] ?? m[1] };
  }
  if ((m = /(?:iPhone|CPU) OS ([\d_]+)/.exec(ua))) {
    return {
      name: /iPad/.test(ua) ? "iPadOS" : "iOS",
      version: m[1].replace(/_/g, "."),
    };
  }
  if ((m = /Android ([\d.]+)/.exec(ua)))
    return { name: "Android", version: m[1] };
  if (/CrOS/.test(ua)) return { name: "ChromeOS" };
  if ((m = /Mac OS X ([\d_.]+)/.exec(ua))) {
    return { name: "macOS", version: m[1].replace(/_/g, ".") };
  }
  if (/Linux/.test(ua)) return { name: "Linux" };
  return { name: "Unknown" };
}

export function parseUserAgent(input: string): ParsedUserAgent {
  const ua = input.trim();
  const notes: string[] = [];
  const bot = match(ua, BOTS);
  const browser = bot ?? match(ua, BROWSERS) ?? { name: "Unknown" };
  const os = parseOs(ua);

  let engine = "Unknown";
  if (/iPhone|iPad|iPod/.test(ua)) engine = "WebKit";
  else if (/Edge\/\d/.test(ua)) engine = "EdgeHTML";
  else if (/Chrome\/|CriOS|SamsungBrowser/.test(ua)) engine = "Blink";
  else if (/Gecko\/\d.*Firefox/.test(ua)) engine = "Gecko";
  else if (/AppleWebKit/.test(ua)) engine = "WebKit";
  else if (/Trident/.test(ua)) engine = "Trident";

  let device: ParsedUserAgent["device"] = "Desktop";
  if (bot) device = "Bot or tool";
  else if (
    /iPad|Tablet/.test(ua) ||
    (/Android/.test(ua) && !/Mobile/.test(ua))
  ) {
    device = "Tablet";
  } else if (/Mobi|iPhone|iPod|Android/.test(ua)) device = "Mobile";

  if (/iPhone|iPad|iPod/.test(ua) && browser.name !== "Safari") {
    notes.push("Every browser on iOS uses Apple's WebKit engine underneath.");
  }
  if (os.name === "Windows" && os.version === "10 or 11") {
    notes.push(
      "Windows 11 still reports itself as Windows NT 10.0; only Client Hints can tell them apart.",
    );
  }
  if (os.name === "macOS" && os.version === "10.15.7") {
    notes.push(
      "Browsers freeze the macOS version at 10.15.7, so the real version is unknown.",
    );
  }
  if (os.name === "Android" && /Android 10; K\)/.test(ua)) {
    notes.push(
      "Chrome's reduced user agent hides the real Android version and device model.",
    );
  }
  if (
    /Macintosh/.test(ua) &&
    device === "Desktop" &&
    /Version\/.*Safari/.test(ua)
  ) {
    notes.push(
      "iPads ask for desktop sites by default and look exactly like a Mac here.",
    );
  }

  return { browser, engine, os, device, notes };
}
