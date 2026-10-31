export type HttpStatus = {
  code: number;
  name: string;
  summary: string;
  // When an API should send it, and how it differs from similar codes.
  use?: string;
  // What usually causes it when you see it in logs.
  causes?: string;
  headers?: string[];
  spec: string;
  link?: string;
  unofficial?: boolean;
  deprecated?: boolean;
};

const rfc9110 = (section: string) => ({
  spec: `RFC 9110 §${section}`,
  link: `https://www.rfc-editor.org/rfc/rfc9110#section-${section}`,
});

const rfc = (number: number) => ({
  spec: `RFC ${number}`,
  link: `https://www.rfc-editor.org/rfc/rfc${number}`,
});

export const HTTP_STATUSES: HttpStatus[] = [
  // 1xx informational
  {
    code: 100,
    name: "Continue",
    summary: "The headers are fine; the client may send the request body.",
    causes:
      "Clients that send Expect: 100-continue before a large upload (curl does this above 1 MB).",
    headers: ["Expect"],
    ...rfc9110("15.2.1"),
  },
  {
    code: 101,
    name: "Switching Protocols",
    summary: "The server is switching to the protocol named in Upgrade.",
    causes: "Normal for WebSocket connections.",
    headers: ["Upgrade", "Connection"],
    ...rfc9110("15.2.2"),
  },
  {
    code: 102,
    name: "Processing",
    summary: "WebDAV: still working, no response yet.",
    deprecated: true,
    ...rfc(2518),
  },
  {
    code: 103,
    name: "Early Hints",
    summary: "Preliminary headers so the browser can preload resources.",
    headers: ["Link"],
    ...rfc(8297),
  },

  // 2xx success
  {
    code: 200,
    name: "OK",
    summary: "The request succeeded and the response has a body.",
    ...rfc9110("15.3.1"),
  },
  {
    code: 201,
    name: "Created",
    summary: "A new resource was created.",
    use: "After a POST that creates something. Point to it with Location and usually return it in the body.",
    headers: ["Location"],
    ...rfc9110("15.3.2"),
  },
  {
    code: 202,
    name: "Accepted",
    summary: "Accepted for processing, but not finished yet.",
    use: "Long-running or queued work. Return a URL where the client can poll the status.",
    headers: ["Location", "Retry-After"],
    ...rfc9110("15.3.3"),
  },
  {
    code: 203,
    name: "Non-Authoritative Information",
    summary: "A proxy changed the origin's response.",
    ...rfc9110("15.3.4"),
  },
  {
    code: 204,
    name: "No Content",
    summary: "Success with no response body.",
    use: "DELETE, or a PUT/PATCH when you don't return the updated resource. Never send a body with it.",
    ...rfc9110("15.3.5"),
  },
  {
    code: 205,
    name: "Reset Content",
    summary: "Success; the client should reset the form or view.",
    ...rfc9110("15.3.6"),
  },
  {
    code: 206,
    name: "Partial Content",
    summary: "Only the requested byte range is returned.",
    causes: "Range requests: resumable downloads, video seeking.",
    headers: ["Range", "Content-Range"],
    ...rfc9110("15.3.7"),
  },
  {
    code: 207,
    name: "Multi-Status",
    summary: "WebDAV: several results in one XML body.",
    ...rfc(4918),
  },
  {
    code: 208,
    name: "Already Reported",
    summary: "WebDAV: members already listed earlier in the response.",
    ...rfc(5842),
  },
  {
    code: 226,
    name: "IM Used",
    summary: "Delta encoding: the response is a diff against a cached version.",
    ...rfc(3229),
  },

  // 3xx redirection
  {
    code: 300,
    name: "Multiple Choices",
    summary: "Several representations are available; the client picks one.",
    ...rfc9110("15.4.1"),
  },
  {
    code: 301,
    name: "Moved Permanently",
    summary: "The resource has a new permanent URL.",
    use: "Old URLs and domain moves. Browsers may turn a POST into a GET; use 308 if the method must stay.",
    causes: "HTTP → HTTPS redirects, a missing trailing slash, an old domain.",
    headers: ["Location"],
    ...rfc9110("15.4.2"),
  },
  {
    code: 302,
    name: "Found",
    summary: "Temporarily at another URL.",
    use: "Historically used for everything. Prefer 303 (after a form POST) or 307 (keep the method).",
    causes: "Login redirects, e.g. to Entra ID or another identity provider.",
    headers: ["Location"],
    ...rfc9110("15.4.3"),
  },
  {
    code: 303,
    name: "See Other",
    summary: "Get the result from another URL with GET.",
    use: "After a form POST, so reloading the result page doesn't submit again (Post/Redirect/Get).",
    headers: ["Location"],
    ...rfc9110("15.4.4"),
  },
  {
    code: 304,
    name: "Not Modified",
    summary: "The cached copy is still valid; no body is sent.",
    causes:
      "Conditional requests with If-None-Match (ETag) or If-Modified-Since. Normal and good.",
    headers: ["ETag", "If-None-Match", "Last-Modified", "If-Modified-Since"],
    ...rfc9110("15.4.5"),
  },
  {
    code: 305,
    name: "Use Proxy",
    summary:
      "Access through the given proxy. Ignored by browsers for security reasons.",
    deprecated: true,
    ...rfc9110("15.4.6"),
  },
  {
    code: 307,
    name: "Temporary Redirect",
    summary: "Temporarily at another URL; repeat the same method and body.",
    use: "Temporary redirects where a POST must stay a POST.",
    causes:
      "HSTS: browsers answer http:// links with an internal 307 to https://.",
    headers: ["Location"],
    ...rfc9110("15.4.8"),
  },
  {
    code: 308,
    name: "Permanent Redirect",
    summary: "Permanently at another URL; repeat the same method and body.",
    use: "Like 301, but the method can't change. Vercel uses it for domain redirects.",
    headers: ["Location"],
    ...rfc9110("15.4.9"),
  },

  // 4xx client errors
  {
    code: 400,
    name: "Bad Request",
    summary: "The server can't process the request as sent.",
    use: "Malformed syntax: invalid JSON, wrong types, missing required parameters. For valid JSON that breaks business rules, many APIs use 422.",
    causes:
      "Broken JSON, wrong Content-Type, a header or cookie that's too large (some servers), invalid query parameters.",
    ...rfc9110("15.5.1"),
  },
  {
    code: 401,
    name: "Unauthorized",
    summary:
      "Authentication is missing or invalid. Despite the name, it means “unauthenticated”.",
    use: "No token, an expired token, or a wrong signature. Must include WWW-Authenticate. If the user is known but not allowed, use 403.",
    causes:
      "Expired access token, wrong audience (aud) or issuer, clock skew, a missing Authorization header after a redirect.",
    headers: ["WWW-Authenticate", "Authorization"],
    ...rfc9110("15.5.2"),
  },
  {
    code: 402,
    name: "Payment Required",
    summary:
      "Reserved for future use; some APIs use it for exhausted credit or quotas.",
    ...rfc9110("15.5.3"),
  },
  {
    code: 403,
    name: "Forbidden",
    summary: "The server understood who you are, but refuses.",
    use: "Authenticated but lacking a role or permission. Logging in again won't help. Use 404 instead if the resource's existence itself is secret.",
    causes:
      "Missing role or scope, IP restrictions or a WAF rule, wrong file permissions, Azure Storage firewall or a missing RBAC role.",
    ...rfc9110("15.5.4"),
  },
  {
    code: 404,
    name: "Not Found",
    summary: "Nothing exists at this URL (or the server won't say).",
    use: "Unknown resources, and resources the caller mustn't know about.",
    causes:
      "Typos, wrong base path or API version, a missing route, deleted resources, a SPA route without a server fallback.",
    ...rfc9110("15.5.5"),
  },
  {
    code: 405,
    name: "Method Not Allowed",
    summary: "The URL exists but doesn't support this method.",
    use: "Must include Allow with the supported methods.",
    causes:
      "POST to a GET-only route, or a CORS preflight (OPTIONS) the server doesn't handle.",
    headers: ["Allow"],
    ...rfc9110("15.5.6"),
  },
  {
    code: 406,
    name: "Not Acceptable",
    summary: "No representation matches the Accept headers.",
    headers: ["Accept", "Accept-Language"],
    ...rfc9110("15.5.7"),
  },
  {
    code: 407,
    name: "Proxy Authentication Required",
    summary: "Like 401, but the proxy wants credentials.",
    causes: "Corporate proxies, often in build agents or containers.",
    headers: ["Proxy-Authenticate"],
    ...rfc9110("15.5.8"),
  },
  {
    code: 408,
    name: "Request Timeout",
    summary: "The client took too long to send the request.",
    causes: "Slow uploads, idle keep-alive connections the server closes.",
    ...rfc9110("15.5.9"),
  },
  {
    code: 409,
    name: "Conflict",
    summary: "The request conflicts with the resource's current state.",
    use: "Duplicates (a username already taken) and concurrent edits.",
    causes: "Creating something that already exists, version conflicts.",
    ...rfc9110("15.5.10"),
  },
  {
    code: 410,
    name: "Gone",
    summary: "The resource existed but was removed for good.",
    use: "Deliberately retired endpoints or deleted content, so clients and search engines stop asking.",
    ...rfc9110("15.5.11"),
  },
  {
    code: 411,
    name: "Length Required",
    summary: "The request needs a Content-Length header.",
    headers: ["Content-Length"],
    ...rfc9110("15.5.12"),
  },
  {
    code: 412,
    name: "Precondition Failed",
    summary: "An If-Match or If-Unmodified-Since condition wasn't met.",
    use: "Optimistic concurrency: the client's ETag is out of date, so someone else changed the resource.",
    headers: ["If-Match", "ETag"],
    ...rfc9110("15.5.13"),
  },
  {
    code: 413,
    name: "Content Too Large",
    summary: "The request body is bigger than the server accepts.",
    causes:
      "Upload limits: nginx client_max_body_size (1 MB by default), IIS maxAllowedContentLength (about 28.6 MB), Kestrel (about 28.6 MB), serverless platforms (Vercel functions: 4.5 MB).",
    headers: ["Retry-After"],
    ...rfc9110("15.5.14"),
  },
  {
    code: 414,
    name: "URI Too Long",
    summary: "The URL is longer than the server handles.",
    causes:
      "Huge query strings, often filters or tokens that belong in a POST body.",
    ...rfc9110("15.5.15"),
  },
  {
    code: 415,
    name: "Unsupported Media Type",
    summary: "The server doesn't accept the request body's format.",
    causes:
      "Missing or wrong Content-Type, e.g. sending JSON without Content-Type: application/json.",
    headers: ["Content-Type", "Accept-Post"],
    ...rfc9110("15.5.16"),
  },
  {
    code: 416,
    name: "Range Not Satisfiable",
    summary: "The requested byte range lies outside the file.",
    headers: ["Range", "Content-Range"],
    ...rfc9110("15.5.17"),
  },
  {
    code: 417,
    name: "Expectation Failed",
    summary: "The server can't meet the Expect header.",
    headers: ["Expect"],
    ...rfc9110("15.5.18"),
  },
  {
    code: 418,
    name: "I'm a teapot",
    summary:
      "An April Fools' joke from 1998, reserved so nobody uses it for real.",
    spec: "RFC 2324, RFC 9110 §15.5.19",
    link: "https://www.rfc-editor.org/rfc/rfc9110#section-15.5.19",
  },
  {
    code: 421,
    name: "Misdirected Request",
    summary: "This server can't answer for the requested host.",
    causes:
      "HTTP/2 connection reuse across domains with a shared TLS certificate.",
    ...rfc9110("15.5.20"),
  },
  {
    code: 422,
    name: "Unprocessable Content",
    summary: "The syntax is fine, but the content is invalid.",
    use: "Validation errors on well-formed requests: an end date before the start date, an invalid email. Many APIs return field errors here.",
    ...rfc9110("15.5.21"),
  },
  {
    code: 423,
    name: "Locked",
    summary: "WebDAV: the resource is locked.",
    causes: "SharePoint and OneDrive files open for editing by someone else.",
    ...rfc(4918),
  },
  {
    code: 424,
    name: "Failed Dependency",
    summary: "WebDAV: failed because an earlier action failed.",
    ...rfc(4918),
  },
  {
    code: 425,
    name: "Too Early",
    summary:
      "The server won't risk processing a TLS 1.3 early-data (0-RTT) request that might be replayed.",
    ...rfc(8470),
  },
  {
    code: 426,
    name: "Upgrade Required",
    summary: "Repeat the request with a different protocol.",
    headers: ["Upgrade"],
    ...rfc9110("15.5.22"),
  },
  {
    code: 428,
    name: "Precondition Required",
    summary: "The server requires a conditional request (If-Match).",
    use: "Force clients to send an ETag so they can't overwrite each other's changes.",
    headers: ["If-Match"],
    ...rfc(6585),
  },
  {
    code: 429,
    name: "Too Many Requests",
    summary: "Rate limit exceeded.",
    use: "Throttling. Tell the client when to retry with Retry-After.",
    causes:
      "Client retry loops without backoff, Azure Resource Manager and Microsoft Graph throttling, API gateway quotas.",
    headers: ["Retry-After", "RateLimit", "RateLimit-Policy"],
    ...rfc(6585),
  },
  {
    code: 431,
    name: "Request Header Fields Too Large",
    summary: "One header, or all headers together, are too large.",
    causes:
      "Huge cookies (often many auth cookies on localhost), large tokens in headers.",
    ...rfc(6585),
  },
  {
    code: 451,
    name: "Unavailable For Legal Reasons",
    summary: "Blocked for legal reasons, e.g. a court order or sanctions.",
    ...rfc(7725),
  },

  // 5xx server errors
  {
    code: 500,
    name: "Internal Server Error",
    summary: "Something failed on the server, with no more specific code.",
    use: "Unhandled exceptions. Don't put stack traces in the response; log them.",
    causes:
      "Bugs, missing configuration or secrets, a failed dependency without proper handling.",
    ...rfc9110("15.6.1"),
  },
  {
    code: 501,
    name: "Not Implemented",
    summary: "The server doesn't support this functionality at all.",
    ...rfc9110("15.6.2"),
  },
  {
    code: 502,
    name: "Bad Gateway",
    summary: "A proxy got an invalid response from the server behind it.",
    causes:
      "The app crashed or isn't listening on the expected port, a container restarting, TLS problems between proxy and origin, Azure App Service or Front Door unable to reach the backend.",
    ...rfc9110("15.6.3"),
  },
  {
    code: 503,
    name: "Service Unavailable",
    summary: "Temporarily overloaded or down for maintenance.",
    use: "Planned maintenance or load shedding. Add Retry-After.",
    causes:
      "No healthy instances behind the load balancer, an app pool that stopped, a scale-out still starting.",
    headers: ["Retry-After"],
    ...rfc9110("15.6.4"),
  },
  {
    code: 504,
    name: "Gateway Timeout",
    summary: "A proxy gave up waiting for the server behind it.",
    causes:
      "Slow queries or downstream calls exceeding the proxy's timeout, e.g. Azure App Service's 230 s, the Front Door origin response timeout, or nginx's proxy_read_timeout (60 s by default).",
    ...rfc9110("15.6.5"),
  },
  {
    code: 505,
    name: "HTTP Version Not Supported",
    summary: "The server doesn't support the request's HTTP version.",
    ...rfc9110("15.6.6"),
  },
  {
    code: 506,
    name: "Variant Also Negotiates",
    summary: "A content negotiation configuration error on the server.",
    ...rfc(2295),
  },
  {
    code: 507,
    name: "Insufficient Storage",
    summary: "WebDAV: the server can't store what's needed.",
    ...rfc(4918),
  },
  {
    code: 508,
    name: "Loop Detected",
    summary: "WebDAV: an infinite loop while processing the request.",
    ...rfc(5842),
  },
  {
    code: 510,
    name: "Not Extended",
    summary: "Further extensions to the request are required.",
    deprecated: true,
    ...rfc(2774),
  },
  {
    code: 511,
    name: "Network Authentication Required",
    summary: "Log in to the network first.",
    causes: "Captive portals in hotels, trains and guest Wi-Fi.",
    ...rfc(6585),
  },

  // Unofficial codes seen in the wild
  {
    code: 444,
    name: "No Response",
    summary: "nginx closed the connection without sending anything.",
    causes: "nginx rules that drop unwanted requests (return 444).",
    spec: "nginx",
    unofficial: true,
  },
  {
    code: 499,
    name: "Client Closed Request",
    summary: "nginx: the client hung up before the response was ready.",
    causes:
      "Users navigating away, client timeouts shorter than the server's processing time.",
    spec: "nginx",
    unofficial: true,
  },
  {
    code: 520,
    name: "Web Server Returned an Unknown Error",
    summary: "Cloudflare: the origin returned something empty or invalid.",
    spec: "Cloudflare",
    unofficial: true,
  },
  {
    code: 521,
    name: "Web Server Is Down",
    summary: "Cloudflare: the origin refused the connection.",
    causes:
      "The origin is down, or its firewall blocks Cloudflare's IP ranges.",
    spec: "Cloudflare",
    unofficial: true,
  },
  {
    code: 522,
    name: "Connection Timed Out",
    summary: "Cloudflare: couldn't connect to the origin in time.",
    spec: "Cloudflare",
    unofficial: true,
  },
  {
    code: 523,
    name: "Origin Is Unreachable",
    summary: "Cloudflare: no route to the origin, often a wrong DNS record.",
    spec: "Cloudflare",
    unofficial: true,
  },
  {
    code: 524,
    name: "A Timeout Occurred",
    summary:
      "Cloudflare: connected, but the origin took more than 100 seconds to answer.",
    spec: "Cloudflare",
    unofficial: true,
  },
  {
    code: 525,
    name: "SSL Handshake Failed",
    summary: "Cloudflare: the TLS handshake with the origin failed.",
    spec: "Cloudflare",
    unofficial: true,
  },
  {
    code: 526,
    name: "Invalid SSL Certificate",
    summary:
      "Cloudflare: the origin's certificate isn't valid (in Full (strict) mode).",
    spec: "Cloudflare",
    unofficial: true,
  },
];

export const STATUS_CLASSES = [
  { prefix: 1, label: "1xx Informational" },
  { prefix: 2, label: "2xx Success" },
  { prefix: 3, label: "3xx Redirection" },
  { prefix: 4, label: "4xx Client error" },
  { prefix: 5, label: "5xx Server error" },
] as const;

// "404", "4xx", "4" and words like "rate limit" all work.
export function searchStatuses(query: string): HttpStatus[] {
  const q = query.trim().toLowerCase();
  const sorted = [...HTTP_STATUSES].sort((a, b) => a.code - b.code);
  if (!q) return sorted;
  const classMatch = /^([1-5])(xx)?$/.exec(q);
  if (classMatch && !/^\d{3}$/.test(q)) {
    return sorted.filter((s) => String(s.code)[0] === classMatch[1]);
  }
  if (/^\d{1,3}$/.test(q))
    return sorted.filter((s) => String(s.code).startsWith(q));
  const terms = q.split(/\s+/);
  return sorted.filter((s) => {
    const text = [
      s.name,
      s.summary,
      s.use,
      s.causes,
      ...(s.headers ?? []),
      s.spec,
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((term) => text.includes(term));
  });
}
