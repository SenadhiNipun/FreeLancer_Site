"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  ShoppingBag,
  Wallet,
  MessageSquare,
  Star,
  User,
  LifeBuoy,
  LogOut,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";

const menuItems = [
  { label: "Overview",    icon: LayoutDashboard, href: "/customer/dashboard" },
  { label: "New Task",    icon: PlusCircle,       href: "/customer/create-task" },
  { label: "My Projects", icon: ShoppingBag,      href: "/customer/orders" },
  { label: "Finances",    icon: Wallet,           href: "/customer/payments" },
  { label: "Messages",    icon: MessageSquare,    href: "/customer/messages" },
  { label: "Reviews",     icon: Star,             href: "/customer/reviews" },
  { label: "Profile",     icon: User,             href: "/customer/profile" },
  { label: "Support",     icon: LifeBuoy,         href: "/customer/support" },
];

export function CustomerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 glass border-r border-white/20 flex flex-col hidden lg:flex overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute -top-10 -left-10 size-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10 relative z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="size-9 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/30 group-hover:scale-105 transition-transform duration-300">
            <LayoutGrid className="size-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="block text-[15px] font-bold text-foreground tracking-tight leading-none">
              Project<span className="text-primary">Hub</span>
            </span>
            <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1.5 leading-none">
              Academic Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 relative z-10 custom-scrollbar">
        <p className="px-3 pb-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
          Core Menu
        </p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-[13px] font-bold transition-all duration-300 group",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <item.icon
                className={cn(
                  "size-4.5 flex-shrink-0 transition-all duration-300",
                  isActive
                    ? "text-white scale-110"
                    : "text-muted-foreground/50 group-hover:text-primary group-hover:scale-110"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {item.label}
              {isActive && (
                <div className="ml-auto size-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
            </Link>
          );
        })}

        {/* Upgrade Card (from mockup) */}
        <div className="mt-8 px-2">
          <div className="glass bg-primary/5 border border-primary/20 rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 size-20 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <Star className="size-5 text-primary mb-3" fill="currentColor" />
            <p className="text-[12px] font-bold text-foreground mb-1">Upgrade to Pro</p>
            <p className="text-[10px] text-muted-foreground leading-relaxed mb-4">
              Unlock advanced analytics and more features.
            </p>
            <button className="w-full py-2.5 rounded-xl bg-primary text-white text-[11px] font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
              Upgrade Now
            </button>
          </div>
        </div>
      </nav>

      {/* User section at bottom */}
      <div className="px-4 py-6 border-t border-white/10 glass bg-white/5">
        <div className="flex items-center gap-3 p-2.5 rounded-2xl transition-all cursor-pointer group">
          <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-[#A78BFA] flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-foreground truncate leading-none">
              John Doe
            </p>
            <p className="text-[10px] text-muted-foreground/70 font-bold uppercase tracking-wider mt-1.5">
              Premium member
            </p>
          </div>
        </div>
        <button
          onClick={() => authService.logout()}
          className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-[12px] font-bold text-muted-foreground/60 hover:text-rose-500 hover:bg-rose-500/10 transition-all duration-200 group mt-2"
        >
          <LogOut className="size-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
