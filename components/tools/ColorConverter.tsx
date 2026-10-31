"use client";

import { CircleCheck, CircleX } from "lucide-react";
import { useState } from "react";
import { OutputRow, Panel } from "@/components/ui";
import {
  contrastRatio,
  parseColor,
  type Rgba,
  toHex,
  toHslString,
  toOklchString,
  toRgbString,
  wcagLevels,
} from "@/lib/color";

const opaqueHex = (color: Rgba) => toHex({ ...color, a: 1 });

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const color = parseColor(value);
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-muted">{label}</span>
      <span className="flex gap-2">
        <input
          type="color"
          value={color ? opaqueHex(color) : "#000000"}
          onChange={(event) => onChange(event.target.value)}
          aria-label={`${label} picker`}
          className="h-10 w-12 shrink-0 cursor-pointer rounded-field border border-line bg-base-200 p-1"
        />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
          aria-label={label}
          className={`input w-full font-mono ${value && !color ? "input-error" : ""}`}
        />
      </span>
    </label>
  );
}

function Level({ pass, label }: { pass: boolean; label: string }) {
  return (
    <span
      className={`flex items-center gap-1.5 text-sm ${pass ? "text-success" : "text-error"}`}
    >
      {pass ? (
        <CircleCheck className="size-4" />
      ) : (
        <CircleX className="size-4" />
      )}
      {label}
    </span>
  );
}

// Swatches use inline styles, so this tool renders only in the browser:
// the CSP blocks style attributes in server-rendered HTML.
export default function ColorConverter() {
  const [input, setInput] = useState("#ff7a00");
  const [foreground, setForeground] = useState("#0b0d12");
  const [background, setBackground] = useState("#ff7a00");

  const color = parseColor(input);
  const fg = parseColor(foreground);
  const bg = parseColor(background);
  const ratio = fg && bg ? contrastRatio(fg, bg) : null;
  const levels = ratio ? wcagLevels(ratio) : null;

  return (
    <div className="space-y-5">
      <Panel>
        <div className="grid gap-5 sm:grid-cols-[1fr_8rem]">
          <div>
            <ColorInput
              label="Color (HEX, rgb(), hsl() or oklch())"
              value={input}
              onChange={setInput}
            />
            {input && !color && (
              <p className="mt-2 text-sm text-error">
                Try #ff7a00, rgb(255 122 0), hsl(29 100% 50%) or oklch(72% 0.19
                50).
              </p>
            )}
          </div>
          <div
            className="h-24 rounded-box border border-line sm:h-full"
            style={{
              backgroundColor: color ? toRgbString(color) : "transparent",
            }}
            aria-hidden
          />
        </div>
        {color && (
          <div className="mt-4">
            <OutputRow label="HEX" value={toHex(color)} />
            <OutputRow label="RGB" value={toRgbString(color)} />
            <OutputRow label="HSL" value={toHslString(color)} />
            <OutputRow label="OKLCH" value={toOklchString(color)} />
            <OutputRow
              label="Contrast on white / black"
              value={`${contrastRatio(color, parseColor("#fff")!).toFixed(2)} : 1 / ${contrastRatio(color, parseColor("#000")!).toFixed(2)} : 1`}
            />
          </div>
        )}
      </Panel>

      <Panel title="Contrast check (WCAG 2.2)">
        <div className="grid gap-4 sm:grid-cols-2">
          <ColorInput
            label="Text"
            value={foreground}
            onChange={setForeground}
          />
          <ColorInput
            label="Background"
            value={background}
            onChange={setBackground}
          />
        </div>
        {fg && bg && ratio && levels && (
          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div
              className="rounded-box border border-line p-5"
              style={{
                color: toRgbString(fg),
                backgroundColor: toRgbString(bg),
              }}
            >
              <p className="text-2xl font-semibold">Large text 24px</p>
              <p className="mt-1 text-sm">
                Normal body text at 14px should stay readable.
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="font-mono text-3xl tabular-nums">
                {ratio.toFixed(2)} : 1
              </p>
              <Level pass={levels.aaNormal} label="AA normal text (4.5)" />
              <Level pass={levels.aaLarge} label="AA large text (3)" />
              <Level pass={levels.aaaNormal} label="AAA normal text (7)" />
              <Level pass={levels.aaaLarge} label="AAA large text (4.5)" />
            </div>
          </div>
        )}
        <button
          type="button"
          className="btn btn-ghost btn-sm mt-3"
          onClick={() => {
            setForeground(background);
            setBackground(foreground);
          }}
        >
          Swap colors
        </button>
      </Panel>
    </div>
  );
}
