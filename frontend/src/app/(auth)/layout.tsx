import React from "react";
import { LayoutGrid, CheckCircle2, Zap, Shield, Star } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const trust = [
  { icon: CheckCircle2, label: "99.9% uptime SLA" },
  { icon: Zap,          label: "Sub-100ms responses" },
  { icon: Shield,       label: "SOC 2 compliant" },
];

const testimonial = {
  quote: "ProjectHub transformed how I manage my academic workload. Absolutely seamless.",
  author: "Dr. Sarah Chen",
  role: "Research Lead, Stanford",
  rating: 5,
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full relative">
      {/* Theme Toggle */}
      <div className="absolute top-5 right-5 z-50">
        <ThemeToggle />
      </div>

      {/* ── Brand Panel ── */}
      <div className="hidden lg:flex w-[46%] flex-col relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0a0a18 0%, #0f0f2a 50%, #0d0d22 100%)" }}>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #818cf8 1px, transparent 1px), linear-gradient(to bottom, #818cf8 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute -top-40 -left-40 size-[560px] rounded-full opacity-25 pointer-events-none"
          style={{ background: "radial-gradient(circle, oklch(0.58 0.28 270) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute top-1/2 -right-32 size-[400px] rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, oklch(0.65 0.22 290) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute -bottom-32 left-16 size-[300px] rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.16 55) 0%, transparent 70%)", filter: "blur(60px)" }} />

        <div className="relative flex h-full flex-col justify-between p-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="size-10 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:rotate-3"
              style={{ background: "linear-gradient(135deg, oklch(0.68 0.22 265), oklch(0.55 0.26 280))", boxShadow: "0 8px 24px oklch(0.58 0.22 265 / 0.4)" }}>
              <LayoutGrid className="size-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[18px] font-bold text-white tracking-tight">
              Project<span style={{ color: "oklch(0.78 0.18 265)" }}>Hub</span>
            </span>
          </Link>

          {/* Main content */}
          <div className="space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
              style={{ background: "oklch(0.68 0.22 265 / 0.15)", border: "1px solid oklch(0.68 0.22 265 / 0.3)" }}>
              <span className="size-1.5 rounded-full animate-pulse" style={{ background: "oklch(0.78 0.18 265)" }} />
              <span className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: "oklch(0.82 0.14 265)" }}>
                Trusted by 5,000+ professionals
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-5">
              <h2 className="text-[42px] font-black leading-[1.1] tracking-tight text-white">
                Academic excellence,<br />
                <span style={{ background: "linear-gradient(135deg, oklch(0.78 0.18 265), oklch(0.82 0.14 290))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  delivered precisely.
                </span>
              </h2>
              <p className="text-[15px] leading-relaxed max-w-[340px] font-medium"
                style={{ color: "oklch(0.98 0.005 260 / 0.45)" }}>
                A modern platform built for academic professionals. Streamline
                your workflow, collaborate, and deliver outstanding results.
              </p>
            </div>

            {/* Trust items */}
            <div className="space-y-3.5">
              {trust.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3.5">
                  <div className="size-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "oklch(0.68 0.22 265 / 0.15)", border: "1px solid oklch(0.68 0.22 265 / 0.25)" }}>
                    <Icon className="size-4" style={{ color: "oklch(0.78 0.18 265)" }} strokeWidth={2.5} />
                  </div>
                  <span className="text-[13px] font-semibold" style={{ color: "oklch(0.98 0.005 260 / 0.55)" }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="p-5 rounded-2xl"
              style={{ background: "oklch(1 0 0 / 0.04)", border: "1px solid oklch(1 0 0 / 0.08)" }}>
              <div className="flex gap-0.5 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="size-3.5 fill-current" style={{ color: "oklch(0.78 0.16 70)" }} />
                ))}
              </div>
              <p className="text-[13px] leading-relaxed mb-3 font-medium italic"
                style={{ color: "oklch(0.98 0.005 260 / 0.55)" }}>
                "{testimonial.quote}"
              </p>
              <div>
                <p className="text-[12px] font-bold text-white">{testimonial.author}</p>
                <p className="text-[11px] font-medium mt-0.5" style={{ color: "oklch(0.98 0.005 260 / 0.35)" }}>{testimonial.role}</p>
              </div>
            </div>
          </div>

          <p className="text-[11px] font-medium" style={{ color: "oklch(0.98 0.005 260 / 0.2)" }}>
            © 2026 Project Hub Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Form Panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12 sm:px-14 relative">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 70% 30%, oklch(0.58 0.22 265 / 0.05) 0%, transparent 60%)" }} />

        {/* Mobile logo */}
        <div className="mb-10 flex lg:hidden">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <LayoutGrid className="size-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[16px] font-bold text-foreground tracking-tight">
              Project<span className="text-primary">Hub</span>
            </span>
          </Link>
        </div>

        <div className="w-full max-w-[420px] relative z-10">{children}</div>
      </div>
    </div>
  );
}
