import { ExternalLink } from "lucide-react";

// Small link to the Microsoft documentation a tool's data or rules come from.
export default function DocsLink({
  href,
  children = "Microsoft docs",
}: {
  href: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-faint transition-colors hover:text-muted"
    >
      {children}
      <ExternalLink className="size-3" aria-hidden />
    </a>
  );
}
