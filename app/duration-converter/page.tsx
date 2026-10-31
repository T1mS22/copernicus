import DurationConverter from "@/components/tools/DurationConverter";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("duration-converter");

export default function Page() {
  return (
    <ToolShell slug="duration-converter">
      <DurationConverter />
    </ToolShell>
  );
}
