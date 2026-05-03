"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { AlertCircle, Loader2, Sparkles, UserPlus } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const first_name = formData.get("first_name") as string;
    const last_name = formData.get("last_name") as string;
    const email = formData.get("email") as string;
    const phone_number = formData.get("phone_number") as string;
    const password = formData.get("password") as string;
    const verify_password = formData.get("verify_password") as string;

    if (password !== verify_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await authService.register({
        first_name,
        last_name,
        email,
        phone_number,
        password,
        verify_password
      });
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <div className="glass w-full max-w-xl p-8 sm:p-12 rounded-[2.5rem] animate-reveal relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-32 -right-32 size-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-8 relative z-10">
          {/* Header */}
          <div className="space-y-2 text-center sm:text-left">
            <div className="size-12 rounded-2xl glass bg-primary/10 flex items-center justify-center mx-auto sm:mx-0 mb-4">
               <UserPlus className="size-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Join thousands of professionals on Project Hub.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-4 text-sm text-destructive animate-in fade-in zoom-in-95 duration-200">
                <AlertCircle className="size-5 mt-0.5 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="first_name" className="text-sm font-bold text-foreground/80">First Name</Label>
                <Input id="first_name" name="first_name" placeholder="John" required disabled={loading} className="h-12 glass rounded-xl px-4 border-white/20" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name" className="text-sm font-bold text-foreground/80">Last Name</Label>
                <Input id="last_name" name="last_name" placeholder="Doe" required disabled={loading} className="h-12 glass rounded-xl px-4 border-white/20" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-bold text-foreground/80">Email address</Label>
                <Input id="email" name="email" type="email" placeholder="name@example.com" required disabled={loading} className="h-12 glass rounded-xl px-4 border-white/20" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone_number" className="text-sm font-bold text-foreground/80">Mobile Number</Label>
                <Input id="phone_number" name="phone_number" type="tel" placeholder="0771234567" required disabled={loading} className="h-12 glass rounded-xl px-4 border-white/20" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-bold text-foreground/80">Password</Label>
                <Input id="password" name="password" type="password" required disabled={loading} className="h-12 glass rounded-xl px-4 border-white/20" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="verify_password" className="text-sm font-bold text-foreground/80">Verify Password</Label>
                <Input id="verify_password" name="verify_password" type="password" required disabled={loading} className="h-12 glass rounded-xl px-4 border-white/20" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-13 rounded-2xl font-bold bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <div className="flex items-center gap-2">
                   Get Started <Sparkles className="size-5" />
                </div>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="pt-6 border-t border-white/10 text-center text-sm text-muted-foreground font-medium">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
