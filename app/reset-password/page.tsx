import { ResetPasswordForm } from "@/components/PasswordResetForms";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  return token ? (
    <ResetPasswordForm token={token} />
  ) : (
    <div className="auth-panel">
      <h1>Reset link missing</h1>
      <p className="empty-state">Generate a new password reset link from the forgot password page.</p>
    </div>
  );
}
