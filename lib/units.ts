// Every unit converts through its category's base unit. Linear units only
// need a factor (value in base = value × factor); temperature needs offsets.
export type Unit = {
  id: string;
  label: string;
  symbol: string;
  factor?: number;
  toBase?: (value: number) => number;
  fromBase?: (value: number) => number;
};

export type UnitCategory = { id: string; label: string; units: Unit[] };

const unit = (id: string, label: string, symbol: string, factor: number) => ({
  id,
  label,
  symbol,
  factor,
});

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: "length",
    label: "Length",
    units: [
      unit("nm", "Nanometre", "nm", 1e-9),
      unit("um", "Micrometre", "µm", 1e-6),
      unit("mm", "Millimetre", "mm", 1e-3),
      unit("cm", "Centimetre", "cm", 1e-2),
      unit("m", "Metre", "m", 1),
      unit("km", "Kilometre", "km", 1e3),
      unit("in", "Inch", "in", 0.0254),
      unit("ft", "Foot", "ft", 0.3048),
      unit("yd", "Yard", "yd", 0.9144),
      unit("mi", "Mile", "mi", 1609.344),
      unit("nmi", "Nautical mile", "nmi", 1852),
    ],
  },
  {
    id: "mass",
    label: "Mass",
    units: [
      unit("mg", "Milligram", "mg", 1e-6),
      unit("g", "Gram", "g", 1e-3),
      unit("kg", "Kilogram", "kg", 1),
      unit("t", "Tonne", "t", 1e3),
      unit("oz", "Ounce", "oz", 0.028349523125),
      unit("lb", "Pound", "lb", 0.45359237),
      unit("st", "Stone", "st", 6.35029318),
    ],
  },
  {
    id: "temperature",
    label: "Temperature",
    units: [
      { id: "c", label: "Celsius", symbol: "°C" },
      {
        id: "f",
        label: "Fahrenheit",
        symbol: "°F",
        toBase: (f) => ((f - 32) * 5) / 9,
        fromBase: (c) => (c * 9) / 5 + 32,
      },
      {
        id: "k",
        label: "Kelvin",
        symbol: "K",
        toBase: (k) => k - 273.15,
        fromBase: (c) => c + 273.15,
      },
    ],
  },
  {
    id: "area",
    label: "Area",
    units: [
      unit("mm2", "Square millimetre", "mm²", 1e-6),
      unit("cm2", "Square centimetre", "cm²", 1e-4),
      unit("m2", "Square metre", "m²", 1),
      unit("ha", "Hectare", "ha", 1e4),
      unit("km2", "Square kilometre", "km²", 1e6),
      unit("in2", "Square inch", "in²", 0.00064516),
      unit("ft2", "Square foot", "ft²", 0.09290304),
      unit("yd2", "Square yard", "yd²", 0.83612736),
      unit("ac", "Acre", "ac", 4046.8564224),
      unit("mi2", "Square mile", "mi²", 2589988.110336),
    ],
  },
  {
    id: "volume",
    label: "Volume",
    units: [
      unit("ml", "Millilitre", "ml", 1e-3),
      unit("cl", "Centilitre", "cl", 1e-2),
      unit("dl", "Decilitre", "dl", 0.1),
      unit("l", "Litre", "l", 1),
      unit("m3", "Cubic metre", "m³", 1e3),
      unit("tsp", "Teaspoon (US)", "tsp", 0.00492892159375),
      unit("tbsp", "Tablespoon (US)", "tbsp", 0.01478676478125),
      unit("floz", "Fluid ounce (US)", "fl oz", 0.0295735295625),
      unit("cup", "Cup (US)", "cup", 0.2365882365),
      unit("pt", "Pint (US)", "pt", 0.473176473),
      unit("qt", "Quart (US)", "qt", 0.946352946),
      unit("gal", "Gallon (US)", "gal", 3.785411784),
      unit("galuk", "Gallon (UK)", "gal (UK)", 4.54609),
      unit("in3", "Cubic inch", "in³", 0.016387064),
      unit("ft3", "Cubic foot", "ft³", 28.316846592),
    ],
  },
  {
    id: "speed",
    label: "Speed",
    units: [
      unit("ms", "Metre per second", "m/s", 1),
      unit("kmh", "Kilometre per hour", "km/h", 1 / 3.6),
      unit("mph", "Mile per hour", "mph", 0.44704),
      unit("kn", "Knot", "kn", 1852 / 3600),
      unit("fts", "Foot per second", "ft/s", 0.3048),
    ],
  },
  {
    id: "time",
    label: "Time",
    units: [
      unit("ns", "Nanosecond", "ns", 1e-9),
      unit("us", "Microsecond", "µs", 1e-6),
      unit("ms", "Millisecond", "ms", 1e-3),
      unit("s", "Second", "s", 1),
      unit("min", "Minute", "min", 60),
      unit("h", "Hour", "h", 3600),
      unit("d", "Day", "d", 86400),
      unit("wk", "Week", "wk", 604800),
      unit("mo", "Month (average)", "mo", 2629746),
      unit("yr", "Year (average)", "yr", 31556952),
    ],
  },
  {
    id: "data",
    label: "Data size",
    units: [
      unit("bit", "Bit", "bit", 0.125),
      unit("B", "Byte", "B", 1),
      unit("kB", "Kilobyte", "kB", 1e3),
      unit("MB", "Megabyte", "MB", 1e6),
      unit("GB", "Gigabyte", "GB", 1e9),
      unit("TB", "Terabyte", "TB", 1e12),
      unit("PB", "Petabyte", "PB", 1e15),
      unit("KiB", "Kibibyte", "KiB", 1024),
      unit("MiB", "Mebibyte", "MiB", 1024 ** 2),
      unit("GiB", "Gibibyte", "GiB", 1024 ** 3),
      unit("TiB", "Tebibyte", "TiB", 1024 ** 4),
      unit("PiB", "Pebibyte", "PiB", 1024 ** 5),
      unit("kbit", "Kilobit", "kbit", 125),
      unit("Mbit", "Megabit", "Mbit", 125e3),
      unit("Gbit", "Gigabit", "Gbit", 125e6),
    ],
  },
  {
    id: "pressure",
    label: "Pressure",
    units: [
      unit("pa", "Pascal", "Pa", 1),
      unit("hpa", "Hectopascal", "hPa", 100),
      unit("kpa", "Kilopascal", "kPa", 1e3),
      unit("bar", "Bar", "bar", 1e5),
      unit("psi", "Pound per square inch", "psi", 6894.757293168),
      unit("atm", "Atmosphere", "atm", 101325),
      unit("mmhg", "Millimetre of mercury", "mmHg", 133.322387415),
    ],
  },
  {
    id: "energy",
    label: "Energy",
    units: [
      unit("j", "Joule", "J", 1),
      unit("kj", "Kilojoule", "kJ", 1e3),
      unit("cal", "Calorie", "cal", 4.184),
      unit("kcal", "Kilocalorie", "kcal", 4184),
      unit("wh", "Watt-hour", "Wh", 3600),
      unit("kwh", "Kilowatt-hour", "kWh", 3.6e6),
    ],
  },
];

