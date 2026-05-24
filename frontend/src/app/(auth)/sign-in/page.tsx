"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { AlertCircle, Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await authService.login({ email, password });

      if (response.results) {
        const results = response.results as any;
        localStorage.setItem("token", results.access_token);
        localStorage.setItem("refresh_token", results.refresh_token);
        const roles = results.roles || [];
        localStorage.setItem("user_roles", JSON.stringify(roles));
        localStorage.setItem("user", JSON.stringify({ id: results.user_id, email: results.email }));

        if (roles.includes("SUPER_ADMIN") || roles.includes("ADMIN")) {
          router.push("/admin/dashboard");
        } else if (roles.includes("WRITER")) {
          router.push("/writer/dashboard");
        } else {
          router.push("/customer/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-reveal">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-[28px] font-black text-foreground tracking-tight leading-tight">
          Welcome back
        </h1>
        <p className="text-[14px] text-muted-foreground font-medium">
          Sign in to your account to continue your journey.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3.5 text-sm text-destructive animate-in fade-in zoom-in-95 duration-200">
            <AlertCircle className="size-4 mt-0.5 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[13px] font-bold text-foreground/80 tracking-tight">
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            required
            disabled={loading}
            className="h-12 rounded-xl border-border/50 bg-white/60 dark:bg-white/[0.04] backdrop-blur-sm px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:border-primary/50 shadow-none transition-all duration-200 placeholder:text-muted-foreground/40"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[13px] font-bold text-foreground/80 tracking-tight">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-[12px] font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              disabled={loading}
              className="h-12 rounded-xl border-border/50 bg-white/60 dark:bg-white/[0.04] backdrop-blur-sm pr-12 px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:border-primary/50 shadow-none transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl font-bold text-[14px] bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-[11px] font-bold text-muted-foreground/50 uppercase tracking-widest">
            New to ProjectHub?
          </span>
        </div>
      </div>

      {/* Sign up link */}
      <Link href="/sign-up">
        <button className="w-full h-11 rounded-xl border-2 border-border/60 font-bold text-[13px] text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-200">
          Create a free account
        </button>
      </Link>
    </div>
  );
}
