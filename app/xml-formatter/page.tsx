import XmlFormatter from "@/components/tools/XmlFormatter";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("xml-formatter");

export default function Page() {
  return (
    <ToolShell slug="xml-formatter">
      <XmlFormatter />
    </ToolShell>
  );
}
