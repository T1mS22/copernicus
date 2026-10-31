import AzureRoles from "@/components/tools/AzureRoles";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("azure-roles");

export default function Page() {
  return (
    <ToolShell slug="azure-roles">
      <AzureRoles />
    </ToolShell>
  );
}
