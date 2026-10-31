export type ConnectionPart = { key: string; value: string; secret: boolean };

export type ConnectionInfo = {
  kind: string;
  parts: ConnectionPart[];
  summary: [string, string][];
  warnings: string[];
  masked: string;
};

const SECRET_KEY =
  /^(password|pwd|accountkey|sharedaccesskey|accesskey|secret|sharedaccesssignature|sig|token|key|clientsecret|client secret)$/i;

// key=value pairs separated by ";". Values may be quoted with " or ' (a
// doubled quote inside is a literal quote), as ADO.NET allows.
export function parseKeyValue(text: string, separator = ";"): ConnectionPart[] {
  const parts: ConnectionPart[] = [];
  let i = 0;
  while (i < text.length) {
    const eq = text.indexOf("=", i);
    if (eq === -1) break;
    const key = text.slice(i, eq).trim();
    let j = eq + 1;
    while (text[j] === " ") j++;
    let value = "";
    const quote = text[j];
    if (quote === '"' || quote === "'") {
      j++;
      while (j < text.length) {
        if (text[j] === quote && text[j + 1] === quote) {
          value += quote;
          j += 2;
        } else if (text[j] === quote) {
          j++;
          break;
        } else {
          value += text[j++];
        }
      }
      const next = text.indexOf(separator, j);
      i = next === -1 ? text.length : next + 1;
    } else {
      const next = text.indexOf(separator, j);
      value = text.slice(j, next === -1 ? text.length : next).trim();
      i = next === -1 ? text.length : next + 1;
    }
    if (key)
      parts.push({
        key,
        value,
        secret: SECRET_KEY.test(key.replace(/\s+/g, "")),
      });
  }
  return parts;
}

function get(parts: ConnectionPart[], ...keys: string[]): string | undefined {
  const wanted = keys.map((key) => key.toLowerCase().replace(/\s+/g, ""));
  return parts.find((part) =>
    wanted.includes(part.key.toLowerCase().replace(/\s+/g, "")),
  )?.value;
}

const isTrue = (value?: string) => /^(true|yes|1|sspi)$/i.test(value ?? "");
const isFalse = (value?: string) =>
  /^(false|no|0|optional)$/i.test(value ?? "");

function maskKeyValue(parts: ConnectionPart[], separator = ";"): string {
  return parts
    .map((part) => `${part.key}=${part.secret ? "***" : part.value}`)
    .join(separator);
}

function fromUrl(text: string): ConnectionInfo {
  const url = new URL(text);
  const scheme = url.protocol.replace(/:$/, "");
  const parts: ConnectionPart[] = [
    { key: "Scheme", value: scheme, secret: false },
    ...(url.username
      ? [
          {
            key: "User",
            value: decodeURIComponent(url.username),
            secret: false,
          },
        ]
      : []),
    ...(url.password
      ? [
          {
            key: "Password",
            value: decodeURIComponent(url.password),
            secret: true,
          },
        ]
      : []),
    { key: "Host", value: url.hostname, secret: false },
    ...(url.port ? [{ key: "Port", value: url.port, secret: false }] : []),
    ...(url.pathname.length > 1
      ? [
          {
            key: "Database / path",
            value: decodeURIComponent(url.pathname.slice(1)),
            secret: false,
          },
        ]
      : []),
    ...[...url.searchParams].map(([key, value]) => ({
      key,
      value,
      secret: SECRET_KEY.test(key),
    })),
  ];
  const kind = /^postgres(ql)?$/.test(scheme)
    ? "PostgreSQL"
    : /^mongodb(\+srv)?$/.test(scheme)
      ? "MongoDB"
      : /^rediss?$/.test(scheme)
        ? "Redis"
        : /^amqps?$/.test(scheme)
          ? "AMQP"
          : /^mysql$/.test(scheme)
            ? "MySQL"
            : `${scheme} URL`;
  const warnings: string[] = [];
  if (url.password)
    warnings.push(
      "Contains a password in plain text. Keep it in Key Vault or use managed identity instead of config files.",
    );
  if (scheme === "redis" || scheme === "amqp")
    warnings.push(
      `${scheme}:// is unencrypted; use ${scheme === "redis" ? "rediss" : "amqps"}:// for TLS.`,
    );
  const masked = url.password
    ? text.replace(`:${url.password}@`, ":***@")
    : text;
  return { kind, parts, summary: [["Host", url.hostname]], warnings, masked };
}

