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
  // Isometric cube (the "scene") with a semicolon on the right face — matches the favicon.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <path
        d="M16 2 29 9v14L16 30 3 23V9L16 2Z"
        stroke="var(--accent)"
        strokeWidth="2.2"
        strokeLinejoin="round"
        opacity="0.4"
      />
      <path
        d="M3 9 16 16 29 9M16 16V30"
        stroke="var(--accent)"
        strokeWidth="2.4"
        strokeLinejoin="round"
        opacity="0.4"
      />
      <g transform="matrix(13,-7,0,14,16,16)" fill="var(--accent)">
        <circle cx="0.5" cy="0.27" r="0.085" />
        <path
          d="M0.5 0.5 C0.518 0.61 0.505 0.7 0.4 0.73"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="0.13"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
