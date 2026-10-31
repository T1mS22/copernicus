"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import DocsLink from "@/components/DocsLink";
import { CopyButton } from "@/components/ui";
import {
  MICROSOFT_DOCS,
  ROLE_CATEGORIES,
  roleDocsUrl,
  searchRoles,
} from "@/lib/azurereference";

export default function AzureRoles() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const roles = searchRoles(query, category);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="input flex-1">
          <Search className="size-4 text-faint" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, description or role ID…"
            aria-label="Search roles"
          />
        </label>
        <select
          value={category ?? ""}
          onChange={(event) => setCategory(event.target.value || null)}
          aria-label="Category"
          className="select sm:w-60"
        >
          <option value="">All categories</option>
          {ROLE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-muted">{roles.length} of 505 built-in roles</p>

      <ul className="space-y-2">
        {roles.map((role) => (
          <li
            key={role.id}
            className="rounded-box border border-line bg-base-200 p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold [overflow-wrap:anywhere]">
                {role.name}
              </h3>
              <span
                className={`badge badge-sm ${role.category === "Privileged" ? "badge-soft badge-warning" : "badge-ghost"}`}
              >
                {role.category}
              </span>
              <span className="ml-auto">
                <DocsLink href={roleDocsUrl(role)}>Permissions</DocsLink>
              </span>
            </div>
            <p className="mt-1 text-sm [overflow-wrap:anywhere] text-muted">
              {role.description}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1">
              <span className="font-mono text-xs break-all text-faint">
                {role.id}
              </span>
              <CopyButton value={role.id} label="Copy ID" />
            </div>
          </li>
        ))}
      </ul>
      {roles.length === 0 && (
        <p className="text-center text-muted">No role matches.</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-faint">
          Role IDs are the same in every tenant, so they can go straight into
          Bicep, Terraform or az role assignment create --role.
        </p>
        <DocsLink href={MICROSOFT_DOCS.roles}>
          Source: Azure built-in roles
        </DocsLink>
      </div>
    </div>
  );
}