// StackExchange.Redis: "host:port,password=…,ssl=True,abortConnect=False"
function fromRedis(text: string): ConnectionInfo {
  const [endpoint, ...rest] = text.split(",");
  const parts = [
    { key: "Endpoint", value: endpoint.trim(), secret: false },
    ...parseKeyValue(rest.join(","), ","),
  ];
  const warnings: string[] = [];
  if (get(parts, "password"))
    warnings.push(
      "Contains the access key in plain text. Prefer Entra ID authentication or Key Vault.",
    );
  if (!isTrue(get(parts, "ssl")))
    warnings.push(
      "TLS isn't enabled (ssl=True). Azure Cache for Redis only accepts TLS on port 6380 by default.",
    );
  return {
    kind: /redis\.cache\.windows\.net|redis\.azure\.net/i.test(endpoint)
      ? "Azure Cache for Redis"
      : "Redis (StackExchange.Redis)",
    parts,
    summary: [["Endpoint", endpoint.trim()]],
    warnings,
    masked: [
      endpoint,
      ...parts.slice(1).map((p) => `${p.key}=${p.secret ? "***" : p.value}`),
    ].join(","),
  };
}

export function parseConnectionString(input: string): ConnectionInfo {
  const text = input.trim();
  if (/^[a-z][a-z0-9+.-]*:\/\/[^;]*$/i.test(text)) return fromUrl(text);
  if (/^[^=;,]+:\d+,/.test(text)) return fromRedis(text);

  const parts = parseKeyValue(text);
  if (parts.length === 0) throw new Error("No key=value pairs found.");
  const warnings: string[] = [];
  const summary: [string, string][] = [];
  let kind = "Key/value connection string";

  const endpoint = get(parts, "Endpoint") ?? "";
  if (
    get(
      parts,
      "AccountName",
      "AccountKey",
      "DefaultEndpointsProtocol",
      "BlobEndpoint",
      "SharedAccessSignature",
    ) !== undefined
  ) {
    kind = "Azure Storage";
    summary.push(["Account", get(parts, "AccountName") ?? "(from endpoint)"]);
    summary.push([
      "Endpoint suffix",
      get(parts, "EndpointSuffix") ?? "core.windows.net",
    ]);
    summary.push([
      "Authentication",
      get(parts, "AccountKey")
        ? "Account key (full access)"
        : get(parts, "SharedAccessSignature")
          ? "SAS token"
          : "None in string",
    ]);
    if (get(parts, "AccountKey"))
      warnings.push(
        "An account key grants full access to the whole storage account. Prefer managed identity or a SAS limited in scope and time.",
      );
    if (/^http$/i.test(get(parts, "DefaultEndpointsProtocol") ?? ""))
      warnings.push("DefaultEndpointsProtocol=http sends data unencrypted.");
  } else if (/^sb:\/\//i.test(endpoint)) {
    kind = "Azure Service Bus / Event Hubs";
    summary.push([
      "Namespace",
      endpoint.replace(/^sb:\/\//i, "").replace(/\/$/, ""),
    ]);
    summary.push(["Policy", get(parts, "SharedAccessKeyName") ?? "—"]);
    if (get(parts, "EntityPath"))
      summary.push(["Entity", get(parts, "EntityPath")!]);
    if (
      /RootManageSharedAccessKey/i.test(get(parts, "SharedAccessKeyName") ?? "")
    ) {
      warnings.push(
        "RootManageSharedAccessKey has Manage rights on the whole namespace. Create a policy limited to Send or Listen, or use managed identity.",
      );
    }
  } else if (
    /documents\.azure\.com/i.test(get(parts, "AccountEndpoint") ?? "")
  ) {
    kind = "Azure Cosmos DB";
    summary.push(["Endpoint", get(parts, "AccountEndpoint")!]);
    if (get(parts, "AccountKey"))
      warnings.push(
        "The account key gives full read/write access. Prefer Entra ID (RBAC) authentication.",
      );
  } else if (
    get(parts, "InstrumentationKey", "IngestionEndpoint") !== undefined
  ) {
    kind = "Application Insights";
    summary.push([
      "Instrumentation key",
      get(parts, "InstrumentationKey") ?? "—",
    ]);
    if (get(parts, "IngestionEndpoint"))
      summary.push(["Ingestion endpoint", get(parts, "IngestionEndpoint")!]);
  } else if (get(parts, "HostName") && get(parts, "SharedAccessKey")) {
    kind = "Azure IoT Hub";
    summary.push(["Host", get(parts, "HostName")!]);
  } else if (/\.azconfig\.io/i.test(endpoint)) {
    kind = "Azure App Configuration";
    summary.push(["Endpoint", endpoint]);
  } else if (/\.service\.signalr\.net/i.test(endpoint)) {
    kind = "Azure SignalR";
    summary.push(["Endpoint", endpoint]);
  } else if (
    get(parts, "Host") !== undefined &&
    get(parts, "Server", "Data Source") === undefined
  ) {
    kind = "PostgreSQL (Npgsql)";
    summary.push(["Host", get(parts, "Host")!]);
    summary.push(["Port", get(parts, "Port") ?? "5432"]);
    summary.push(["Database", get(parts, "Database") ?? "—"]);
    summary.push([
      "SSL mode",
      get(parts, "SSL Mode", "SslMode") ?? "Prefer (default)",
    ]);
    if (
      /^(disable|allow|prefer)$/i.test(
        get(parts, "SSL Mode", "SslMode") ?? "prefer",
      )
    ) {
      warnings.push("SSL Mode doesn't require TLS. Use Require or VerifyFull.");
    }
  } else if (
    get(parts, "Server", "Data Source", "Address", "Addr") !== undefined
  ) {
    const server = get(parts, "Server", "Data Source", "Address", "Addr")!;
    const host = server.replace(/^tcp:/i, "").split(",")[0];
    const port = server.split(",")[1]?.trim();
    kind = /database\.windows\.net|database\.azure\.com/i.test(host)
      ? "Azure SQL Database"
      : "SQL Server";
    summary.push(["Server", host]);
    if (port) summary.push(["Port", port]);
    summary.push([
      "Database",
      get(parts, "Database", "Initial Catalog") ?? "(default)",
    ]);
    const auth = get(parts, "Authentication");
    summary.push([
      "Authentication",
      auth ??
        (isTrue(get(parts, "Integrated Security", "Trusted_Connection"))
          ? "Windows (integrated)"
          : get(parts, "User ID", "UID", "User")
            ? "SQL login"
            : "Not specified"),
    ]);
    summary.push([
      "Encrypt",
      get(parts, "Encrypt") ?? "True (default since SqlClient 4)",
    ]);
    if (isTrue(get(parts, "TrustServerCertificate"))) {
      warnings.push(
        "TrustServerCertificate=True skips certificate validation, which allows man-in-the-middle attacks.",
      );
    }
    if (isFalse(get(parts, "Encrypt")))
      warnings.push("Encrypt is off, so traffic isn't protected by TLS.");
  }

  if (
    parts.some((part) => part.secret && part.value) &&
    !warnings.some((w) => /key|password/i.test(w))
  ) {
    warnings.unshift(
      "Contains a password or key in plain text. Keep it in Key Vault or use managed identity instead of config files.",
    );
  }
  return { kind, parts, summary, warnings, masked: maskKeyValue(parts) };
}
