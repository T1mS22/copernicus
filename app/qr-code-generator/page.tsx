import QrCodeGenerator from "@/components/tools/QrCodeGenerator";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("qr-code-generator");

export default function Page() {
  return (
    <ToolShell slug="qr-code-generator">
      <QrCodeGenerator />
    </ToolShell>
  );
}
