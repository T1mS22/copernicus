"use client";

import { CircleCheck, CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { ErrorMessage, OutputRow, Panel } from "@/components/ui";
import {
  decodeKey,
  hmac,
  HMAC_ALGORITHMS,
  type HmacAlgorithm,
  type KeyEncoding,
  signatureMatches,
} from "@/lib/hmac";

type Result = { hex: string; base64: string };

export default function HmacGenerator() {
  const [algorithm, setAlgorithm] = useState<HmacAlgorithm>("SHA-256");
  const [key, setKey] = useState("");
  const [keyEncoding, setKeyEncoding] = useState<KeyEncoding>("text");
  const [message, setMessage] = useState("");
  const [expected, setExpected] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function sign() {
      try {
        const signature =
          key || message
            ? await hmac(algorithm, decodeKey(key, keyEncoding), message)
            : null;
        if (!cancelled) {
          setResult(signature);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setResult(null);
          setError((e as Error).message);
        }
      }
    }
    sign();
    return () => {
      cancelled = true;
    };
  }, [algorithm, key, keyEncoding, message]);

  const match =
    expected.trim() && result ? signatureMatches(expected, result) : null;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">Secret key</span>
          <input
            type="password"
            value={key}
            onChange={(event) => setKey(event.target.value)}
            autoComplete="off"
            spellCheck={false}
            className="input w-full font-mono"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">Key format</span>
          <select
            value={keyEncoding}
            onChange={(event) =>
              setKeyEncoding(event.target.value as KeyEncoding)
            }
            className="select w-full sm:w-32"
          >
            <option value="text">Text</option>
            <option value="hex">Hex</option>
            <option value="base64">Base64</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">Algorithm</span>
          <select
            value={algorithm}
            onChange={(event) =>
              setAlgorithm(event.target.value as HmacAlgorithm)
            }
            className="select w-full sm:w-36"
          >
            {HMAC_ALGORITHMS.map((a) => (
              <option key={a} value={a}>
                HMAC-{a}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted">Message (e.g. the raw webhook body)</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={6}
          spellCheck={false}
          className="textarea w-full font-mono text-sm"
        />
      </label>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Panel title="Signature">
        <OutputRow label="Hex" value={result?.hex ?? ""} />
        <OutputRow label="Base64" value={result?.base64 ?? ""} />
      </Panel>

      <Panel title="Verify a signature">
        <input
          value={expected}
          onChange={(event) => setExpected(event.target.value)}
          placeholder="Paste the received signature, e.g. sha256=… from X-Hub-Signature-256"
          aria-label="Received signature"
          spellCheck={false}
          className="input w-full font-mono text-sm"
        />
        {match !== null && (
          <p
            className={`mt-3 flex items-center gap-2 text-sm ${match ? "text-success" : "text-error"}`}
          >
            {match ? (
              <CircleCheck className="size-4" />
            ) : (
              <CircleX className="size-4" />
            )}
            {match
              ? "Signature matches."
              : "Doesn't match. Check the key, the algorithm and that the body is byte-for-byte identical."}
          </p>
        )}
      </Panel>

      <p className="text-xs text-faint">
        Computed with Web Crypto in your browser; the key never leaves this
        page. Messages are signed as UTF-8.
      </p>
    </div>
  );
}
