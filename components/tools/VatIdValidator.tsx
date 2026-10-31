"use client";

import { useState } from "react";
import ValidationResult from "@/components/ValidationResult";
import { checkVatId } from "@/lib/validators";

export default function VatIdValidator() {
  const [input, setInput] = useState("");
  const result = input.trim() ? checkVatId(input) : null;

  return (
    <div className="space-y-5">
      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="e.g. DE136695976"
        aria-label="VAT ID"
        autoComplete="off"
        spellCheck={false}
        className="input input-lg w-full font-mono"
      />
      {result && (
        <ValidationResult
          result={result}
          validLabel="Valid format"
          invalidLabel="Not a valid VAT ID"
        />
      )}
      <p className="text-xs text-faint">
        German IDs get a full check-digit test; other EU countries are checked
        for the right format. To confirm that a number is actually registered,
        use the EU&apos;s{" "}
        <a href="https://ec.europa.eu/taxation_customs/vies/" className="link">
          VIES service
        </a>
        .
      </p>
    </div>
  );
}
