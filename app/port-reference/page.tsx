import PortReference from "@/components/tools/PortReference";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("port-reference");

export default function Page() {
  return (
    <ToolShell slug="port-reference">
      <PortReference />
    </ToolShell>
  );
}
