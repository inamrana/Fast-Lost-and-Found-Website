"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogIn, LogOut, Menu, PackagePlus, Search, ShieldCheck, UserPlus, X } from "lucide-react";
import { useState } from "react";
import type { PublicUser } from "@/lib/types";

export function Navbar({ user }: { user: PublicUser | null }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const links = [
    { href: "/", label: "Browse", icon: Search },
    { href: "/report", label: "Report", icon: PackagePlus },
    { href: "/about", label: "About", icon: LayoutDashboard },
    { href: "/contact", label: "Contact", icon: LayoutDashboard }
  ];

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Fast Lost and Found home">
        <span className="brand-mark">F</span>
        <span>Fast Lost & Found</span>
      </Link>

      <button className="icon-button mobile-menu" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <nav className={open ? "nav-links open" : "nav-links"} aria-label="Primary navigation">
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
            <link.icon size={17} />
            {link.label}
          </Link>
        ))}
        {user?.role === "admin" && (
          <Link href="/admin" onClick={() => setOpen(false)}>
            <ShieldCheck size={17} />
            Admin
          </Link>
        )}
      </nav>

      <div className="auth-actions">
        {user ? (
          <>
            <span className="user-pill">{user.role === "admin" ? "Admin" : user.name}</span>
            <button className="ghost-button" onClick={logout}>
              <LogOut size={17} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="ghost-button" href="/login">
              <LogIn size={17} />
              Login
            </Link>
            <Link className="primary-button compact" href="/signup">
              <UserPlus size={17} />
              Signup
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
