// Format and check-digit validators. None of them can tell whether a bank,
// company or product actually exists.

export type ValidationResult = {
  valid: boolean;
  normalized: string;
  errors: string[];
  details: [string, string][];
};

const regionNames = new Intl.DisplayNames(["en"], {
  type: "region",
  fallback: "none",
});

export function countryName(code: string): string | undefined {
  try {
    return regionNames.of(code);
  } catch {
    return undefined;
  }
}

// BIC / SWIFT ------------------------------------------------------------------

// AAAA BB CC (DDD): bank, ISO country, location, optional branch.
export function checkBic(input: string): ValidationResult {
  const bic = input.replace(/\s+/g, "").toUpperCase();
  const result: ValidationResult = {
    valid: false,
    normalized: bic,
    errors: [],
    details: [],
  };

  if (bic.length !== 8 && bic.length !== 11) {
    result.errors.push(
      `A BIC has 8 or 11 characters, this one has ${bic.length}.`,
    );
    return result;
  }
  if (!/^[A-Z]{4}/.test(bic))
    result.errors.push("The first 4 characters (bank code) must be letters.");
  const country = bic.slice(4, 6);
  const name = /^[A-Z]{2}$/.test(country) ? countryName(country) : undefined;
  if (!name) result.errors.push(`“${country}” isn't a valid country code.`);
  if (!/^[A-Z0-9]{2}$/.test(bic.slice(6, 8)))
    result.errors.push("The location code must be letters or digits.");
  if (bic.length === 11 && !/^[A-Z0-9]{3}$/.test(bic.slice(8))) {
    result.errors.push("The branch code must be letters or digits.");
  }

  result.details.push(["Bank code", bic.slice(0, 4)]);
  result.details.push(["Country", name ? `${name} (${country})` : country]);
  result.details.push(["Location", bic.slice(6, 8)]);
  const branch = bic.length === 11 ? bic.slice(8) : "XXX";
  result.details.push([
    "Branch",
    branch === "XXX" ? "XXX (head office)" : branch,
  ]);
  if (bic[7] === "0")
    result.details.push(["Note", "A 0 in position 8 marks a test BIC."]);

  result.valid = result.errors.length === 0;
  return result;
}

// VAT IDs ----------------------------------------------------------------------

// Formats after the country prefix, as used by the EU's VIES service.
// "EL" is Greece's VAT prefix; Northern Ireland uses "XI".
const VAT_FORMATS: Record<string, RegExp> = {
  AT: /^U\d{8}$/,
  BE: /^[01]\d{9}$/,
  BG: /^\d{9,10}$/,
  CY: /^\d{8}[A-Z]$/,
  CZ: /^\d{8,10}$/,
  DE: /^\d{9}$/,
  DK: /^\d{8}$/,
  EE: /^\d{9}$/,
  EL: /^\d{9}$/,
  ES: /^[A-Z0-9]\d{7}[A-Z0-9]$/,
  FI: /^\d{8}$/,
  FR: /^[A-HJ-NP-Z0-9]{2}\d{9}$/,
  HR: /^\d{11}$/,
  HU: /^\d{8}$/,
  IE: /^\d[0-9A-Z+*]\d{5}[A-W][A-I]?$/,
  IT: /^\d{11}$/,
  LT: /^(\d{9}|\d{12})$/,
  LU: /^\d{8}$/,
  LV: /^\d{11}$/,
  MT: /^\d{8}$/,
  NL: /^\d{9}B\d{2}$/,
  PL: /^\d{10}$/,
  PT: /^\d{9}$/,
  RO: /^\d{2,10}$/,
  SE: /^\d{12}$/,
  SI: /^\d{8}$/,
  SK: /^\d{10}$/,
  XI: /^(\d{9}|\d{12}|GD\d{3}|HA\d{3})$/,
};

const VAT_COUNTRY_NAMES: Record<string, string> = {
  EL: "Greece",
  XI: "Northern Ireland",
};

// German USt-IdNr.: ISO 7064 MOD 11,10 over the first eight digits.
export function germanVatCheckDigit(digits: string): number {
  let product = 10;
  for (const digit of digits.slice(0, 8)) {
    let sum = (Number(digit) + product) % 10;
    if (sum === 0) sum = 10;
    product = (2 * sum) % 11;
  }
  const check = 11 - product;
  return check === 10 ? 0 : check;
}

export function checkVatId(input: string): ValidationResult {
  const vat = input.replace(/[\s.-]/g, "").toUpperCase();
  const result: ValidationResult = {
    valid: false,
    normalized: vat,
    errors: [],
    details: [],
  };
  const country = vat.slice(0, 2);
  const number = vat.slice(2);
  const format = VAT_FORMATS[country];

  if (!format) {
    result.errors.push(
      country === "GR"
        ? "Greek VAT IDs start with EL, not GR."
        : `“${country}” isn't an EU VAT prefix (e.g. DE, AT, FR).`,
    );
    return result;
  }
  result.details.push([
    "Country",
    VAT_COUNTRY_NAMES[country] ?? countryName(country) ?? country,
  ]);
  result.details.push(["Number", number]);

  if (!format.test(number)) {
    result.errors.push(`This doesn't match the format of ${country} VAT IDs.`);
  } else if (country === "DE") {
    if (number[0] === "0") {
      result.errors.push("German VAT IDs don't start with 0.");
    } else if (germanVatCheckDigit(number) !== Number(number[8])) {
      result.errors.push(
        "The check digit doesn't match. There's probably a typo.",
      );
    } else {
      result.details.push(["Check digit", `${number[8]} (correct)`]);
    }
  }
  if (country !== "DE") {
    result.details.push([
      "Check digit",
      "Only the format is checked for this country",
    ]);
  }

  result.valid = result.errors.length === 0;
  return result;
}

