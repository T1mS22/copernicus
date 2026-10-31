"use client";

import { TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { ErrorMessage, OutputRow, Panel } from "@/components/ui";
import {
  type CertificateInfo,
  certificateFingerprints,
  decodeBlock,
  parsePem,
} from "@/lib/certificate";

type Fingerprints = Awaited<ReturnType<typeof certificateFingerprints>>;

const DAY = 86_400_000;

function decodeAll(text: string) {
  if (!text.trim()) return { certificates: [], error: null };
  try {
    return { certificates: parsePem(text).map(decodeBlock), error: null };
  } catch (error) {
    return {
      certificates: [],
      error:
        error instanceof Error &&
        /private key|blocks aren't/.test(error.message)
          ? error.message
          : "That isn't a PEM certificate or CSR. Paste the text including -----BEGIN CERTIFICATE-----.",
    };
  }
}

function formatDate(date: Date): string {
  return (
    date.toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    }) + " UTC"
  );
}

function status(cert: CertificateInfo) {
  if (!cert.notBefore || !cert.notAfter) return null;
  const now = Date.now();
  const daysLeft = Math.floor((cert.notAfter.getTime() - now) / DAY);
  if (now < cert.notBefore.getTime())
    return { label: "Not valid yet", className: "badge-warning" };
  if (daysLeft < 0)
    return { label: `Expired ${-daysLeft} days ago`, className: "badge-error" };
  if (daysLeft < 30)
    return { label: `Expires in ${daysLeft} days`, className: "badge-warning" };
  return { label: `Valid, ${daysLeft} days left`, className: "badge-success" };
}

function warnings(cert: CertificateInfo): string[] {
  const list: string[] = [];
  if (/SHA-1/.test(cert.signatureAlgorithm))
    list.push("Signed with SHA-1, which browsers no longer accept.");
  const rsa = /RSA (\d+) bit/.exec(cert.publicKey);
  if (rsa && Number(rsa[1]) < 2048)
    list.push("RSA keys below 2048 bits are considered insecure.");
  if (
    cert.kind === "certificate" &&
    !cert.isCa &&
    cert.notBefore &&
    cert.notAfter
  ) {
    const days = (cert.notAfter.getTime() - cert.notBefore.getTime()) / DAY;
    if (
      days > 398 &&
      cert.extendedKeyUsage.includes("TLS server authentication") &&
      !cert.selfSigned
    ) {
      list.push(
        "Valid for more than 398 days, longer than browsers accept for publicly trusted TLS certificates.",
      );
    }
  }
  if (
    cert.kind === "certificate" &&
    cert.subjectAltNames.length === 0 &&
    !cert.isCa
  ) {
    list.push(
      "No subject alternative names. Browsers ignore the CN and need the host name in the SANs.",
    );
  }
  return list;
}

