import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

const UPDATED = "3 August 2026";

export const metadata: Metadata = {
  title: "Privacy · CodeScenes",
  description:
    "What CodeScenes collects, who processes it, and how to have it removed.",
  alternates: { canonical: `${SITE_URL}/privacy/` },
  robots: { index: true, follow: true },
};

export default function Privacy() {
  return (
    <>
      <header className="site-header" data-scrolled={false}>
        <div className="container">
          <div className="flex items-center" style={{ height: 64 }}>
            <Link href="/" aria-label="CodeScenes home">
              <Logo />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="section" style={{ paddingTop: 120 }}>
          <div className="container">
            <div className="prose-col">
              <span className="eyebrow">Privacy</span>
              <h1 className="h2" style={{ marginTop: 18 }}>
                What this site collects.
              </h1>
              <p className="muted" style={{ marginTop: 12, fontSize: "0.85rem" }}>
                Last updated {UPDATED}
              </p>

              <p className="lead" style={{ marginTop: 26 }}>
                CodeScenes is run by one person as a sole proprietorship in the
                United States. This site collects two things: anonymous usage
                measurements, and an email address if you choose to give one.
              </p>

              <h2 className="h3" style={{ marginTop: 44 }}>
                Usage measurement
              </h2>
              <p style={{ marginTop: 14 }}>
                Visits are measured with PostHog, on servers in the European
                Union. Each visit records the pages viewed, the site or campaign
                tag that referred you, your browser and device type, screen size,
                an approximate location derived from your IP address, and how you
                interacted with the page: clicks, how far you scrolled, how long
                you spent on each section, and whether the demo video played.
              </p>
              <p style={{ marginTop: 14 }}>
                No cookies are set and nothing is written to your device. Because
                nothing is stored locally, return visits are not linked to
                previous ones. There is no session recording, no cross-site
                tracking, and no advertising network involved.
              </p>

              <h2 className="h3" style={{ marginTop: 44 }}>
                Email, if you give one
              </h2>
              <p style={{ marginTop: 14 }}>
                If you sign up to be notified, your address is stored in Mailchimp,
                which operates in the United States. You will receive a
                confirmation email first, and you are only added if you click the
                link in it. The address is used to email you about CodeScenes and
                nothing else. Every email includes an unsubscribe link, and the
                address is deleted when you use it.
              </p>

              <h2 className="h3" style={{ marginTop: 44 }}>
                Who else sees it
              </h2>
              <p style={{ marginTop: 14 }}>
                PostHog and Mailchimp process this data on our behalf and are the
                only third parties involved. Nothing is sold, rented, or shared
                for advertising. If you buy a license, the payment is handled by
                Gumroad on their own site under their privacy policy, and this
                site never sees your payment details.
              </p>

              <h2 className="h3" style={{ marginTop: 44 }}>
                How long it is kept
              </h2>
              <p style={{ marginTop: 14 }}>
                Email addresses are kept until you unsubscribe. Usage measurements
                are kept under the retention settings of our PostHog project and
                are not tied to a name or an account.
              </p>

              <h2 className="h3" style={{ marginTop: 44 }}>
                Asking for your data or its removal
              </h2>
              <p style={{ marginTop: 14 }}>
                Email{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="link-quiet">
                  {CONTACT_EMAIL}
                </a>{" "}
                and say what you want: a copy of what is held, correction, or
                deletion. Unsubscribing from the list removes your address without
                needing to ask.
              </p>
              <p style={{ marginTop: 14 }}>
                If you are in the EU or UK, the lawful basis for usage measurement
                is legitimate interest in understanding whether the site works,
                and the lawful basis for the mailing list is your consent, which
                you can withdraw at any time.
              </p>

              <h2 className="h3" style={{ marginTop: 44 }}>
                Changes
              </h2>
              <p style={{ marginTop: 14 }}>
                If what is collected changes, the date at the top of this page
                changes with it.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
