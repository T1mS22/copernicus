"use client";

import { ArrowLeftRight } from "lucide-react";
import { useDeferredValue, useState } from "react";
import { Panel } from "@/components/ui";
import { type DiffLine, diffLines, diffStats } from "@/lib/diff";

const ROW_STYLES: Record<DiffLine["type"], string> = {
  equal: "",
  delete: "bg-error/10",
  insert: "bg-success/10",
};

const SIGNS: Record<DiffLine["type"], string> = {
  equal: " ",
  delete: "−",
  insert: "+",
};

function LineText({ line }: { line: DiffLine }) {
  if (!line.segments) return <>{line.text || " "}</>;
  return (
    <>
      {line.segments.map((segment, i) =>
        segment.type === "equal" ? (
          <span key={i}>{segment.text}</span>
        ) : (
          <mark
            key={i}
            className={`rounded-sm text-base-content ${segment.type === "delete" ? "bg-error/35" : "bg-success/35"}`}
          >
            {segment.text}
          </mark>
        ),
      )}
    </>
  );
}

export default function TextDiff() {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);

  // Diffing large texts on every keystroke would make typing lag.
  const deferredOld = useDeferredValue(oldText);
  const deferredNew = useDeferredValue(newText);
  const hasInput = deferredOld !== "" || deferredNew !== "";
  const lines = hasInput
    ? diffLines(deferredOld, deferredNew, { ignoreWhitespace, ignoreCase })
    : [];
  const stats = diffStats(lines);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">Original</span>
          <textarea
            value={oldText}
            onChange={(event) => setOldText(event.target.value)}
            rows={12}
            spellCheck={false}
            className="textarea w-full font-mono text-sm"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">Changed</span>
          <textarea
            value={newText}
            onChange={(event) => setNewText(event.target.value)}
            rows={12}
            spellCheck={false}
            className="textarea w-full font-mono text-sm"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            setOldText(newText);
            setNewText(oldText);
          }}
        >
          <ArrowLeftRight className="size-4" />
          Swap
        </button>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={ignoreWhitespace}
            onChange={(event) => setIgnoreWhitespace(event.target.checked)}
            className="checkbox checkbox-sm checkbox-primary"
          />
          Ignore whitespace
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={(event) => setIgnoreCase(event.target.checked)}
            className="checkbox checkbox-sm checkbox-primary"
          />
          Ignore case
        </label>
      </div>

      {hasInput && (
        <Panel
          title="Differences"
          actions={
            <span className="text-sm">
              <span className="text-success">+{stats.added}</span>{" "}
              <span className="text-error">−{stats.removed}</span>
            </span>
          }
        >
          {stats.added === 0 && stats.removed === 0 ? (
            <p className="text-sm text-muted">The texts are identical.</p>
          ) : (
            <div className="overflow-x-auto rounded-field border border-line font-mono text-sm">
              <table className="w-full border-collapse">
                <tbody>
                  {lines.map((line, i) => (
                    <tr key={i} className={ROW_STYLES[line.type]}>
                      <td className="w-10 px-2 text-right text-faint select-none">
                        {line.oldNumber ?? ""}
                      </td>
                      <td className="w-10 px-2 text-right text-faint select-none">
                        {line.newNumber ?? ""}
                      </td>
                      <td
                        className={`w-5 select-none ${line.type === "delete" ? "text-error" : "text-success"}`}
                      >
                        {SIGNS[line.type]}
                      </td>
                      <td className="pr-3 whitespace-pre">
                        <LineText line={line} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      )}
    </div>
  );
}
