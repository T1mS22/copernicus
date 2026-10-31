import CaseConverter from "@/components/tools/CaseConverter";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("case-converter");

export default function Page() {
  return (
    <ToolShell slug="case-converter">
      <CaseConverter />
    </ToolShell>
  );
}
