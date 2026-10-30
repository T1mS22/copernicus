import UnitConverter from "@/components/tools/UnitConverter";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("unit-converter");

export default function Page() {
  return (
    <ToolShell slug="unit-converter">
      <UnitConverter />
    </ToolShell>
  );
}
