// Central place for site-wide constants.

export const SITE_NAME = "CodeScenes";
export const SITE_URL = "https://codescenes.dev";

export const BLUESKY_HANDLE = "@made4me.bsky.social";
export const BLUESKY_URL = "https://bsky.app/profile/made4me.bsky.social";

export const CONTACT_EMAIL = "paul@codescenes.dev";

// Where to buy. Same product and same price on both channels: the Asset Store copy
// is licensed under Unity's own per-seat EULA, the direct copy uses a license key.
// See specs/01-licensing-backend.md and research/04-asset-store-distribution.md.
export const PRICE_USD = 15;
// Tagged so Gumroad's own referrer report can be reconciled against the
// outbound_clicked count here. The purchase itself happens off-site and is not
// visible to this site's analytics.
export const GUMROAD_PRODUCT_URL =
  "https://paulmartindev.gumroad.com/l/codescenes?utm_source=codescenes&utm_medium=site&utm_campaign=get_plugin";

// TODO(paul): real listing URL once the Asset Store submission is live.
export const ASSET_STORE_URL = "";

// UPM git install. The ?path= is required: package.json lives in com.codescenes/,
// not at the repo root, and Unity looks at the root without it.
// TODO(paul): append #v1.0.0 once a release is tagged, so installs are pinned to a
// release instead of whatever happens to be on main.
export const PACKAGE_GIT_URL =
  "https://github.com/pmartin36/CodeScenes.git?path=/com.codescenes";

// Neither channel is open yet. Flip to false to enable both CTAs in GetPluginModal.
export const CHANNELS_COMING_SOON = true;
