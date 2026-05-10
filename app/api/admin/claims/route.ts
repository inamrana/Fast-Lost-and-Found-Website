import { NextResponse } from "next/server";
import { readCurrentUser } from "@/lib/auth";
import { getDb, updateDb } from "@/lib/store";
import type { ClaimStatus } from "@/lib/types";
import { sanitize } from "@/lib/validation";

export async function GET() {
  const admin = await readCurrentUser();
  if (admin?.role !== "admin") return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  const db = await getDb();
  return NextResponse.json({
    claims: db.claims
      .map((claim) => ({
        ...claim,
        item: db.items.find((item) => item.id === claim.itemId)
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  });
}

export async function PATCH(request: Request) {
  const admin = await readCurrentUser();
  if (admin?.role !== "admin") return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  const id = sanitize(body.id);
  const status = sanitize(body.status) as ClaimStatus;
  if (status !== "approved" && status !== "rejected") {
    return NextResponse.json({ errors: { status: "Choose approved or rejected." } }, { status: 400 });
  }

  let updated;
  await updateDb((db) => {
    const claim = db.claims.find((candidate) => candidate.id === id);
    if (!claim) return;
    
    claim.status = status;
    claim.reviewedAt = new Date().toISOString();
    claim.reviewedBy = admin.id;
    updated = claim;

    if (status === "approved") {
      // Remove the item from the active items list
      db.items = db.items.filter((item) => item.id !== claim.itemId);
      
      // Also automatically reject any other pending claims for this same item
      db.claims.forEach((other) => {
        if (other.id !== claim.id && other.itemId === claim.itemId && other.status === "pending") {
          other.status = "rejected";
          other.reviewedAt = new Date().toISOString();
          other.reviewedBy = admin.id;
        }
      });
    }
  });

  if (!updated) return NextResponse.json({ error: "Claim not found." }, { status: 404 });
  return NextResponse.json({ claim: updated });
}
