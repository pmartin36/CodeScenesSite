// Central place for site-wide constants.

export const SITE_NAME = "CodeScenes";
export const SITE_URL = "https://codescenes.dev";

export const BLUESKY_HANDLE = "@made4me.bsky.social";
export const BLUESKY_URL = "https://bsky.app/profile/made4me.bsky.social";

export const CONTACT_EMAIL = "paul@codescenes.dev";

// TODO(paul): wire this to a real provider (Buttondown / ConvertKit / a Cloudflare
// Pages Function). Until then the waitlist form only shows a local success state
// and does NOT store the address anywhere. See src/components/Waitlist.tsx.
export const WAITLIST_ENDPOINT = "";
