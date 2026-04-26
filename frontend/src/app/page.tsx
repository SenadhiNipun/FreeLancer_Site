"use client";

import Link from "next/link";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Users2,
  Zap,
  ArrowRight,
  LayoutGrid,
  Star,
  TrendingUp,
  Globe,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { FeatureCard } from "@/components/landing/feature-card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const features = [
    {
      title: "Task Management",
      description:
        "Organize and track tasks with ease. Use boards and lists to keep your team aligned.",
      icon: CheckCircle2,
      gradient: "from-indigo-500 to-violet-600",
      glow: "shadow-indigo-500/25",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      tag: "Core",
    },
    {
      title: "Team Collaboration",
      description:
        "Real-time updates and communication tools to keep everyone in sync, anywhere.",
      icon: Users2,
      gradient: "from-sky-400 to-blue-600",
      glow: "shadow-blue-500/25",
      iconBg: "bg-sky-50",
      iconColor: "text-sky-600",
      tag: "Live",
    },
    {
      title: "Detailed Analytics",
      description:
        "Gain insights into your project's progress with high-end reporting and dashboards.",
      icon: BarChart3,
      gradient: "from-violet-500 to-purple-700",
      glow: "shadow-violet-500/25",
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      tag: "Reports",
    },
    {
      title: "Secure Records",
      description:
        "Enterprise-grade security for your project data and intellectual property.",
      icon: ShieldCheck,
      gradient: "from-emerald-400 to-teal-600",
      glow: "shadow-emerald-500/25",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      tag: "Enterprise",
    },
    {
      title: "Fast Performance",
      description:
        "Lightning-fast interface optimized for productivity and modern workflows.",
      icon: Zap,
      gradient: "from-amber-400 to-orange-500",
      glow: "shadow-amber-500/25",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      tag: "Optimised",
    },
    {
      title: "Time Tracking",
      description:
        "Keep track of hours spent on specific tasks to optimize your team's throughput.",
      icon: Clock,
      gradient: "from-rose-400 to-pink-600",
      glow: "shadow-rose-500/25",
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      tag: "Smart",
    },
  ];

  const stats = [
    { value: "5,000+", label: "Students & writers" },
    { value: "98%",    label: "On-time delivery" },
    { value: "4.9 ★",  label: "Average rating" },
    { value: "50+",    label: "Subject areas" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-36">
          {/* Background mesh */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-primary/6 blur-[120px]" />
            <div className="absolute left-1/4 top-48 h-[300px] w-[400px] rounded-full bg-violet-500/5 blur-[80px]" />
          </div>

          <div className="mx-auto max-w-7xl px-5 sm:px-8 text-center">
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/6 px-4 py-1.5 mb-8">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Trusted by 5,000+ Students & Writers
                </span>
              </div>

              {/* Headline */}
              <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-foreground">
                The modern platform for{" "}
                <span className="relative inline-block">
                  <span className="text-gradient">academic success.</span>
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                Empower your academic journey with Project Hub — seamlessly
                connect with expert writers, manage tasks, and deliver
                excellence with our all-in-one professional platform.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="h-12 px-8 text-base font-semibold gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-px rounded-xl"
                  >
                    Get started free
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="/sign-up/writer">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 text-base font-semibold border-border/80 hover:bg-muted/50 hover:border-border transition-all duration-200 rounded-xl"
                  >
                    Join as a writer
                  </Button>
                </Link>
              </div>

              {/* Social proof */}
              <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-foreground">4.9/5</span>
                  <span className="ml-1 text-sm text-muted-foreground">(2,400+ reviews)</span>
                </div>
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="mt-20 relative animate-in fade-in zoom-in-[0.97] duration-700 delay-300">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/15 to-transparent blur-sm" />
              <div className="relative rounded-2xl border border-border/60 bg-card shadow-2xl shadow-foreground/5 overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted/30 px-4 py-3">
                  <div className="size-3 rounded-full bg-[#FF5F57]" />
                  <div className="size-3 rounded-full bg-[#FEBC2E]" />
                  <div className="size-3 rounded-full bg-[#28C840]" />
                  <div className="ml-3 flex-1 rounded-md bg-background border border-border/60 px-3 py-1 text-xs text-muted-foreground font-medium max-w-[280px] mx-auto text-center">
                    app.projecthub.io/dashboard
                  </div>
                </div>
                <div className="aspect-[16/9] w-full bg-muted/20 flex items-center justify-center">
                  <div className="text-center space-y-4 py-16">
                    <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                      <LayoutGrid className="size-8 text-primary/60" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Interactive dashboard preview
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────────────────────────── */}
        <section className="border-y border-border/60 bg-muted/20 py-14">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-extrabold text-foreground">{s.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ──────────────────────────────────────────────── */}
        <section id="features" className="relative py-24 lg:py-40 overflow-hidden">
          {/* Deep dark background */}
          <div className="absolute inset-0 bg-[#080811]" />

          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Ambient glow blobs */}
          <div className="absolute left-1/4 top-1/4 size-[500px] rounded-full bg-indigo-600/8 blur-[120px] pointer-events-none" />
          <div className="absolute right-1/4 bottom-1/4 size-[400px] rounded-full bg-violet-600/8 blur-[100px] pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            {/* Section header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-6 backdrop-blur-sm">
                <div className="size-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-widest">
                  Platform features
                </span>
              </div>
              <h2 className="text-3xl font-bold sm:text-5xl text-white max-w-2xl mx-auto leading-tight">
                Everything you need to{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  deliver excellence
                </span>
              </h2>
              <p className="mt-5 text-base text-white/40 max-w-xl mx-auto leading-relaxed">
                A unified environment built for the complexities of modern
                academic and professional project delivery.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, idx) => (
                <FeatureCard key={idx} index={idx} {...feature} />
              ))}
            </div>
          </div>
        </section>


        {/* ── CTA ───────────────────────────────────────────────────── */}
        <section id="about" className="py-24 lg:py-36 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary via-indigo-600 to-violet-700" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_transparent_40%,_rgba(0,0,0,0.25)_100%)]" />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 -z-10 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="mx-auto max-w-4xl px-5 sm:px-8 text-center text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 mb-8 backdrop-blur-sm">
              <Globe className="size-3.5 text-white/70" />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                Join the network
              </span>
            </div>
            <h2 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl leading-tight mb-7">
              Elevate your academic
              <br />
              workflow, today.
            </h2>
            <p className="text-lg text-white/70 max-w-xl mx-auto mb-10 leading-relaxed">
              Connect with professional writers and expert project managers.
              Thousands of successful outcomes start right here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="h-13 px-10 text-base font-semibold bg-white text-primary hover:bg-white/95 shadow-xl transition-all duration-200 hover:-translate-y-px rounded-xl"
                >
                  Start for free
                </Button>
              </Link>
              <Link href="/sign-up/writer">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 px-10 text-base font-semibold bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all rounded-xl"
                >
                  Become a writer
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="size-7 rounded-md bg-primary flex items-center justify-center shadow-sm shadow-primary/20">
                <LayoutGrid className="size-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-foreground">
                Project<span className="text-primary">Hub</span>
              </span>
            </Link>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Contact Sales
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2026 Project Hub Inc.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
