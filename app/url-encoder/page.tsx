import UrlEncoder from "@/components/tools/UrlEncoder";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("url-encoder");

export default function Page() {
  return (
    <ToolShell slug="url-encoder">
      <UrlEncoder />
    </ToolShell>
  );
}
