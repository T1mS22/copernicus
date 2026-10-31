import TextDiff from "@/components/tools/TextDiff";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("text-diff");

export default function Page() {
  return (
    <ToolShell slug="text-diff">
      <TextDiff />
    </ToolShell>
  );
}
