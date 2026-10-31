"use client";

import { Download, ImageUp, MapPin } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  ErrorMessage,
  formatBytes,
  OutputRow,
  Panel,
  Segmented,
} from "@/components/ui";
import { type ExifData, readExif } from "@/lib/exif";

type Format = "image/jpeg" | "image/webp" | "image/png";

const FORMATS: { value: Format; label: string }[] = [
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/webp", label: "WebP" },
  { value: "image/png", label: "PNG" },
];

const EXTENSIONS: Record<Format, string> = {
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/png": "png",
};

const MAX_FILE_BYTES = 50 * 1024 * 1024;
const SIZES = [0, 3840, 2560, 1920, 1280, 1024, 800, 512];

type Source = {
  file: File;
  bitmap: ImageBitmap;
  url: string;
  exif: ExifData | null;
};

type Output = { blob: Blob; url: string; width: number; height: number };

function encode(
  bitmap: ImageBitmap,
  format: Format,
  quality: number,
  maxSide: number,
): Promise<Output> {
  const scale = maxSide
    ? Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
    : 1;
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d")!;
  if (format === "image/jpeg") {
    // JPEG has no transparency; fill it white instead of black.
    context.fillStyle = "#fff";
    context.fillRect(0, 0, width, height);
  }
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, width, height);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve({ blob, url: URL.createObjectURL(blob), width, height })
          : reject(new Error("Encoding failed.")),
      format,
      quality,
    ),
  );
}

