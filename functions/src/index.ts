import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as logger from "firebase-functions/logger";

const MAILCHIMP_API_KEY = defineSecret("MAILCHIMP_API_KEY");

const AUDIENCE_ID = "5618732e33";

// "pending" sends Mailchimp's confirmation email and the contact stays unconfirmed
// until they click it. "subscribed" adds them to the list immediately.
const OPT_IN_STATUS: "pending" | "subscribed" = "pending";

const TAG = "prelaunch";

const ALLOWED_ORIGINS = new Set([
  "https://codescenes.dev",
  "https://www.codescenes.dev",
  "http://localhost:3000",
]);

// Per-instance, per-IP throttle. Resets whenever the instance is recycled, so it
// caps a single client hammering a warm instance rather than a distributed flood.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT_MAX;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const subscribe = onRequest(
  { region: "us-central1", secrets: [MAILCHIMP_API_KEY], cors: false, maxInstances: 5 },
  async (req, res) => {
    const origin = req.get("origin");
    if (origin && ALLOWED_ORIGINS.has(origin)) {
      res.set("Access-Control-Allow-Origin", origin);
      res.set("Vary", "Origin");
    }

    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({ message: "Method not allowed." });
      return;
    }

    const body = (req.body ?? {}) as { email?: unknown; company?: unknown };

    // Honeypot: the form's hidden `company` field is invisible to people and
    // irresistible to bots. Report success without touching Mailchimp.
    if (typeof body.company === "string" && body.company.trim() !== "") {
      res.status(200).json({ state: OPT_IN_STATUS });
      return;
    }

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!EMAIL_RE.test(email) || email.length > 254) {
      res.status(400).json({ message: "That doesn't look like a valid email address." });
      return;
    }

    const ip = req.ip ?? "unknown";
    if (rateLimited(ip)) {
      res.status(429).json({ message: "Too many attempts. Try again in a minute." });
      return;
    }

    const key = MAILCHIMP_API_KEY.value();
    const dc = key.split("-").pop();
    if (!dc || dc === key) {
      logger.error("MAILCHIMP_API_KEY has no datacenter suffix");
      res.status(500).json({ message: "Subscriptions are temporarily unavailable." });
      return;
    }

    let mc: Response;
    try {
      mc = await fetch(
        `https://${dc}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_address: email,
            status: OPT_IN_STATUS,
            tags: [TAG],
          }),
        },
      );
    } catch (err) {
      logger.error("mailchimp request failed", err);
      res.status(502).json({ message: "Subscriptions are temporarily unavailable." });
      return;
    }

    if (mc.ok) {
      res.status(200).json({ state: OPT_IN_STATUS });
      return;
    }

    const detail = (await mc.json().catch(() => ({}))) as { title?: string };

    // Mailchimp returns 400 "Member Exists" both for a live contact and for one who
    // previously unsubscribed. Treating it as success keeps the form idempotent and
    // avoids resubscribing anyone who opted out.
    if (mc.status === 400 && detail.title === "Member Exists") {
      res.status(200).json({ state: "already" });
      return;
    }

    if (mc.status === 400 && detail.title === "Invalid Resource") {
      res.status(400).json({ message: "Mailchimp rejected that address." });
      return;
    }

    logger.error("mailchimp error", { status: mc.status, title: detail.title });
    res.status(502).json({ message: "Subscriptions are temporarily unavailable." });
  },
);
