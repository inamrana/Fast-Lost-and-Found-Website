import { NextResponse } from "next/server";
import { createResetToken, hashToken, normalizeEmail, randomId } from "@/lib/security";
import { updateDb } from "@/lib/store";
import { isEmail, sanitize } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = normalizeEmail(sanitize(body.email));
  if (!isEmail(email)) return NextResponse.json({ errors: { email: "Enter a valid email." } }, { status: 400 });

  let resetLink: string | null = null;
  await updateDb((db) => {
    const user = db.users.find((candidate) => candidate.email === email && candidate.active);
    if (!user) return;

    const token = createResetToken();
    db.resetTokens.push({
      id: randomId("rst"),
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
      createdAt: new Date().toISOString()
    });
    resetLink = `/reset-password?token=${token}`;
  });

  return NextResponse.json({
    ok: true,
    message: "If the email exists, a reset link has been created.",
    resetLink
  });
}
