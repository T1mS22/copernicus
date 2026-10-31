import UnicodeInspector from "@/components/tools/UnicodeInspector";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("unicode-inspector");

export default function Page() {
  return (
    <ToolShell slug="unicode-inspector">
      <UnicodeInspector />
    </ToolShell>
  );
}
