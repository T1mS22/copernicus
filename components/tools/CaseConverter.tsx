"use client";

import { useState } from "react";
import { OutputRow, Panel } from "@/components/ui";
import { CASE_STYLES, convertLines } from "@/lib/case";

export default function CaseConverter() {
  const [input, setInput] = useState("");

  return (
    <div className="space-y-5">
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Type or paste text, e.g. Customer order ID or customerOrderId"
        aria-label="Text"
        rows={4}
        spellCheck={false}
        className="textarea w-full font-mono text-sm"
      />

      <Panel>
        {CASE_STYLES.map((style) => (
          <OutputRow
            key={style.id}
            label={style.label}
            value={input ? convertLines(input, style) : ""}
          />
        ))}
      </Panel>

      <p className="text-xs text-faint">
        Each line is converted separately, so lists of names work. Slugs turn ä,
        ö, ü and ß into ae, oe, ue and ss and drop other accents.
      </p>
    </div>
  );
}
