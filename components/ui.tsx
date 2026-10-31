"use client";

import { Check, Copy } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

export function CopyButton({
  value,
  label = "Copy",
  primary = false,
}: {
  value: string;
  label?: string;
  primary?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      disabled={!value}
      className={primary ? "btn btn-primary" : "btn btn-ghost btn-sm"}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? "Copied" : label}
    </button>
  );
}

// A labelled read-only value with a copy button.
export function OutputRow({
  label,
  value,
  mono = true,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-line py-2.5 last:border-b-0 sm:flex-row sm:items-center sm:gap-4">
      <span className="w-44 shrink-0 text-sm text-muted">{label}</span>
      <span
        className={`min-w-0 flex-1 break-all whitespace-pre-wrap ${mono ? "font-mono text-sm" : ""}`}
      >
        {value}
      </span>
      <span className="-ml-3 sm:ml-0">
        <CopyButton value={value} />
      </span>
    </div>
  );
}

export function Panel({
  title,
  children,
  actions,
}: {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="rounded-box border border-line bg-base-200 p-4 sm:p-5">
      {(title || actions) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          {title && <h2 className="font-semibold">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="join">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={`btn join-item btn-sm ${value === option.value ? "btn-primary" : "border-line bg-base-200"}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function ErrorMessage({ children }: { children: React.ReactNode }) {
  return (
    <div role="alert" className="alert alert-error alert-soft text-sm">
      {children}
    </div>
  );
}

const subscribeNever = () => () => {};

// Renders children only in the browser. For tools whose first render
// depends on randomness or the clock, which would differ from the server
// render.
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const isClient = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
  return isClient ? children : null;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MiB`;
}
