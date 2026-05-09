import { promises as fs } from "fs";
import { MongoClient } from "mongodb";
import path from "path";
import type { Database } from "./types";
import { hashPassword, randomId } from "./security";

const DB_KEY = "fast-lost-found:db";
const LOCAL_DB_PATH = path.join(process.cwd(), "data", "db.json");
const MONGO_DOC_ID = "main";

declare global {
  // eslint-disable-next-line no-var
  var __FAST_FOUND_DB: Database | undefined;
  // eslint-disable-next-line no-var
  var __FAST_FOUND_MONGO: Promise<MongoClient> | undefined;
}

function hasMongo() {
  return Boolean(process.env.MONGODB_URI);
}

function hasKv() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function getMongoCollection() {
  globalThis.__FAST_FOUND_MONGO ??= new MongoClient(process.env.MONGODB_URI!).connect();
  const client = await globalThis.__FAST_FOUND_MONGO;
  return client.db(process.env.MONGODB_DB || "fast_lost_found").collection<{ _id: string; data: Database }>("app_state");
}

async function kvCommand(command: unknown[]) {
  const response = await fetch(process.env.KV_REST_API_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`KV request failed: ${response.status}`);
  }

  return (await response.json()) as { result: unknown };
}

async function createSeedDb(): Promise<Database> {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@fastfound.local").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
  const adminId = randomId("usr");
  const userId = randomId("usr");
  const now = new Date().toISOString();

  return {
    users: [
      {
        id: adminId,
        name: "FastFound Admin",
        email: adminEmail,
        passwordHash: await hashPassword(adminPassword),
        role: "admin",
        active: true,
        createdAt: now
      },
      {
        id: userId,
        name: "Demo Student",
        email: "student@fastfound.local",
        passwordHash: await hashPassword("Student@12345"),
        role: "user",
        active: true,
        createdAt: now
      }
    ],
    items: [
      {
        id: randomId("itm"),
        status: "lost",
        title: "Black leather wallet",
        category: "Wallet",
        color: "Black",
        location: "Library second floor",
        eventDate: "2026-05-05",
        description: "Slim wallet with university card and a blue metro card inside.",
        contactEmail: "student@fastfound.local",
        imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80",
        tags: ["black", "wallet", "library", "card"],
        ownerId: userId,
        ownerName: "Demo Student",
        createdAt: now
      },
      {
        id: randomId("itm"),
        status: "found",
        title: "Silver key ring",
        category: "Keys",
        color: "Silver",
        location: "Main cafeteria",
        eventDate: "2026-05-06",
        description: "Three keys on a simple ring, found near the payment counter.",
        contactEmail: "admin@fastfound.local",
        imageUrl: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=900&q=80",
        tags: ["silver", "keys", "cafeteria", "ring"],
        ownerId: adminId,
        ownerName: "FastFound Admin",
        createdAt: now
      }
    ],
    claims: [],
    resetTokens: []
  };
}

export async function getDb(): Promise<Database> {
  if (hasMongo()) {
    const collection = await getMongoCollection();
    const doc = await collection.findOne({ _id: MONGO_DOC_ID });
    if (doc?.data) return doc.data;
    const seed = await createSeedDb();
    await saveDb(seed);
    return seed;
  }

  if (hasKv()) {
    const { result } = await kvCommand(["GET", DB_KEY]);
    if (typeof result === "string") return JSON.parse(result) as Database;
    const seed = await createSeedDb();
    await saveDb(seed);
    return seed;
  }

  if (process.env.VERCEL) {
    globalThis.__FAST_FOUND_DB ??= await createSeedDb();
    return structuredClone(globalThis.__FAST_FOUND_DB);
  }

  try {
    const raw = await fs.readFile(LOCAL_DB_PATH, "utf8");
    return JSON.parse(raw) as Database;
  } catch {
    const seed = await createSeedDb();
    await saveDb(seed);
    return seed;
  }
}

export async function saveDb(db: Database) {
  if (hasMongo()) {
    const collection = await getMongoCollection();
    await collection.updateOne({ _id: MONGO_DOC_ID }, { $set: { data: db } }, { upsert: true });
    return;
  }

  if (hasKv()) {
    await kvCommand(["SET", DB_KEY, JSON.stringify(db)]);
    return;
  }

  if (process.env.VERCEL) {
    globalThis.__FAST_FOUND_DB = structuredClone(db);
    return;
  }

  await fs.mkdir(path.dirname(LOCAL_DB_PATH), { recursive: true });
  await fs.writeFile(LOCAL_DB_PATH, JSON.stringify(db, null, 2));
}

export async function updateDb(mutator: (db: Database) => void | Promise<void>) {
  const db = await getDb();
  await mutator(db);
  await saveDb(db);
  return db;
}
