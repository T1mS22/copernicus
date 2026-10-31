import ChmodCalculator from "@/components/tools/ChmodCalculator";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("chmod-calculator");

export default function Page() {
  return (
    <ToolShell slug="chmod-calculator">
      <ChmodCalculator />
    </ToolShell>
  );
}
