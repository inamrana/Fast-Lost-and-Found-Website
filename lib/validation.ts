export type ValidationResult<T> = { ok: true; data: T } | { ok: false; errors: Record<string, string> };

export function sanitize(value: unknown) {
  return String(value ?? "").trim().replace(/[<>]/g, "");
}

export function isEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password: string) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
}

export function requireFields(fields: Record<string, string>) {
  const errors: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (!value.trim()) errors[key] = "This field is required.";
  }
  return errors;
}
