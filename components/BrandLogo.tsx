export function BrandLogo() {
  return (
    <span className="brand-logo" aria-hidden="true">
      <svg viewBox="0 0 64 64" role="img">
        <path className="logo-shield" d="M32 5 53 14v17c0 13.5-8.2 23.6-21 28-12.8-4.4-21-14.5-21-28V14L32 5Z" />
        <path className="logo-pin" d="M32 17c-7 0-12 5-12 11.8 0 8.2 9 16 11.1 17.7.5.4 1.3.4 1.8 0C35 44.8 44 37 44 28.8 44 22 39 17 32 17Z" />
        <circle className="logo-hole" cx="32" cy="28.5" r="5" />
        <path className="logo-check" d="m24 43 5 5 12-13" />
      </svg>
      <span className="brand-words">
        <strong>FAST</strong>
        <small>Lost & Found</small>
      </span>
    </span>
  );
}
