import UserAgentParser from "@/components/tools/UserAgentParser";
import ToolShell, { toolMetadata } from "@/components/ToolShell";
import { ClientOnly } from "@/components/ui";

export const metadata = toolMetadata("user-agent-parser");

export default function Page() {
  return (
    <ToolShell slug="user-agent-parser">
      {/* Reads the visitor's own user agent and Client Hints. */}
      <ClientOnly>
        <UserAgentParser />
      </ClientOnly>
    </ToolShell>
  );
}
