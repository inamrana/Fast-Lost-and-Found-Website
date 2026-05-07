import { NextResponse } from "next/server";
import { makeSessionCookie, publicUser, SESSION_COOKIE } from "@/lib/auth";
import { getDb } from "@/lib/store";
import { normalizeEmail, verifyPassword } from "@/lib/security";
import { isEmail, sanitize } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = normalizeEmail(sanitize(body.email));
  const password = String(body.password ?? "");
  const remember = Boolean(body.remember);

  if (!isEmail(email) || !password) {
    return NextResponse.json({ errors: { email: "Enter your email and password." } }, { status: 400 });
  }

  const db = await getDb();
  const user = db.users.find((candidate) => candidate.email === email);
  if (!user || !user.active || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ errors: { email: "Invalid email or password." } }, { status: 401 });
  }

  const session = makeSessionCookie(user.id, user.role, remember);
  const response = NextResponse.json({ user: publicUser(user) });
  response.cookies.set(SESSION_COOKIE, session.value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: session.maxAge
  });
  return response;
}
