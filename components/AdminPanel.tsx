"use client";

import { useRouter } from "next/navigation";
import { BarChart3, ClipboardList, Clock, Users, CheckCircle } from "lucide-react";
import type { Claim, Item, PublicUser } from "@/lib/types";

type ClaimWithItem = Claim & { item?: Item };

export function AdminPanel({ 
  users, 
  claims, 
  stats, 
  recentItems 
}: { 
  users: PublicUser[]; 
  claims: ClaimWithItem[];
  stats: {
    totalItems: number;
    lostItems: number;
    foundItems: number;
    totalClaims: number;
    pendingClaims: number;
    resolvedClaims: number;
  };
  recentItems: Item[];
}) {
  const router = useRouter();

  async function updateUser(id: string, patch: Partial<PublicUser>) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch })
    });
    router.refresh();
  }

  async function reviewClaim(id: string, status: "approved" | "rejected") {
    await fetch("/api/admin/claims", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });
    router.refresh();
  }

  return (
    <div className="form-stack">
      <section className="stat-strip">
        <div className="stat">
          <div className="row-between">
            <small>Total Items</small>
            <BarChart3 size={18} color="var(--blue)" />
          </div>
          <strong>{stats.totalItems}</strong>
          <p className="meta-line">{stats.lostItems} Lost / {stats.foundItems} Found</p>
        </div>
        <div className="stat">
          <div className="row-between">
            <small>Active Claims</small>
            <Clock size={18} color="var(--gold)" />
          </div>
          <strong>{stats.pendingClaims}</strong>
          <p className="meta-line">Pending verification</p>
        </div>
        <div className="stat">
          <div className="row-between">
            <small>Resolved</small>
            <CheckCircle size={18} color="var(--green)" />
          </div>
          <strong>{stats.resolvedClaims}</strong>
          <p className="meta-line">Ownership confirmed</p>
        </div>
      </section>

      <div className="admin-tabs">
        <section className="panel">
          <div className="row-between">
            <h2 className="section-title">Users</h2>
            <Users size={20} color="var(--muted)" />
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="brand-words">
                        <strong>{user.name}</strong>
                        <small>{user.active ? "Active" : "Disabled"}</small>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td><span className="tag-chip">{user.role}</span></td>
                    <td className="inline-actions">
                      <button className="mini-button" onClick={() => updateUser(user.id, { active: !user.active })}>
                        {user.active ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="row-between">
            <h2 className="section-title">Pending Claims</h2>
            <ClipboardList size={20} color="var(--muted)" />
          </div>
          <div className="form-stack">
            {claims.filter(c => c.status === 'pending').length ? (
              claims.filter(c => c.status === 'pending').map((claim) => (
                <article className="panel" key={claim.id} style={{ boxShadow: 'none', border: '1px solid var(--line)', background: 'var(--paper)' }}>
                  <div className="row-between">
                    <strong>{claim.item?.title || "Removed item"}</strong>
                    <span className="tag-chip">{claim.status}</span>
                  </div>
                  <p style={{ margin: '8px 0', fontSize: '0.95rem' }}>{claim.message}</p>
                  <p className="meta-line">By {claim.userName}</p>
                  <div className="inline-actions" style={{ marginTop: '12px' }}>
                    <button className="mini-button text-link" onClick={() => reviewClaim(claim.id, "approved")}>Approve</button>
                    <button className="mini-button" onClick={() => reviewClaim(claim.id, "rejected")} style={{ color: 'var(--red)' }}>Reject</button>
                  </div>
                </article>
              ))
            ) : (
              <p className="empty-state">No pending claim requests.</p>
            )}
          </div>
        </section>
      </div>

      <section className="panel">
        <h2 className="section-title">Recent Activity</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Status</th>
                <th>Category</th>
                <th>Location</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentItems.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.title}</strong></td>
                  <td><span className={`status-badge ${item.status}`}>{item.status}</span></td>
                  <td>{item.category}</td>
                  <td>{item.location}</td>
                  <td><small>{new Date(item.createdAt).toLocaleDateString()}</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
