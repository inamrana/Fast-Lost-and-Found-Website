import { NextResponse } from "next/server";
import { readCurrentUser } from "@/lib/auth";
import { buildTags, findMatches } from "@/lib/matching";
import { randomId } from "@/lib/security";
import { getDb, updateDb } from "@/lib/store";
import type { Item, ItemStatus } from "@/lib/types";
import { isEmail, sanitize } from "@/lib/validation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const db = await getDb();
  const q = searchParams.get("q")?.toLowerCase().trim() || "";
  const status = searchParams.get("status");
  const category = searchParams.get("category")?.toLowerCase().trim() || "";

  const items = db.items
    .filter((item) => !status || status === "all" || item.status === status)
    .filter((item) => !category || item.category.toLowerCase().includes(category))
    .filter((item) => {
      if (!q) return true;
      return [item.title, item.category, item.color, item.location, item.description, item.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(q);
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return NextResponse.json({
    items,
    categories: Array.from(new Set(db.items.map((item) => item.category))).sort()
  });
}

export async function POST(request: Request) {
  const user = await readCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const status = sanitize(body.status) as ItemStatus;
  const title = sanitize(body.title);
  const category = sanitize(body.category);
  const color = sanitize(body.color);
  const location = sanitize(body.location);
  const eventDate = sanitize(body.eventDate);
  const description = sanitize(body.description);
  const contactEmail = sanitize(body.contactEmail || user.email);
  const imageUrl = sanitize(body.imageUrl) || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80";

  const errors: Record<string, string> = {};
  if (status !== "lost" && status !== "found") errors.status = "Choose lost or found.";
  for (const [key, value] of Object.entries({ title, category, color, location, eventDate, description })) {
    if (!value) errors[key] = "This field is required.";
  }
  if (!isEmail(contactEmail)) errors.contactEmail = "Enter a valid contact email.";
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 400 });

  let created: Item | undefined;
  let matches: ReturnType<typeof findMatches> = [];
  await updateDb((db) => {
    created = {
      id: randomId("itm"),
      status,
      title,
      category,
      color,
      location,
      eventDate,
      description,
      contactEmail,
      imageUrl,
      tags: buildTags({ title, category, color, location, description }),
      ownerId: user.id,
      ownerName: user.name,
      createdAt: new Date().toISOString()
    };
    matches = findMatches(created, db.items);
    db.items.push(created);
  });

  return NextResponse.json({ item: created, matches }, { status: 201 });
}
