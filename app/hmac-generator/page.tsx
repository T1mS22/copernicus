import HmacGenerator from "@/components/tools/HmacGenerator";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("hmac-generator");

export default function Page() {
  return (
    <ToolShell slug="hmac-generator">
      <HmacGenerator />
    </ToolShell>
  );
}
