import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>Fast Lost & Found</strong>
        <p>Smart item recovery for campus, offices, and public spaces.</p>
      </div>
      <div className="footer-links">
        <Link href="/contact">fastfound@example.com</Link>
        <Link href="https://github.com/" target="_blank">GitHub</Link>
        <Link href="https://vercel.com/" target="_blank">Vercel</Link>
      </div>
      <span>Copyright 2026 Fast Lost & Found</span>
    </footer>
  );
}
