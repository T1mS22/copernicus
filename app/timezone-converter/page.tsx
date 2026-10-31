import TimezoneConverter from "@/components/tools/TimezoneConverter";
import ToolShell, { toolMetadata } from "@/components/ToolShell";
import { ClientOnly } from "@/components/ui";

export const metadata = toolMetadata("timezone-converter");

export default function Page() {
  return (
    <ToolShell slug="timezone-converter">
      {/* Starts at the current time in the visitor's time zone. */}
      <ClientOnly>
        <TimezoneConverter />
      </ClientOnly>
    </ToolShell>
  );
}