function toBase(unit: Unit, value: number): number {
  if (unit.toBase) return unit.toBase(value);
  return value * (unit.factor ?? 1);
}

function fromBase(unit: Unit, value: number): number {
  if (unit.fromBase) return unit.fromBase(value);
  return value / (unit.factor ?? 1);
}

export function convert(value: number, from: Unit, to: Unit): number {
  return from === to ? value : fromBase(to, toBase(from, value));
}

export function findUnit(category: UnitCategory, id: string): Unit {
  return category.units.find((u) => u.id === id) ?? category.units[0];
}

// Accepts "1.5", "1,5" (German decimal comma) and "1 500".
export function parseNumber(input: string): number | null {
  let text = input.trim().replace(/[\s_']/g, "");
  if (text.includes(",") && !text.includes(".")) text = text.replace(",", ".");
  else text = text.replace(/,/g, "");
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(text)) return null;
  return Number(text);
}

// Twelve significant digits hide floating point noise (0.1 + 0.2), and very
// large or small values switch to scientific notation.
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";
  const magnitude = Math.abs(value);
  if (magnitude >= 1e15 || magnitude < 1e-6) {
    return value.toExponential(6).replace(/\.?0+e/, "e");
  }
  return new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 12,
    useGrouping: false,
  }).format(value);
}
