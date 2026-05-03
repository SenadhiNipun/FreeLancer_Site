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
  Sparkles
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
      gradient: "from-primary to-[#7C3AED]",
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
    { value: "5,000+", label: "Expert Writers" },
    { value: "98%",    label: "On-time Success" },
    { value: "4.9 ★",  label: "Global Rating" },
    { value: "50+",    label: "Subject Areas" },
  ];

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      {/* Global Background Handled by globals.css (Mesh pseudo-element) */}
      
      <Navbar />

      <main className="flex-1 relative z-10">
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-24 lg:pt-52 lg:pb-40 px-5 sm:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <div className="animate-reveal">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 glass px-5 py-2 mb-10 rounded-2xl border-white/10 shadow-xl shadow-black/5">
                <div className="size-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[11px] font-bold text-primary uppercase tracking-[0.2em]">
                  The Future of Academic Collaboration
                </span>
              </div>

              {/* Headline */}
              <h1 className="mx-auto max-w-5xl text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl text-foreground leading-[1.1]">
                Academic success,{" "}
                <span className="relative inline-block">
                  <span className="text-gradient">redefined.</span>
                </span>
              </h1>

              <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground font-medium leading-relaxed">
                Connect with professional writers, manage complex tasks, and deliver
                excellence through our unified, high-performance portal.
              </p>

              {/* CTAs */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="h-14 px-10 text-base font-bold gap-2 bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all rounded-2xl"
                  >
                    Get started free
                    <Sparkles className="size-5" />
                  </Button>
                </Link>
                <Link href="/sign-up/writer">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 px-10 text-base font-bold glass bg-card/20 border-border/20 hover:bg-card/40 transition-all rounded-2xl"
                  >
                    Join as a writer
                  </Button>
                </Link>
              </div>

              {/* Social proof */}
              <div className="mt-12 flex items-center justify-center gap-8 flex-wrap">
                <div className="flex items-center gap-2 glass px-4 py-2 rounded-xl border-white/5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                  <span className="ml-2 text-sm font-bold text-foreground">4.9/5</span>
                  <span className="ml-1 text-sm text-muted-foreground font-medium opacity-60">(2.4k+ reviews)</span>
                </div>
              </div>
            </div>

            {/* Dashboard mockup - Upgraded to match new style */}
            <div className="mt-24 relative animate-reveal [animation-delay:400ms]">
              <div className="absolute -inset-2 rounded-[2.5rem] bg-primary/10 blur-3xl -z-10" />
              <div className="relative rounded-[2rem] border border-white/20 glass shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden max-w-6xl mx-auto">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 border-b border-border/10 glass bg-card/40 px-6 py-4">
                  <div className="flex gap-1.5">
                    <div className="size-3 rounded-full bg-rose-500/80" />
                    <div className="size-3 rounded-full bg-amber-500/80" />
                    <div className="size-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex-1 max-w-md mx-auto h-8 glass rounded-xl flex items-center justify-center text-[11px] font-bold text-muted-foreground/50 border-white/5">
                    portal.projecthub.io
                  </div>
                </div>
                {/* Dashboard Placeholder with Mesh */}
                <div className="aspect-[16/10] w-full bg-card/5 flex items-center justify-center relative">
                   <div className="absolute inset-0 bg-[radial-gradient(at_0%_0%,var(--mesh-1)_0,_transparent_50%),radial-gradient(at_100%_100%,var(--mesh-2)_0,_transparent_50%)] opacity-30" />
                   <div className="relative z-10 space-y-6 text-center scale-110">
                      <div className="size-20 rounded-3xl glass bg-primary/10 flex items-center justify-center mx-auto border-white/20 shadow-2xl">
                        <LayoutGrid className="size-10 text-primary" strokeWidth={2.5} />
                      </div>
                      <p className="text-sm font-bold text-muted-foreground/60 tracking-widest uppercase">Premium Portal Active</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats Section ── */}
        <section className="py-20 glass bg-card/20 border-y border-border/10">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid grid-cols-2 gap-12 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center space-y-1">
                  <p className="text-4xl font-bold text-foreground tracking-tighter">{s.value}</p>
                  <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Grid ── */}
        <section id="features" className="py-32 lg:py-48 px-5 sm:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Section header */}
            <div className="text-center mb-20 animate-reveal">
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-2xl border-white/5 mb-6">
                <Zap className="size-4 text-primary" fill="currentColor" />
                <span className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
                  The Intelligence Layer
                </span>
              </div>
              <h2 className="text-4xl font-bold sm:text-6xl text-foreground max-w-3xl mx-auto leading-tight tracking-tight">
                Designed for the demands of{" "}
                <span className="text-gradient">modern delivery.</span>
              </h2>
              <p className="mt-6 text-lg text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
                A unified environment built to handle the complexities of academic research and high-stakes project delivery.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, idx) => (
                <FeatureCard key={idx} index={idx} {...feature} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-32 lg:py-48 px-5 sm:px-8 relative">
           <div className="mx-auto max-w-5xl">
              <div className="glass rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden border-gradient shadow-2xl shadow-primary/10">
                 <div className="absolute top-0 right-0 size-96 bg-primary/20 rounded-full blur-[100px] -z-10" />
                 <div className="absolute bottom-0 left-0 size-96 bg-indigo-500/10 rounded-full blur-[100px] -z-10" />
                 
                 <div className="relative z-10 space-y-10">
                    <h2 className="text-4xl font-bold sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight">
                      Elevate your academic <br />
                      <span className="text-primary">trajectory.</span>
                    </h2>
                    <p className="text-lg text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
                      Join thousands of successful students and professional writers who have already transformed their workflow.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                      <Link href="/sign-up">
                        <Button
                          size="lg"
                          className="h-14 px-12 text-base font-bold bg-primary text-white hover:bg-primary/90 shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all rounded-2xl"
                        >
                          Start for free
                        </Button>
                      </Link>
                      <Link href="/sign-up/writer">
                        <Button
                          size="lg"
                          variant="outline"
                          className="h-14 px-12 text-base font-bold glass bg-card/20 border-border/20 hover:bg-card/40 transition-all rounded-2xl"
                        >
                          Become a writer
                        </Button>
                      </Link>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </main>

      {/* ── Unified Footer ── */}
      <footer className="glass bg-card/20 border-t border-border/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="size-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                <LayoutGrid className="size-5 text-white" strokeWidth={3} />
              </div>
              <span className="text-[17px] font-bold text-foreground tracking-tight">
                Project<span className="text-primary">Hub</span>
              </span>
            </Link>
            
            <div className="flex items-center gap-10 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="#" className="hover:text-primary transition-colors">Security</Link>
              <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
            </div>
            
            <p className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
              © 2026 Project Hub Inc.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
