"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { ErrorMessage, Panel, Segmented } from "@/components/ui";
import {
  type Ecc,
  qrMatrix,
  qrPath,
  qrSvg,
  type WifiNetwork,
  wifiPayload,
} from "@/lib/qr";

type Mode = "text" | "wifi";

const ECC_LEVELS: { value: Ecc; label: string }[] = [
  { value: "L", label: "Low (7%)" },
  { value: "M", label: "Medium (15%)" },
  { value: "Q", label: "Quartile (25%)" },
  { value: "H", label: "High (30%)" },
];

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadPng(matrix: boolean[][], pixels: number) {
  const scale = Math.max(1, Math.floor(pixels / matrix.length));
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = matrix.length * scale;
  const context = canvas.getContext("2d")!;
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#000";
  matrix.forEach((row, y) =>
    row.forEach((dark, x) => {
      if (dark) context.fillRect(x * scale, y * scale, scale, scale);
    }),
  );
  canvas.toBlob((blob) => blob && download(blob, "qr-code.png"), "image/png");
}

function build(payload: string, ecc: Ecc) {
  if (!payload) return { matrix: null, error: null };
  try {
    return { matrix: qrMatrix(payload, ecc), error: null };
  } catch {
    return {
      matrix: null,
      error:
        "That's too much data for a QR code. Shorten it or lower the error correction.",
    };
  }
}

export default function QrCodeGenerator() {
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("https://tools.t-s.dev");
  const [wifi, setWifi] = useState<WifiNetwork>({
    ssid: "",
    password: "",
    security: "WPA",
    hidden: false,
  });
  const [ecc, setEcc] = useState<Ecc>("M");
  const [pixels, setPixels] = useState(1024);

  const payload = mode === "text" ? text : wifi.ssid ? wifiPayload(wifi) : "";
  const { matrix, error } = build(payload, ecc);

  return (
    <div className="space-y-5">
      <Segmented
        label="Content"
        value={mode}
        onChange={setMode}
        options={[
          { value: "text", label: "Link or text" },
          { value: "wifi", label: "Wi-Fi" },
        ]}
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          {mode === "text" ? (
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="https://… or any text"
              aria-label="Content"
              rows={4}
              spellCheck={false}
              className="textarea w-full font-mono text-sm"
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-muted">Network name (SSID)</span>
                <input
                  value={wifi.ssid}
                  onChange={(event) =>
                    setWifi({ ...wifi, ssid: event.target.value })
                  }
                  className="input w-full"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-muted">Security</span>
                <select
                  value={wifi.security}
                  onChange={(event) =>
                    setWifi({
                      ...wifi,
                      security: event.target.value as WifiNetwork["security"],
                    })
                  }
                  className="select w-full"
                >
                  <option value="WPA">WPA / WPA2 / WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Open (no password)</option>
                </select>
              </label>
              {wifi.security !== "nopass" && (
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="text-muted">Password</span>
                  <input
                    type="password"
                    value={wifi.password}
                    onChange={(event) =>
                      setWifi({ ...wifi, password: event.target.value })
                    }
                    autoComplete="off"
                    className="input w-full"
                  />
                </label>
              )}
              <label className="flex items-center gap-2 self-end pb-2 text-sm">
                <input
                  type="checkbox"
                  checked={wifi.hidden}
                  onChange={(event) =>
                    setWifi({ ...wifi, hidden: event.target.checked })
                  }
                  className="checkbox checkbox-sm checkbox-primary"
                />
                Hidden network
              </label>
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-muted">Error correction</span>
              <select
                value={ecc}
                onChange={(event) => setEcc(event.target.value as Ecc)}
                className="select select-sm w-44"
              >
                {ECC_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-muted">PNG size</span>
              <select
                value={pixels}
                onChange={(event) => setPixels(Number(event.target.value))}
                className="select select-sm w-32"
              >
                {[256, 512, 1024, 2048].map((size) => (
                  <option key={size} value={size}>
                    {size} px
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          <p className="text-xs text-faint">
            Higher error correction survives scratches or a logo on top, but
            makes the code denser. Generated in your browser, so Wi-Fi passwords
            stay on this device.
          </p>
        </div>

        <Panel>
          {matrix ? (
            <>
              <svg
                viewBox={`0 0 ${matrix.length} ${matrix.length}`}
                shapeRendering="crispEdges"
                role="img"
                aria-label="QR code"
                className="w-full rounded-field"
              >
                <rect
                  width={matrix.length}
                  height={matrix.length}
                  fill="#fff"
                />
                <path d={qrPath(matrix)} fill="#000" />
              </svg>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="btn btn-primary btn-sm flex-1"
                  onClick={() => downloadPng(matrix, pixels)}
                >
                  <Download className="size-4" />
                  PNG
                </button>
                <button
                  type="button"
                  className="btn btn-sm flex-1"
                  onClick={() =>
                    download(
                      new Blob([qrSvg(matrix)], { type: "image/svg+xml" }),
                      "qr-code.svg",
                    )
                  }
                >
                  <Download className="size-4" />
                  SVG
                </button>
              </div>
            </>
          ) : (
            <div className="flex aspect-square items-center justify-center text-sm text-faint">
              {mode === "wifi" ? "Enter a network name" : "Enter some text"}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
