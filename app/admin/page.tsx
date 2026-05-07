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

  return (
    <div className="page-shell">
      <section className="page-heading">
        <h1>Admin dashboard</h1>
        <p>Manage users, roles, account status, and claim verification before ownership is approved.</p>
      </section>
      <AdminPanel users={db.users.map(publicUser)} claims={claims} />
    </div>
  );
}
