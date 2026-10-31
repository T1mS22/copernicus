import { encode } from "uqr";

export type Ecc = "L" | "M" | "Q" | "H";

export type WifiNetwork = {
  ssid: string;
  password: string;
  security: "WPA" | "WEP" | "nopass";
  hidden: boolean;
};

// Special characters in Wi-Fi QR fields must be backslash-escaped.
const escapeWifi = (value: string) => value.replace(/([\\;,:"])/g, "\\$1");

// The format phones understand for joining a network by scanning.
export function wifiPayload(network: WifiNetwork): string {
  const password =
    network.security === "nopass" ? "" : `P:${escapeWifi(network.password)};`;
  return `WIFI:T:${network.security};S:${escapeWifi(network.ssid)};${password}${network.hidden ? "H:true;" : ""};`;
}

// Module matrix including a four-module quiet zone, as scanners expect.
export function qrMatrix(text: string, ecc: Ecc): boolean[][] {
  return encode(text, { ecc, boostEcc: false, border: 4 }).data;
}

// One path of 1×1 squares for the dark modules; renders crisply at any size.
export function qrPath(matrix: boolean[][]): string {
  let path = "";
  matrix.forEach((row, y) =>
    row.forEach((dark, x) => {
      if (dark) path += `M${x} ${y}h1v1h-1z`;
    }),
  );
  return path;
}

export function qrSvg(matrix: boolean[][]): string {
  const size = matrix.length;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/><path d="${qrPath(matrix)}" fill="#000"/></svg>`;
}
