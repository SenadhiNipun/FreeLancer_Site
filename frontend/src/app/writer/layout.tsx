"use client";

import React, { useState, useEffect } from "react";
import { WriterSidebar } from "@/components/layout/writer-sidebar";
import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
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
      .then((res: any) => {
        setProfile(res.results);
      })
      .catch((err) => {
        console.error("Failed to load writer header profile:", err);
      });
  }, []);

  return (
    <div className="min-h-screen relative">
      <WriterSidebar />
      
      <div className="lg:pl-72 flex flex-col min-h-screen relative z-10">
        {/* Dashboard Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between glass border-b border-white/10 px-6 lg:px-10 transition-all">
          <div className="relative w-full max-w-sm hidden sm:block group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40 group-focus-within:text-primary group-hover:scale-110 group-focus-within:scale-110 transition-all duration-300" />
            <input 
              placeholder="Search tasks, payments, messages..." 
              className="w-full h-10 pl-10 pr-12 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 backdrop-blur-md text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:bg-white/10 outline-none shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 placeholder:text-muted-foreground/40"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/10 border border-white/10 pointer-events-none group-focus-within:opacity-0 transition-opacity duration-300">
              <span className="text-[10px] font-bold text-muted-foreground/50 tracking-widest uppercase">⌘K</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-3.5">
              <MessageNotificationBell />
              <NotificationBell />
            </div>
            
            <Link 
              href="/writer/profile" 
              className="flex items-center gap-3 pl-4 border-l border-white/10 ml-2 group cursor-pointer"
            >
              <div className="text-right hidden sm:block">
                <p className="text-[12px] font-bold text-foreground group-hover:text-primary leading-none transition-colors">
                  {profile ? `${profile.first_name} ${profile.last_name}` : "Writer Profile"}
                </p>
                <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider mt-1">Specialist</p>
              </div>
              <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-[#7C3AED] flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-primary/20 group-hover:scale-105 group-hover:shadow-primary/30 transition-all overflow-hidden border border-white/10">
                {profile?.profile_image_url ? (
                  <img 
                    src={getFileUrl(profile.profile_image_url)} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile ? `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase() || "W" : "W"
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 lg:p-10">
          <div className="mx-auto max-w-[1360px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
