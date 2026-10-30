"use client";

import { CircleCheck, CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { formatBytes, OutputRow, Panel, Segmented } from "@/components/ui";
import {
  digestAll,
  HASH_ALGORITHMS,
  type HashAlgorithm,
  sameHash,
} from "@/lib/hash";

type Mode = "text" | "file";
type Digests = Record<HashAlgorithm, string>;

const MAX_FILE_BYTES = 512 * 1024 * 1024;

export default function HashGenerator() {
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [digests, setDigests] = useState<Digests | null>(null);
  const [busy, setBusy] = useState(false);
  const [expected, setExpected] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function hash() {
      const data =
        mode === "text"
          ? text
            ? new TextEncoder().encode(text)
            : null
          : file && file.size <= MAX_FILE_BYTES
            ? await file.arrayBuffer()
            : null;
      const result = data ? await digestAll(data) : null;
      if (!cancelled) {
        setDigests(result);
        setBusy(false);
      }
    }
    hash();
    return () => {
      cancelled = true;
    };
  }, [mode, text, file]);

  const match =
    expected.trim() && digests
      ? HASH_ALGORITHMS.find((algorithm) =>
          sameHash(expected, digests[algorithm]),
        )
      : undefined;

  return (
    <div className="space-y-5">
      <Segmented
        label="Input"
        value={mode}
        onChange={setMode}
        options={[
          { value: "text", label: "Text" },
          { value: "file", label: "File" },
        ]}
      />

      {mode === "text" ? (
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Text to hash (UTF-8)…"
          aria-label="Text to hash"
          rows={5}
          spellCheck={false}
          className="textarea w-full font-mono text-sm"
        />
      ) : (
        <div>
          <input
            type="file"
            onChange={(event) => {
              setBusy(true);
              setFile(event.target.files?.[0] ?? null);
            }}
            aria-label="File to hash"
            className="file-input w-full"
          />
          {file && (
            <p className="mt-2 text-sm text-muted">
              {file.name} · {formatBytes(file.size)}
              {file.size > MAX_FILE_BYTES && (
                <span className="text-error">
                  {" "}
                  · too large, the limit is {formatBytes(MAX_FILE_BYTES)}
                </span>
              )}
            </p>
          )}
        </div>
      )}

      <Panel
        title="Hashes"
        actions={
          busy && <span className="loading loading-spinner loading-sm" />
        }
      >
        {HASH_ALGORITHMS.map((algorithm) => (
          <OutputRow
            key={algorithm}
            label={match === algorithm ? `${algorithm} ✓` : algorithm}
            value={digests?.[algorithm] ?? ""}
          />
        ))}
      </Panel>

      <Panel title="Compare with a checksum">
        <input
          value={expected}
          onChange={(event) => setExpected(event.target.value)}
          placeholder="Paste the expected hash, e.g. from a download page"
          aria-label="Expected hash"
          spellCheck={false}
          className="input w-full font-mono text-sm"
        />
        {expected.trim() && digests && (
          <p
            className={`mt-3 flex items-center gap-2 text-sm ${match ? "text-success" : "text-error"}`}
          >
            {match ? (
              <>
                <CircleCheck className="size-4" /> Matches the {match} hash.
              </>
            ) : (
              <>
                <CircleX className="size-4" /> Doesn&apos;t match any of the
                hashes above.
              </>
            )}
          </p>
        )}
      </Panel>

      <p className="text-xs text-faint">
        SHA-1 is broken for security purposes; use it only to compare with
        existing checksums. MD5 isn&apos;t offered because browsers don&apos;t
        support it natively.
      </p>
    </div>
  );
}
