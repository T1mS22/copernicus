import Metronome from "@/components/tools/Metronome";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("metronome");

export default function Page() {
  return (
    <ToolShell slug="metronome">
      <Metronome />
    </ToolShell>
  );
}
