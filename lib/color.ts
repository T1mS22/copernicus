// Colors are stored as sRGB with channels 0–255 and alpha 0–1.
export type Rgba = { r: number; g: number; b: number; a: number };

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const round = (value: number, digits = 0) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

function parseHex(text: string): Rgba | null {
  const match = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(text);
  if (!match) return null;
  let hex = match[1];
  if (hex.length <= 4) hex = [...hex].map((c) => c + c).join("");
  const value = (i: number) => parseInt(hex.slice(i, i + 2), 16);
  return {
    r: value(0),
    g: value(2),
    b: value(4),
    a: hex.length === 8 ? round(value(6) / 255, 3) : 1,
  };
}

// "50%" → 0.5 of `scale`, "0.5" → 0.5 (for alpha), "128" → 128.
function channel(text: string, scale: number): number {
  return text.endsWith("%")
    ? (parseFloat(text) / 100) * scale
    : parseFloat(text);
}

function functionArgs(text: string, name: RegExp): string[] | null {
  const match = new RegExp(`^${name.source}\\((.*)\\)$`, "i").exec(text);
  if (!match) return null;
  // Accepts both "1, 2, 3, 0.5" and "1 2 3 / 0.5".
  return match[1]
    .trim()
    .split(/\s*[,/]\s*|\s+/)
    .filter(Boolean);
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

const toLinear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const fromLinear = (c: number) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;

// OKLCH ↔ sRGB via OKLab (Björn Ottosson's matrices).
function oklchToRgb(l: number, c: number, h: number): [number, number, number] {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ].map((v) => clamp(fromLinear(v), 0, 1) * 255) as [number, number, number];
}

export function parseColor(input: string): Rgba | null {
  const text = input.trim().toLowerCase();
  const hex = parseHex(text);
  if (hex) return hex;

  const alphaOf = (value?: string) =>
    value === undefined ? 1 : clamp(channel(value, 1), 0, 1);

  const rgb = functionArgs(text, /rgba?/);
  if (rgb && (rgb.length === 3 || rgb.length === 4)) {
    const [r, g, b] = rgb
      .slice(0, 3)
      .map((v) => clamp(channel(v, 255), 0, 255));
    if ([r, g, b].some(Number.isNaN)) return null;
    return { r, g, b, a: alphaOf(rgb[3]) };
  }

  const hsl = functionArgs(text, /hsla?/);
  if (hsl && (hsl.length === 3 || hsl.length === 4)) {
    const h = parseFloat(hsl[0]);
    const s = clamp(
      channel(hsl[1].endsWith("%") ? hsl[1] : `${hsl[1]}%`, 1),
      0,
      1,
    );
    const l = clamp(
      channel(hsl[2].endsWith("%") ? hsl[2] : `${hsl[2]}%`, 1),
      0,
      1,
    );
    if ([h, s, l].some(Number.isNaN)) return null;
    const [r, g, b] = hslToRgb(((h % 360) + 360) % 360, s, l);
    return { r, g, b, a: alphaOf(hsl[3]) };
  }

  const oklch = functionArgs(text, /oklch/);
  if (oklch && (oklch.length === 3 || oklch.length === 4)) {
    const l = clamp(channel(oklch[0], 1), 0, 1);
    const c = Math.max(0, channel(oklch[1], 0.4));
    const h = parseFloat(oklch[2]);
    if ([l, c, h].some(Number.isNaN)) return null;
    const [r, g, b] = oklchToRgb(l, c, h);
    return { r, g, b, a: alphaOf(oklch[3]) };
  }
  return null;
}

const hex2 = (value: number) =>
  Math.round(clamp(value, 0, 255))
    .toString(16)
    .padStart(2, "0");

export function toHex({ r, g, b, a }: Rgba): string {
  return `#${hex2(r)}${hex2(g)}${hex2(b)}${a < 1 ? hex2(a * 255) : ""}`;
}

const alphaSuffix = (a: number) => (a < 1 ? ` / ${round(a, 3)}` : "");

export function toRgbString({ r, g, b, a }: Rgba): string {
  return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)}${alphaSuffix(a)})`;
}

export function toHsl({ r, g, b }: Rgba) {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === rn) h = ((gn - bn) / d) % 6;
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return { h: (h * 60 + 360) % 360, s, l };
}

export function toHslString(color: Rgba): string {
  const { h, s, l } = toHsl(color);
  return `hsl(${round(h)} ${round(s * 100)}% ${round(l * 100)}%${alphaSuffix(color.a)})`;
}

export function toOklch({ r, g, b }: Rgba) {
  const [lr, lg, lb] = [r, g, b].map((v) => toLinear(v / 255));
  const l = Math.cbrt(
    0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb,
  );
  const m = Math.cbrt(
    0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb,
  );
  const s = Math.cbrt(
    0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb,
  );
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const c = Math.sqrt(A * A + B * B);
  const h = c < 1e-4 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return { l: L, c, h };
}

export function toOklchString(color: Rgba): string {
  const { l, c, h } = toOklch(color);
  return `oklch(${round(l * 100, 1)}% ${round(c, 4)} ${round(h, 1)}${alphaSuffix(color.a)})`;
}

// WCAG 2.x relative luminance and contrast ratio (1–21). Alpha is ignored.
export function luminance({ r, g, b }: Rgba): number {
  const [lr, lg, lb] = [r, g, b].map((v) => toLinear(v / 255));
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

export function contrastRatio(a: Rgba, b: Rgba): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

export function wcagLevels(ratio: number) {
  return {
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaaNormal: ratio >= 7,
    aaaLarge: ratio >= 4.5,
  };
}
