"use client";

import React, { useState, useEffect } from "react";
import { CustomerSidebar } from "@/components/layout/customer-sidebar";
import { Bell, Search, Menu, X, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { MessageNotificationBell } from "@/components/notifications/message-notification-bell";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { userService } from "@/services/user.service";
import { getFileUrl } from "@/lib/api-client";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    userService.getMyProfile()
      .then((res: any) => {
        setProfile(res.results);
      })
      .catch((err) => {
        console.error("Failed to load customer header profile:", err);
      });
  }, []);

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
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40 group-focus-within:text-primary group-hover:scale-110 group-focus-within:scale-110 transition-all duration-300" />
            <input
              placeholder="Search projects, messages…"
              className="w-full h-10 pl-10 pr-12 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 backdrop-blur-md text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:bg-white/10 outline-none shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 placeholder:text-muted-foreground/40"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/10 border border-white/10 pointer-events-none group-focus-within:opacity-0 transition-opacity duration-300">
              <span className="text-[10px] font-bold text-muted-foreground/50 tracking-widest uppercase">⌘K</span>
            </div>
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
            <div className="flex items-center gap-3.5">
              <ThemeToggle />
              <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />
              <MessageNotificationBell />
              <NotificationBell />
            </div>

            {/* Avatar */}
            <Link 
              href="/customer/profile"
              className="flex items-center gap-3 pl-4 border-l border-white/10 ml-2 group cursor-pointer"
            >
              <div className="text-right hidden sm:block">
                <p className="text-[12px] font-bold text-foreground group-hover:text-primary leading-none transition-colors">
                  {profile ? `${profile.first_name} ${profile.last_name}` : "Client Profile"}
                </p>
                <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider mt-1">
                  Premium
                </p>
              </div>
              <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-[#A78BFA] flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-primary/20 group-hover:scale-105 group-hover:shadow-primary/30 transition-all overflow-hidden border border-white/10">
                {profile?.profile_image_url ? (
                  <img 
                    src={getFileUrl(profile.profile_image_url)} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile ? `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase() || "C" : "C"
                )}
              </div>
            </Link>
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
