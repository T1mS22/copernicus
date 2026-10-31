import TextCounter from "@/components/tools/TextCounter";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("text-counter");

export default function Page() {
  return (
    <ToolShell slug="text-counter">
      <TextCounter />
    </ToolShell>
  );
}
