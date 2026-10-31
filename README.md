# Copernicus

Everyday developer tools at [tools.t-s.dev](https://tools.t-s.dev). Named
after Copernicus (55 Cancri A), a star with five known planets: the hub the
other tools orbit.

Every tool runs entirely in the browser. There's no backend or database, and
the Content Security Policy (`connect-src 'self'`) stops pages from sending
anything to another origin, so pasted tokens, IBANs and passwords never leave
the machine.

Vercel Web Analytics counts page views ([`components/Analytics.tsx`](components/Analytics.tsx)).
It's served from the same origin, sets no cookies and only sees the path:
query strings and fragments are stripped before anything is sent. Nothing
typed into a tool is part of a page view. Lete (the one-time secret app)
deliberately has no analytics, because its links carry the decryption key.

## Tools

| Tool                        | Path                                              | Logic                              |
| --------------------------- | ------------------------------------------------- | ---------------------------------- |
| Password generator          | `/password-generator`                             | `lib/password.ts`                  |
| Hash generator              | `/hash-generator`                                 | `lib/hash.ts`                      |
| HMAC generator              | `/hmac-generator`                                 | `lib/hmac.ts`                      |
| JWT decoder                 | `/jwt-decoder`                                    | `lib/jwt.ts`                       |
| Text diff                   | `/text-diff`                                      | `lib/diff.ts`                      |
| Regex tester                | `/regex-tester`                                   | `lib/regex.ts`                     |
| Case converter              | `/case-converter`                                 | `lib/case.ts`                      |
| Word and character counter  | `/text-counter`                                   | `lib/textstats.ts`                 |
| JSON formatter              | `/json-formatter`                                 | `lib/json.ts`                      |
| JSON / YAML / CSV converter | `/data-converter`                                 | `lib/dataconvert.ts`, `lib/csv.ts` |
| XML formatter               | `/xml-formatter`                                  | `lib/xml.ts`                       |
| Base64 encode / decode      | `/base64`                                         | `lib/base64.ts`                    |
| URL encode / decode         | `/url-encoder`                                    | `lib/url.ts`                       |
| Number base converter       | `/number-base-converter`                          | `lib/numberbase.ts`                |
| UUID / GUID generator       | `/uuid-generator`                                 | `lib/uuid.ts`                      |
| ULID generator              | `/ulid-generator`                                 | `lib/ulid.ts`                      |
| QR code generator           | `/qr-code-generator`                              | `lib/qr.ts`                        |
| Unix timestamp converter    | `/timestamp-converter`                            | `lib/timestamp.ts`                 |
| Cron expression explainer   | `/cron-explainer`                                 | `lib/cron.ts`                      |
| Time zone converter         | `/timezone-converter`                             | `lib/timezone.ts`                  |
| Date calculator             | `/date-calculator`                                | `lib/datecalc.ts`                  |
| IPv4 subnet calculator      | `/subnet-calculator`                              | `lib/subnet.ts`                    |
| IPv6 subnet calculator      | `/ipv6-subnet-calculator`                         | `lib/ipv6.ts`                      |
| IP range checker            | `/ip-range-checker`                               | `lib/iprange.ts`                   |
| MAC address formatter       | `/mac-address-formatter`                          | `lib/mac.ts`                       |
| chmod calculator            | `/chmod-calculator`                               | `lib/chmod.ts`                     |
| Color converter             | `/color-converter`                                | `lib/color.ts`                     |
| HTTP status codes           | `/http-status-codes`                              | `lib/httpstatus.ts`                |
| User agent parser           | `/user-agent-parser`                              | `lib/useragent.ts`                 |
| IBAN validator              | `/iban-validator`                                 | `lib/iban.ts`                      |
| BIC / SWIFT validator       | `/bic-validator`                                  | `lib/validators.ts`                |
| VAT ID validator            | `/vat-id-validator`                               | `lib/validators.ts`                |
| EAN / GTIN validator        | `/ean-validator`                                  | `lib/validators.ts`                |
| Unit converter              | `/unit-converter`                                 | `lib/units.ts`                     |
| One-time secret sharing     | links to [secret.t-s.dev](https://secret.t-s.dev) | own repo (`lete`)                  |

Randomness always comes from `crypto.getRandomValues` (`lib/random.ts`, with
rejection sampling to avoid bias). Passphrases use the EFF large wordlist.
Third-party libraries: `yaml` (YAML parsing), `cronstrue` (cron descriptions)
and `uqr` (QR encoding); everything else is plain TypeScript in `lib/`.

Tools whose first render depends on the clock, randomness or inline styles
(swatches) are wrapped in `ClientOnly`, so server and browser renders match
and the CSP never sees a server-rendered `style` attribute.

## Adding a tool

1. Put the logic in `lib/<name>.ts` with tests in a `lib/*.test.ts` file.
2. Build the UI in `components/tools/<Name>.tsx` from the pieces in
   `components/ui.tsx`.
3. Add an entry to `TOOLS` in [`lib/tools.ts`](lib/tools.ts) and a page at
   `app/<slug>/page.tsx` (copy an existing one).

Tools that handle secrets or need a server get their own repo and subdomain
instead, like the one-time secret app.

## Development

Requires Node 26 and Yarn 4.

```bash
yarn install
yarn dev
```

```bash
yarn test   # logic tests
yarn lint
yarn build
```

## Deployment

1. Import the repo as a new Vercel project. No environment variables are
   needed. Enable **Analytics** in the project so `/_vercel/insights` exists.
2. Add the domain `tools.t-s.dev` in Vercel, then in Cloudflare DNS add a
   `CNAME tools → cname.vercel-dns.com` with the proxy **off** (DNS only).
