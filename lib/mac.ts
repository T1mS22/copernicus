// 48-bit MAC addresses (EUI-48) as 12 lowercase hex digits.

export function parseMac(text: string): string | null {
  const hex = text
    .trim()
    .replace(/[\s:.-]/g, "")
    .toLowerCase();
  return /^[0-9a-f]{12}$/.test(hex) ? hex : null;
}

const pairs = (hex: string) => hex.match(/../g)!;

export type MacFormat = { label: string; value: string };

export function macFormats(hex: string): MacFormat[] {
  return [
    { label: "Colon (Linux, macOS)", value: pairs(hex).join(":") },
    { label: "Colon, uppercase", value: pairs(hex).join(":").toUpperCase() },
    { label: "Hyphen (Windows)", value: pairs(hex).join("-").toUpperCase() },
    { label: "Dotted (Cisco)", value: hex.match(/..../g)!.join(".") },
    { label: "Plain", value: hex },
  ];
}

export function macFlags(hex: string) {
  const first = parseInt(hex.slice(0, 2), 16);
  return {
    broadcast: hex === "ffffffffffff",
    multicast: (first & 1) === 1,
    // Set on randomized ("private") addresses that phones and laptops use
    // per Wi-Fi network, and on most virtual machine NICs.
    locallyAdministered: (first & 2) === 2,
    oui: pairs(hex).slice(0, 3).join(":").toUpperCase(),
  };
}

// Modified EUI-64 interface ID as used by IPv6 SLAAC: ff:fe in the middle and
// the universal/local bit flipped.
export function eui64InterfaceId(hex: string): string {
  const first = (parseInt(hex.slice(0, 2), 16) ^ 2)
    .toString(16)
    .padStart(2, "0");
  const eui = first + hex.slice(2, 6) + "fffe" + hex.slice(6);
  return eui
    .match(/..../g)!
    .map((group) => group.replace(/^0+(?=.)/, ""))
    .join(":");
}

// A random locally administered unicast address, safe for VMs and tests.
export function randomMac(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  bytes[0] = (bytes[0] & 0xfc) | 0x02;
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}
