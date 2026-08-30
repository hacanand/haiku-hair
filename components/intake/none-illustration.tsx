/** Drawn fallback for options with no supplied photo (currently just
 *  "None" / "No known family history" style answers) — a soft all-clear
 *  checkmark that matches the app's own palette instead of a broken image
 *  or an empty gray tile. */
export function NoneIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="None">
      <defs>
        <radialGradient id="none-illustration-bg" cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor="var(--secondary)" />
          <stop offset="100%" stopColor="var(--muted)" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill="url(#none-illustration-bg)" />
      <circle cx="100" cy="102" r="48" fill="var(--card)" stroke="var(--success)" strokeWidth="7" />
      <path
        d="M77 103l16 16 31-35"
        fill="none"
        stroke="var(--success)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
