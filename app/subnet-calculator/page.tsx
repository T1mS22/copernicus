import SubnetCalculator from "@/components/tools/SubnetCalculator";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("subnet-calculator");

export default function Page() {
  return (
    <ToolShell slug="subnet-calculator">
      <SubnetCalculator />
    </ToolShell>
  );
}
