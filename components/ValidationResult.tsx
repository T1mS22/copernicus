import { CircleCheck, CircleX } from "lucide-react";
import { OutputRow, Panel } from "@/components/ui";
import type { ValidationResult as Result } from "@/lib/validators";

// Shared result panel for the format and check-digit validators.
export default function ValidationResult({
  result,
  validLabel,
  invalidLabel,
}: {
  result: Result;
  validLabel: string;
  invalidLabel: string;
}) {
  return (
    <Panel>
      <p
        className={`flex items-center gap-2 font-semibold ${result.valid ? "text-success" : "text-error"}`}
      >
        {result.valid ? (
          <CircleCheck className="size-5" />
        ) : (
          <CircleX className="size-5" />
        )}
        {result.valid ? validLabel : invalidLabel}
      </p>
      {result.errors.length > 0 && (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
          {result.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      {result.details.length > 0 && (
        <div className="mt-4">
          {result.details.map(([label, value]) => (
            <OutputRow key={label} label={label} value={value} mono={false} />
          ))}
        </div>
      )}
    </Panel>
  );
}
