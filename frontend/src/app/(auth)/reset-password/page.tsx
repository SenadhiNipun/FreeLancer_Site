"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/services/auth.service";
import { AlertCircle, Loader2, KeyRound, CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const reset_code = formData.get("code") as string;
    const new_password = formData.get("password") as string;
    const verify_password = formData.get("verify_password") as string;

    if (new_password !== verify_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await authService.resetPassword({
        email,
        reset_code,
        new_password,
        verify_password
      });
      setSuccess(true);
      setTimeout(() => router.push("/sign-in"), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Check your code.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="border-none shadow-none bg-transparent lg:bg-card lg:border lg:shadow-sm text-center">
        <CardHeader className="space-y-1 lg:p-6">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="size-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Password Reset!</CardTitle>
          <CardDescription>
            Your password has been successfully updated.
          </CardDescription>
        </CardHeader>
        <CardContent className="lg:p-6">
          <p className="text-sm text-muted-foreground pb-4">
            Redirecting you to the sign in page in 3 seconds...
          </p>
          <Link href="/sign-in">
            <Button className="w-full">Sign In Now</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-none bg-transparent lg:bg-card lg:border lg:shadow-sm">
      <CardHeader className="space-y-1 lg:p-6 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <KeyRound className="size-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-left">Set new password</CardTitle>
        <CardDescription className="text-left">
          Enter the code sent to <span className="font-medium text-foreground">{email}</span> and your new password.
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
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input id="code" name="code" type="text" placeholder="000000" maxLength={6} required disabled={loading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input id="password" name="password" type="password" required disabled={loading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="verify_password">Confirm New Password</Label>
            <Input id="verify_password" name="verify_password" type="password" required disabled={loading} />
          </div>
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
