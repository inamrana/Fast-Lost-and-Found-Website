import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { PublicUser, SessionPayload, UserRole } from "./types";
import { getDb } from "./store";
import { signSession, verifySession } from "./security";

export const SESSION_COOKIE = "fastfound_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 30;
export const REMEMBER_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function publicUser(user: { passwordHash: string } & PublicUser): PublicUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safe } = user;
  return safe;
}

export function makeSessionCookie(userId: string, role: UserRole, remember: boolean) {
  const maxAge = remember ? REMEMBER_MAX_AGE_SECONDS : SESSION_MAX_AGE_SECONDS;
  const exp = Math.floor(Date.now() / 1000) + maxAge;
  return {
    value: signSession({ userId, role, exp }),
    maxAge
  };
}

export async function readCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const payload = verifySession<SessionPayload>(token);
  if (!payload || payload.exp < Math.floor(Date.now() / 1000)) return null;

  const db = await getDb();
  const user = db.users.find((candidate) => candidate.id === payload.userId && candidate.active);
  return user ? publicUser(user) : null;
}

export async function requireUser() {
  const user = await readCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/?error=forbidden");
  return user;
}
