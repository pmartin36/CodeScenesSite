import { Logo } from "./Logo";
import { BLUESKY_URL, CONTACT_EMAIL } from "@/lib/site";

const YEAR = new Date().getFullYear();

const COLS: { title: string; links: { label: string; href: string; ext?: boolean }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how" },
      { label: "Origin story", href: "#origin" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Help", href: "#help" },
      { label: "Sources", href: "#sources" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Bluesky", href: BLUESKY_URL, ext: true },
      { label: "Email", href: `mailto:${CONTACT_EMAIL}`, ext: true },
    ],
  },
];

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
      <div className="container" style={{ paddingBlock: 56 }}>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="muted" style={{ marginTop: 16, maxWidth: 320, fontSize: "0.9rem" }}>
              Build your Unity scenes in code. Edit them in the editor. Keep both in
              sync, automatically.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <div
                className="eyebrow"
                style={{ color: "var(--text-muted)", justifyContent: "flex-start", marginBottom: 14 }}
              >
                {col.title}
              </div>
              <ul className="flex flex-col gap-2.5" style={{ listStyle: "none", padding: 0 }}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="nav-link"
                      style={{ fontSize: "0.9rem" }}
                      {...(l.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="hairline" style={{ marginBlock: 36 }} />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="muted" style={{ fontSize: "0.8rem" }}>
            © {YEAR} CodeScenes. All rights reserved.
          </p>
          <p className="muted" style={{ fontSize: "0.75rem", maxWidth: 620, lineHeight: 1.6 }}>
            CodeScenes is not affiliated with, sponsored by, or endorsed by Unity
            Technologies or Anthropic. Unity is a trademark of Unity Technologies;
            all other trademarks are the property of their respective owners.
            Comparisons reflect our own testing and opinion as of publication.
          </p>
        </div>
      </div>
    </footer>
  );
}
