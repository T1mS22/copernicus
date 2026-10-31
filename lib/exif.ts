// Reads the most useful EXIF tags from a JPEG: camera, date, GPS position.
// Re-encoding the image through a canvas drops all metadata, which is how
// the image tool removes it.

export type ExifData = {
  make?: string;
  model?: string;
  software?: string;
  dateTaken?: string;
  orientation?: number;
  lens?: string;
  exposure?: string;
  fNumber?: string;
  iso?: number;
  focalLength?: string;
  gps?: { latitude: number; longitude: number; altitude?: number };
  tagCount: number;
};

const TYPE_SIZES: Record<number, number> = {
  1: 1,
  2: 1,
  3: 2,
  4: 4,
  5: 8,
  7: 1,
  9: 4,
  10: 8,
};

type Entry = { tag: number; type: number; count: number; valueOffset: number };

function readIfd(
  view: DataView,
  tiff: number,
  offset: number,
  little: boolean,
): { entries: Entry[]; next: number } {
  const count = view.getUint16(tiff + offset, little);
  const entries: Entry[] = [];
  for (let i = 0; i < count; i++) {
    const at = tiff + offset + 2 + i * 12;
    const type = view.getUint16(at + 2, little);
    const itemCount = view.getUint32(at + 4, little);
    const size = (TYPE_SIZES[type] ?? 1) * itemCount;
    entries.push({
      tag: view.getUint16(at, little),
      type,
      count: itemCount,
      // Values up to 4 bytes are stored inline.
      valueOffset: size <= 4 ? at + 8 : tiff + view.getUint32(at + 8, little),
    });
  }
  return {
    entries,
    next: view.getUint32(tiff + offset + 2 + count * 12, little),
  };
}

function readValue(
  view: DataView,
  entry: Entry,
  little: boolean,
): string | number | number[] {
  const { type, count, valueOffset } = entry;
  if (type === 2) {
    let text = "";
    for (let i = 0; i < count; i++) {
      const code = view.getUint8(valueOffset + i);
      if (code === 0) break;
      text += String.fromCharCode(code);
    }
    return text.trim();
  }
  const values: number[] = [];
  for (let i = 0; i < count; i++) {
    if (type === 3) values.push(view.getUint16(valueOffset + i * 2, little));
    else if (type === 4)
      values.push(view.getUint32(valueOffset + i * 4, little));
    else if (type === 5 || type === 10) {
      const read =
        type === 5 ? view.getUint32.bind(view) : view.getInt32.bind(view);
      const numerator = read(valueOffset + i * 8, little);
      const denominator = read(valueOffset + i * 8 + 4, little);
      values.push(denominator ? numerator / denominator : 0);
    } else values.push(view.getUint8(valueOffset + i));
  }
  return count === 1 ? values[0] : values;
}

function toDegrees(value: number[] | number, ref: string): number {
  const [d, m = 0, s = 0] = Array.isArray(value) ? value : [value];
  const degrees = d + m / 60 + s / 3600;
  return ref === "S" || ref === "W" ? -degrees : degrees;
}

export function readExif(buffer: ArrayBuffer): ExifData | null {
  const view = new DataView(buffer);
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return null;

  // Walk the JPEG segments to the APP1 "Exif" block.
  let offset = 2;
  while (offset + 4 <= view.byteLength) {
    const marker = view.getUint16(offset);
    const length = view.getUint16(offset + 2);
    if (marker === 0xffe1 && view.getUint32(offset + 4) === 0x45786966) {
      return parseTiff(view, offset + 10);
    }
    if ((marker & 0xff00) !== 0xff00 || marker === 0xffda) break;
    offset += 2 + length;
  }
  return null;
}

function parseTiff(view: DataView, tiff: number): ExifData | null {
  const little = view.getUint16(tiff) === 0x4949;
  if (view.getUint16(tiff + 2, little) !== 42) return null;

  const tags = new Map<number, string | number | number[]>();
  const gpsTags = new Map<number, string | number | number[]>();
  const visit = (
    ifdOffset: number,
    target: Map<number, string | number | number[]>,
  ) => {
    const { entries } = readIfd(view, tiff, ifdOffset, little);
    for (const entry of entries) {
      if (entry.tag === 0x8769)
        visit(view.getUint32(entry.valueOffset, little), tags);
      else if (entry.tag === 0x8825)
        visit(view.getUint32(entry.valueOffset, little), gpsTags);
      else target.set(entry.tag, readValue(view, entry, little));
    }
  };
  visit(view.getUint32(tiff + 4, little), tags);

  const str = (tag: number) =>
    typeof tags.get(tag) === "string" ? (tags.get(tag) as string) : undefined;
  const numberTag = (tag: number) =>
    typeof tags.get(tag) === "number" ? (tags.get(tag) as number) : undefined;

  const exposure = numberTag(0x829a);
  const data: ExifData = {
    make: str(0x010f),
    model: str(0x0110),
    software: str(0x0131),
    dateTaken: str(0x9003) ?? str(0x0132),
    orientation: numberTag(0x0112),
    lens: str(0xa434),
    exposure: exposure
      ? exposure < 1
        ? `1/${Math.round(1 / exposure)} s`
        : `${exposure} s`
      : undefined,
    fNumber: numberTag(0x829d) ? `f/${numberTag(0x829d)}` : undefined,
    iso: numberTag(0x8827),
    focalLength: numberTag(0x920a)
      ? `${Math.round(numberTag(0x920a)!)} mm`
      : undefined,
    tagCount: tags.size + gpsTags.size,
  };

  const lat = gpsTags.get(0x0002);
  const lon = gpsTags.get(0x0004);
  if (lat !== undefined && lon !== undefined) {
    const altitude = gpsTags.get(0x0006);
    data.gps = {
      latitude: toDegrees(lat as number[], String(gpsTags.get(0x0001) ?? "N")),
      longitude: toDegrees(lon as number[], String(gpsTags.get(0x0003) ?? "E")),
      altitude: typeof altitude === "number" ? altitude : undefined,
    };
  }
  return data;
}
