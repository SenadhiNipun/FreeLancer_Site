import React from "react";
import Link from "next/link";
import { CheckCircle2, Users, FileText, Star } from "lucide-react";

const features = [
  { icon: Users,       text: "5,000+ verified academic professionals" },
  { icon: FileText,    text: "Secure escrow payment protection" },
  { icon: CheckCircle2,text: "Expert writers across all disciplines" },
  { icon: Star,        text: "4.9 average rating from 10,000+ reviews" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex w-[44%] flex-col bg-slate-900 relative overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        {/* Accent gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 to-violet-400" />

        <div className="relative flex flex-col justify-between h-full px-12 py-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <div className="size-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="text-white">
                <rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor"/>
                <rect x="8" y="1" width="5" height="5" rx="1" fill="currentColor" opacity="0.7"/>
                <rect x="1" y="8" width="5" height="5" rx="1" fill="currentColor" opacity="0.7"/>
                <rect x="8" y="8" width="5" height="5" rx="1" fill="currentColor"/>
              </svg>
            </div>
            <span className="text-base font-semibold text-white">ProjectHub</span>
          </Link>

          {/* Main content */}
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-xs font-medium text-violet-400 uppercase tracking-widest">Academic Writing Platform</p>
              <h2 className="text-3xl font-semibold text-white leading-snug">
                Connect with expert writers.<br />
                Deliver with confidence.
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                A professional marketplace connecting students and researchers with qualified academic writers.
              </p>
            </div>

            <div className="space-y-3">
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="size-4 text-violet-400" strokeWidth={1.75} />
                  </div>
                  <span className="text-sm text-slate-300">{text}</span>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-300 italic leading-relaxed">
                "ProjectHub streamlined our entire research workflow. Outstanding quality every time."
              </p>
              <p className="text-xs text-slate-500 mt-2">— Dr. Sarah Chen, Research Lead</p>
            </div>
          </div>

          <p className="text-xs text-slate-600">© 2026 ProjectHub Inc. All rights reserved.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white px-6 py-12 sm:px-10">
        {/* Mobile logo */}
        <div className="mb-8 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white">
                <rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor"/>
                <rect x="8" y="1" width="5" height="5" rx="1" fill="currentColor" opacity="0.7"/>
                <rect x="1" y="8" width="5" height="5" rx="1" fill="currentColor" opacity="0.7"/>
                <rect x="8" y="8" width="5" height="5" rx="1" fill="currentColor"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-foreground">ProjectHub</span>
          </Link>
        </div>

        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}
