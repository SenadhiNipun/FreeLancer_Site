"use client";

import React, { useState, useEffect } from "react";
import { CustomerSidebar } from "@/components/layout/customer-sidebar";
import { Search, Menu, X, LayoutGrid } from "lucide-react";
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
      .then((res: any) => { setProfile(res.results); })
      .catch((err) => { console.error("Failed to load customer header profile:", err); });
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar – desktop */}
      <div className="hidden lg:block">
        <CustomerSidebar />
      </div>

      {/* Sidebar – mobile */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-[272px] transition-transform duration-400 ease-in-out lg:hidden",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}
        style={{
          background: "oklch(0.985 0.006 260 / 0.97)",
          backdropFilter: "blur(24px)",
          borderRight: "1px solid oklch(0.88 0.018 260 / 0.5)",
          boxShadow: "8px 0 32px oklch(0 0 0 / 0.1)"
        }}>
        <div className="flex items-center justify-between px-5 py-5"
          style={{ borderBottom: "1px solid oklch(0.88 0.018 260 / 0.4)" }}>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))", boxShadow: "0 4px 12px oklch(0.58 0.22 265 / 0.3)" }}>
              <LayoutGrid className="size-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[14px] font-bold text-foreground">
              Project<span className="text-primary">Hub</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-xl p-1.5 text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06] transition-all"
          >
            <X className="size-4" />
          </button>
        </div>
        <CustomerSidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-[272px] flex flex-col min-h-screen relative z-10">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-[60px] items-center gap-4 px-5 lg:px-8 transition-all"
          style={{
            background: "oklch(0.985 0.006 260 / 0.88)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid oklch(0.88 0.018 260 / 0.45)",
            boxShadow: "0 1px 0 oklch(1 0 0 / 0.6), 0 4px 16px oklch(0 0 0 / 0.04)"
          }}>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden rounded-xl p-2 text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06] transition-all"
            aria-label="Open sidebar"
          >
            <Menu className="size-5" />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-[300px] hidden sm:block group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/35 group-focus-within:text-primary transition-colors duration-200" />
            <input
              placeholder="Search projects, messages..."
              className="w-full h-9 pl-9 pr-4 rounded-xl text-[13px] font-medium outline-none transition-all duration-200 placeholder:text-muted-foreground/35"
              style={{
                background: "oklch(0 0 0 / 0.04)",
                border: "1px solid oklch(0.88 0.018 260 / 0.5)",
              }}
              onFocus={e => {
                e.currentTarget.style.background = "oklch(1 0 0 / 0.8)";
                e.currentTarget.style.borderColor = "oklch(0.58 0.22 265 / 0.4)";
                e.currentTarget.style.boxShadow = "0 0 0 3px oklch(0.58 0.22 265 / 0.08)";
              }}
              onBlur={e => {
                e.currentTarget.style.background = "oklch(0 0 0 / 0.04)";
                e.currentTarget.style.borderColor = "oklch(0.88 0.018 260 / 0.5)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <div className="flex-1" />

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div className="hidden md:flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wider"
              style={{ background: "oklch(0 0 0 / 0.04)", border: "1px solid oklch(0.88 0.018 260 / 0.4)" }}>
              <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
              Systems Optimal
            </div>

            <ThemeToggle />
            <div className="w-px h-5 bg-border/60" />
            <div className="flex items-center gap-2">
              <MessageNotificationBell />
              <NotificationBell />
            </div>
            <div className="w-px h-5 bg-border/60" />

            {/* Profile */}
            <Link
              href="/customer/profile"
              className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-all duration-200 hover:bg-foreground/[0.04] group cursor-pointer"
            >
              <div className="text-right hidden sm:block">
                <p className="text-[12px] font-bold text-foreground group-hover:text-primary leading-none transition-colors">
                  {profile ? `${profile.first_name} ${profile.last_name}` : "Client Profile"}
                </p>
                <p className="text-[10px] text-muted-foreground/55 font-semibold uppercase tracking-wider mt-0.5">Premium</p>
              </div>
              <div className="size-8 rounded-xl flex items-center justify-center text-white text-[11px] font-bold shadow-md overflow-hidden border border-white/20 flex-shrink-0 transition-transform group-hover:scale-105"
                style={{ background: "linear-gradient(135deg, oklch(0.62 0.22 265), oklch(0.65 0.2 310))" }}>
                {profile?.profile_image_url ? (
                  <img src={getFileUrl(profile.profile_image_url)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profile ? `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase() || "C" : "C"
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 lg:p-8">
          <div className="mx-auto max-w-[1360px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
