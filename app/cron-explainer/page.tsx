import CronExplainer from "@/components/tools/CronExplainer";
import ToolShell, { toolMetadata } from "@/components/ToolShell";
import { ClientOnly } from "@/components/ui";

export const metadata = toolMetadata("cron-explainer");

export default function Page() {
  return (
    <ToolShell slug="cron-explainer">
      {/* Next run times depend on the current time and time zone. */}
      <ClientOnly>
        <CronExplainer />
      </ClientOnly>
    </ToolShell>
  );
}
