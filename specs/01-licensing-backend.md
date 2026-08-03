# M-Licensing-Backend — purchase link, activation API, license store

> **Why this spec exists.** Gumroad sells CodeScenes and generates the license keys, and its
> `/v2/licenses/verify` endpoint is the authority on whether a key was paid for and is still valid.
> What Gumroad cannot express is "this key is good for 3 machines": its `uses` field counts API
> calls, not distinct machines, so a reinstall or a retry burns a seat. The seat binding is the only
> thing this backend owns. Everything else about money, tax, refunds and key generation stays with
> Gumroad.
>
> This repo owns the server half. The editor half — activation UI, seat management, the startup
> check, the trial and expiry behavior — is `CodeScenesUnity/specs/34-licensing-activation.md`. The
> two specs share one wire contract, defined here.

---

## Scope split

| Lives here | Lives in CodeScenesUnity |
|---|---|
| Buy button on the marketing site | Editor activation window, seat list UI |
| `activate` / `trial` / `seats` / `release` functions | All calls into those functions |
| Firestore `licenses` + `trials` collections and rules | Signed-token cache, expiry and refresh logic |
| Token signing (private key) | Token verification (public key) |
| Gumroad verify calls | Gumroad checkout link (opened, not called) |

The editor never talks to Gumroad or Firestore directly. Every call goes through a function here.

---

## 1. Buy link on the marketing site

The site's only licensing responsibility is sending people to Gumroad. There is no activation page,
no key entry, and no machine identifier in any URL. Activation happens in the Unity editor, where
the machine already is.

`src/lib/site.ts` gains `GUMROAD_PRODUCT_URL` alongside the existing constants. The primary CTA
links to it directly.

```
GUMROAD_PRODUCT_URL = "https://paulmartindev.gumroad.com/l/zuwqt"
GUMROAD_PRODUCT_ID  = "d_bOiSZquNziUu2K45OHIA=="   // functions/.env, not a secret
```

