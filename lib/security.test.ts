import assert from "node:assert/strict";
import { test } from "node:test";
import {
  certificateFingerprints,
  decodeBlock,
  parsePem,
} from "./certificate.ts";
import { toHex } from "./asn1.ts";
import { md5 } from "./md5.ts";
import { parseSshKeys } from "./ssh.ts";

// Throwaway certificate, CSR and SSH keys made with openssl and ssh-keygen
// for these tests; the private keys were deleted right away.
const CERT = `-----BEGIN CERTIFICATE-----
MIICWTCCAf+gAwIBAgIUTyXUhYUEXuO5za0roXWUqkATe+YwCgYIKoZIzj0EAwIw
WTELMAkGA1UEBhMCREUxGDAWBgNVBAgMD1JoZWlubGFuZC1QZmFsejEYMBYGA1UE
CgwPQ29wZXJuaWN1cyBUZXN0MRYwFAYDVQQDDA10b29scy50LXMuZGV2MB4XDTI2
MTAzMTIwNDU0NFoXDTI3MTIwMjIwNDU0NFowWTELMAkGA1UEBhMCREUxGDAWBgNV
BAgMD1JoZWlubGFuZC1QZmFsejEYMBYGA1UECgwPQ29wZXJuaWN1cyBUZXN0MRYw
FAYDVQQDDA10b29scy50LXMuZGV2MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE
AWFll3zm+Y1D6U9NfG+gU9h66FF65J9HcgOESm93GxOTb6XG1Y9oV3ISxMIk6952
wXuaAsVITOOOHOuY8F2V+6OBpDCBoTAdBgNVHQ4EFgQUylsOxiDyVNXfRcjMpkAR
w8wJ2ZgwHwYDVR0jBBgwFoAUylsOxiDyVNXfRcjMpkARw8wJ2ZgwDwYDVR0TAQH/
BAUwAwEB/zApBgNVHREEIjAggg10b29scy50LXMuZGV2ggkqLnQtcy5kZXaHBMAA
AgowEwYDVR0lBAwwCgYIKwYBBQUHAwEwDgYDVR0PAQH/BAQDAgeAMAoGCCqGSM49
BAMCA0gAMEUCICjRyf0Q1tkViLRFAi7ky+w8ddYF371jUey4qeqFdJPmAiEAgXU4
JBN188VdI1PIMzWYFog8cr0SUG2SYtAzSULJTdc=
-----END CERTIFICATE-----`;

const CSR = `-----BEGIN CERTIFICATE REQUEST-----
MIICqzCCAZMCAQAwPTELMAkGA1UEBhMCREUxGDAWBgNVBAoMD0NvcGVybmljdXMg
VGVzdDEUMBIGA1UEAwwLYXBpLnQtcy5kZXYwggEiMA0GCSqGSIb3DQEBAQUAA4IB
DwAwggEKAoIBAQCj9Mpg0bnZFEun3Hqs966PYF3VjFgOyLauMor15az7Pgte6PbR
h9+Bw0i5JISLnm8VqPs+BjjwbUOUFH7aMnFmC+f/sZdVsUiFUR/rS3Fh8tmDni4f
sX7GUSKTu9WFi4bubsFDo9yj+uAxWT7BbEXyddg+gWElzUH2X4iv6PtGSVstRwXE
KJKsXZ9xhwQCQDVQhJ0BPr2HAyONeQUsW64ja6D1VL8UVTUSW8x+NjRjTTXcgtMv
s0lRl6b8ACOjTDUYmmhRabo4rISRsfaQeXhZcU3N5vUAJBpS6cXIuHYih0DnsvXp
nuDh+XKzMJCtDVMZ06NBXscdHOJGw1AGzcT5AgMBAAGgKTAnBgkqhkiG9w0BCQ4x
GjAYMBYGA1UdEQQPMA2CC2FwaS50LXMuZGV2MA0GCSqGSIb3DQEBCwUAA4IBAQB6
RwaLwjxOjYWw6iu+uFBuy+wgTeHRriwYicjAMcYPom56RIN4n+xM3dULcFv8bvG5
i2bpUyK4mACd6WJbz5wtEg64VODwIOQ1pKK32e3BQsQTRa5nDqP3d7mDEDZDG5Ei
VzSNMlDoiYOU8Ez+zVWwTOBhmq3lCBMf7Nz2/0s9xWDOgMPzGMQnPlz4XGa1yh+6
sOJsqSDcCRP2R4Ija4mki46RQ6KGCAPAAX9PtETvIWsQeXDRDcU47BVc2Hh/fnQ0
Ijg7r4msWq2sjuzKz1r2Xk0PFkm1KWY7EF5ZO0zrJw380dsBJkstEdmfb6ypUAnY
sE20tuHeTSbHPqQcuJPc
-----END CERTIFICATE REQUEST-----`;

const ED25519 =
  "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIC1sYPuvralqodyGpBX17XoABfgadH1eFPALegUY1Wj+ tim@laptop";

