"use client";

import { useDeferredValue, useState } from "react";
import { Panel } from "@/components/ui";
import { textStats, topWords } from "@/lib/textstats";

const number = (value: number) => value.toLocaleString("en-US");

function minutes(value: number): string {
  if (value === 0) return "0 min";
  if (value < 1) return `${Math.max(1, Math.round(value * 60))} sec`;
  return `${Math.round(value)} min`;
}

export default function TextCounter() {
  const [text, setText] = useState("");
  const deferred = useDeferredValue(text);
  const stats = textStats(deferred);
  const words = topWords(deferred, 8);

  const tiles: [string, string][] = [
    ["Characters", number(stats.characters)],
    ["Without spaces", number(stats.charactersNoSpaces)],
    ["Words", number(stats.words)],
    ["Sentences", number(stats.sentences)],
    ["Lines", number(stats.lines)],
    ["Paragraphs", number(stats.paragraphs)],
    ["Bytes (UTF-8)", number(stats.bytes)],
    ["Reading time", minutes(stats.readingMinutes)],
  ];

  return (
    <div className="space-y-5">
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Type or paste text…"
        aria-label="Text"
        rows={10}
        className="textarea w-full text-sm"
      />

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map(([label, value]) => (
          <div
            key={label}
            className="rounded-box border border-line bg-base-200 p-4"
          >
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="mt-1 font-mono text-xl tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      {words.length > 0 && (
        <Panel title="Most frequent words">
          <ul className="flex flex-wrap gap-2">
            {words.map(([word, count]) => (
              <li key={word} className="badge badge-ghost gap-1.5 font-mono">
                {word} <span className="text-faint">{count}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <p className="text-xs text-faint">
        Characters are counted as you see them, so an emoji with a skin tone
        counts once. Many systems (SMS, database columns) count UTF-16 units or
        bytes instead; bytes are shown for that reason.
      </p>
    </div>
  );
}
