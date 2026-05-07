"use client";

import { useRouter } from "next/navigation";
import type { Claim, Item, PublicUser } from "@/lib/types";

type ClaimWithItem = Claim & { item?: Item };

export function AdminPanel({ users, claims }: { users: PublicUser[]; claims: ClaimWithItem[] }) {
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
    <div className="admin-tabs">
      <section className="panel">
        <h2 className="section-title">Users</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.active ? "Active" : "Disabled"}</td>
                  <td className="inline-actions">
                    <button className="mini-button" onClick={() => updateUser(user.id, { active: !user.active })}>
                      {user.active ? "Deactivate" : "Activate"}
                    </button>
                    <button className="mini-button" onClick={() => updateUser(user.id, { role: user.role === "admin" ? "user" : "admin" })}>
                      Make {user.role === "admin" ? "User" : "Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2 className="section-title">Claim verification</h2>
        <div className="form-stack">
          {claims.length ? (
            claims.map((claim) => (
              <article className="panel" key={claim.id}>
                <div className="row-between">
                  <strong>{claim.item?.title || "Removed item"}</strong>
                  <span className="tag-chip">{claim.status}</span>
                </div>
                <p>{claim.message}</p>
                <p className="meta-line">Requested by {claim.userName}</p>
                {claim.status === "pending" && (
                  <div className="inline-actions">
                    <button className="mini-button" onClick={() => reviewClaim(claim.id, "approved")}>Approve</button>
                    <button className="mini-button" onClick={() => reviewClaim(claim.id, "rejected")}>Reject</button>
                  </div>
                )}
              </article>
            ))
          ) : (
            <p className="empty-state">No claim requests yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
