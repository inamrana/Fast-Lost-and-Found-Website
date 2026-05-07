import { NextResponse } from "next/server";
import { readCurrentUser } from "@/lib/auth";
import { randomId } from "@/lib/security";
import { updateDb } from "@/lib/store";
import { sanitize } from "@/lib/validation";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await readCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const message = sanitize(body.message);
  if (message.length < 15) return NextResponse.json({ errors: { message: "Add at least 15 characters of proof." } }, { status: 400 });

  let created;
  let notFound = false;
  await updateDb((db) => {
    const item = db.items.find((candidate) => candidate.id === id);
    if (!item) {
      notFound = true;
      return;
    }
    created = {
      id: randomId("clm"),
      itemId: id,
      userId: user.id,
      userName: user.name,
      message,
      status: "pending" as const,
      createdAt: new Date().toISOString()
    };
    db.claims.push(created);
  });

  if (notFound) return NextResponse.json({ error: "Item not found." }, { status: 404 });
  return NextResponse.json({ claim: created }, { status: 201 });
}