const RSA =
  "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCXahibyXidb8Zd6XWFckDQbY40BH15w2d5Fp8V7vkhVhF04agAfU+cTSAqoQaKAETw1Vsv7y7Na09RJs44UZ7C+/exixUVPXcgZb4mh6Dqxrmrhi9KJ0kXhYh6o8qEAPZ/BSI6FXUCp0umtq25loQ3UABzlTrt/JwJxrExMigzfyrHV9Q9HEp9Cj84ig3sN/ICbuHqJd+OaGLqdflvHai0f+3t0S8VPB7hbPYgtu3zKc4HqFo3AKiVtzJbSz/ZPE0gLqNRwtbEIAkWfHNnWUY7UxaR1+Wq9nWbgrs2iusWzNAzXD4l2WKa/p344IY9b1b6DO8rY9XOtFiA5DjZXV+0rj1Uq2M0n2OtpFn6LHaIZZJGT+WbPa2jOthqWYQhMEM8f3KJP7jd74yzVctMMFXq5KroaUldOWekywXheZUjVLGPLcqrVmszjCw6Tl+m5xDQcAM/CmIEcdZO9DoKc6NjM2/IVytgzFALPIfL8ZSElniBEcE3nYPjnVOwK9XxBwM= build-agent";

test("decodes an X.509 certificate like openssl x509 -text", async () => {
  const [block] = parsePem(CERT);
  const cert = decodeBlock(block);
  assert.equal(cert.kind, "certificate");
  assert.equal(
    cert.subject,
    "C=DE, ST=Rheinland-Pfalz, O=Copernicus Test, CN=tools.t-s.dev",
  );
  assert.equal(cert.commonName, "tools.t-s.dev");
  assert.equal(cert.serialNumber, "4F25D48585045EE3B9CDAD2BA17594AA40137BE6");
  assert.equal(cert.notBefore?.toISOString(), "2026-10-31T20:45:44.000Z");
  assert.equal(cert.notAfter?.toISOString(), "2027-12-02T20:45:44.000Z");
  assert.equal(cert.signatureAlgorithm, "ECDSA with SHA-256");
  assert.equal(cert.publicKey, "EC P-256");
  assert.deepEqual(cert.subjectAltNames, [
    "DNS: tools.t-s.dev",
    "DNS: *.t-s.dev",
    "IP: 192.0.2.10",
  ]);
  assert.deepEqual(cert.keyUsage, ["Digital signature"]);
  assert.deepEqual(cert.extendedKeyUsage, ["TLS server authentication"]);
  assert.equal(cert.isCa, true);
  assert.equal(cert.selfSigned, true);

  const fingerprints = await certificateFingerprints(cert.der);
  assert.equal(
    fingerprints.sha256,
    "3C:0A:4D:EA:AF:AD:BD:C9:08:9B:DA:41:B0:92:47:78:52:94:27:56:84:B6:AB:D1:5E:FC:9F:FE:7C:4F:51:FB",
  );
  assert.equal(
    fingerprints.thumbprint,
    "EF0E5C338142B7F7BE8FCAA36469DE58C719DB4F",
  );
});

test("decodes a CSR with requested SANs", () => {
  const csr = decodeBlock(parsePem(CSR)[0]);
  assert.equal(csr.kind, "csr");
  assert.equal(csr.subject, "C=DE, O=Copernicus Test, CN=api.t-s.dev");
  assert.equal(csr.publicKey, "RSA 2048 bit");
  assert.equal(csr.signatureAlgorithm, "SHA-256 with RSA");
  assert.deepEqual(csr.subjectAltNames, ["DNS: api.t-s.dev"]);
});

test("PEM handling", () => {
  assert.equal(parsePem(CERT + "\n" + CSR).length, 2);
  // Bare Base64 DER without markers.
  const base64 = CERT.split("\n").slice(1, -1).join("");
  assert.equal(decodeBlock(parsePem(base64)[0]).commonName, "tools.t-s.dev");
  assert.throws(
    () =>
      parsePem("-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----"),
    /private key/,
  );
  assert.throws(() => decodeBlock(parsePem("MIIB")[0]));
});

test("MD5 matches RFC 1321 vectors", () => {
  const hash = (text: string) => toHex(md5(new TextEncoder().encode(text)));
  assert.equal(hash(""), "d41d8cd98f00b204e9800998ecf8427e");
  assert.equal(hash("abc"), "900150983cd24fb0d6963f7d28e17f72");
  assert.equal(
    hash(
      "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
    ),
    "57edf4a22be3c955ac49da2e2107b67a",
  );
});

test("SSH fingerprints match ssh-keygen -lf", async () => {
  const { keys, errors } = await parseSshKeys(
    `# authorized_keys\n${ED25519}\nfrom="10.0.0.0/8" ${RSA}\ngarbage`,
  );
  assert.equal(errors.length, 1);
  assert.deepEqual(keys[0], {
    type: "Ed25519",
    bits: 256,
    comment: "tim@laptop",
    sha256: "SHA256:chuLK8+/kCng+/1ztqYezmnC8nb80kmZdNhCw/F00kc",
    md5: "MD5:47:fe:ab:0a:3d:89:f3:19:79:23:cd:b8:6e:b4:5d:fc",
  });
  assert.deepEqual(keys[1], {
    type: "RSA",
    bits: 3072,
    comment: "build-agent",
    sha256: "SHA256:UkRu7uEX91mktXk1fDk11mqoKb54kZcOVQ6ooBAjUng",
    md5: "MD5:02:3f:1c:68:ea:32:c1:8d:d9:01:9f:4d:ef:09:31:8f",
  });
  const privateKey = await parseSshKeys("-----BEGIN OPENSSH PRIVATE KEY-----");
  assert.match(privateKey.errors[0], /private key/);
});
