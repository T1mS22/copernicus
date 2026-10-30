// Cryptographically secure randomness for the generators. Everything goes
// through crypto.getRandomValues, never Math.random.

const RANGE = 2 ** 32;

// Uniform integer in [0, max). Rejection sampling avoids modulo bias, so no
// value is more likely than another.
export function randomInt(max: number): number {
  if (!Number.isInteger(max) || max <= 0 || max > RANGE) {
    throw new RangeError(`max must be an integer between 1 and 2^32`);
  }
  const limit = RANGE - (RANGE % max);
  const buffer = new Uint32Array(1);
  for (;;) {
    crypto.getRandomValues(buffer);
    if (buffer[0] < limit) return buffer[0] % max;
  }
}

export function pick<T>(items: ArrayLike<T>): T {
  return items[randomInt(items.length)];
}

// Fisher-Yates shuffle into a new array.
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
