import DateCalculator from "@/components/tools/DateCalculator";
import ToolShell, { toolMetadata } from "@/components/ToolShell";
import { ClientOnly } from "@/components/ui";

export const metadata = toolMetadata("date-calculator");

export default function Page() {
  return (
    <ToolShell slug="date-calculator">
      {/* Starts at today's date in the visitor's time zone. */}
      <ClientOnly>
        <DateCalculator />
      </ClientOnly>
    </ToolShell>
  );
}
