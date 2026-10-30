"use client";

import { ShieldAlert } from "lucide-react";
import { useState } from "react";
import { CopyButton, ErrorMessage, OutputRow, Panel } from "@/components/ui";
import { decodeJwt, type TokenStatus, tokenStatus } from "@/lib/jwt";
import { relativeTime } from "@/lib/timestamp";

const STATUS: Record<TokenStatus, { label: string; className: string }> = {
  valid: { label: "Not expired", className: "badge-success" },
  expired: { label: "Expired", className: "badge-error" },
  "not-yet-valid": { label: "Not valid yet", className: "badge-warning" },
  "no-expiry": { label: "No expiry", className: "badge-neutral" },
};

function decode(token: string) {
  try {
    return { decoded: decodeJwt(token), error: null };
  } catch (error) {
    return { decoded: null, error: (error as Error).message };
  }
}

function formatDate(date: Date): string {
  return `${date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })} (${relativeTime(date)})`;
}

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const { decoded, error } = token.trim()
    ? decode(token)
    : { decoded: null, error: null };

  const header = decoded ? JSON.stringify(decoded.header, null, 2) : "";
  const payload = decoded ? JSON.stringify(decoded.payload, null, 2) : "";
  const status = decoded ? STATUS[tokenStatus(decoded.claims)] : null;

  return (
    <div className="space-y-5">
      <textarea
        value={token}
        onChange={(event) => setToken(event.target.value)}
        placeholder="Paste a JWT (eyJhbGciOi…), with or without “Bearer”"
        aria-label="JWT"
        rows={5}
        spellCheck={false}
        autoComplete="off"
        className="textarea w-full font-mono text-sm break-all"
      />

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {decoded && status && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`badge ${status.className}`}>{status.label}</span>
            {typeof decoded.header.alg === "string" && (
              <span className="badge badge-ghost font-mono">
                {decoded.header.alg}
              </span>
            )}
            {decoded.header.alg === "none" && (
              <span className="text-sm text-error">
                Unsigned token (alg: none). Never accept these.
              </span>
            )}
          </div>

          {(decoded.claims.exp || decoded.claims.iat || decoded.claims.nbf) && (
            <Panel title="Times">
              {decoded.claims.iat && (
                <OutputRow
                  label="Issued (iat)"
                  value={formatDate(decoded.claims.iat)}
                  mono={false}
                />
              )}
              {decoded.claims.nbf && (
                <OutputRow
                  label="Not before (nbf)"
                  value={formatDate(decoded.claims.nbf)}
                  mono={false}
                />
              )}
              {decoded.claims.exp && (
                <OutputRow
                  label="Expires (exp)"
                  value={formatDate(decoded.claims.exp)}
                  mono={false}
                />
              )}
            </Panel>
          )}

          <div className="grid gap-5 lg:grid-cols-2">
            <Panel title="Header" actions={<CopyButton value={header} />}>
              <pre className="overflow-x-auto font-mono text-sm whitespace-pre-wrap break-all">
                {header}
              </pre>
            </Panel>
            <Panel title="Payload" actions={<CopyButton value={payload} />}>
              <pre className="overflow-x-auto font-mono text-sm whitespace-pre-wrap break-all">
                {payload}
              </pre>
            </Panel>
          </div>
        </>
      )}

      <div className="alert alert-soft text-sm">
        <ShieldAlert className="size-4 shrink-0" />
        <span>
          Decoded in your browser only. The signature isn&apos;t verified: that
          needs the issuer&apos;s key, so don&apos;t trust the contents just
          because they decode.
        </span>
      </div>
    </div>
  );
}
