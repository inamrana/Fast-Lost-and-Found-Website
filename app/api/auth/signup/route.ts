import { NextResponse } from "next/server";
import { makeSessionCookie, publicUser, SESSION_COOKIE } from "@/lib/auth";
import { updateDb } from "@/lib/store";
import { hashPassword, normalizeEmail, randomId } from "@/lib/security";
import type { User } from "@/lib/types";
import { isEmail, isStrongPassword, sanitize } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const name = sanitize(body.name);
  const email = normalizeEmail(sanitize(body.email));
  const password = String(body.password ?? "");

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Name is required.";
  if (!isEmail(email)) errors.email = "Enter a valid email address.";
  if (!isStrongPassword(password)) errors.password = "Use 8+ characters with uppercase, lowercase, and a number.";
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 400 });

  let createdUser: User | undefined;
  await updateDb(async (db) => {
    if (db.users.some((user) => user.email === email)) {
      errors.email = "An account with this email already exists.";
      return;
    }

    const now = new Date().toISOString();
    createdUser = {
      id: randomId("usr"),
      name,
      email,
      passwordHash: await hashPassword(password),
      role: "user" as const,
      active: true,
      createdAt: now
    };
    db.users.push(createdUser);
  });

  if (Object.keys(errors).length || !createdUser) return NextResponse.json({ errors }, { status: 409 });

  const session = makeSessionCookie(createdUser.id, createdUser.role, false);
  const response = NextResponse.json({ user: publicUser(createdUser) }, { status: 201 });
  response.cookies.set(SESSION_COOKIE, session.value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: session.maxAge
  });
  return response;
}
