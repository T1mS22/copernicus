import DataConverter from "@/components/tools/DataConverter";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("data-converter");

export default function Page() {
  return (
    <ToolShell slug="data-converter">
      <DataConverter />
    </ToolShell>
  );
}
