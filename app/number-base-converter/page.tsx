import NumberBaseConverter from "@/components/tools/NumberBaseConverter";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("number-base-converter");

export default function Page() {
  return (
    <ToolShell slug="number-base-converter">
      <NumberBaseConverter />
    </ToolShell>
  );
}
