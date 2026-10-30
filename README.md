# Copernicus

Everyday developer tools at [tools.t-s.dev](https://tools.t-s.dev). Named
after Copernicus (55 Cancri A), a star with five known planets: the hub the
other tools orbit.

Every tool runs entirely in the browser. There's no backend, no database and
no analytics, and the Content Security Policy (`connect-src 'self'`) stops
pages from sending anything to another origin, so pasted tokens, IBANs and
passwords never leave the machine.

## Tools

| Tool                     | Path                                              | Logic              |
| ------------------------ | ------------------------------------------------- | ------------------ |
| Password generator       | `/password-generator`                             | `lib/password.ts`  |
| Hash generator           | `/hash-generator`                                 | `lib/hash.ts`      |
| JWT decoder              | `/jwt-decoder`                                    | `lib/jwt.ts`       |
| Base64 encode / decode   | `/base64`                                         | `lib/base64.ts`    |
| URL encode / decode      | `/url-encoder`                                    | `lib/url.ts`       |
| JSON formatter           | `/json-formatter`                                 | `lib/json.ts`      |
| UUID / GUID generator    | `/uuid-generator`                                 | `lib/uuid.ts`      |
| Unix timestamp converter | `/timestamp-converter`                            | `lib/timestamp.ts` |
| IPv4 subnet calculator   | `/subnet-calculator`                              | `lib/subnet.ts`    |
| IBAN validator           | `/iban-validator`                                 | `lib/iban.ts`      |
| Unit converter           | `/unit-converter`                                 | `lib/units.ts`     |
| One-time secret sharing  | links to [secret.t-s.dev](https://secret.t-s.dev) | own repo (`lete`)  |

Randomness always comes from `crypto.getRandomValues` (`lib/random.ts`, with
rejection sampling to avoid bias). Passphrases use the EFF large wordlist.

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
   needed.
2. Add the domain `tools.t-s.dev` in Vercel, then in Cloudflare DNS add a
   `CNAME tools → cname.vercel-dns.com` with the proxy **off** (DNS only).
