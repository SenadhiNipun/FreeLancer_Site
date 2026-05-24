"use client";

import React, { useState, useEffect } from "react";
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
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";

export function CustomerSidebar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState("Premium Client");
  const [userInitials, setUserInitials] = useState("CS");

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const first = user.first_name || "";
        const last = user.last_name || "";
        setUserName(`${first} ${last}`.trim() || "Premium Client");
        const fChar = first.charAt(0) || "C";
        const lChar = last.charAt(0) || "S";
        setUserInitials((fChar + lChar).toUpperCase());
      } catch (e) {
        console.error("Failed to parse user details in customer sidebar:", e);
      }
    }
  }, []);

  const menuGroups = [
    {
      title: "Core Operations",
      items: [
        { label: "Overview", icon: LayoutDashboard, href: "/customer/dashboard" },
        { label: "Messages", icon: MessageSquare, href: "/customer/messages" },
      ]
    },
    {
      title: "Projects Hub",
      items: [
        { label: "New Task", icon: PlusCircle, href: "/customer/create-task" },
        { label: "My Projects", icon: ShoppingBag, href: "/customer/orders" },
      ]
    },
    {
      title: "Billing & Reviews",
      items: [
        { label: "Finances", icon: Wallet, href: "/customer/payments" },
        { label: "Reviews", icon: Star, href: "/customer/reviews" },
      ]
    },
    {
      title: "Account & Help",
      items: [
        { label: "Profile", icon: User, href: "/customer/profile" },
        { label: "Support", icon: LifeBuoy, href: "/customer/support" },
      ]
    }
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[272px] flex flex-col hidden lg:flex overflow-hidden"
      style={{
        background: "linear-gradient(180deg, oklch(0.985 0.006 260 / 0.95) 0%, oklch(0.97 0.012 265 / 0.95) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid oklch(0.88 0.018 260 / 0.5)",
        boxShadow: "4px 0 24px oklch(0 0 0 / 0.04), inset -1px 0 0 oklch(1 0 0 / 0.6)"
      }}>

      {/* Ambient glow */}
      <div className="absolute -top-16 -left-16 size-56 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(0.58 0.22 265 / 0.08) 0%, transparent 70%)" }} />

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 relative z-10"
        style={{ borderBottom: "1px solid oklch(0.88 0.018 260 / 0.4)" }}>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="size-9 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:rotate-3"
            style={{ background: "linear-gradient(135deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))", boxShadow: "0 6px 16px oklch(0.58 0.22 265 / 0.3)" }}>
            <LayoutGrid className="size-4.5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="block text-[14px] font-black text-foreground tracking-tight leading-none">
              Project<span className="text-primary">Hub</span>
            </span>
            <span className="block text-[9px] text-muted-foreground/60 font-bold uppercase tracking-[0.18em] mt-1 leading-none">
              Academic Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6 relative z-10 custom-scrollbar">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <p className="px-3 text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.18em] mb-2">
              {group.title}
            </p>
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-200 group relative",
                    isActive
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  style={isActive ? {
                    background: "linear-gradient(135deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))",
                    boxShadow: "0 4px 12px oklch(0.58 0.22 265 / 0.25), inset 0 1px 0 oklch(1 0 0 / 0.15)"
                  } : undefined}
                >
                  {!isActive && (
                    <span className="absolute inset-0 rounded-xl bg-foreground/0 group-hover:bg-foreground/[0.04] transition-colors duration-200" />
                  )}
                  <item.icon
                    className={cn(
                      "size-4 flex-shrink-0 transition-all duration-200 relative z-10",
                      isActive ? "text-white" : "text-muted-foreground/50 group-hover:text-primary"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="relative z-10 flex-1">{item.label}</span>
                  {isActive && (
                    <span className="relative z-10 size-1.5 rounded-full bg-white/80 animate-pulse" />
                  )}
                  {!isActive && (
                    <ChevronRight className="relative z-10 size-3.5 text-muted-foreground/25 group-hover:text-muted-foreground/50 transition-colors" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Profile tray */}
      <div className="p-3 relative z-10"
        style={{ borderTop: "1px solid oklch(0.88 0.018 260 / 0.4)" }}>
        <Link href="/customer/profile"
          className="flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 group hover:bg-foreground/[0.04]">
          <div className="size-9 rounded-xl flex items-center justify-center text-white text-[12px] font-black flex-shrink-0 shadow-md transition-transform group-hover:scale-105"
            style={{ background: "linear-gradient(135deg, oklch(0.62 0.22 265), oklch(0.65 0.2 310))", boxShadow: "0 4px 10px oklch(0.58 0.22 265 / 0.2)" }}>
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-foreground truncate leading-none">{userName}</p>
            <p className="text-[10px] text-muted-foreground/60 font-semibold uppercase tracking-wider mt-1">Premium Client</p>
          </div>
        </Link>
        <button
          onClick={() => authService.logout()}
          className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-[12px] font-semibold text-muted-foreground/50 hover:text-rose-500 hover:bg-rose-500/8 transition-all duration-200 group mt-1"
        >
          <LogOut className="size-3.5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
