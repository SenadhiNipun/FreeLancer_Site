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
    <div className="min-h-screen bg-background">
      <WriterSidebar />
      
      <div className="pl-72">
        {/* Dashboard Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border/50 bg-background/70 px-8 backdrop-blur-xl">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search tasks, payments, messages..." 
              className="pl-10 h-10 bg-muted/50 border-none rounded-xl focus-visible:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-4">
            <MessageNotificationBell />
            <NotificationBell />
            <div className="flex items-center gap-3 pl-6 border-l border-border/50">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-foreground">Senadhi Rajarathna</p>
                <p className="text-xs text-muted-foreground">Specialist Writer</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                SR
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
