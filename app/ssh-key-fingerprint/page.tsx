import SshKeyFingerprint from "@/components/tools/SshKeyFingerprint";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("ssh-key-fingerprint");

export default function Page() {
  return (
    <ToolShell slug="ssh-key-fingerprint">
      <SshKeyFingerprint />
    </ToolShell>
  );
}
