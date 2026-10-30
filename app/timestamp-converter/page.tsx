import TimestampConverter from "@/components/tools/TimestampConverter";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("timestamp-converter");

export default function Page() {
  return (
    <ToolShell slug="timestamp-converter">
      <TimestampConverter />
    </ToolShell>
  );
}
