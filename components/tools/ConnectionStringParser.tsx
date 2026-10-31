"use client";

import { Eye, EyeOff, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { CopyButton, ErrorMessage, OutputRow, Panel } from "@/components/ui";
import { parseConnectionString } from "@/lib/connectionstring";

// Made-up values, only to show the format of each type.
const EXAMPLES: [string, string][] = [
  [
    "Azure SQL",
    "Server=tcp:contoso.database.windows.net,1433;Initial Catalog=orders;User ID=app;Password=example;Encrypt=True;TrustServerCertificate=False",
  ],
  [
    "Storage",
    "DefaultEndpointsProtocol=https;AccountName=stcontoso;AccountKey=ZXhhbXBsZQ==;EndpointSuffix=core.windows.net",
  ],
  [
    "Service Bus",
    "Endpoint=sb://contoso.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=ZXhhbXBsZQ=",
  ],
  [
    "PostgreSQL",
    "Host=contoso.postgres.database.azure.com;Database=app;Username=admin;Password=example;SSL Mode=Require",
  ],
  [
    "Redis",
    "contoso.redis.cache.windows.net:6380,password=ZXhhbXBsZQ=,ssl=True,abortConnect=False",
  ],
];

function parse(input: string) {
  try {
    return { info: parseConnectionString(input), error: null };
  } catch (error) {
    return { info: null, error: (error as Error).message };
  }
}

export default function ConnectionStringParser() {
  const [input, setInput] = useState("");
  const [showSecrets, setShowSecrets] = useState(false);
  const { info, error } = input.trim()
    ? parse(input)
    : { info: null, error: null };

  return (
    <div className="space-y-5">
      <div>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Server=…;Database=…;User ID=…;Password=…"
          aria-label="Connection string"
          rows={4}
          spellCheck={false}
          autoComplete="off"
          className="textarea w-full font-mono text-sm break-all"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {EXAMPLES.map(([label, value]) => (
            <button
              key={label}
              type="button"
              onClick={() => setInput(value)}
              className="btn btn-ghost btn-xs border-line"
            >
              {label} example
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {info && (
        <>
          <Panel title={info.kind}>
            {info.warnings.length > 0 && (
              <div className="mb-3 space-y-1.5">
                {info.warnings.map((warning) => (
                  <p key={warning} className="flex gap-2 text-sm text-warning">
                    <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                    {warning}
                  </p>
                ))}
              </div>
            )}
            {info.summary.map(([label, value]) => (
              <OutputRow key={label} label={label} value={value} mono={false} />
            ))}
          </Panel>

          <Panel
            title="All values"
            actions={
              <span className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowSecrets(!showSecrets)}
                >
                  {showSecrets ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                  {showSecrets ? "Hide secrets" : "Show secrets"}
                </button>
                <CopyButton value={info.masked} label="Copy masked" />
              </span>
            }
          >
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <tbody>
                  {info.parts.map((part, i) => (
                    <tr key={i}>
                      <td className="w-48 text-muted">{part.key}</td>
                      <td className="font-mono break-all">
                        {part.secret && !showSecrets ? (
                          <span className="text-faint">
                            •••••••• ({part.value.length} characters)
                          </span>
                        ) : (
                          part.value || (
                            <span className="text-faint">(empty)</span>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </>
      )}

      <p className="text-xs text-faint">
        Parsed in your browser. Use “Copy masked” to share a connection string
        in a ticket or chat without its password or key. Supports ADO.NET style
        (SQL Server, Npgsql, Azure Storage, Service Bus, Cosmos DB, App
        Insights), URL style (postgres://, mongodb://, redis://) and
        StackExchange.Redis.
      </p>
    </div>
  );
}
