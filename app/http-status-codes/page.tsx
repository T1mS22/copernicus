import HttpStatusCodes from "@/components/tools/HttpStatusCodes";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("http-status-codes");

export default function Page() {
  return (
    <ToolShell slug="http-status-codes">
      <HttpStatusCodes />
    </ToolShell>
  );
}
