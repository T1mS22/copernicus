import MacAddressFormatter from "@/components/tools/MacAddressFormatter";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("mac-address-formatter");

export default function Page() {
  return (
    <ToolShell slug="mac-address-formatter">
      <MacAddressFormatter />
    </ToolShell>
  );
}
