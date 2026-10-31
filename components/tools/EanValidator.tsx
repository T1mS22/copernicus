"use client";

import { useState } from "react";
import ValidationResult from "@/components/ValidationResult";
import { checkGtin } from "@/lib/validators";

export default function EanValidator() {
  const [input, setInput] = useState("");
  const result = input.trim() ? checkGtin(input) : null;

  return (
    <div className="space-y-5">
      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="e.g. 4006381333931"
        aria-label="EAN or GTIN"
        inputMode="numeric"
        autoComplete="off"
        className="input input-lg w-full font-mono"
      />
      {result?.suggestedCheckDigit !== undefined && (
        <p className="text-sm">
          Missing the check digit? The full code would be{" "}
          <span className="font-mono text-primary">
            {result.normalized}
            {result.suggestedCheckDigit}
          </span>
          .
        </p>
      )}
      {result && (
        <ValidationResult
          result={result}
          validLabel="Valid check digit"
          invalidLabel="Not a valid EAN/GTIN"
        />
      )}
      <p className="text-xs text-faint">
        The GS1 prefix shows which national GS1 office issued the number, not
        where the product was made. ISBNs (978/979) are EAN-13 codes too.
      </p>
    </div>
  );
}