export default function ImageConverter() {
  const [source, setSource] = useState<Source | null>(null);
  const [output, setOutput] = useState<Output | null>(null);
  const [format, setFormat] = useState<Format>("image/jpeg");
  const [quality, setQuality] = useState(82);
  const [maxSide, setMaxSide] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const load = useCallback(async (file: File | undefined) => {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That file isn't an image.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(`Images up to ${formatBytes(MAX_FILE_BYTES)} are supported.`);
      return;
    }
    try {
      // createImageBitmap applies the EXIF orientation, so rotated phone
      // photos come out upright.
      const bitmap = await createImageBitmap(file);
      const exif = /jpe?g/.test(file.type)
        ? readExif(await file.arrayBuffer())
        : null;
      setSource((previous) => {
        if (previous) URL.revokeObjectURL(previous.url);
        return { file, bitmap, url: URL.createObjectURL(file), exif };
      });
    } catch {
      setError(
        "The browser can't read this image format. HEIC photos only open in Safari.",
      );
    }
  }, []);

  useEffect(() => {
    if (!source) return;
    let cancelled = false;
    let created: Output | null = null;
    async function run(bitmap: ImageBitmap) {
      const result = await encode(bitmap, format, quality / 100, maxSide);
      if (cancelled) {
        URL.revokeObjectURL(result.url);
        return;
      }
      created = result;
      setOutput(result);
    }
    run(source.bitmap);
    return () => {
      cancelled = true;
      if (created) URL.revokeObjectURL(created.url);
    };
  }, [source, format, quality, maxSide]);

  useEffect(() => {
    function onPaste(event: ClipboardEvent) {
      const file = [...(event.clipboardData?.files ?? [])].find((f) =>
        f.type.startsWith("image/"),
      );
      if (file) load(file);
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [load]);

  const exif = source?.exif;
  const ratio =
    source && output ? (output.blob.size / source.file.size - 1) * 100 : 0;
  // Keep "−99.6 %" from rounding to a misleading "−100 %".
  const change =
    Math.round(ratio) === -100 ? ratio.toFixed(1) : String(Math.round(ratio));

  return (
    <div className="space-y-5">
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          load(event.dataTransfer.files[0]);
        }}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-box border-2 border-dashed p-8 text-center transition-colors ${dragging ? "border-primary bg-primary/5" : "border-line hover:border-primary/50"}`}
      >
        <ImageUp className="size-8 text-faint" />
        <span className="font-semibold">
          Drop an image, paste one or click to choose
        </span>
        <span className="text-sm text-muted">JPEG, PNG, WebP, GIF or AVIF</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => load(event.target.files?.[0])}
        />
      </label>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {source && (
        <>
          <Panel title="Original">
            <OutputRow label="File" value={source.file.name} mono={false} />
            <OutputRow
              label="Size"
              value={`${source.bitmap.width} × ${source.bitmap.height} px · ${formatBytes(source.file.size)} · ${source.file.type}`}
              mono={false}
            />
            {exif?.gps && (
              <p className="my-2 flex items-center gap-2 text-sm text-warning">
                <MapPin className="size-4 shrink-0" />
                This photo contains its GPS location (
                {exif.gps.latitude.toFixed(5)}, {exif.gps.longitude.toFixed(5)}
                ). The converted image below doesn&apos;t.
              </p>
            )}
            {exif && (
              <>
                {(exif.make || exif.model) && (
                  <OutputRow
                    label="Camera"
                    value={[exif.make, exif.model].filter(Boolean).join(" ")}
                    mono={false}
                  />
                )}
                {exif.lens && (
                  <OutputRow label="Lens" value={exif.lens} mono={false} />
                )}
                {exif.dateTaken && (
                  <OutputRow
                    label="Taken"
                    value={exif.dateTaken}
                    mono={false}
                  />
                )}
                {(exif.exposure || exif.fNumber || exif.iso) && (
                  <OutputRow
                    label="Exposure"
                    value={[
                      exif.exposure,
                      exif.fNumber,
                      exif.iso && `ISO ${exif.iso}`,
                      exif.focalLength,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                    mono={false}
                  />
                )}
                {exif.software && (
                  <OutputRow
                    label="Software"
                    value={exif.software}
                    mono={false}
                  />
                )}
                <OutputRow
                  label="Metadata tags"
                  value={String(exif.tagCount)}
                  mono={false}
                />
              </>
            )}
            {!exif && (
              <p className="mt-2 text-sm text-muted">No EXIF metadata found.</p>
            )}
          </Panel>

          <Panel title="Convert">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex flex-col gap-1.5 text-sm">
                <span className="text-muted">Format</span>
                <Segmented
                  label="Format"
                  value={format}
                  onChange={setFormat}
                  options={FORMATS}
                />
              </div>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-muted">Longest side</span>
                <select
                  value={maxSide}
                  onChange={(event) => setMaxSide(Number(event.target.value))}
                  className="select select-sm w-40"
                >
                  {SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size ? `${size} px` : "Original"}
                    </option>
                  ))}
                </select>
              </label>
              {format !== "image/png" && (
                <label className="flex min-w-48 flex-1 flex-col gap-1.5 text-sm">
                  <span className="text-muted">Quality: {quality}</span>
                  <input
                    type="range"
                    min={30}
                    max={100}
                    value={quality}
                    onChange={(event) => setQuality(Number(event.target.value))}
                    className="range range-primary range-sm w-full"
                  />
                </label>
              )}
            </div>

            {output && (
              <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
                {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
                <img
                  src={output.url}
                  alt="Converted preview"
                  className="max-h-96 w-full rounded-field border border-line bg-base-100 object-contain"
                />
                <div className="space-y-2 text-sm md:w-56">
                  <p>
                    {output.width} × {output.height} px
                  </p>
                  <p>
                    {formatBytes(output.blob.size)}{" "}
                    <span
                      className={ratio <= 0 ? "text-success" : "text-warning"}
                    >
                      ({ratio > 0 ? "+" : ""}
                      {change} %)
                    </span>
                  </p>
                  <p className="text-xs text-faint">All metadata removed.</p>
                  <a
                    href={output.url}
                    download={`${source.file.name.replace(/\.[^.]+$/, "")}-converted.${EXTENSIONS[format]}`}
                    className="btn btn-primary w-full"
                  >
                    <Download className="size-4" />
                    Download
                  </a>
                </div>
              </div>
            )}
          </Panel>
        </>
      )}

      <p className="text-xs text-faint">
        Images are processed in your browser and never uploaded. Phone photos
        often contain the exact location where they were taken; converting
        strips it along with all other metadata.
      </p>
    </div>
  );
}
