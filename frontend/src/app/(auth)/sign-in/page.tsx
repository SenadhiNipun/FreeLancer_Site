"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd       = new FormData(e.currentTarget);
    const email    = fd.get("email") as string;
    const password = fd.get("password") as string;
    try {
      const res = await authService.login({ email, password });
      if (res.results) {
        const r = res.results as any;
        localStorage.setItem("token",         r.access_token);
        localStorage.setItem("refresh_token", r.refresh_token);
        localStorage.setItem("user_roles",    JSON.stringify(r.roles || []));
        localStorage.setItem("user",          JSON.stringify({ id: r.user_id, email: r.email }));
        const roles = r.roles || [];
        if (roles.includes("SUPER_ADMIN") || roles.includes("ADMIN")) router.push("/admin/dashboard");
        else if (roles.includes("WRITER")) router.push("/writer/dashboard");
        else router.push("/customer/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to your account to continue.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-foreground">Email address</label>
          <input
            id="email" name="email" type="email" required disabled={loading}
            placeholder="name@example.com"
            className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-50 placeholder:text-muted-foreground/50"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">Password</label>
            <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <input
              id="password" name="password" type={showPassword ? "text" : "password"} required disabled={loading}
              className="w-full h-10 px-3 pr-10 rounded-lg border border-border bg-white text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-50"
            />
            <button
              type="button" tabIndex={-1}
              onClick={() => setShowPassword(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full h-10 rounded-lg bg-primary text-white text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="size-4 animate-spin" /> Signing in…</> : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/sign-up" className="font-medium text-primary hover:underline">Create one</Link>
      </p>
    </div>
  );
}
