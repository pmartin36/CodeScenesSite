"use client";

import { useEffect, useRef, useState } from "react";
import {
  ASSET_STORE_URL,
  CHANNELS_COMING_SOON,
  GUMROAD_PRODUCT_URL,
  PACKAGE_GIT_URL,
  PRICE_USD,
} from "@/lib/site";
import { track } from "@/lib/analytics";
import { NotifyLink, NOTIFY_PROMISE } from "./NotifyLink";

const STEPS = [
  <>
    In Unity, open <strong>Window &rsaquo; Package Manager</strong>
  </>,
  <>
    Click <strong>(+)</strong>, then{" "}
    <strong>Install package from git URL</strong>
  </>,
  <>Paste this and hit Install:</>,
];

function CopyField({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <div className="copy-field">
      <code>{value}</code>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(value).then(
            () => {
              setCopied(true);
              track("install_url_copied");
            },
            () => setCopied(false),
          );
        }}
        aria-label={copied ? "Copied" : "Copy install URL"}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export function GetPluginModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    if (isOpen) {
      if (!el.open) el.showModal();
      closeRef.current?.focus();
      track("plugin_modal_viewed");
    } else if (el.open) {
      el.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const soon = CHANNELS_COMING_SOON;

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="get-plugin-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="modal-panel modal-panel-wide">
        <button
          ref={closeRef}
          type="button"
          className="modal-close"
          aria-label="Close"
          onClick={onClose}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <span className="eyebrow">Get the plugin</span>

        {soon ? (
          /* Pre-release: no install steps, because following them gets you a
             package that does not work yet. */
          <>
            <h2 id="get-plugin-title" className="h3" style={{ marginTop: 14 }}>
              Launching soon.
            </h2>
            <p style={{ marginTop: 12, fontSize: "0.95rem" }}>
              CodeScenes is still being built. Here is how it will work when it
              ships:
            </p>

            <ul className="soon-facts">
              <li>Install it free from GitHub, straight into Package Manager</li>
              <li>Fourteen days to try it, no card up front</li>
              <li>A ${PRICE_USD} license after that, covering 3 machines</li>
              <li>On the Unity Asset Store too, if you would rather buy there</li>
            </ul>

            {/* closes this dialog first, so the two <dialog>s never stack */}
            <NotifyLink
              source="plugin_modal"
              className="btn btn-primary install-cta"
              onActivate={onClose}
            />
            <p className="install-note">{NOTIFY_PROMISE}</p>
          </>
        ) : (
          <>
            <h2 id="get-plugin-title" className="h3" style={{ marginTop: 14 }}>
              Install it free. Try it for 14 days.
            </h2>

            <ol className="install-steps">
              {STEPS.map((step, i) => (
                <li key={i}>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <CopyField value={PACKAGE_GIT_URL} />

            <a
              href={GUMROAD_PRODUCT_URL}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary install-cta"
              onClick={() => track("outbound_clicked", { destination: "gumroad" })}
            >
              Purchase a license (${PRICE_USD})
            </a>
            <p className="install-note">One license covers 3 machines.</p>

            {/* No listing yet means no row: offering a choice you cannot click
                is worse than not raising it. Reappears when the URL is set. */}
            {ASSET_STORE_URL ? (
              <div className="alt-buy">
                <span>Prefer the Asset Store?</span>
                <a
                  href={ASSET_STORE_URL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track("outbound_clicked", { destination: "asset_store" })}
                >
                  Buy it there instead (${PRICE_USD})
                </a>
              </div>
            ) : null}

            <p className="modal-fineprint">
              Licenses are activated inside Unity, under Code Scenes &rsaquo;
              License.{ASSET_STORE_URL ? " An Asset Store copy needs no key." : ""}
            </p>
          </>
        )}
      </div>
    </dialog>
  );
}
