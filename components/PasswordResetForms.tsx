"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export function ForgotPasswordForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resetLink, setResetLink] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setResetLink("");
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) {
      setErrors(result.errors || {});
      return;
    }
    setResetLink(result.resetLink || "");
  }

  return (
    <form className="auth-panel form-stack" onSubmit={submit}>
      <h1>Reset password</h1>
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" required />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </label>
      <button className="primary-button">Create reset link</button>
      {resetLink && (
        <p className="success-text">
          Demo reset link: <Link className="text-link" href={resetLink}>open secure token link</Link>
        </p>
      )}
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirm") || "");
    if (password !== confirm) {
      setErrors({ confirm: "Passwords do not match." });
      return;
    }

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    });
    const result = await response.json();
    if (!response.ok) {
      setErrors(result.errors || {});
      return;
    }
    setDone(true);
  }

  return (
    <form className="auth-panel form-stack" onSubmit={submit}>
      <h1>Choose new password</h1>
      <label className="field">
        <span>New password</span>
        <input
          name="password"
          type="password"
          minLength={8}
          pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}"
          title="Use at least 8 characters with uppercase, lowercase, and a number."
          required
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
      </label>
      <label className="field">
        <span>Confirm password</span>
        <input name="confirm" type="password" required />
        {errors.confirm && <p className="error-text">{errors.confirm}</p>}
      </label>
      {errors.token && <p className="error-text">{errors.token}</p>}
      <button className="primary-button">Update password</button>
      {done && <Link className="text-link" href="/login">Password updated. Login now.</Link>}
    </form>
  );
}
