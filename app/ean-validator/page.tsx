import EanValidator from "@/components/tools/EanValidator";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("ean-validator");

export default function Page() {
  return (
    <ToolShell slug="ean-validator">
      <EanValidator />
    </ToolShell>
  );
}
