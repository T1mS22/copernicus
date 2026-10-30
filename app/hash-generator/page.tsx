import HashGenerator from "@/components/tools/HashGenerator";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("hash-generator");

export default function Page() {
  return (
    <ToolShell slug="hash-generator">
      <HashGenerator />
    </ToolShell>
  );
}
