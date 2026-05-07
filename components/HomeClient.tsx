"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ItemCard } from "@/components/ItemCard";
import type { Item } from "@/lib/types";

export function HomeClient({ items, categories }: { items: Item[]; categories: string[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return items.filter((item) => {
      const matchesStatus = status === "all" || item.status === status;
      const matchesCategory = !category || item.category === category;
      const haystack = [item.title, item.category, item.color, item.location, item.description, item.tags.join(" ")].join(" ").toLowerCase();
      return matchesStatus && matchesCategory && (!q || haystack.includes(q));
    });
  }, [items, query, status, category]);

  return (
    <>
      <section className="toolbar" aria-label="Search lost and found items">
        <label className="field">
          <span>Search</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="wallet, black, library..." />
        </label>
        <label className="field">
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </label>
        <label className="field">
          <span>Category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Any category</option>
            {categories.map((entry) => (
              <option key={entry} value={entry}>{entry}</option>
            ))}
          </select>
        </label>
      </section>

      {filtered.length ? (
        <section className="grid">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </section>
      ) : (
        <div className="panel empty-state">
          <Search size={28} />
          <p>No matching item yet. Try another keyword or report a new lost/found item.</p>
        </div>
      )}
    </>
  );
}
