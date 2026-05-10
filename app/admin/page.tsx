import { AdminPanel } from "@/components/AdminPanel";
import { requireAdmin } from "@/lib/auth";
import { publicUser } from "@/lib/auth";
import { getDb } from "@/lib/store";

export default async function AdminPage() {
  await requireAdmin();
  const db = await getDb();
  
  const claims = db.claims
    .map((claim) => ({ ...claim, item: db.items.find((item) => item.id === claim.itemId) }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const stats = {
    totalItems: db.items.length,
    lostItems: db.items.filter(i => i.status === 'lost').length,
    foundItems: db.items.filter(i => i.status === 'found').length,
    totalClaims: db.claims.length,
    pendingClaims: db.claims.filter(c => c.status === 'pending').length,
    resolvedClaims: db.claims.filter(c => c.status !== 'pending').length,
  };

  const recentItems = [...db.items]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <div className="page-shell">
      <section className="page-heading">
        <h1>Admin dashboard</h1>
        <p>Manage users, roles, account status, and analytics insights.</p>
      </section>
      <AdminPanel 
        users={db.users.map(publicUser)} 
        claims={claims} 
        stats={stats}
        recentItems={recentItems}
      />
    </div>
  );
}
