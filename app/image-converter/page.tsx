import ImageConverter from "@/components/tools/ImageConverter";
import ToolShell, { toolMetadata } from "@/components/ToolShell";

export const metadata = toolMetadata("image-converter");

export default function Page() {
  return (
    <ToolShell slug="image-converter">
      <ImageConverter />
    </ToolShell>
  );
}
