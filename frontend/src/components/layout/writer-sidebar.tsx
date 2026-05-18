"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  TrendingUp, 
  CheckCircle2, 
  Wallet, 
  MessageSquare, 
  Star, 
  User, 
  Bell, 
  LifeBuoy,
  LogOut,
  LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";

export function WriterSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/writer/dashboard" },
    { label: "Available Tasks", icon: Briefcase, href: "/writer/tasks/available" },
    { label: "Active Tasks", icon: TrendingUp, href: "/writer/tasks/active" },
    { label: "Completed Tasks", icon: CheckCircle2, href: "/writer/tasks/completed" },
    { label: "Earnings", icon: Wallet, href: "/writer/earnings" },
    { label: "Messages", icon: MessageSquare, href: "/writer/messages" },
    { label: "Reviews", icon: Star, href: "/writer/reviews" },
    { label: "Profile", icon: User, href: "/writer/profile" },
    { label: "Notifications", icon: Bell, href: "/writer/notifications" },
    { label: "Support", icon: LifeBuoy, href: "/writer/support" },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 glass border-r border-white/20 flex flex-col hidden lg:flex overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute -top-10 -left-10 size-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex h-full flex-col px-6 py-8 relative z-10">
        <Link href="/" className="flex items-center gap-3 mb-10 group">
          <div className="size-10 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/30 group-hover:scale-105 transition-transform duration-300">
            <LayoutGrid className="size-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="block text-[16px] font-bold text-foreground tracking-tight leading-none">
              Project<span className="text-primary">Hub</span>
            </span>
            <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1.5 leading-none">
              Writer Portal
            </span>
          </div>
        </Link>

        <nav className="flex-1 space-y-1.5 custom-scrollbar overflow-y-auto pr-2">
          <p className="px-3 pb-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
            Manage Portal
          </p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3.5 text-[13.5px] font-bold transition-all duration-300 group",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/30" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <item.icon className={cn(
                  "size-5 transition-all duration-300", 
                  isActive 
                    ? "text-white scale-110" 
                    : "text-muted-foreground/50 group-hover:text-primary group-hover:scale-110"
                )} />
                {item.label}
                {isActive && (
                  <div className="ml-auto size-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <button
            onClick={() => authService.logout()}
            className="flex items-center gap-3 w-full rounded-2xl px-4 py-4 text-[13px] font-bold text-muted-foreground/60 hover:text-rose-500 hover:bg-rose-500/10 transition-all duration-200 group"
          >
            <LogOut className="size-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
