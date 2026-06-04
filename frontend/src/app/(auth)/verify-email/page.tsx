"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";
import { Mail, Loader2 } from "lucide-react";

function VerifyEmailForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const email        = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [code, setCode]       = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.length !== 6) { setError("Please enter a valid 6-digit code."); return; }
    setLoading(true); setError(null);
    try {
      await authService.verifyEmail({ email, verification_code: code });
      router.push("/sign-in?verified=true");
    } catch (err) {
      setError((err as Error).message || "Invalid verification code.");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="size-12 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center mx-auto">
        <Mail className="size-6 text-violet-600" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Verify your email</h1>
        <p className="text-sm text-muted-foreground mt-1">
          We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {error && (
          <div className="px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
        )}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground text-center">Verification Code</label>
          <input
            type="text" required maxLength={6} value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, ""))}
            disabled={loading} placeholder="000000"
            className="w-full h-14 px-3 rounded-lg border border-border bg-white text-center text-2xl font-mono tracking-[0.5em] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors placeholder:text-muted-foreground/30 disabled:opacity-50"
          />
        </div>
        <button type="submit" disabled={loading || code.length !== 6}
          className="w-full h-10 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="size-4 animate-spin" /> Verifying…</> : "Verify Account"}
        </button>
      </form>

      <button type="button" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        Didn&apos;t receive a code? Resend
      </button>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="size-5 animate-spin text-primary" /></div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
