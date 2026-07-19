"use client";

import React, { useState, useEffect } from "react";
import { WriterSidebar } from "@/components/layout/writer-sidebar";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { MessageNotificationBell } from "@/components/notifications/message-notification-bell";
import { userService } from "@/services/user.service";
import { getFileUrl } from "@/lib/api-client";

export default function WriterLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile]       = useState<any>(null);

  useEffect(() => {
    userService.getMyProfile()
      .then((res: any) => setProfile(res.results))
      .catch(() => {});
  }, []);

  const initials = profile
    ? `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase() || "W"
    : "W";

  return (
    <div className="min-h-screen bg-muted">
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className="hidden lg:block">
        <WriterSidebar />
      </div>

      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 lg:hidden transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="absolute top-3 right-3 z-10">
          <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
            <X className="size-4 text-slate-600" />
          </button>
        </div>
        <WriterSidebar />
      </div>

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 h-14 flex items-center gap-3 px-4 lg:px-6 bg-white border-b border-border">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <Menu className="size-5 text-slate-600" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-1.5">
            <MessageNotificationBell />
            <NotificationBell />
            <div className="w-px h-5 bg-border mx-1" />
            <Link href="/writer/profile" className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="size-7 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center overflow-hidden flex-shrink-0">
                {profile?.profile_image_url ? (
                  <img src={getFileUrl(profile.profile_image_url)} alt="" className="w-full h-full object-cover" />
                ) : initials}
              </div>
              <span className="hidden sm:block text-sm font-medium text-foreground">
                {profile ? `${profile.first_name} ${profile.last_name}` : "Account"}
              </span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
