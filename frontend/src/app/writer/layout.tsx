"use client";

import React, { useState, useEffect } from "react";
import { WriterSidebar } from "@/components/layout/writer-sidebar";
import { Search } from "lucide-react";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { MessageNotificationBell } from "@/components/notifications/message-notification-bell";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { userService } from "@/services/user.service";
import { getFileUrl } from "@/lib/api-client";
import Link from "next/link";

export default function WriterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    userService.getMyProfile()
      .then((res: any) => { setProfile(res.results); })
      .catch((err) => { console.error("Failed to load writer header profile:", err); });
  }, []);

  return (
    <div className="min-h-screen relative">
      <WriterSidebar />

      <div className="lg:pl-[272px] flex flex-col min-h-screen relative z-10">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between px-6 lg:px-8 transition-all"
          style={{
            background: "oklch(0.985 0.006 260 / 0.88)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid oklch(0.88 0.018 260 / 0.45)",
            boxShadow: "0 1px 0 oklch(1 0 0 / 0.6), 0 4px 16px oklch(0 0 0 / 0.04)"
          }}>

          {/* Search */}
          <div className="relative w-full max-w-[300px] hidden sm:block group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/35 group-focus-within:text-primary transition-colors duration-200" />
            <input
              placeholder="Search tasks, payments..."
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

          {/* Right side */}
          <div className="flex items-center gap-3 ml-auto">
            <ThemeToggle />
            <div className="w-px h-5 bg-border/60" />
            <div className="flex items-center gap-2">
              <MessageNotificationBell />
              <NotificationBell />
            </div>
            <div className="w-px h-5 bg-border/60" />

            {/* Profile */}
            <Link href="/writer/profile"
              className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-all duration-200 hover:bg-foreground/[0.04] group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-[12px] font-bold text-foreground group-hover:text-primary leading-none transition-colors">
                  {profile ? `${profile.first_name} ${profile.last_name}` : "Writer Profile"}
                </p>
                <p className="text-[10px] text-muted-foreground/55 font-semibold uppercase tracking-wider mt-0.5">Specialist</p>
              </div>
              <div className="size-8 rounded-xl flex items-center justify-center text-white text-[11px] font-bold shadow-md overflow-hidden border border-white/20 flex-shrink-0 transition-transform group-hover:scale-105"
                style={{ background: "linear-gradient(135deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))" }}>
                {profile?.profile_image_url ? (
                  <img src={getFileUrl(profile.profile_image_url)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profile ? `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase() || "W" : "W"
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-[1360px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
