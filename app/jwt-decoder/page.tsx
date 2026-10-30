import JwtDecoder from "@/components/tools/JwtDecoder";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("jwt-decoder");

export default function Page() {
  return (
    <ToolShell slug="jwt-decoder">
      <JwtDecoder />
    </ToolShell>
  );
}
