"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { ItemCard } from "@/components/ItemCard";
import type { Item } from "@/lib/types";

export function ReportForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [created, setCreated] = useState<Item | null>(null);
  const [matches, setMatches] = useState<Array<{ item: Item; score: number }>>([]);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    setBusy(false);

    if (!response.ok) {
      setErrors(result.errors || { form: result.error || "Unable to save item." });
      return;
    }

    setCreated(result.item);
    setMatches(result.matches || []);
    event.currentTarget.reset();
  }

  return (
    <div className="report-layout">
      <form className="panel form-stack" onSubmit={submit}>
        <div className="form-row">
          <label className="field">
            <span>Status</span>
            <select name="status" required>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
            {errors.status && <p className="error-text">{errors.status}</p>}
          </label>
          <label className="field">
            <span>Category</span>
            <input name="category" placeholder="Phone, wallet, keys" required />
            {errors.category && <p className="error-text">{errors.category}</p>}
          </label>
        </div>
        <label className="field">
          <span>Title</span>
          <input name="title" placeholder="Black wallet near library" required />
          {errors.title && <p className="error-text">{errors.title}</p>}
        </label>
        <div className="form-row">
          <label className="field">
            <span>Color</span>
            <input name="color" required />
            {errors.color && <p className="error-text">{errors.color}</p>}
          </label>
          <label className="field">
            <span>Date</span>
            <input name="eventDate" type="date" required />
            {errors.eventDate && <p className="error-text">{errors.eventDate}</p>}
          </label>
        </div>
        <label className="field">
          <span>Location</span>
          <input name="location" placeholder="Main cafeteria, Block A" required />
          {errors.location && <p className="error-text">{errors.location}</p>}
        </label>
        <label className="field">
          <span>Image URL</span>
          <input name="imageUrl" type="url" placeholder="https://..." />
        </label>
        <label className="field">
          <span>Contact email</span>
          <input name="contactEmail" type="email" required />
          {errors.contactEmail && <p className="error-text">{errors.contactEmail}</p>}
        </label>
        <label className="field">
          <span>Description</span>
          <textarea name="description" minLength={12} required />
          {errors.description && <p className="error-text">{errors.description}</p>}
        </label>
        {errors.form && <p className="error-text">{errors.form}</p>}
        <button className="primary-button" disabled={busy}>
          <Send size={17} />
          {busy ? "Saving..." : "Submit report"}
        </button>
      </form>

      <aside className="panel form-stack">
        <h2 className="section-title">Smart matches</h2>
        {created && <p className="success-text">Report saved. The system checked type, color, location, and tags.</p>}
        {matches.length ? (
          matches.map((match) => <ItemCard key={match.item.id} item={match.item} score={match.score} />)
        ) : (
          <p className="empty-state">Matches will appear here after a report is submitted.</p>
        )}
      </aside>
    </div>
  );
}
