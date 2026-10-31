"use client";

import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { OutputRow, Panel } from "@/components/ui";
import { parseUserAgent } from "@/lib/useragent";

// User-Agent Client Hints (Chromium only), not yet in TypeScript's DOM types.
type UaData = {
  brands: { brand: string; version: string }[];
  mobile: boolean;
  platform: string;
  getHighEntropyValues(hints: string[]): Promise<{
    platformVersion?: string;
    architecture?: string;
    model?: string;
    fullVersionList?: { brand: string; version: string }[];
  }>;
};

type Hints = {
  platform: string;
  architecture?: string;
  model?: string;
  browsers: string;
};

function describePlatform(platform: string, version?: string): string {
  if (!version) return platform;
  const major = Number(version.split(".")[0]);
  // Windows reports 1–10 for Windows 10 and 13+ for Windows 11.
  if (platform === "Windows") return major >= 13 ? "Windows 11" : "Windows 10";
  return `${platform} ${version}`;
}

export default function UserAgentParser() {
  const [input, setInput] = useState(() => navigator.userAgent);
  const [hints, setHints] = useState<Hints | null>(null);
  const parsed = input.trim() ? parseUserAgent(input) : null;

  useEffect(() => {
    const data = (navigator as Navigator & { userAgentData?: UaData })
      .userAgentData;
    if (!data) return;
    let cancelled = false;
    async function load(ua: UaData) {
      const values = await ua.getHighEntropyValues([
        "platformVersion",
        "architecture",
        "model",
        "fullVersionList",
      ]);
      if (cancelled) return;
      setHints({
        platform: describePlatform(ua.platform, values.platformVersion),
        architecture: values.architecture || undefined,
        model: values.model || undefined,
        browsers: (values.fullVersionList ?? ua.brands)
          .filter((b) => !/Not.?A.?Brand/i.test(b.brand))
          .map((b) => `${b.brand} ${b.version}`)
          .join(", "),
      });
    }
    load(data);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          aria-label="User agent string"
          rows={3}
          spellCheck={false}
          className="textarea w-full font-mono text-sm"
        />
        <button
          type="button"
          className="btn btn-ghost btn-xs mt-2 border-line"
          onClick={() => setInput(navigator.userAgent)}
        >
          Use my browser&apos;s user agent
        </button>
      </div>

      {parsed && (
        <Panel>
          <OutputRow
            label="Browser"
            value={[parsed.browser.name, parsed.browser.version]
              .filter(Boolean)
              .join(" ")}
            mono={false}
          />
          <OutputRow label="Engine" value={parsed.engine} mono={false} />
          <OutputRow
            label="Operating system"
            value={[parsed.os.name, parsed.os.version]
              .filter(Boolean)
              .join(" ")}
            mono={false}
          />
          <OutputRow label="Device" value={parsed.device} mono={false} />
          {parsed.notes.length > 0 && (
            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              {parsed.notes.map((note) => (
                <li key={note} className="flex gap-2">
                  <Info className="mt-0.5 size-4 shrink-0 text-faint" />
                  {note}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      )}

      {hints && (
        <Panel title="Your browser’s Client Hints">
          <OutputRow label="Platform" value={hints.platform} mono={false} />
          {hints.architecture && (
            <OutputRow
              label="Architecture"
              value={hints.architecture}
              mono={false}
            />
          )}
          {hints.model && (
            <OutputRow label="Model" value={hints.model} mono={false} />
          )}
          <OutputRow
            label="Browser brands"
            value={hints.browsers}
            mono={false}
          />
          <p className="mt-3 text-xs text-faint">
            Chromium browsers report these more precise values separately from
            the user agent string, which they increasingly freeze.
          </p>
        </Panel>
      )}

      <p className="text-xs text-faint">
        User agents are easy to fake and browsers deliberately hide details, so
        treat the result as a hint, not proof. Brave reports itself as Chrome.
      </p>
    </div>
  );
}
