import { NextResponse } from "next/server";
import { hashPassword, hashToken } from "@/lib/security";
import { updateDb } from "@/lib/store";
import { isStrongPassword } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const token = String(body.token ?? "");
  const password = String(body.password ?? "");

  if (!token) return NextResponse.json({ errors: { token: "Reset token is missing." } }, { status: 400 });
  if (!isStrongPassword(password)) {
    return NextResponse.json({ errors: { password: "Use 8+ characters with uppercase, lowercase, and a number." } }, { status: 400 });
  }

  let ok = false;
  await updateDb(async (db) => {
    const reset = db.resetTokens.find(
      (candidate) => candidate.tokenHash === hashToken(token) && !candidate.usedAt && new Date(candidate.expiresAt).getTime() > Date.now()
    );
    if (!reset) return;

    const user = db.users.find((candidate) => candidate.id === reset.userId);
    if (!user) return;

    user.passwordHash = await hashPassword(password);
    reset.usedAt = new Date().toISOString();
    ok = true;
  });

  if (!ok) return NextResponse.json({ errors: { token: "This reset link is invalid or expired." } }, { status: 400 });
  return NextResponse.json({ ok: true });
}
