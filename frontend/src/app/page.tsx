"use client";

import Link from "next/link";
import {
  Zap, TrendingUp, ShieldCheck, Users2, Globe, Award,
  Star, CheckCircle2, ArrowRight, LayoutGrid, Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";

const features = [
  { title: "Expert Bidding",         desc: "Post tasks and receive competitive bids from vetted academic professionals in real-time.",                   icon: Zap,         color: "bg-amber-50 border-amber-100 text-amber-600" },
  { title: "Real-time Tracking",     desc: "Monitor project progress with live updates and interactive status dashboards.",                               icon: TrendingUp,   color: "bg-violet-50 border-violet-100 text-violet-600" },
  { title: "Secure Escrow",          desc: "Your funds are safe. Payment is released only when you are 100% satisfied.",                                  icon: ShieldCheck,  color: "bg-green-50 border-green-100 text-green-600" },
  { title: "Global Writer Network",  desc: "Access a pool of specialists across 50+ subject areas and academic disciplines worldwide.",                   icon: Globe,        color: "bg-blue-50 border-blue-100 text-blue-600" },
  { title: "Smart Messaging",        desc: "Collaborate directly with writers through our integrated, high-speed communication portal.",                   icon: Users2,       color: "bg-indigo-50 border-indigo-100 text-indigo-600" },
  { title: "Quality Assurance",      desc: "Built-in review systems and quality checks ensure every delivery meets your standards.",                      icon: Award,        color: "bg-rose-50 border-rose-100 text-rose-600" },
];

const stats = [
  { value: "5,000+", label: "Expert Writers" },
  { value: "98%",    label: "On-time Rate" },
  { value: "4.9★",  label: "Average Rating" },
  { value: "50+",    label: "Subject Areas" },
];

const testimonials = [
  { quote: "ProjectHub transformed my research workflow. Quality writers, fast turnarounds.", author: "Dr. Sarah Chen", role: "Research Lead, Stanford" },
  { quote: "Found my go-to platform for academic work. The escrow system gives me peace of mind.", author: "James Okonkwo", role: "PhD Student, UCL" },
  { quote: "As a writer, ProjectHub gives me consistent, well-paying projects. Highly recommended.", author: "Priya Nair", role: "Academic Writer" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1">

        {/* Hero */}
        <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 px-5 sm:px-8 text-center bg-gradient-to-b from-white to-slate-50">
          <div className="mx-auto max-w-4xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-xs font-semibold text-violet-700 mb-8">
              <span className="size-1.5 rounded-full bg-violet-600 animate-pulse" />
              Academic Writing Platform
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
              Academic success,{" "}
              <span className="text-primary">redefined.</span>
            </h1>

            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
              Connect with professional writers, manage complex tasks, and deliver excellence
              through our unified, high-performance portal.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/sign-up">
                <button className="flex items-center gap-2 h-12 px-8 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-primary/20">
                  Get started free <Sparkles className="size-4" />
                </button>
              </Link>
              <Link href="/sign-up/writer">
                <button className="flex items-center gap-2 h-12 px-8 rounded-lg border border-border bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  Join as a writer <ArrowRight className="size-4" />
                </button>
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="size-4 fill-amber-400 text-amber-400" />)}
                <span className="text-sm font-semibold text-slate-700 ml-1">4.9/5</span>
                <span className="text-sm text-slate-400">(2.4k+ reviews)</span>
              </div>
              <div className="flex -space-x-2">
                {["bg-violet-500","bg-green-500","bg-amber-500","bg-rose-500"].map((c, i) => (
                  <div key={i} className={`size-8 rounded-full border-2 border-white ${c}`} />
                ))}
                <div className="size-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">+5k</div>
              </div>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white border border-border rounded-2xl shadow-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-slate-50">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-red-400" />
                  <div className="size-3 rounded-full bg-amber-400" />
                  <div className="size-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 max-w-xs mx-auto h-6 rounded-md bg-white border border-border flex items-center justify-center text-xs text-muted-foreground gap-2">
                  <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                  portal.projecthub.io
                </div>
              </div>
              <div className="aspect-[16/9] bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-8">
                <div className="space-y-4 text-center">
                  <div className="size-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                    <LayoutGrid className="size-7 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">ProjectHub Portal</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[{ v: "24", l: "Tasks", c: "text-primary" }, { v: "98%", l: "Success", c: "text-green-600" }, { v: "$4.2k", l: "Earned", c: "text-amber-600" }].map(s => (
                      <div key={s.l} className="bg-white border border-border rounded-lg p-3 text-center shadow-sm">
                        <p className={`text-xl font-bold ${s.c}`}>{s.v}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{s.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 border-y border-border bg-white">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {stats.map(s => (
                <div key={s.label}>
                  <p className="text-3xl font-bold text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 lg:py-28 px-5 sm:px-8 bg-slate-50">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                Everything you need to succeed
              </h2>
              <p className="text-slate-500 mt-3 max-w-xl mx-auto">
                A unified environment built to handle the complexities of academic research and project delivery.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f) => (
                <div key={f.title} className="bg-white border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className={`size-10 rounded-lg border flex items-center justify-center mb-4 ${f.color}`}>
                    <f.icon className="size-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 lg:py-28 px-5 sm:px-8 bg-white">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">How it works</h2>
              <p className="text-slate-500 mt-3">Get started in minutes, no technical knowledge needed.</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Post your task",      desc: "Describe your project requirements, set a deadline, and submit it to the platform." },
                { step: "02", title: "Writers place bids",  desc: "Verified experts bid competitively. Review profiles, ratings, and choose the best match." },
                { step: "03", title: "Approve & pay",       desc: "Work is delivered. Review it and release payment from escrow only when satisfied." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="text-center">
                  <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary mx-auto mb-4">
                    {step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 lg:py-28 px-5 sm:px-8 bg-slate-50">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Trusted by thousands</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {testimonials.map(({ quote, author, role }) => (
                <div key={author} className="bg-white border border-border rounded-xl p-5 shadow-sm">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="size-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-4 italic">&ldquo;{quote}&rdquo;</p>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{author}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28 px-5 sm:px-8 bg-primary">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Ready to get started?
            </h2>
            <p className="text-white/70 mb-10 leading-relaxed">
              Join thousands of students and writers who have already transformed their academic workflow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/sign-up">
                <button className="flex items-center gap-2 h-12 px-8 rounded-lg bg-white text-primary text-sm font-semibold hover:bg-white/90 transition-colors shadow-md">
                  Start for free <CheckCircle2 className="size-4" />
                </button>
              </Link>
              <Link href="/sign-up/writer">
                <button className="flex items-center gap-2 h-12 px-8 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-colors">
                  Become a writer <ArrowRight className="size-4" />
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <LayoutGrid className="size-4 text-white" strokeWidth={2} />
              </div>
              <span className="text-sm font-semibold text-foreground">ProjectHub</span>
            </Link>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {["Privacy","Terms","Security","Contact"].map(item => (
                <Link key={item} href="#" className="hover:text-foreground transition-colors">{item}</Link>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">© 2026 ProjectHub Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
