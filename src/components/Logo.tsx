export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`}>
      <LogoMark />
      <span>
        Code<span className="text-accent">Scenes</span>
      </span>
    </span>
  );
}

export function LogoMark({ size = 22 }: { size?: number }) {
  // Isometric cube (the "scene") drawn in accent strokes — code + space.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <path
        d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7L12 2.5Z"
        stroke="var(--accent)"
        strokeWidth="1.4"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <path
        d="M3.7 7 12 11.6 20.3 7M12 11.6V21"
        stroke="var(--accent)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
