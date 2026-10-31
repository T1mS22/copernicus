import IpRangeChecker from "@/components/tools/IpRangeChecker";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("ip-range-checker");

export default function Page() {
  return (
    <ToolShell slug="ip-range-checker">
      <IpRangeChecker />
    </ToolShell>
  );
}
