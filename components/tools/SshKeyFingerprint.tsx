"use client";

import { TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { ErrorMessage, OutputRow, Panel } from "@/components/ui";
import { parseSshKeys, type SshKey } from "@/lib/ssh";

function weakness(key: SshKey): string | null {
  if (key.type === "DSA")
    return "DSA keys are deprecated and disabled in current OpenSSH.";
  if (key.type === "RSA" && (key.bits ?? 0) < 2048)
    return "RSA keys below 2048 bits are too weak.";
  return null;
}

export default function SshKeyFingerprint() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ keys: SshKey[]; errors: string[] }>({
    keys: [],
    errors: [],
  });

  useEffect(() => {
    let cancelled = false;
    async function parse() {
      const parsed = input.trim()
        ? await parseSshKeys(input)
        : { keys: [], errors: [] };
      if (!cancelled) setResult(parsed);
    }
    parse();
    return () => {
      cancelled = true;
    };
  }, [input]);

  return (
    <div className="space-y-5">
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA… you@laptop"
        aria-label="SSH public keys"
        rows={5}
        spellCheck={false}
        className="textarea w-full font-mono text-sm break-all"
      />
      {result.errors.map((error) => (
        <ErrorMessage key={error}>{error}</ErrorMessage>
      ))}
      {result.keys.map((key, i) => {
        const weak = weakness(key);
        return (
          <Panel
            key={i}
            title={`${key.type}${key.bits ? ` · ${key.bits} bit` : ""}`}
            actions={
              key.comment && (
                <span className="text-sm text-muted">{key.comment}</span>
              )
            }
          >
            {weak && (
              <p className="mb-2 flex gap-2 text-sm text-warning">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                {weak}
              </p>
            )}
            <OutputRow label="SHA256 fingerprint" value={key.sha256} />
            <OutputRow label="MD5 fingerprint" value={key.md5} />
          </Panel>
        );
      })}
      <p className="text-xs text-faint">
        Same output as ssh-keygen -lf. GitHub, GitLab and current OpenSSH show
        the SHA256 form; older tools show MD5. Paste a .pub file or a whole
        authorized_keys file. Never paste a private key.
      </p>
    </div>
  );
}
