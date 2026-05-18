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
  LayoutGrid
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
    <aside className="fixed left-0 top-0 z-40 h-screen w-[280px] glass border-r border-white/20 flex flex-col hidden lg:flex overflow-hidden">
      {/* Premium Ambient Background Glows */}
      <div className="absolute -top-12 -left-12 size-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 size-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Brand logo container */}
      <div className="flex items-center gap-3 px-7 py-7 border-b border-white/10 relative z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="size-10 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/30 group-hover:scale-[1.05] transition-transform duration-300">
            <LayoutGrid className="size-5.5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="block text-[15px] font-black text-foreground tracking-tight leading-none">
              Project<span className="text-primary">Hub</span>
            </span>
            <span className="block text-[10px] text-muted-foreground/80 font-black uppercase tracking-widest mt-1.5 leading-none">
              Academic Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Grouped sidebar navigation */}
      <nav className="flex-1 overflow-y-auto px-4.5 py-6 space-y-6 relative z-10 custom-scrollbar">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1.5">
            <p className="px-3 text-[10px] font-extrabold text-muted-foreground/50 uppercase tracking-[0.2em] mb-2.5">
              {group.title}
            </p>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-[13px] font-bold transition-all duration-300 group hover:translate-x-0.5 cursor-pointer select-none",
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/30" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5 dark:hover:bg-white/[0.02]"
                  )}
                >
                  <item.icon className={cn(
                    "size-4.5 transition-all duration-300", 
                    isActive 
                      ? "text-white scale-110" 
                      : "text-muted-foreground/55 group-hover:text-primary group-hover:scale-110"
                  )} strokeWidth={2} />
                  {item.label}
                  {isActive && (
                    <div className="ml-auto size-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Account Info Profile tray at the bottom */}
      <div className="p-4.5 border-t border-white/10 glass bg-white/5 dark:bg-slate-900/10 space-y-2 relative z-10">
        <Link href="/customer/profile" className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white/5 transition-all group">
          <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-[#8B5CF6] flex items-center justify-center text-white text-[13px] font-black flex-shrink-0 shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-foreground truncate leading-none">
              {userName}
            </p>
            <p className="text-[9px] text-muted-foreground/75 font-black uppercase tracking-wider mt-1.5">
              Premium Client
            </p>
          </div>
        </Link>
        <button
          onClick={() => authService.logout()}
          className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-[12px] font-bold text-muted-foreground/60 hover:text-rose-500 hover:bg-rose-500/10 transition-all duration-200 group"
        >
          <LogOut className="size-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
