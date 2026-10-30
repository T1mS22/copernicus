import IbanValidator from "@/components/tools/IbanValidator";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("iban-validator");

export default function Page() {
  return (
    <ToolShell slug="iban-validator">
      <IbanValidator />
    </ToolShell>
  );
}
