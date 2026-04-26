"use client";

import React, { useState } from "react";
import { CustomerSidebar } from "@/components/layout/customer-sidebar";
import { Bell, Search, Menu, X, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F8F6FF 0%, #FAF9FF 50%, #FFF8F5 100%)' }}>
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar – desktop */}
      <div className="hidden lg:block">
        <CustomerSidebar />
      </div>

      {/* Sidebar – mobile slide-in */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border/60 transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-border/60">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
              <LayoutGrid className="size-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[14px] font-bold text-foreground">
              Project<span className="text-primary">Hub</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>
        <CustomerSidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-white/90 backdrop-blur-xl border-b border-[#ede9ff]/60 shadow-[0_1px_8px_rgba(120,80,220,0.06)] px-5 lg:px-8">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="size-5" />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-sm hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
            <Input
              placeholder="Search projects, messages…"
              className="h-9 pl-9 pr-4 rounded-lg border-border/60 bg-muted/40 text-sm placeholder:text-muted-foreground/50 focus-visible:ring-primary/20 focus-visible:border-primary/40 focus-visible:bg-white transition-all shadow-none"
            />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Status pill */}
            <div className="hidden md:flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5">
              <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium text-muted-foreground">
                All systems normal
              </span>
            </div>

            {/* Notifications */}
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors">
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-primary border-2 border-card" />
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-border/60 ml-1">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-foreground leading-none">
                  John Doe
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Premium member
                </p>
              </div>
              <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold cursor-pointer hover:bg-primary/15 transition-colors">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 lg:p-7">
          <div className="mx-auto max-w-[1360px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