function CertificateCard({
  cert,
  fingerprints,
}: {
  cert: CertificateInfo;
  fingerprints?: Fingerprints;
}) {
  const state = status(cert);
  const issues = warnings(cert);
  const list = (values: string[]) => (values.length ? values.join("\n") : "—");

  return (
    <Panel
      title={cert.commonName ?? cert.subject}
      actions={
        <span className="flex flex-wrap gap-1.5">
          <span className="badge badge-ghost">
            {cert.kind === "csr"
              ? "Signing request"
              : cert.isCa
                ? "CA certificate"
                : "Certificate"}
          </span>
          {cert.selfSigned && (
            <span className="badge badge-ghost">Self-signed</span>
          )}
          {state && (
            <span className={`badge badge-soft ${state.className}`}>
              {state.label}
            </span>
          )}
        </span>
      }
    >
      {issues.length > 0 && (
        <div className="mb-3 space-y-1">
          {issues.map((issue) => (
            <p key={issue} className="flex gap-2 text-sm text-warning">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              {issue}
            </p>
          ))}
        </div>
      )}
      <OutputRow label="Subject" value={cert.subject} />
      {cert.issuer && <OutputRow label="Issuer" value={cert.issuer} />}
      <OutputRow
        label="Subject alternative names"
        value={list(cert.subjectAltNames)}
      />
      {cert.notBefore && (
        <OutputRow
          label="Valid from"
          value={formatDate(cert.notBefore)}
          mono={false}
        />
      )}
      {cert.notAfter && (
        <OutputRow
          label="Valid until"
          value={formatDate(cert.notAfter)}
          mono={false}
        />
      )}
      <OutputRow label="Public key" value={cert.publicKey} mono={false} />
      <OutputRow
        label="Signature"
        value={cert.signatureAlgorithm}
        mono={false}
      />
      {cert.serialNumber && (
        <OutputRow label="Serial number" value={cert.serialNumber} />
      )}
      {cert.keyUsage.length > 0 && (
        <OutputRow
          label="Key usage"
          value={cert.keyUsage.join(", ")}
          mono={false}
        />
      )}
      {cert.extendedKeyUsage.length > 0 && (
        <OutputRow
          label="Extended key usage"
          value={cert.extendedKeyUsage.join(", ")}
          mono={false}
        />
      )}
      {cert.isCa !== undefined && (
        <OutputRow
          label="Basic constraints"
          value={
            cert.isCa
              ? `CA${cert.pathLength !== undefined ? `, path length ${cert.pathLength}` : ""}`
              : "Not a CA"
          }
          mono={false}
        />
      )}
      {cert.policies.length > 0 && (
        <OutputRow
          label="Policies"
          value={cert.policies.join(", ")}
          mono={false}
        />
      )}
      {cert.subjectKeyId && (
        <OutputRow label="Subject key ID" value={cert.subjectKeyId} />
      )}
      {cert.authorityKeyId && (
        <OutputRow label="Authority key ID" value={cert.authorityKeyId} />
      )}
      {cert.ocspUrls.length > 0 && (
        <OutputRow label="OCSP" value={list(cert.ocspUrls)} />
      )}
      {cert.issuerUrls.length > 0 && (
        <OutputRow label="Issuer certificate" value={list(cert.issuerUrls)} />
      )}
      {cert.crlUrls.length > 0 && (
        <OutputRow label="CRL" value={list(cert.crlUrls)} />
      )}
      {cert.kind === "certificate" && (
        <OutputRow
          label="Certificate Transparency"
          value={cert.hasSct ? "Embedded SCTs present" : "No embedded SCTs"}
          mono={false}
        />
      )}
      {fingerprints && cert.kind === "certificate" && (
        <>
          <OutputRow
            label="Thumbprint (Azure, Windows)"
            value={fingerprints.thumbprint}
          />
          <OutputRow label="SHA-1 fingerprint" value={fingerprints.sha1} />
          <OutputRow label="SHA-256 fingerprint" value={fingerprints.sha256} />
        </>
      )}
    </Panel>
  );
}

export default function CertificateDecoder() {
  const [input, setInput] = useState("");
  const [fingerprints, setFingerprints] = useState<Fingerprints[]>([]);
  const { certificates, error } = decodeAll(input);

  useEffect(() => {
    let cancelled = false;
    async function compute() {
      const { certificates: certs } = decodeAll(input);
      const results = await Promise.all(
        certs.map((cert) => certificateFingerprints(cert.der)),
      );
      if (!cancelled) setFingerprints(results);
    }
    compute();
    return () => {
      cancelled = true;
    };
  }, [input]);

  // In a chain, each certificate's issuer key should be the next one's key.
  const chain = certificates.filter((c) => c.kind === "certificate");
  const chainOk =
    chain.length > 1 &&
    chain.every(
      (cert, i) =>
        i === chain.length - 1 ||
        !cert.authorityKeyId ||
        cert.authorityKeyId === chain[i + 1].subjectKeyId,
    );

  return (
    <div className="space-y-5">
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={
          "-----BEGIN CERTIFICATE-----\nMIID…\n-----END CERTIFICATE-----"
        }
        aria-label="Certificate or CSR in PEM format"
        rows={8}
        spellCheck={false}
        className="textarea w-full font-mono text-sm"
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {chain.length > 1 && (
        <p className={`text-sm ${chainOk ? "text-success" : "text-warning"}`}>
          {chainOk
            ? `Chain of ${chain.length} certificates in the right order (each one is issued by the next).`
            : "These certificates aren't in chain order: each one should be followed by its issuer."}
        </p>
      )}
      {certificates.map((cert, i) => (
        <CertificateCard key={i} cert={cert} fingerprints={fingerprints[i]} />
      ))}
      <p className="text-xs text-faint">
        Decoded in your browser. Paste one or more certificates (a full chain
        works) or a CSR. Never paste private keys; the tool refuses them. For a
        .pfx file, export the certificate first, e.g. with openssl pkcs12 -in
        file.pfx -nokeys.
      </p>
    </div>
  );
}
