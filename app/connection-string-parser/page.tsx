import ConnectionStringParser from "@/components/tools/ConnectionStringParser";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("connection-string-parser");

export default function Page() {
  return (
    <ToolShell slug="connection-string-parser">
      <ConnectionStringParser />
    </ToolShell>
  );
}
