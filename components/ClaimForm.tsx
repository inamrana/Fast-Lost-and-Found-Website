"use client";

import { FormEvent, useState } from "react";

export function ClaimForm({ itemId }: { itemId: string }) {
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setError("");
    const response = await fetch(`/api/items/${itemId}/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const result = await response.json();

    if (!response.ok) {
      setError(result.errors?.message || result.error || "Unable to submit claim.");
      return;
    }

    setMessage("");
    setNotice("Claim submitted for admin verification.");
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <label className="field">
        <span>Ownership proof</span>
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} minLength={15} required />
      </label>
      {error && <p className="error-text">{error}</p>}
      {notice && <p className="success-text">{notice}</p>}
      <button className="primary-button">Submit claim</button>
    </form>
  );
}
