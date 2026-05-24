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
  Award,
  Sparkles,
  ChevronRight,
  Play
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { FeatureCard } from "@/components/landing/feature-card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const features = [
    {
      title: "Expert Bidding",
      description: "Post your tasks and receive competitive bids from vetted academic professionals in real-time.",
      icon: Zap,
      gradient: "from-amber-400 to-orange-500",
      tag: "Dynamic",
    },
    {
      title: "Real-time Tracking",
      description: "Monitor your project's progress with live updates and interactive status pipelines.",
      icon: TrendingUp,
      gradient: "from-violet-500 to-indigo-600",
      tag: "Live",
    },
    {
      title: "Secure Escrow",
      description: "Your funds are safe. Payment is only released when you are 100% satisfied with the work.",
      icon: ShieldCheck,
      gradient: "from-emerald-400 to-teal-600",
      tag: "Secure",
    },
    {
      title: "Professional Network",
      description: "Access a global pool of specialists across 50+ subject areas and academic disciplines.",
      icon: Globe,
      gradient: "from-sky-400 to-blue-600",
      tag: "Global",
    },
    {
      title: "Smart Messaging",
      description: "Collaborate directly with writers through our integrated, high-speed communication portal.",
      icon: Users2,
      gradient: "from-indigo-400 to-indigo-700",
      tag: "Seamless",
    },
    {
      title: "Quality Assurance",
      description: "Built-in review systems and quality checks ensure every delivery meets your standards.",
      icon: Award,
      gradient: "from-rose-400 to-pink-600",
      tag: "Premium",
    },
  ];

  const stats = [
    { value: "5,000+", label: "Expert Writers", icon: Users2 },
    { value: "98%",    label: "On-time Success", icon: CheckCircle2 },
    { value: "4.9 ★",  label: "Global Rating", icon: Star },
    { value: "50+",    label: "Subject Areas", icon: Globe },
  ];

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      <Navbar />

      <main className="flex-1 relative z-10">

        {/* ── Hero ───────────────────────────────────────── */}
        <section className="relative pt-36 pb-28 lg:pt-56 lg:pb-44 px-5 sm:px-8">

          {/* Large background orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] left-[5%] size-[600px] rounded-full opacity-40"
              style={{ background: "radial-gradient(circle, oklch(0.88 0.08 260) 0%, transparent 70%)", filter: "blur(60px)" }} />
            <div className="absolute top-[5%] right-[5%] size-[500px] rounded-full opacity-30"
              style={{ background: "radial-gradient(circle, oklch(0.88 0.07 290) 0%, transparent 70%)", filter: "blur(60px)" }} />
            <div className="absolute bottom-[10%] left-[30%] size-[400px] rounded-full opacity-25"
              style={{ background: "radial-gradient(circle, oklch(0.88 0.07 320) 0%, transparent 70%)", filter: "blur(60px)" }} />
          </div>

          <div className="mx-auto max-w-7xl text-center relative z-10">
            <div className="animate-reveal">

              {/* Live badge */}
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 mb-10 rounded-full text-[11px] font-bold uppercase tracking-[0.15em]"
                style={{
                  background: "oklch(0.58 0.22 265 / 0.08)",
                  border: "1px solid oklch(0.58 0.22 265 / 0.2)",
                  color: "oklch(0.52 0.22 265)",
                  backdropFilter: "blur(12px)"
                }}>
                <span className="size-2 rounded-full animate-pulse" style={{ background: "oklch(0.58 0.22 265)" }} />
                The Future of Academic Collaboration
              </div>

              {/* Headline */}
              <h1 className="mx-auto max-w-5xl font-black tracking-tight text-foreground leading-[1.08]"
                style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}>
                Academic success,{" "}
                <span className="relative inline-block">
                  <span style={{
                    background: "linear-gradient(135deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280), oklch(0.65 0.2 310))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}>
                    redefined.
                  </span>
                  {/* Underline decoration */}
                  <span className="absolute -bottom-2 left-0 right-0 h-1 rounded-full opacity-30"
                    style={{ background: "linear-gradient(90deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))" }} />
                </span>
              </h1>

              <p className="mx-auto mt-8 max-w-2xl text-[17px] text-muted-foreground font-medium leading-relaxed">
                Connect with professional writers, manage complex tasks, and deliver
                excellence through our unified, high-performance portal.
              </p>

              {/* CTAs */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/sign-up">
                  <button className="h-14 px-10 text-[15px] font-bold gap-2.5 text-white rounded-2xl flex items-center transition-all hover:-translate-y-1"
                    style={{
                      background: "linear-gradient(135deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))",
                      boxShadow: "0 8px 32px oklch(0.58 0.22 265 / 0.35), 0 2px 8px oklch(0.58 0.22 265 / 0.2)"
                    }}>
                    Get started free
                    <Sparkles className="size-5" />
                  </button>
                </Link>
                <Link href="/sign-up/writer">
                  <button className="h-14 px-10 text-[15px] font-bold rounded-2xl flex items-center gap-2.5 transition-all hover:-translate-y-0.5"
                    style={{
                      background: "oklch(1 0 0 / 0.7)",
                      border: "1px solid oklch(0.88 0.018 260 / 0.6)",
                      backdropFilter: "blur(12px)",
                      boxShadow: "0 4px 16px oklch(0 0 0 / 0.06)"
                    }}>
                    Join as a writer
                    <ChevronRight className="size-4.5" />
                  </button>
                </Link>
              </div>

              {/* Social proof */}
              <div className="mt-10 flex items-center justify-center gap-6 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
                  style={{ background: "oklch(1 0 0 / 0.7)", border: "1px solid oklch(0.88 0.018 260 / 0.5)", backdropFilter: "blur(12px)" }}>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[13px] font-bold text-foreground">4.9/5</span>
                  <span className="text-[12px] text-muted-foreground font-medium opacity-70">(2.4k+ reviews)</span>
                </div>
                <div className="flex -space-x-2">
                  {["oklch(0.62 0.22 265)", "oklch(0.65 0.18 145)", "oklch(0.72 0.16 55)", "oklch(0.58 0.22 25)"].map((c, i) => (
                    <div key={i} className="size-8 rounded-full border-2 border-background flex-shrink-0"
                      style={{ background: c, boxShadow: `0 2px 8px ${c}40` }} />
                  ))}
                  <div className="size-8 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-foreground flex-shrink-0"
                    style={{ background: "oklch(0.94 0.012 260)" }}>
                    +5k
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="mt-24 relative animate-reveal" style={{ animationDelay: "400ms" }}>
              <div className="absolute -inset-8 rounded-[3rem] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, oklch(0.58 0.22 265 / 0.12) 0%, transparent 70%)", filter: "blur(20px)" }} />
              <div className="relative rounded-[2rem] overflow-hidden max-w-5xl mx-auto"
                style={{
                  background: "oklch(1 0 0 / 0.85)",
                  border: "1px solid oklch(0.88 0.018 260 / 0.5)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 32px 80px oklch(0.58 0.22 265 / 0.12), 0 8px 32px oklch(0 0 0 / 0.08), inset 0 1px 0 oklch(1 0 0 / 0.5)"
                }}>
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-5 py-3.5"
                  style={{ borderBottom: "1px solid oklch(0.88 0.018 260 / 0.4)", background: "oklch(0.97 0.008 260 / 0.8)" }}>
                  <div className="flex gap-1.5">
                    <div className="size-3 rounded-full bg-rose-400/90" />
                    <div className="size-3 rounded-full bg-amber-400/90" />
                    <div className="size-3 rounded-full bg-emerald-400/90" />
                  </div>
                  <div className="flex-1 max-w-xs mx-auto h-6 rounded-lg flex items-center justify-center text-[10px] font-semibold text-muted-foreground/50 gap-2"
                    style={{ background: "oklch(0.92 0.01 260 / 0.8)", border: "1px solid oklch(0.88 0.018 260 / 0.4)" }}>
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    portal.projecthub.io
                  </div>
                </div>
                {/* Mock dashboard */}
                <div className="aspect-[16/10] w-full flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20"
                    style={{ background: "radial-gradient(at 0% 0%, oklch(0.88 0.08 260) 0, transparent 50%), radial-gradient(at 100% 100%, oklch(0.88 0.07 290) 0, transparent 50%)" }} />
                  <div className="relative z-10 space-y-4 text-center px-8 py-8 w-full max-w-sm mx-auto">
                    <div className="size-16 rounded-2xl mx-auto flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, oklch(0.62 0.22 265 / 0.15), oklch(0.52 0.26 280 / 0.1))", border: "1px solid oklch(0.58 0.22 265 / 0.2)" }}>
                      <LayoutGrid className="size-8 text-primary" strokeWidth={2} />
                    </div>
                    <p className="text-[12px] font-bold text-muted-foreground/60 tracking-[0.15em] uppercase">Premium Portal Active</p>
                    {/* Mini stat row */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {[
                        { v: "24", l: "Tasks", c: "oklch(0.62 0.22 265)" },
                        { v: "98%", l: "Success", c: "oklch(0.55 0.2 145)" },
                        { v: "$4.2k", l: "Earned", c: "oklch(0.65 0.18 70)" }
                      ].map(s => (
                        <div key={s.l} className="p-3 rounded-xl text-center"
                          style={{ background: "oklch(1 0 0 / 0.6)", border: "1px solid oklch(0.88 0.018 260 / 0.4)" }}>
                          <p className="text-[16px] font-black" style={{ color: s.c }}>{s.v}</p>
                          <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider mt-0.5">{s.l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats Band ── */}
        <section className="py-16 relative"
          style={{
            background: "oklch(1 0 0 / 0.5)",
            borderTop: "1px solid oklch(0.88 0.018 260 / 0.4)",
            borderBottom: "1px solid oklch(0.88 0.018 260 / 0.4)",
            backdropFilter: "blur(16px)"
          }}>
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center space-y-2 group">
                  <p className="text-[36px] font-black text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">{s.value}</p>
                  <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.15em]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Grid ── */}
        <section id="features" className="py-32 lg:py-48 px-5 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-20 animate-reveal">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl mb-6 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.15em]"
                style={{ background: "oklch(1 0 0 / 0.6)", border: "1px solid oklch(0.88 0.018 260 / 0.5)", backdropFilter: "blur(12px)" }}>
                <Zap className="size-3.5 text-primary" fill="currentColor" />
                The Intelligence Layer
              </div>
              <h2 className="font-black text-foreground max-w-3xl mx-auto leading-tight tracking-tight"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
                Designed for the demands of{" "}
                <span style={{
                  background: "linear-gradient(135deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  modern delivery.
                </span>
              </h2>
              <p className="mt-6 text-[16px] text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
                A unified environment built to handle the complexities of academic research and high-stakes project delivery.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, idx) => (
                <FeatureCard key={idx} index={idx} {...feature} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-32 lg:py-48 px-5 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="relative rounded-[2.5rem] p-12 lg:p-20 text-center overflow-hidden"
              style={{
                background: "linear-gradient(135deg, oklch(0.62 0.22 265 / 0.06) 0%, oklch(0.52 0.26 280 / 0.04) 100%)",
                border: "1px solid oklch(0.58 0.22 265 / 0.2)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 16px 64px oklch(0.58 0.22 265 / 0.1), inset 0 1px 0 oklch(1 0 0 / 0.5)"
              }}>
              <div className="absolute -top-24 -right-24 size-[400px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, oklch(0.62 0.22 265 / 0.18) 0%, transparent 70%)", filter: "blur(40px)" }} />
              <div className="absolute -bottom-24 -left-24 size-[300px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, oklch(0.65 0.2 310 / 0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />

              <div className="relative z-10 space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] text-primary"
                  style={{ background: "oklch(0.58 0.22 265 / 0.1)", border: "1px solid oklch(0.58 0.22 265 / 0.2)" }}>
                  <Sparkles className="size-3.5" />
                  Join the community
                </div>

                <h2 className="font-black tracking-tight text-foreground leading-[1.1]"
                  style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
                  Elevate your academic<br />
                  <span style={{
                    background: "linear-gradient(135deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}>trajectory.</span>
                </h2>

                <p className="text-[16px] text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed">
                  Join thousands of successful students and professional writers who have already transformed their workflow.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/sign-up">
                    <button className="h-14 px-12 text-[15px] font-bold text-white rounded-2xl flex items-center gap-2.5 transition-all hover:-translate-y-1"
                      style={{
                        background: "linear-gradient(135deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))",
                        boxShadow: "0 8px 32px oklch(0.58 0.22 265 / 0.3)"
                      }}>
                      Start for free <Sparkles className="size-4.5" />
                    </button>
                  </Link>
                  <Link href="/sign-up/writer">
                    <button className="h-14 px-12 text-[15px] font-bold rounded-2xl flex items-center gap-2.5 transition-all hover:-translate-y-0.5"
                      style={{
                        background: "oklch(1 0 0 / 0.7)",
                        border: "1px solid oklch(0.88 0.018 260 / 0.6)",
                        backdropFilter: "blur(12px)"
                      }}>
                      Become a writer <ArrowRight className="size-4.5" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer style={{
        background: "oklch(1 0 0 / 0.6)",
        borderTop: "1px solid oklch(0.88 0.018 260 / 0.4)",
        backdropFilter: "blur(16px)"
      }}>
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="size-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-105 group-hover:rotate-3"
                style={{ background: "linear-gradient(135deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))", boxShadow: "0 4px 14px oklch(0.58 0.22 265 / 0.25)" }}>
                <LayoutGrid className="size-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[16px] font-bold text-foreground tracking-tight">
                Project<span className="text-primary">Hub</span>
              </span>
            </Link>

            <div className="flex items-center gap-8 text-[11px] font-bold text-muted-foreground/50 uppercase tracking-[0.15em]">
              {["Privacy", "Terms", "Security", "Contact"].map(item => (
                <Link key={item} href="#" className="hover:text-primary transition-colors duration-200">{item}</Link>
              ))}
            </div>

            <p className="text-[11px] font-bold text-muted-foreground/35 uppercase tracking-[0.15em]">
              © 2026 ProjectHub Inc.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
