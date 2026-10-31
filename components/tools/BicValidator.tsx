"use client";

import { useState } from "react";
import ValidationResult from "@/components/ValidationResult";
import { checkBic } from "@/lib/validators";

export default function BicValidator() {
  const [input, setInput] = useState("");
  const result = input.trim() ? checkBic(input) : null;

  return (
    <div className="space-y-5">
      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="e.g. COBADEFFXXX"
        aria-label="BIC"
        autoComplete="off"
        spellCheck={false}
        className="input input-lg w-full font-mono"
      />
      {result && (
        <ValidationResult
          result={result}
          validLabel="Valid BIC format"
          invalidLabel="Not a valid BIC"
        />
      )}
      <p className="text-xs text-faint">
        Checks the structure and the country code. Whether the bank code exists
        can only be confirmed in the SWIFT directory. Within SEPA, an IBAN alone
        is enough for transfers.
      </p>
    </div>
  );
}