// EAN / GTIN -------------------------------------------------------------------

export const GTIN_LENGTHS = [8, 12, 13, 14];

// GS1 check digit: weights 3 and 1 alternating from the right.
export function gtinCheckDigit(body: string): number {
  let sum = 0;
  [...body].reverse().forEach((digit, i) => {
    sum += Number(digit) * (i % 2 === 0 ? 3 : 1);
  });
  return (10 - (sum % 10)) % 10;
}

// GS1 prefixes say which national GS1 office issued the number, not where
// the product was made.
// prettier-ignore
const GS1_PREFIXES: [number, number, string][] = [
  [0, 19, "USA / Canada (UPC)"], [20, 29, "In-store use"], [30, 39, "USA (drugs)"],
  [40, 49, "In-store use"], [50, 59, "Coupons"], [60, 139, "USA / Canada"],
  [200, 299, "In-store use"], [300, 379, "France / Monaco"], [380, 380, "Bulgaria"],
  [383, 383, "Slovenia"], [385, 385, "Croatia"], [387, 387, "Bosnia and Herzegovina"],
  [389, 389, "Montenegro"], [400, 440, "Germany"], [450, 459, "Japan"],
  [460, 469, "Russia"], [471, 471, "Taiwan"], [474, 474, "Estonia"], [475, 475, "Latvia"],
  [477, 477, "Lithuania"], [480, 480, "Philippines"], [481, 481, "Belarus"],
  [482, 482, "Ukraine"], [484, 484, "Moldova"], [489, 489, "Hong Kong"],
  [490, 499, "Japan"], [500, 509, "United Kingdom"], [520, 521, "Greece"],
  [528, 528, "Lebanon"], [529, 529, "Cyprus"], [530, 530, "Albania"],
  [531, 531, "North Macedonia"], [535, 535, "Malta"], [539, 539, "Ireland"],
  [540, 549, "Belgium / Luxembourg"], [560, 560, "Portugal"], [569, 569, "Iceland"],
  [570, 579, "Denmark"], [590, 590, "Poland"], [594, 594, "Romania"],
  [599, 599, "Hungary"], [600, 601, "South Africa"], [640, 649, "Finland"],
  [690, 699, "China"], [700, 709, "Norway"], [729, 729, "Israel"],
  [730, 739, "Sweden"], [760, 769, "Switzerland / Liechtenstein"],
  [800, 839, "Italy"], [840, 849, "Spain / Andorra"], [858, 858, "Slovakia"],
  [859, 859, "Czechia"], [860, 860, "Serbia"], [868, 869, "Turkey"],
  [870, 879, "Netherlands"], [880, 880, "South Korea"], [885, 885, "Thailand"],
  [888, 888, "Singapore"], [890, 890, "India"], [893, 893, "Vietnam"],
  [899, 899, "Indonesia"], [900, 919, "Austria"], [930, 939, "Australia"],
  [940, 949, "New Zealand"], [955, 955, "Malaysia"], [977, 977, "Periodicals (ISSN)"],
  [978, 979, "Books (ISBN)"], [980, 980, "Refund receipts"], [981, 984, "Coupons"],
  [990, 999, "Coupons"],
];

export function gs1Prefix(gtin13: string): string | undefined {
  const prefix = Number(gtin13.slice(0, 3));
  return GS1_PREFIXES.find(([from, to]) => prefix >= from && prefix <= to)?.[2];
}

const GTIN_NAMES: Record<number, string> = {
  8: "EAN-8",
  12: "UPC-A (GTIN-12)",
  13: "EAN-13 (GTIN-13)",
  14: "GTIN-14 (cartons)",
};

export function checkGtin(
  input: string,
): ValidationResult & { suggestedCheckDigit?: number } {
  const code = input.replace(/[\s-]/g, "");
  const result: ValidationResult & { suggestedCheckDigit?: number } = {
    valid: false,
    normalized: code,
    errors: [],
    details: [],
  };
  if (!/^\d+$/.test(code)) {
    result.errors.push("Only digits are allowed.");
    return result;
  }
  // One digit short of a valid length: offer the check digit.
  if (GTIN_LENGTHS.includes(code.length + 1)) {
    result.suggestedCheckDigit = gtinCheckDigit(code);
  }
  if (!GTIN_LENGTHS.includes(code.length)) {
    result.errors.push("EAN/GTIN codes have 8, 12, 13 or 14 digits.");
    return result;
  }

  const expected = gtinCheckDigit(code.slice(0, -1));
  result.details.push(["Type", GTIN_NAMES[code.length]]);
  if (expected !== Number(code.at(-1))) {
    result.errors.push(
      `The check digit should be ${expected}, not ${code.at(-1)}.`,
    );
  } else {
    result.details.push(["Check digit", `${expected} (correct)`]);
  }
  if (code.length >= 12) {
    // Compare as GTIN-13 so UPC-A and GTIN-14 codes map to the same prefixes.
    const gtin13 = code.length === 14 ? code.slice(1) : code.padStart(13, "0");
    const prefix = gs1Prefix(gtin13);
    if (prefix)
      result.details.push(["GS1 prefix", `${gtin13.slice(0, 3)}: ${prefix}`]);
  }

  result.valid = result.errors.length === 0;
  return result;
}