> **`GUMROAD_PRODUCT_ID` is unconfirmed.** It was read out of the product page's embedded JSON
> (Gumroad's checkout widget needs it client-side), not from the authenticated products API. It
> could not be validated by probe: `/v2/licenses/verify` returns an identical `404 "That license
> does not exist for the provided product."` for a wrong product ID and a wrong license key, so a
> bogus-key request proves nothing. Confirm with a Gumroad test purchase and a real key returning
> `success: true` before the function depends on it. The product also currently reports
> `is_published: false`, so retest after publishing.

**Build:** a `GUMROAD_PRODUCT_URL` constant and a Buy CTA that opens it. Decide whether the
existing `Waitlist` section is replaced by the Buy CTA at launch or the two coexist during the
pre-launch window; `WAITLIST_ENDPOINT` is still unwired (`src/lib/site.ts:14`) and stores nothing.

**Accept when:** a visitor with no Unity installed can reach Gumroad checkout in one click from the
landing page, and no page on the site accepts, displays, or transmits a license key or a machine
identifier.

---

## 2. Data model

Two collections. Firestore is schemaless, so this is the shape the functions write, not an enforced
declaration.

```
licenses/{licenseKey}                  // doc ID IS the Gumroad key — O(1) get, uniqueness free
  productId:  string
  email:      string | null            // denormalized from Gumroad for support lookup only
  machines:   [ { hash, label, os, activatedAt, lastSeenAt } ]   // max 3
  createdAt:  timestamp
  updatedAt:  timestamp

trials/{machineHash}
  startedAt:  timestamp
  expiresAt:  timestamp                // startedAt + 14d, written once and never extended
  label:      string
  os:         string
```

`machines[].hash` is a SHA-256 of the raw machine identifier, computed **server-side**. The raw
identifier is never stored. `label` and `os` are human-readable (hostname, "Windows 11") and exist
so a user picking a seat to remove is not staring at three hex strings.

`email` is optional and can be dropped. Gumroad's verify response already returns it, so storing it
is duplicated personal data whose only benefit is answering "which key belongs to this customer?"
without a Gumroad round trip.

The 3-machine array is deliberately not a subcollection. At a cap of 3, the array keeps activation
to one read and one write inside a single transaction; a subcollection would make the count an
aggregation query for no gain.

**Note on the reverse lookup:** `array-contains` matches whole array elements, so "which license
holds machine X" is not queryable against `machines` as specified. If support needs that lookup, add
a parallel `machineHashes: [string]` field and query that. Not built until needed.

---

## 3. Wire contract

Four HTTPS functions, region `us-central1` (co-located with the `nam5` Firestore multi-region).
All are `POST`, all take and return JSON. They may be implemented as one function with an action
discriminator; the contract is what matters.

### `activate`

Request: `{ licenseKey, machineId, label, os }`

Idempotent, and therefore also serves refresh. Steps:

1. `POST https://api.gumroad.com/v2/licenses/verify` with `product_id`, `license_key`, and
   `increment_uses_count: false`. **False is load-bearing** — seat counting is this system's job,
   and incrementing would make every refresh look like a new activation.
2. Reject on `success: false`, or on `purchase.refunded`, `purchase.chargebacked`,
   `purchase.subscription_cancelled_at`, or `purchase.subscription_failed_at` being set.
3. In a Firestore transaction on `licenses/{licenseKey}`:
   - missing → create with this machine as the sole seat
   - `machines` already contains this hash → touch `lastSeenAt`, no seat consumed
   - fewer than 3 seats → append
   - otherwise → fail with `seat_limit`
4. Issue a signed token (§4).

Response: `{ ok: true, token, seatsUsed, seatsTotal }` or
`{ ok: false, reason, seats? }`. `reason` is one of `invalid_key`, `refunded`, `seat_limit`,
`rate_limited`. On `seat_limit` the response carries the seat list so the editor can offer removal
without a second round trip.

The transaction is mandatory. Two near-simultaneous activations against the last free seat would
both pass a read-then-write check.

### `trial`

Request: `{ machineId, label, os }`

`trials/{machineHash}` missing → create with `expiresAt = now + 14d` and issue a trial token.
Present and unexpired → reissue a token carrying the **original** `expiresAt`. Present and expired →
`{ ok: false, reason: "trial_expired" }`.

Writing `expiresAt` once and never extending it is what makes reinstalling not reset the trial.

**This is a soft control.** `machineId` is client-supplied, so anyone willing to fake one gets
another trial. Server-side tracking defeats the reinstall, not a determined user. Do not build
further defenses against the determined case; it is not winnable client-side.

### `seats`

Request: `{ licenseKey }` → `{ ok, machines: [{ hash, label, os, activatedAt, lastSeenAt }] }`.
Verifies the key against Gumroad first so the endpoint is not a free seat-listing oracle.

### `release`

Request: `{ licenseKey, hash }` → removes that seat, returns the updated list.

No cooldown on release, by explicit product decision: 3 seats is generous on purpose, and a user
handing a spare seat to a friend is acceptable. Rotation abuse is not defended against.

---

## 4. The token

A boolean over HTTP is not a verification. `{"ok": true}` is forgeable by anyone with a hosts file
entry, so the functions return a signed assertion the editor validates offline.

Payload:

```
{ v: 1, kind: "license" | "trial", sub: <machineHash>, lic: <sha256(licenseKey)> | null,
  iat: <unix>, exp: <unix> }
```

`exp` is `iat + 14d` for a license token. For a trial token `exp` is the trial's own `expiresAt`,
so a trial token cannot outlive the trial no matter how often it is reissued.

The 14 days is the **entire** offline budget; there is no separate grace period on the editor side.
The editor attempts a refresh at most once per day, and each success reissues a token expiring 14
days out, so "time since last successful contact" and "time to expiry" are one clock. This also caps
refund exposure at one day for an online user, since the daily check catches a `refunded` response
rather than waiting for the token to lapse.

`lic` is a hash, not the key, so a leaked token does not leak a working license key.

**Algorithm: ECDSA P-256 with SHA-256.** Node signs with the built-in `crypto` module; Unity
verifies with `System.Security.Cryptography.ECDsa`. Ed25519 is the better primitive but is not
available in Unity's .NET profile without a third-party library.

> **Unverified.** I could not run Unity from this repo to confirm `ECDsa.Create()` and P-256
> verification behave on the target editor version and on every desktop platform. Spike this before
> committing to the algorithm — it is a one-file test and it decides the wire format.

The private key lives in Secret Manager via `defineSecret()`, never in a `.env` file and never in
the repo. The public key is embedded in the Unity package as a literal.

Note that `functions.config()` is deprecated and new deploys begin failing after March 2027, so
configuration is `functions/.env` for plain values (`GUMROAD_PRODUCT_ID` is not a secret) and
`defineSecret()` for the signing key.

**Accept when:** a token with one byte flipped fails verification, and a token issued for machine A
fails verification on machine B.

---

## 5. Abuse and cost

The project is on the Blaze plan, which has no hard spend cap. `activate` and `trial` are public,
unauthenticated, and each one makes an outbound Gumroad call, so an unthrottled endpoint is a way
for a stranger to spend money and exhaust Gumroad API quota.

**Build:** per-IP rate limiting on `activate` and `trial` before either does any Gumroad or
Firestore work. A `rateLimits/{ip}` document with a counter and a TTL policy is sufficient at this
scale. Set a Cloud Console budget alert regardless.

**Accept when:** a script hitting `activate` in a loop from one IP is rejected before any outbound
Gumroad request is made.

---

## 6. Rules and deployment

`firestore.rules` denies all client access and stays that way. Both collections are written
exclusively by the functions through the Admin SDK, which bypasses rules entirely. There is no
Firebase client SDK anywhere in the Unity package or on the website.

Restoring the `functions` block in `firebase.json` is part of this work; it was removed so that a
plain `firebase deploy` would not fail its predeploy build against an empty `functions/src`.

**Accept when:** an unauthenticated read of `licenses/{anything}` is rejected, and
`npx firebase deploy` with no `--only` flag succeeds.

---

## 7. Local testing

The functions and the license store run entirely on the emulator suite:

```sh
npx firebase emulators:start --only firestore,functions
```

**This requires a JDK 21 or newer.** `firebase-tools` 15 refuses to start on anything older with
`firebase-tools no longer supports Java version before 21`. Verified against the Java 8 install on
the dev machine, which fails.

Add an `emulators` block to `firebase.json` pinning the Firestore and Functions ports, so the Unity
package can point at a fixed local base URL while developing.

**The emulator does not intercept outbound HTTP.** A function running locally still calls the real
`api.gumroad.com`. Gumroad test purchases cover more of this than a mock-everything approach would
suggest:

| Branch | Reachable with a Gumroad test purchase? |
|---|---|
| valid key | Yes. A test purchase issues a real key; verify returns `success: true` with `purchase.test: true` |
| `invalid_key` | Yes. Any made-up key |
| `refunded` | Yes, by refunding the test purchase from the dashboard |
| `chargebacked` | **No.** A chargeback originates from a payment dispute and cannot be manufactured |
| `subscription_cancelled_at` / `subscription_failed_at` | N/A while the product is a one-time purchase; these fields only apply to subscriptions |

So the happy path and most rejections are testable end to end against real Gumroad, for free. The
chargeback branch is not reachable any other way than a stubbed response, and no test should depend
on network reachability or on external account state anyway.

**Decide what `purchase.test: true` means in production.** A test purchase is something only the
seller can create, so it is not an attack surface, but left unchecked your own test keys consume
real seats in the production `licenses` collection. Either reject test purchases outside the
emulator, or accept them knowingly.

**Build:** put the Gumroad call behind a single injectable interface so tests supply the response.
Every rejection branch in §3 must be reachable from a test without a network call, and the seat
transaction must be testable against the emulator with no Gumroad involvement at all.

**Accept when:** the full matrix — valid, invalid, refunded, chargebacked, cancelled, seat limit,
already-activated, and a concurrent double-activation against the last free seat — runs green
against the emulator with the network disconnected.

The concurrency case is the one that cannot be checked by reading the code. Two simultaneous
activations against the last seat must yield exactly one success and one `seat_limit`, which is the
entire reason §3 mandates a transaction.

---

## Already done

The `(default)` Firestore database exists on project `codescenes` at location `nam5`, type
`FIRESTORE_NATIVE`, edition `STANDARD`. `firestore.rules` (deny-all) and `firestore.indexes.json`
(empty — key-as-document-ID needs no index) are written and deployed. `functions/` is scaffolded
with `firebase-functions` 7.3.2 and `firebase-admin` 14.2.0 on Node 22, with no source yet.

The database location is permanent. Changing it means deleting and recreating the database.
