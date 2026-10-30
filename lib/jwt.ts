import { base64ToBytes, bytesToText } from "./base64.ts";

export type JwtClaims = { exp?: Date; nbf?: Date; iat?: Date };

export type DecodedJwt = {
  header: Record<string, unknown>;
  payload: unknown;
  signature: string;
  claims: JwtClaims;
};

export type TokenStatus = "valid" | "expired" | "not-yet-valid" | "no-expiry";

function decodePart(part: string, name: string): unknown {
  try {
    return JSON.parse(bytesToText(base64ToBytes(part)));
  } catch {
    throw new Error(`The ${name} isn't valid Base64url-encoded JSON.`);
  }
}

function secondsToDate(value: unknown): Date | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? new Date(value * 1000)
    : undefined;
}

// Decodes without verifying the signature: that needs the issuer's key and
// is the receiving server's job.
export function decodeJwt(input: string): DecodedJwt {
  const token = input.trim().replace(/^Bearer\s+/i, "");
  const parts = token.split(".");
  if (parts.length === 5) {
    throw new Error(
      "This is an encrypted token (JWE). Its contents can't be read without the key.",
    );
  }
  if (parts.length !== 3) {
    throw new Error(
      "A JWT has three parts separated by dots: header.payload.signature.",
    );
  }

  const header = decodePart(parts[0], "header");
  if (typeof header !== "object" || header === null || Array.isArray(header)) {
    throw new Error("The header must be a JSON object.");
  }
  const payload = decodePart(parts[1], "payload");
  const record =
    typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>)
      : {};

  return {
    header: header as Record<string, unknown>,
    payload,
    signature: parts[2],
    claims: {
      exp: secondsToDate(record.exp),
      nbf: secondsToDate(record.nbf),
      iat: secondsToDate(record.iat),
    },
  };
}

export function tokenStatus(claims: JwtClaims, now = Date.now()): TokenStatus {
  if (claims.nbf && claims.nbf.getTime() > now) return "not-yet-valid";
  if (!claims.exp) return "no-expiry";
  return claims.exp.getTime() <= now ? "expired" : "valid";
}
