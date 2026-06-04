"use client";

import React, { useState } from "react";
import Link from "next/link";
import { authService } from "@/services/auth.service";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState(false);
  const [email, setEmail]       = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await authService.forgotPassword({ email });
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="size-12 rounded-full bg-green-100 border border-green-200 flex items-center justify-center mx-auto">
          <CheckCircle2 className="size-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Check your email</h1>
          <p className="text-sm text-muted-foreground mt-1">
            We sent a reset code to <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
        <Link href={`/reset-password?email=${encodeURIComponent(email)}`}>
          <button className="w-full h-10 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
            Continue to Reset Password
          </button>
        </Link>
        <Link href="/sign-in" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-4" /> Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Forgot password?</h1>
        <p className="text-sm text-muted-foreground mt-1">Enter your email and we&apos;ll send you reset instructions.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
        )}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Email address</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} disabled={loading}
            placeholder="name@example.com"
            className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors placeholder:text-muted-foreground/50 disabled:opacity-50" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full h-10 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="size-4 animate-spin" /> Sending…</> : "Send Reset Code"}
        </button>
      </form>

      <div className="text-center">
        <Link href="/sign-in" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-4" /> Back to Sign In
        </Link>
      </div>
    </div>
  );
}
