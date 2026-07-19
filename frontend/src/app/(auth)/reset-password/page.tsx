"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";
import { KeyRound, CheckCircle2, Loader2 } from "lucide-react";

function ResetPasswordForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const email        = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const inputCls = "w-full h-10 px-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors disabled:opacity-50";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); setError(null);
    const fd              = new FormData(e.currentTarget);
    const reset_code      = fd.get("code")            as string;
    const new_password    = fd.get("password")        as string;
    const verify_password = fd.get("verify_password") as string;
    if (new_password !== verify_password) { setError("Passwords do not match."); setLoading(false); return; }
    try {
      await authService.resetPassword({ email, reset_code, new_password, verify_password });
      setSuccess(true);
      setTimeout(() => router.push("/sign-in"), 3000);
    } catch (err) {
      setError((err as Error).message || "Failed to reset password.");
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="size-12 rounded-full bg-green-100 border border-green-200 flex items-center justify-center mx-auto">
          <CheckCircle2 className="size-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Password updated!</h1>
          <p className="text-sm text-muted-foreground mt-1">Redirecting you to sign in…</p>
        </div>
        <Link href="/sign-in">
          <button className="w-full h-10 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
            Sign In Now
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <div className="size-12 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center">
          <KeyRound className="size-6 text-violet-600" />
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Set new password</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter the code sent to <span className="font-medium text-foreground">{email}</span> and your new password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
        )}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Verification Code</label>
          <input name="code" type="text" placeholder="000000" maxLength={6} required disabled={loading} className={inputCls} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">New Password</label>
          <input name="password" type="password" required disabled={loading} className={inputCls} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Confirm New Password</label>
          <input name="verify_password" type="password" required disabled={loading} className={inputCls} />
        </div>
        <button type="submit" disabled={loading}
          className="w-full h-10 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="size-4 animate-spin" /> Updating…</> : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="size-5 animate-spin text-primary" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
