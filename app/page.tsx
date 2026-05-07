import Link from "next/link";
import { HomeClient } from "@/components/HomeClient";
import { getDb } from "@/lib/store";

export default async function HomePage() {
  const db = await getDb();
  const items = db.items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const categories = Array.from(new Set(items.map((item) => item.category))).sort();
  const recovered = db.claims.filter((claim) => claim.status === "approved").length;

  return (
    <div className="page-shell">
      <section className="hero">
        <div>
          <h1>Fast Lost & Found</h1>
          <p>
            Report lost or found items, search by smart tags, and let admins verify ownership claims before anything is handed over.
          </p>
          <div className="inline-actions">
            <Link className="primary-button compact" href="/report">Report item</Link>
            <Link className="ghost-button" href="/about">How it works</Link>
          </div>
          <div className="stat-strip">
            <div className="stat"><strong>{items.length}</strong><span>active reports</span></div>
            <div className="stat"><strong>{categories.length}</strong><span>categories</span></div>
            <div className="stat"><strong>{recovered}</strong><span>verified recoveries</span></div>
          </div>
        </div>
        <img
          className="hero-art"
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80"
          alt="People checking recovered personal items on a desk"
        />
      </section>

      <HomeClient items={items} categories={categories} />
    </div>
  );
}
