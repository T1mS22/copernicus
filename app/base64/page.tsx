import Base64Tool from "@/components/tools/Base64Tool";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("base64");

export default function Page() {
  return (
    <ToolShell slug="base64">
      <Base64Tool />
    </ToolShell>
  );
}
