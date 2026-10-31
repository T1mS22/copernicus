import VatIdValidator from "@/components/tools/VatIdValidator";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("vat-id-validator");

export default function Page() {
  return (
    <ToolShell slug="vat-id-validator">
      <VatIdValidator />
    </ToolShell>
  );
}
