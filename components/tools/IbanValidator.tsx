"use client";

import { CircleCheck, CircleX } from "lucide-react";
import { useState } from "react";
import { CopyButton, OutputRow, Panel } from "@/components/ui";
import { checkIban } from "@/lib/iban";

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

function countryName(code: string): string {
  try {
    return countryNames.of(code) ?? code;
  } catch {
    return code;
  }
}

export default function IbanValidator() {
  const [input, setInput] = useState("");
  const result = input.trim() ? checkIban(input) : null;

  return (
    <div className="space-y-5">
      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="e.g. DE89 3704 0044 0532 0130 00"
        aria-label="IBAN"
        autoComplete="off"
        spellCheck={false}
        className="input input-lg w-full font-mono"
      />

      {result && (
        <Panel>
          <p
            className={`flex items-center gap-2 font-semibold ${result.valid ? "text-success" : "text-error"}`}
          >
            {result.valid ? (
              <CircleCheck className="size-5" />
            ) : (
              <CircleX className="size-5" />
            )}
            {result.valid ? "Valid IBAN" : "Not a valid IBAN"}
          </p>
          {result.errors.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
              {result.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}

          {result.country && (
            <div className="mt-4">
              <OutputRow
                label="Country"
                value={`${countryName(result.country)} (${result.country})`}
                mono={false}
              />
              {result.details.map(([label, value]) => (
                <OutputRow key={label} label={label} value={value} />
              ))}
            </div>
          )}

          {result.valid && (
            <div className="mt-4 flex flex-wrap gap-2">
              <CopyButton value={result.formatted} label="Copy formatted" />
              <CopyButton
                value={result.normalized}
                label="Copy without spaces"
              />
            </div>
          )}
        </Panel>
      )}

      <p className="text-xs text-faint">
        This checks the format and the check digits, which catches almost all
        typos and swapped digits. It can&apos;t tell whether the account
        actually exists.
      </p>
    </div>
  );
}
