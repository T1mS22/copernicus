"use client";

import { useState } from "react";
import { OutputRow, Panel } from "@/components/ui";
import {
  type Permissions,
  parseOctal,
  parseSymbolic,
  toOctal,
  toSymbolic,
  type Triplet,
} from "@/lib/chmod";

const CLASSES: { key: "owner" | "group" | "others"; label: string }[] = [
  { key: "owner", label: "Owner" },
  { key: "group", label: "Group" },
  { key: "others", label: "Others" },
];

const BITS: { key: keyof Triplet; label: string }[] = [
  { key: "read", label: "Read" },
  { key: "write", label: "Write" },
  { key: "execute", label: "Execute" },
];

const SPECIAL: {
  key: "setuid" | "setgid" | "sticky";
  label: string;
  hint: string;
}[] = [
  { key: "setuid", label: "Set user ID", hint: "Runs as the file's owner" },
  {
    key: "setgid",
    label: "Set group ID",
    hint: "Runs as the group; new files in a directory inherit it",
  },
  {
    key: "sticky",
    label: "Sticky",
    hint: "In a directory, only owners can delete their files",
  },
];

const PRESETS = ["644", "755", "600", "700", "775", "1777"];

export default function ChmodCalculator() {
  const [permissions, setPermissions] = useState<Permissions>(
    parseOctal("755")!,
  );
  const [input, setInput] = useState("755");

  const octal = toOctal(permissions);
  const symbolic = toSymbolic(permissions);
  const inputInvalid =
    input.trim() !== "" && !parseOctal(input) && !parseSymbolic(input);

  function update(next: Permissions) {
    setPermissions(next);
    setInput(toOctal(next));
  }

  return (
    <div className="space-y-5">
      <div>
        <input
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            const parsed =
              parseOctal(event.target.value) ??
              parseSymbolic(event.target.value);
            if (parsed) setPermissions(parsed);
          }}
          placeholder="755, 0644 or -rwxr-xr-x"
          aria-label="Permissions in octal or symbolic form"
          spellCheck={false}
          className={`input input-lg w-full font-mono ${inputInvalid ? "input-error" : ""}`}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => update(parseOctal(preset)!)}
              className="btn btn-ghost btn-xs border-line font-mono"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <Panel>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th />
                {BITS.map((bit) => (
                  <th key={bit.key} className="text-center">
                    {bit.label}
                  </th>
                ))}
                <th className="text-center">Value</th>
              </tr>
            </thead>
            <tbody>
              {CLASSES.map((cls) => {
                const triplet = permissions[cls.key];
                const value =
                  (triplet.read ? 4 : 0) +
                  (triplet.write ? 2 : 0) +
                  (triplet.execute ? 1 : 0);
                return (
                  <tr key={cls.key}>
                    <th className="font-normal text-muted">{cls.label}</th>
                    {BITS.map((bit) => (
                      <td key={bit.key} className="text-center">
                        <input
                          type="checkbox"
                          checked={triplet[bit.key]}
                          aria-label={`${cls.label} ${bit.label.toLowerCase()}`}
                          onChange={(event) =>
                            update({
                              ...permissions,
                              [cls.key]: {
                                ...triplet,
                                [bit.key]: event.target.checked,
                              },
                            })
                          }
                          className="checkbox checkbox-sm checkbox-primary"
                        />
                      </td>
                    ))}
                    <td className="text-center font-mono">{value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {SPECIAL.map((special) => (
            <label
              key={special.key}
              className="flex items-start gap-2 text-sm"
              title={special.hint}
            >
              <input
                type="checkbox"
                checked={permissions[special.key]}
                onChange={(event) =>
                  update({
                    ...permissions,
                    [special.key]: event.target.checked,
                  })
                }
                className="checkbox checkbox-sm checkbox-primary mt-0.5"
              />
              <span>
                {special.label}
                <span className="block text-xs text-faint">{special.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </Panel>

      <Panel>
        <OutputRow label="Octal" value={octal} />
        <OutputRow label="Symbolic" value={symbolic} />
        <OutputRow label="Command" value={`chmod ${octal} <file>`} />
      </Panel>
    </div>
  );
}
