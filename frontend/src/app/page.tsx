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
  LayoutGrid
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { FeatureCard } from "@/components/landing/feature-card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const features = [
    {
      title: "Task Management",
      description: "Organize and track tasks with ease. Use boards and lists to keep your team aligned.",
      icon: CheckCircle2,
    },
    {
      title: "Team Collaboration",
      description: "Real-time updates and communication tools to keep everyone in sync, anywhere.",
      icon: Users2,
    },
    {
      title: "Detailed Analytics",
      description: "Gain insights into your project's progress with high-end reporting and dashboards.",
      icon: BarChart3,
    },
    {
      title: "Secure Records",
      description: "Enterprise-grade security for your project data and intellectual property.",
      icon: ShieldCheck,
    },
    {
      title: "Fast Performance",
      description: "Lightning-fast interface optimized for productivity and modern workflows.",
      icon: Zap,
    },
    {
      title: "Time Tracking",
      description: "Keep track of hours spent on specific tasks to optimize your team's throughput.",
      icon: Clock,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-[-150px]" aria-hidden="true">
            <svg viewBox="0 0 1024 1024" className="h-full w-full">
              <circle cx="512" cy="512" r="512" fill="url(#hero-gradient)" fillOpacity="0.15" />
              <defs>
                <radialGradient id="hero-gradient">
                  <stop stopColor="var(--primary)" />
                  <stop offset="1" stopColor="var(--accent)" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary ring-1 ring-inset ring-primary/20 mb-8">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                Trusted by 5,000+ Students & Writers
              </div>
              <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl">
                The modern hub for <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  successful projects.
                </span>
              </h1>
              <p className="mx-auto mt-10 max-w-2xl text-xl text-muted-foreground leading-relaxed">
                Empower your team with Project Hub. Seamlessly manage tasks, 
                collaborate in real-time, and deliver excellence with our 
                all-in-one professional infrastructure.
              </p>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/sign-up">
                  <Button size="lg" className="h-14 px-10 text-lg font-bold gap-2 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                    Start Your Project <ArrowRight className="size-5" />
                  </Button>
                </Link>
                <Link href="/sign-up/writer" className="group">
                  <Button variant="outline" size="lg" className="h-14 px-10 text-lg font-bold border-2 border-accent/30 text-accent hover:bg-accent/5 hover:border-accent transition-all">
                    Register as Writer
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Dashboard Mockup */}
            <div className="mt-24 relative animate-in fade-in zoom-in-95 duration-1000 delay-500">
              <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-primary/30 to-accent/30 blur-2xl opacity-20 hover:opacity-30 transition-opacity"></div>
              <div className="relative rounded-[2rem] border border-border/50 bg-card/50 p-3 shadow-2xl backdrop-blur-sm mx-auto max-w-6xl overflow-hidden">
                <div className="aspect-[16/10] w-full rounded-[1.5rem] bg-background/80 flex items-center justify-center border border-border/50 shadow-inner group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 transition-opacity group-hover:opacity-100 opacity-50"></div>
                  <img 
                    src="/dashboard_mockup.png" 
                    alt="Project Hub Dashboard"
                    className="w-full h-full object-cover rounded-[1.5rem] opacity-90 group-hover:scale-[1.02] transition-transform duration-700" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden flex-col items-center gap-4 text-muted-foreground animate-pulse">
                    <LayoutGrid size={48} className="text-primary/40" />
                    <p className="text-lg font-medium tracking-wide">Interactive Dashboard Interface</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 lg:py-40 bg-background relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20 lg:mb-32">
              <h2 className="text-base font-bold text-primary uppercase tracking-widest mb-4">Core Ecosystem</h2>
              <h3 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 text-foreground">
                Everything you need <br /> to ship excellence
              </h3>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A unified environment built for the complexities of modern 
                academic and professional project delivery.
              </p>
            </div>
            
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, idx) => (
                <FeatureCard key={idx} {...feature} />
              ))}
            </div>
          </div>
        </section>

        {/* Identity / CTA Section */}
        <section id="about" className="py-24 lg:py-40 relative">
          <div className="absolute inset-0 bg-primary -z-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.2)_100%)] -z-10"></div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
            <div className="max-w-4xl mx-auto backdrop-blur-sm bg-white/5 p-12 lg:p-20 rounded-[3rem] border border-white/10 shadow-2xl">
              <h2 className="text-4xl font-bold tracking-tight sm:text-6xl mb-8">
                Join the network of <br />
                <span className="text-accent-foreground underline decoration-accent/60 underline-offset-8">top-tier talent.</span>
              </h2>
              <p className="text-xl opacity-80 max-w-2xl mx-auto mb-16 leading-relaxed">
                Connect with professional writers and expert project managers. 
                Thousands of successful outcomes start right here.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/sign-up">
                  <Button size="lg" className="h-16 px-12 text-xl font-bold bg-white text-primary hover:bg-white/90 shadow-xl transition-all hover:-translate-y-1">
                    Register Your Team
                  </Button>
                </Link>
                <Link href="/sign-up/writer">
                  <Button size="lg" variant="outline" className="h-16 px-12 text-xl font-bold bg-transparent border-2 border-white/40 hover:bg-white/10 text-white transition-all hover:-translate-y-1">
                    Join as a Writer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-xl font-bold">
            Project Hub
          </div>
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
            <Link href="#" className="hover:text-primary">Contact Sales</Link>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2026 Project Hub Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
