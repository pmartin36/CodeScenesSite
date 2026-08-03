# Unity Asset Store distribution and the off-store license

Background for the distribution decision. Not legal advice; this is a reading of the agreement text,
and the question is worth putting to Unity publisher support directly before committing, because it
is cheap to ask and expensive to get wrong.

## The clause

Asset Store Provider Agreement, <https://unity.com/legal/provider>:

> **4.9.1.2** Provider's free Assets may not have a special enhanced version of this Asset which
> Provider markets outside of the Unity Asset Store (and thus circumventing the payment in favor of
> Unity, as specified in 4.3 above.

Section 4.3 is the revenue split: Unity keeps 30% of license sales made through the store. The
agreement separately requires that fees for licenses to Assets distributed via the store be
processed by Unity's payment processor.

**Caveat on the reading.** 4.9.1.2 appears under section 4.9, headed Donations, and is phrased as a
condition on accepting donations. A narrow reading confines it to publishers soliciting donations.
The parenthetical states the principle in general terms, and the payment-processor requirement
points the same direction, but the placement is genuinely ambiguous.

## What it rules out

The shape it describes is: free or trial listing on the Asset Store, full version purchased
elsewhere. Where the download is hosted makes no difference. Serving the package from GitHub rather
than from Gumroad does not change the structure the clause addresses, because the object of the rule
is the existence of an enhanced version marketed off-store, not the file host.

## Options

| Model | Compliant | Cost |
|---|---|---|
| Free/trial on Asset Store, paid license off-store | The pattern 4.9.1.2 describes | Delisting risk |
| Full product priced on Asset Store **and** sold off-store, each self-contained | Yes | 30% of store sales; package needs two modes |
| Free Lite **and** paid Pro, both listed on the Asset Store | Yes | 30%; two listings to maintain |
| Off-store only (GitHub + Gumroad) | Yes, no store relationship | Loses Asset Store discovery |

The line is off-store, not free. A free listing is fine; a free listing whose upgrade path leaves the
store is the problem.

## Consequence for the licensing system

An Asset Store purchase carries Unity's own EULA and per-seat licensing, so a store-sold copy needs
no key, no activation, and never contacts the backend in
[`specs/01-licensing-backend.md`](../specs/01-licensing-backend.md). Only the off-store copy does.

If both channels ship, the package needs to know which build it is. That is a build-time flag, not a
runtime check, and it should fail closed: a build with no channel set behaves as the licensed
off-store build rather than silently skipping activation.

## Decided

Row 2: the complete Pro version on the Asset Store under Unity's per-seat EULA, and the same
complete product sold on Gumroad with the key system. Each channel is self-contained and nothing
enhanced is marketed off-store.

Consequences: the package ships as two builds
(`CodeScenesUnity/specs/34-licensing-activation.md`, "Two distribution channels"), and the site's
purchase CTA presents both destinations rather than one.

Still worth confirming with Unity publisher support, since the reading above rests on contract text
rather than a ruling.

## Open: the direct channel's delivery mechanism

`github.com/pmartin36/CodeScenes` is **public** (confirmed: unauthenticated API returns 200). That
undercuts "buy on Gumroad, install from GitHub" in two ways. Anyone can install the package from the
git URL without buying, and the activation check is readable source with the verification public key
in it, so patching it out is straightforward for anyone who looks.

The licensing system is still worth building — it is friction for honest users, and no client-side
scheme survives a determined attacker regardless. But the delivery path needs deciding:

- **Gumroad file delivery.** Ship a `.unitypackage` or tarball as the Gumroad product file and keep
  the repo public for visibility. Delivery is what Gumroad is for, and it decouples "can read the
  source" from "has a build."
- **Private repo.** Direct customers install from a git URL they can authenticate against. Loses the
  public-repo marketing value the README currently leans on ("star the repo to follow along").
- **Accept it.** Treat the source as effectively open and monetize on convenience and the Asset Store
  listing.

Related: `CodeScenesUnity/README.md` still says `## License — TBD`. A public repo with no LICENSE
file is all-rights-reserved by default, which is the right default for a paid product, but it should
be stated rather than left blank.
