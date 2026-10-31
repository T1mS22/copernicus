import ColorConverter from "@/components/tools/ColorConverter";
import ToolShell, { toolMetadata } from "@/components/ToolShell";
import { ClientOnly } from "@/components/ui";

export const metadata = toolMetadata("color-converter");

export default function Page() {
  return (
    <ToolShell slug="color-converter">
      {/* Swatches use inline styles, which the CSP only allows from scripts. */}
      <ClientOnly>
        <ColorConverter />
      </ClientOnly>
    </ToolShell>
  );
}
