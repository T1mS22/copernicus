import BicValidator from "@/components/tools/BicValidator";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("bic-validator");

export default function Page() {
  return (
    <ToolShell slug="bic-validator">
      <BicValidator />
    </ToolShell>
  );
}
