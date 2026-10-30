export type UrlEncodeMode = "component" | "full";

// "component" encodes everything that isn't safe inside a query value or
// path segment; "full" keeps the characters that structure a URL (: / ? & #).
export function encodeUrl(text: string, mode: UrlEncodeMode): string {
  return mode === "component" ? encodeURIComponent(text) : encodeURI(text);
}

export function decodeUrl(text: string, plusAsSpace = false): string {
  try {
    return decodeURIComponent(plusAsSpace ? text.replace(/\+/g, " ") : text);
  } catch {
    throw new Error(
      "Contains a malformed escape sequence, such as a % not followed by two hex digits.",
    );
  }
}

export type UrlParts = {
  protocol: string;
  username: string;
  password: string;
  hostname: string;
  port: string;
  pathname: string;
  hash: string;
  params: [string, string][];
};

export function parseUrl(text: string): UrlParts | null {
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(text.trim())) return null;
  try {
    const url = new URL(text.trim());
    return {
      protocol: url.protocol.replace(/:$/, ""),
      username: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      hostname: url.hostname,
      port: url.port,
      pathname: decodeURIComponent(url.pathname),
      hash: url.hash.replace(/^#/, ""),
      params: [...url.searchParams.entries()],
    };
  } catch {
    return null;
  }
}
