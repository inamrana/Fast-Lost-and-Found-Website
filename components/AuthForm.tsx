"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.remember = form.get("remember") === "on" ? "true" : "";

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, remember: form.get("remember") === "on" })
    });
    const result = await response.json();
    setBusy(false);

    if (!response.ok) {
      setErrors(result.errors || { form: "Something went wrong." });
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form className="auth-panel form-stack" onSubmit={submit}>
      <h1>{mode === "login" ? "Login" : "Create account"}</h1>
      {mode === "signup" && (
        <label className="field">
          <span>Name</span>
          <input name="name" minLength={2} required />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </label>
      )}
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" required />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </label>
      <label className="field">
        <span>Password</span>
        <input name="password" type="password" minLength={8} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}" required />
        {errors.password && <p className="error-text">{errors.password}</p>}
      </label>
      {mode === "login" && (
        <label className="checkbox-row">
          <input type="checkbox" name="remember" />
          Remember me
        </label>
      )}
      {errors.form && <p className="error-text">{errors.form}</p>}
      <button className="primary-button" disabled={busy}>{busy ? "Please wait..." : mode === "login" ? "Login" : "Sign up"}</button>
      {mode === "login" ? (
        <p>
          New here? <Link className="text-link" href="/signup">Create an account</Link> or{" "}
          <Link className="text-link" href="/forgot-password">reset password</Link>.
        </p>
      ) : (
        <p>
          Already have an account? <Link className="text-link" href="/login">Login</Link>.
        </p>
      )}
    </form>
  );
}
