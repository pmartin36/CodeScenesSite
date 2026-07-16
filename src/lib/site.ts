// Central place for site-wide constants + the placeholders Paul will fill in.
// TODO(paul): replace the placeholder handles/emails below with the real ones.

export const SITE_NAME = "CodeScenes";
export const SITE_URL = "https://codescenes.dev";

// TODO(paul): real Bluesky handle.
export const BLUESKY_HANDLE = "@codescenes.bsky.social";
export const BLUESKY_URL = "https://bsky.app/profile/codescenes.bsky.social";

// TODO(paul): real contact email.
export const CONTACT_EMAIL = "hello@codescenes.dev";

// TODO(paul): wire this to a real provider (Buttondown / ConvertKit / a Cloudflare
// Pages Function). Until then the waitlist form only shows a local success state
// and does NOT store the address anywhere. See src/components/Waitlist.tsx.
export const WAITLIST_ENDPOINT = "";
