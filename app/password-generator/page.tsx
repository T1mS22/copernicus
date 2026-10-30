import PasswordGenerator from "@/components/tools/PasswordGenerator";
import ToolShell, { toolMetadata } from "@/components/ToolShell";
import { ClientOnly } from "@/components/ui";

export const metadata = toolMetadata("password-generator");

export default function Page() {
  return (
    <ToolShell slug="password-generator">
      {/* Generated in the browser so the server never sees the value. */}
      <ClientOnly>
        <PasswordGenerator />
      </ClientOnly>
    </ToolShell>
  );
}
