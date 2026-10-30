"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { CopyButton, Panel, Segmented } from "@/components/ui";
import {
  generatePassphrase,
  generatePassword,
  MAX_PASSPHRASE_WORDS,
  MIN_PASSPHRASE_WORDS,
  MIN_PASSWORD_LENGTH,
  type PassphraseOptions,
  passphraseEntropy,
  type PasswordOptions,
  passwordEntropy,
  strengthLabel,
} from "@/lib/password";

type Mode = "password" | "passphrase";

const SET_LABELS: [keyof PasswordOptions, string][] = [
  ["lower", "Lowercase (a–z)"],
  ["upper", "Uppercase (A–Z)"],
  ["digits", "Digits (0–9)"],
  ["symbols", "Symbols (!#$%…)"],
  ["avoidAmbiguous", "Avoid look-alikes (I l 1 O 0 o)"],
];

const SEPARATORS = [
  { value: "-", label: "Hyphen" },
  { value: " ", label: "Space" },
  { value: ".", label: "Dot" },
  { value: "_", label: "Underscore" },
  { value: "", label: "None" },
];

function create(
  mode: Mode,
  password: PasswordOptions,
  passphrase: PassphraseOptions,
): string {
  return mode === "password"
    ? generatePassword(password)
    : generatePassphrase(passphrase);
}

const STRENGTH_COLORS: Record<string, string> = {
  Weak: "text-error",
  Fair: "text-warning",
  Strong: "text-success",
  "Very strong": "text-success",
};

export default function PasswordGenerator() {
  const [mode, setMode] = useState<Mode>("password");
  const [password, setPassword] = useState<PasswordOptions>({
    length: 24,
    lower: true,
    upper: true,
    digits: true,
    symbols: true,
    avoidAmbiguous: false,
  });
  const [passphrase, setPassphrase] = useState<PassphraseOptions>({
    words: 6,
    separator: "-",
    capitalize: true,
    addNumber: true,
  });
  const [value, setValue] = useState(() => create(mode, password, passphrase));

  // Regenerate whenever an option changes, so the result always matches the
  // settings on screen.
  function update(
    nextMode: Mode,
    nextPassword: PasswordOptions,
    nextPassphrase: PassphraseOptions,
  ) {
    setMode(nextMode);
    setPassword(nextPassword);
    setPassphrase(nextPassphrase);
    setValue(create(nextMode, nextPassword, nextPassphrase));
  }

  const setsSelected = [
    password.lower,
    password.upper,
    password.digits,
    password.symbols,
  ].filter(Boolean).length;
  const bits =
    mode === "password"
      ? passwordEntropy(password)
      : passphraseEntropy(passphrase);
  const strength = strengthLabel(bits);

  return (
    <div className="space-y-5">
      <Segmented
        label="Type"
        value={mode}
        onChange={(next) => update(next, password, passphrase)}
        options={[
          { value: "password", label: "Password" },
          { value: "passphrase", label: "Passphrase" },
        ]}
      />

      <Panel>
        <p
          className="font-mono text-lg break-all sm:text-xl"
          aria-live="polite"
        >
          {value}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <CopyButton value={value} primary />
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setValue(create(mode, password, passphrase))}
          >
            <RefreshCw className="size-4" />
            Generate new
          </button>
          <span className="ml-auto text-sm text-muted">
            <span className={STRENGTH_COLORS[strength]}>{strength}</span> ·{" "}
            {Math.round(bits)} bits of entropy
          </span>
        </div>
      </Panel>

      {mode === "password" ? (
        <Panel title="Options">
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-muted">Length: {password.length}</span>
            <input
              type="range"
              min={Math.max(MIN_PASSWORD_LENGTH, setsSelected)}
              max={64}
              value={password.length}
              onChange={(event) =>
                update(
                  mode,
                  { ...password, length: Number(event.target.value) },
                  passphrase,
                )
              }
              className="range range-primary range-sm w-full"
            />
          </label>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {SET_LABELS.map(([key, label]) => {
              const checked = password[key] as boolean;
              // Keep at least one character set selected.
              const isLastSet =
                key !== "avoidAmbiguous" && checked && setsSelected === 1;
              return (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={isLastSet}
                    onChange={(event) =>
                      update(
                        mode,
                        { ...password, [key]: event.target.checked },
                        passphrase,
                      )
                    }
                    className="checkbox checkbox-sm checkbox-primary"
                  />
                  {label}
                </label>
              );
            })}
          </div>
        </Panel>
      ) : (
        <Panel title="Options">
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-muted">Words: {passphrase.words}</span>
            <input
              type="range"
              min={MIN_PASSPHRASE_WORDS}
              max={MAX_PASSPHRASE_WORDS}
              value={passphrase.words}
              onChange={(event) =>
                update(mode, password, {
                  ...passphrase,
                  words: Number(event.target.value),
                })
              }
              className="range range-primary range-sm w-full"
            />
          </label>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-muted">Separator</span>
              <select
                value={passphrase.separator}
                onChange={(event) =>
                  update(mode, password, {
                    ...passphrase,
                    separator: event.target.value,
                  })
                }
                className="select w-full"
              >
                {SEPARATORS.map((s) => (
                  <option key={s.label} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-col justify-end gap-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={passphrase.capitalize}
                  onChange={(event) =>
                    update(mode, password, {
                      ...passphrase,
                      capitalize: event.target.checked,
                    })
                  }
                  className="checkbox checkbox-sm checkbox-primary"
                />
                Capitalize words
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={passphrase.addNumber}
                  onChange={(event) =>
                    update(mode, password, {
                      ...passphrase,
                      addNumber: event.target.checked,
                    })
                  }
                  className="checkbox checkbox-sm checkbox-primary"
                />
                Add a digit
              </label>
            </div>
          </div>
          <p className="mt-4 text-xs text-faint">
            Words come from the EFF large wordlist (7,776 words). Six words give
            about 77 bits, which is plenty for a password manager master
            password.
          </p>
        </Panel>
      )}
    </div>
  );
}
