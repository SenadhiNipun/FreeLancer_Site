"use client";

import React from "react";
import {
  FileText,
  Link,
  Code,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/layout/navbar";

export default function WriterProfileCompletion() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-3xl px-4 pt-28 pb-12 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary ring-1 ring-inset ring-primary/20 mb-4 font-bold">
            Onboarding Phase 2
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Complete Your Profile</h1>
          <p className="text-muted-foreground mt-4 text-lg">
            To start receiving tasks, we need to verify your portfolio and professional presence.
          </p>
        </div>

        <Card className="border border-border/50 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-border/50 p-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                SR
              </div>
              <div>
                <CardTitle>Senadhi Rajarathna</CardTitle>
                <CardDescription>Academic Specialist Candidate</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {/* Portfolio Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-lg text-foreground">
                <FileText className="size-5 text-primary" /> Portfolio & Identity
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="portfolio_url">Portfolio Link (Google Drive/Personal Site)</Label>
                  <Input id="portfolio_url" placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
                  <Input id="linkedin_url" placeholder="linkedin.com/in/..." />
                </div>
              </div>
            </div>

            {/* Social / Professional presence */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-lg text-foreground">
                <Link className="size-5 text-primary" /> Professional Links
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Link className="size-5 opacity-50" />
                    <div>
                      <p className="text-sm font-semibold">LinkedIn Identity</p>
                      <p className="text-xs text-muted-foreground">Not connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Code className="size-5 opacity-50" />
                    <div>
                      <p className="text-sm font-semibold">GitHub (Optional)</p>
                      <p className="text-xs text-muted-foreground">For technical writers</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-accent/5 p-6 border border-accent/20">
              <div className="flex gap-3">
                <ShieldCheck className="size-6 text-accent shrink-0" />
                <div>
                  <p className="text-sm font-bold text-accent">Verification Pending</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your academic records are currently under manual review. 
                    This usually takes 24-48 hours. Completing these fields helps speed up the process.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <Button className="h-12 px-10 font-bold bg-primary shadow-lg shadow-primary/20 gap-2 transition-all hover:scale-105">
                Save & Continue <ArrowRight className="size-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
