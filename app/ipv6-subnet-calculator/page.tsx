import Ipv6SubnetCalculator from "@/components/tools/Ipv6SubnetCalculator";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("ipv6-subnet-calculator");

export default function Page() {
  return (
    <ToolShell slug="ipv6-subnet-calculator">
      <Ipv6SubnetCalculator />
    </ToolShell>
  );
}
