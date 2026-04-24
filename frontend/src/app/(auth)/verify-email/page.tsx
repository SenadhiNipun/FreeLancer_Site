"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/services/auth.service";
import { AlertCircle, Loader2, Mail } from "lucide-react";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authService.verifyEmail({ 
        email, 
        verification_code: code 
      });
      // Redirect to sign in after success
      router.push("/sign-in?verified=true");
    } catch (err: any) {
      setError(err.message || "Invalid or expired verification code.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-none bg-transparent lg:bg-card lg:border lg:shadow-sm">
      <CardHeader className="space-y-1 lg:p-6 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Mail className="size-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Verify your email</CardTitle>
        <CardDescription>
          We've sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="lg:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="size-4" />
              <span>{error}</span>
            </div>
          )}
          <div className="space-y-2 text-center">
            <Label htmlFor="code" className="sr-only">Verification Code</Label>
            <Input 
              id="code" 
              name="code" 
              type="text" 
              placeholder="000000" 
              maxLength={6}
              className="text-center text-2xl tracking-[0.5em] font-mono h-14"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              required 
              disabled={loading} 
            />
          </div>
          <Button type="submit" className="w-full h-11" disabled={loading || code.length !== 6}>
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Account"
            )}
          </Button>
          <div className="text-center text-sm">
            <button 
              type="button"
              className="text-muted-foreground hover:text-primary transition-colors hover:underline"
              onClick={() => { /* Implement resend logic if backend supports it */ }}
            >
              Didn't receive a code? Resend
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
