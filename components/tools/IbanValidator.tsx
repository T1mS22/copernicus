"use client";

import { CircleCheck, CircleX } from "lucide-react";
import { useState } from "react";
import { CopyButton, OutputRow, Panel } from "@/components/ui";
import { buildGermanIban, checkIban, formatIban } from "@/lib/iban";

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

function countryName(code: string): string {
  try {
    return countryNames.of(code) ?? code;
  } catch {
    return code;
  }
}

function build(bankCode: string, account: string) {
  if (!bankCode.trim() || !account.trim()) return { iban: null, error: null };
  try {
    return { iban: buildGermanIban(bankCode, account), error: null };
  } catch (error) {
    return { iban: null, error: (error as Error).message };
  }
}

// Old-style German bank details (BLZ + Kontonummer) to an IBAN.
function GermanIbanBuilder() {
  const [bankCode, setBankCode] = useState("");
  const [account, setAccount] = useState("");
  const { iban, error } = build(bankCode, account);

  return (
    <Panel title="Build a German IBAN">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">Bank code (BLZ)</span>
          <input
            value={bankCode}
            onChange={(event) => setBankCode(event.target.value)}
            placeholder="37040044"
            inputMode="numeric"
            autoComplete="off"
            className="input w-full font-mono"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">Account number</span>
          <input
            value={account}
            onChange={(event) => setAccount(event.target.value)}
            placeholder="532013000"
            inputMode="numeric"
            autoComplete="off"
            className="input w-full font-mono"
          />
        </label>
      </div>
      {error && <p className="mt-3 text-sm text-error">{error}</p>}
      {iban && (
        <div className="mt-3">
          <OutputRow label="IBAN" value={formatIban(iban)} />
          <OutputRow label="Without spaces" value={iban} />
        </div>
      )}
      <p className="mt-3 text-xs text-faint">
        Uses the standard calculation. A few banks convert some old account
        numbers differently, so the IBAN on the bank&apos;s own statements
        always takes precedence.
      </p>
    </Panel>
  );
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

      <GermanIbanBuilder />

      <p className="text-xs text-faint">
        This checks the format and the check digits, which catches almost all
        typos and swapped digits. It can&apos;t tell whether the account
        actually exists.
      </p>
    </div>
  );
}
