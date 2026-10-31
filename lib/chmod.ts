export type Triplet = { read: boolean; write: boolean; execute: boolean };
export type Permissions = {
  owner: Triplet;
  group: Triplet;
  others: Triplet;
  setuid: boolean;
  setgid: boolean;
  sticky: boolean;
};

const tripletValue = (t: Triplet) =>
  (t.read ? 4 : 0) + (t.write ? 2 : 0) + (t.execute ? 1 : 0);

const tripletFrom = (digit: number): Triplet => ({
  read: (digit & 4) !== 0,
  write: (digit & 2) !== 0,
  execute: (digit & 1) !== 0,
});

export function toOctal(p: Permissions): string {
  const special = (p.setuid ? 4 : 0) + (p.setgid ? 2 : 0) + (p.sticky ? 1 : 0);
  const base = `${tripletValue(p.owner)}${tripletValue(p.group)}${tripletValue(p.others)}`;
  return special ? `${special}${base}` : base;
}

// ls -l style. Special bits replace the x: s/S for setuid/setgid, t/T for
// sticky (capital when the execute bit underneath is off).
export function toSymbolic(p: Permissions): string {
  const part = (t: Triplet, special: boolean, letter: string) =>
    (t.read ? "r" : "-") +
    (t.write ? "w" : "-") +
    (special
      ? t.execute
        ? letter
        : letter.toUpperCase()
      : t.execute
        ? "x"
        : "-");
  return (
    part(p.owner, p.setuid, "s") +
    part(p.group, p.setgid, "s") +
    part(p.others, p.sticky, "t")
  );
}

export function parseOctal(text: string): Permissions | null {
  const value = text.trim();
  if (!/^[0-7]{3,4}$/.test(value)) return null;
  const digits = value.padStart(4, "0").split("").map(Number);
  return {
    setuid: (digits[0] & 4) !== 0,
    setgid: (digits[0] & 2) !== 0,
    sticky: (digits[0] & 1) !== 0,
    owner: tripletFrom(digits[1]),
    group: tripletFrom(digits[2]),
    others: tripletFrom(digits[3]),
  };
}

export function parseSymbolic(text: string): Permissions | null {
  // Allows the file type character from ls -l output (e.g. "drwxr-xr-x").
  const value = text.trim().replace(/^[-dlcbps](?=.{9}$)/, "");
  if (!/^[r-][w-][xsS-][r-][w-][xsS-][r-][w-][xtT-]$/.test(value)) return null;
  const triplet = (i: number): Triplet => ({
    read: value[i] === "r",
    write: value[i + 1] === "w",
    execute: /[xst]/.test(value[i + 2]),
  });
  return {
    owner: triplet(0),
    group: triplet(3),
    others: triplet(6),
    setuid: /[sS]/.test(value[2]),
    setgid: /[sS]/.test(value[5]),
    sticky: /[tT]/.test(value[8]),
  };
}
