import UuidGenerator from "@/components/tools/UuidGenerator";
import ToolShell, { toolMetadata } from "@/components/ToolShell";
import { ClientOnly } from "@/components/ui";

export const metadata = toolMetadata("uuid-generator");

export default function Page() {
  return (
    <ToolShell slug="uuid-generator">
      {/* Generated in the browser so the server never sees the value. */}
      <ClientOnly>
        <UuidGenerator />
      </ClientOnly>
    </ToolShell>
  );
}
