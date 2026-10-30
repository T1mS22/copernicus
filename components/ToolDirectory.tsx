"use client";

import { ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, type Category, type Tool, TOOLS } from "@/lib/tools";

function matches(tool: Tool, query: string): boolean {
  const haystack = [
    tool.name,
    tool.description,
    tool.category,
    ...tool.keywords,
  ]
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((term) => haystack.includes(term));
}

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-9 items-center justify-center rounded-field bg-base-300 text-primary">
          <Icon className="size-4.5" />
        </span>
        {tool.href && (
          <ArrowUpRight className="size-4 text-faint" aria-hidden />
        )}
      </div>
      <p className="mt-4 font-semibold">{tool.name}</p>
      <p className="mt-1 text-sm text-muted">{tool.description}</p>
    </>
  );
  const className =
    "block h-full rounded-box border border-line bg-base-200 p-5 transition-colors hover:border-primary/60 focus-visible:border-primary focus-visible:outline-none";

  return tool.href ? (
    <a href={tool.href} className={className}>
      {content}
    </a>
  ) : (
    <Link href={`/${tool.slug}`} className={className}>
      {content}
    </Link>
  );
}

export default function ToolDirectory() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | null>(null);

  const visible = TOOLS.filter(
    (tool) =>
      (category === null || tool.category === category) &&
      matches(tool, query.trim()),
  );
  const usedCategories = CATEGORIES.filter((c) =>
    TOOLS.some((tool) => tool.category === c),
  );

  return (
    <div>
      <label className="input w-full">
        <Search className="size-4 text-faint" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tools…"
          aria-label="Search tools"
          autoFocus
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        {[null, ...usedCategories].map((c) => (
          <button
            key={c ?? "all"}
            type="button"
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={`btn btn-sm ${category === c ? "btn-primary" : "btn-ghost border-line"}`}
          >
            {c ?? "All"}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((tool) => (
            <li key={tool.slug}>
              <ToolCard tool={tool} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-center text-muted">
          No tool matches “{query}”.
        </p>
      )}
    </div>
  );
}
