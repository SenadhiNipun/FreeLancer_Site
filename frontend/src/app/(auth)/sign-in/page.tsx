"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";

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
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="glass w-full max-w-md p-8 sm:p-12 rounded-[2.5rem] animate-reveal relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 size-48 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="space-y-8 relative z-10">
          {/* Header */}
          <div className="space-y-1.5">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive animate-in fade-in zoom-in-95 duration-200">
                <AlertCircle className="size-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground/80">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                disabled={loading}
                className="h-12 rounded-xl border-border/40 bg-white/50 backdrop-blur-sm px-4 text-sm focus-visible:ring-primary/30 focus-visible:border-primary/50 shadow-none transition-all duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground/80">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
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
                  className="h-12 rounded-xl border-border/40 bg-white/50 backdrop-blur-sm pr-11 px-4 text-sm focus-visible:ring-primary/30 focus-visible:border-primary/50 shadow-none transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-transparent px-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                OR
              </span>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
