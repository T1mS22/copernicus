import TransferTimeCalculator from "@/components/tools/TransferTimeCalculator";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("transfer-time-calculator");

export default function Page() {
  return (
    <ToolShell slug="transfer-time-calculator">
      <TransferTimeCalculator />
    </ToolShell>
  );
}
