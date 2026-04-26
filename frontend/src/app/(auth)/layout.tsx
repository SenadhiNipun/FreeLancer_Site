import React from "react";
import { LayoutGrid, CheckCircle2, Zap, Shield } from "lucide-react";
import Link from "next/link";

const trust = [
  { icon: CheckCircle2, label: "99.9% uptime SLA" },
  { icon: Zap,          label: "Sub-100ms responses" },
  { icon: Shield,       label: "SOC 2 compliant" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      {/* ── Brand panel ── */}
      <div className="hidden lg:flex w-[42%] flex-col bg-[#0F0F1A] relative overflow-hidden">
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* glow blobs */}
        <div className="absolute -top-32 -left-32 size-[500px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-48 -right-24 size-[400px] rounded-full bg-violet-600/15 blur-[100px] pointer-events-none" />

        <div className="relative flex h-full flex-col justify-between p-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group w-fit">
            <div className="size-9 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200">
              <LayoutGrid className="size-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Project<span className="text-indigo-400">Hub</span>
            </span>
          </Link>

          {/* Headline */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1">
                <span className="size-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  Trusted by 5,000+ users
                </span>
              </div>
              <h2 className="text-4xl font-bold leading-tight text-white">
                Manage your projects
                <br />
                <span className="text-indigo-400">with precision.</span>
              </h2>
              <p className="text-base text-white/50 max-w-sm leading-relaxed">
                A modern platform built for academic professionals. Streamline
                your workflow, collaborate, and deliver results.
              </p>
            </div>

            {/* Trust badges */}
            <div className="space-y-3">
              {trust.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="size-7 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="size-3.5 text-indigo-400" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm text-white/60 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/25">
            © 2026 Project Hub Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Form panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12 sm:px-12">
        {/* Mobile logo */}
        <div className="mb-10 flex lg:hidden">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
              <LayoutGrid className="size-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold text-foreground tracking-tight">
              Project<span className="text-primary">Hub</span>
            </span>
          </Link>
        </div>
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}
