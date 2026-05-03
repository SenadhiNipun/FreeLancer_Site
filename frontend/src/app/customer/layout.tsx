"use client";

import React, { useState } from "react";
import { CustomerSidebar } from "@/components/layout/customer-sidebar";
import { Bell, Search, Menu, X, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { MessageNotificationBell } from "@/components/notifications/message-notification-bell";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen relative">
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/10 backdrop-blur-md lg:hidden transition-all duration-300"
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
          "fixed inset-y-0 left-0 z-50 w-64 glass border-r border-white/10 transition-transform duration-500 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10 relative z-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="size-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <LayoutGrid className="size-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[14px] font-bold text-foreground">
              Project<span className="text-primary">Hub</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-xl p-1.5 glass border-white/5 text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="size-4" />
          </button>
        </div>
        <CustomerSidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen relative z-10">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 glass border-b border-white/10 px-5 lg:px-10 transition-all">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden rounded-xl p-2 glass border-white/5 text-muted-foreground hover:text-foreground transition-all"
            aria-label="Open sidebar"
          >
            <Menu className="size-5" />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-sm hidden sm:block group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
            <input
              placeholder="Search projects, messages…"
              className="w-full h-10 pl-10 pr-4 rounded-xl glass border-white/5 bg-white/10 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Status pill */}
            <div className="hidden md:flex items-center gap-2 rounded-full glass border-white/5 px-4 py-2">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                Systems Optimal
              </span>
            </div>

            {/* Notifications & Theme */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />
              <MessageNotificationBell />
              <NotificationBell />
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-3 pl-4 border-l border-white/10 ml-2">
              <div className="text-right hidden sm:block">
                <p className="text-[12px] font-bold text-foreground leading-none">
                  John Doe
                </p>
                <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider mt-1">
                  Premium
                </p>
              </div>
              <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-[#A78BFA] flex items-center justify-center text-white text-xs font-bold cursor-pointer shadow-lg shadow-primary/20 hover:scale-105 transition-all">
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
