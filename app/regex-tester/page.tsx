import RegexTester from "@/components/tools/RegexTester";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("regex-tester");

export default function Page() {
  return (
    <ToolShell slug="regex-tester">
      <RegexTester />
    </ToolShell>
  );
}
