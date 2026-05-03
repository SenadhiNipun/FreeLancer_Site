"use client";

import React from "react";
import { WriterSidebar } from "@/components/layout/writer-sidebar";
import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { MessageNotificationBell } from "@/components/notifications/message-notification-bell";

export default function WriterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative">
      <WriterSidebar />
      
      <div className="lg:pl-72 flex flex-col min-h-screen relative z-10">
        {/* Dashboard Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between glass border-b border-white/10 px-6 lg:px-10 transition-all">
          <div className="relative w-full max-w-sm group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
            <input 
              placeholder="Search tasks, payments, messages..." 
              className="w-full h-10 pl-10 pr-4 rounded-xl glass border-white/5 bg-white/10 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <MessageNotificationBell />
              <NotificationBell />
            </div>
            
            <div className="flex items-center gap-3 pl-4 border-l border-white/10 ml-2">
              <div className="text-right hidden sm:block">
                <p className="text-[12px] font-bold text-foreground leading-none">Writer Profile</p>
                <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider mt-1">Specialist</p>
              </div>
              <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-[#7C3AED] flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                W
              </div>
            </div>
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
