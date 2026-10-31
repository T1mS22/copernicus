import AzureRegions from "@/components/tools/AzureRegions";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("azure-regions");

export default function Page() {
  return (
    <ToolShell slug="azure-regions">
      <AzureRegions />
    </ToolShell>
  );
}
