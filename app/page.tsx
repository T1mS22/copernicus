import ToolDirectory from "@/components/ToolDirectory";

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Tools.
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Small tools for everyday work. They run in your browser, so tokens,
        IBANs and passwords you paste here never leave your machine.
      </p>
      <div className="mt-8">
        <ToolDirectory />
      </div>
    </>
  );
}
