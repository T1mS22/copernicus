import JsonFormatter from "@/components/tools/JsonFormatter";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("json-formatter");

export default function Page() {
  return (
    <ToolShell slug="json-formatter">
      <JsonFormatter />
    </ToolShell>
  );
}
