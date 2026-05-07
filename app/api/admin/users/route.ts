import { NextResponse } from "next/server";
import { publicUser, readCurrentUser } from "@/lib/auth";
import { getDb, updateDb } from "@/lib/store";
import type { UserRole } from "@/lib/types";
import { sanitize } from "@/lib/validation";

export async function GET() {
  const admin = await readCurrentUser();
  if (admin?.role !== "admin") return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  const db = await getDb();
  return NextResponse.json({ users: db.users.map(publicUser) });
}

export async function PATCH(request: Request) {
  const admin = await readCurrentUser();
  if (admin?.role !== "admin") return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  const id = sanitize(body.id);
  const role = sanitize(body.role) as UserRole;
  const active = typeof body.active === "boolean" ? body.active : undefined;

  let updated;
  await updateDb((db) => {
    const user = db.users.find((candidate) => candidate.id === id);
    if (!user) return;
    if (role === "admin" || role === "user") user.role = role;
    if (typeof active === "boolean") user.active = active;
    updated = publicUser(user);
  });

  if (!updated) return NextResponse.json({ error: "User not found." }, { status: 404 });
  return NextResponse.json({ user: updated });
}
