import CertificateDecoder from "@/components/tools/CertificateDecoder";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("certificate-decoder");

export default function Page() {
  return (
    <ToolShell slug="certificate-decoder">
      <CertificateDecoder />
    </ToolShell>
  );
}
