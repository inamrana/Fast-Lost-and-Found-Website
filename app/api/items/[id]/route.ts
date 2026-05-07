import { NextResponse } from "next/server";
import { findMatches } from "@/lib/matching";
import { getDb } from "@/lib/store";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const item = db.items.find((candidate) => candidate.id === id);
  if (!item) return NextResponse.json({ error: "Item not found." }, { status: 404 });
  return NextResponse.json({ item, matches: findMatches(item, db.items) });
}
