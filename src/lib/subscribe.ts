// Email capture for the pre-launch list. Posts to the `subscribe` Cloud Function,
// which holds the Mailchimp API key server-side. `firebase.json` rewrites this path
// to the function so the request is same-origin in production.
export const SUBSCRIBE_ENDPOINT = "/api/subscribe";

export type SubscribeResult =
  | { ok: true; state: "pending" | "subscribed" | "already" }
  | { ok: false; message: string };

const GENERIC_ERROR = "Something went wrong. Please try again.";

export async function subscribe(
  email: string,
  honeypot: string,
): Promise<SubscribeResult> {
  let res: Response;
  try {
    res = await fetch(SUBSCRIBE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, company: honeypot }),
    });
  } catch {
    return { ok: false, message: "Network error. Check your connection." };
  }

  let body: { state?: string; message?: string } = {};
  try {
    body = await res.json();
  } catch {
    return { ok: false, message: GENERIC_ERROR };
  }

  if (!res.ok) {
    return { ok: false, message: body.message || GENERIC_ERROR };
  }

  const state = body.state;
  if (state === "pending" || state === "subscribed" || state === "already") {
    return { ok: true, state };
  }
  return { ok: false, message: GENERIC_ERROR };
}
