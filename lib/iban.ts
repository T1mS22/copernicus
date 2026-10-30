// IBAN lengths per country from the SWIFT IBAN registry.
// prettier-ignore
const IBAN_LENGTHS: Record<string, number> = {
  AD: 24, AE: 23, AL: 28, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22,
  BI: 27, BR: 29, BY: 28, CH: 21, CR: 22, CY: 28, CZ: 24, DE: 22, DJ: 27,
  DK: 18, DO: 28, EE: 20, EG: 29, ES: 24, FI: 18, FK: 18, FO: 18, FR: 27,
  GB: 22, GE: 22, GI: 23, GL: 18, GR: 27, GT: 28, HN: 28, HR: 21, HU: 28,
  IE: 22, IL: 23, IQ: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28,
  LC: 32, LI: 21, LT: 20, LU: 20, LV: 21, LY: 25, MC: 27, MD: 24, ME: 22,
  MK: 19, MN: 20, MR: 27, MT: 31, MU: 30, NI: 28, NL: 18, NO: 15, OM: 23,
  PK: 24, PL: 28, PS: 29, PT: 25, QA: 29, RO: 24, RS: 22, RU: 33, SA: 24,
  SC: 31, SD: 18, SE: 24, SI: 19, SK: 24, SM: 27, SO: 23, ST: 25, SV: 28,
  TL: 23, TN: 24, TR: 26, UA: 29, VA: 22, VG: 24, XK: 20, YE: 30,
};

// Where the bank code and account number sit inside the BBAN, for the
// countries that come up most (DACH, NL, GB).
const BBAN_LAYOUTS: Record<string, [string, number, number][]> = {
  DE: [
    ["Bank code (BLZ)", 0, 8],
    ["Account number", 8, 18],
  ],
  AT: [
    ["Bank code (BLZ)", 0, 5],
    ["Account number", 5, 16],
  ],
  CH: [
    ["Bank clearing number", 0, 5],
    ["Account number", 5, 17],
  ],
  LI: [
    ["Bank clearing number", 0, 5],
    ["Account number", 5, 17],
  ],
  NL: [
    ["Bank code", 0, 4],
    ["Account number", 4, 14],
  ],
  GB: [
    ["Bank code", 0, 4],
    ["Sort code", 4, 10],
    ["Account number", 10, 18],
  ],
};

export type IbanCheck = {
  valid: boolean;
  normalized: string;
  formatted: string;
  country?: string;
  expectedLength?: number;
  errors: string[];
  details: [string, string][];
};

export function normalizeIban(input: string): string {
  return input
    .replace(/^IBAN[:\s]*/i, "")
    .replace(/[\s-]/g, "")
    .toUpperCase();
}

export function formatIban(iban: string): string {
  return iban.replace(/(.{4})/g, "$1 ").trim();
}

// ISO 7064 mod 97-10: move the first four characters to the end, turn
// letters into numbers (A=10 … Z=35) and the remainder must be 1. Processed
// digit by digit so no big integers are needed.
export function ibanChecksum(iban: string): number {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const char of rearranged) {
    const value = parseInt(char, 36);
    remainder =
      value < 10
        ? (remainder * 10 + value) % 97
        : (remainder * 100 + value) % 97;
  }
  return remainder;
}

export function checkIban(input: string): IbanCheck {
  const iban = normalizeIban(input);
  const result: IbanCheck = {
    valid: false,
    normalized: iban,
    formatted: formatIban(iban),
    errors: [],
    details: [],
  };

  if (!/^[A-Z0-9]+$/.test(iban)) {
    result.errors.push("Only letters and digits are allowed.");
    return result;
  }
  if (!/^[A-Z]{2}\d{2}/.test(iban)) {
    result.errors.push(
      "An IBAN starts with a two-letter country code and two check digits.",
    );
    return result;
  }

  const country = iban.slice(0, 2);
  result.country = country;
  const expectedLength = IBAN_LENGTHS[country];
  if (!expectedLength) {
    result.errors.push(`${country} isn't a country that uses IBANs.`);
    return result;
  }
  result.expectedLength = expectedLength;
  if (iban.length !== expectedLength) {
    result.errors.push(
      `IBANs from ${country} have ${expectedLength} characters, this one has ${iban.length}.`,
    );
  }

  const checkDigits = Number(iban.slice(2, 4));
  if (checkDigits < 2 || checkDigits > 98 || ibanChecksum(iban) !== 1) {
    result.errors.push(
      "The check digits don't match. There's probably a typo or swapped digits.",
    );
  }

  const bban = iban.slice(4);
  for (const [label, start, end] of BBAN_LAYOUTS[country] ?? []) {
    if (bban.length >= end)
      result.details.push([label, bban.slice(start, end)]);
  }
  result.details.push(["Check digits", iban.slice(2, 4)]);
  result.details.push(["BBAN", bban]);

  result.valid = result.errors.length === 0;
  return result;
}
