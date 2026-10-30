import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getTool } from "@/lib/tools";

export function toolMetadata(slug: string): Metadata {
  const tool = getTool(slug);
  return { title: `${tool.name} · t-s.dev`, description: tool.description };
}

export default function ToolShell({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const tool = getTool(slug);
  const Icon = tool.icon;

  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-faint transition-colors hover:text-muted"
      >
        <ArrowLeft className="size-4" />
        All tools
      </Link>
      <div className="mt-6 flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-field bg-base-200 text-primary">
          <Icon className="size-5" />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {tool.name}
        </h1>
      </div>
      <p className="mt-3 text-muted">{tool.description}</p>
      <div className="mt-8">{children}</div>
    </>
  );
}
