"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd              = new FormData(e.currentTarget);
    const first_name      = fd.get("first_name")      as string;
    const last_name       = fd.get("last_name")       as string;
    const email           = fd.get("email")           as string;
    const phone_number    = fd.get("phone_number")    as string;
    const password        = fd.get("password")        as string;
    const verify_password = fd.get("verify_password") as string;

    if (password !== verify_password) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await authService.register({ first_name, last_name, email, phone_number, password, verify_password });
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full h-10 px-3 rounded-lg border border-border bg-white text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-50 placeholder:text-muted-foreground/50";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Join ProjectHub as a customer.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">First name</label>
            <input name="first_name" placeholder="John" required disabled={loading} className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Last name</label>
            <input name="last_name" placeholder="Doe" required disabled={loading} className={inputCls} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Email address</label>
          <input name="email" type="email" placeholder="name@example.com" required disabled={loading} className={inputCls} />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Mobile number</label>
          <input name="phone_number" type="tel" placeholder="0771234567" required disabled={loading} className={inputCls} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Password</label>
            <input name="password" type="password" required disabled={loading} className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Confirm</label>
            <input name="verify_password" type="password" required disabled={loading} className={inputCls} />
          </div>
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full h-10 rounded-lg bg-primary text-white text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="size-4 animate-spin" /> Creating account…</> : "Create account"}
        </button>
      </form>

      <div className="text-center text-sm text-muted-foreground space-y-2">
        <p>
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
        <p>
          Joining as a writer?{" "}
          <Link href="/sign-up/writer" className="font-medium text-primary hover:underline">Writer registration</Link>
        </p>
      </div>
    </div>
  );
}
