import UlidGenerator from "@/components/tools/UlidGenerator";
import ToolShell, { toolMetadata } from "@/components/ToolShell";
import { ClientOnly } from "@/components/ui";

export const metadata = toolMetadata("ulid-generator");

export default function Page() {
  return (
    <ToolShell slug="ulid-generator">
      {/* Generated in the browser so the server never sees the value. */}
      <ClientOnly>
        <UlidGenerator />
      </ClientOnly>
    </ToolShell>
  );
}
