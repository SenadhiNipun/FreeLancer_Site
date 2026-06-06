"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";
import { LogoutConfirmDialog } from "@/components/ui/logout-confirm-dialog";

const menuGroups = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard",   icon: LayoutDashboard, href: "/customer/dashboard" },
      { label: "Messages",    icon: MessageSquare,   href: "/customer/messages" },
    ],
  },
  {
    title: "Projects",
    items: [
      { label: "New Task",    icon: PlusCircle,  href: "/customer/create-task" },
      { label: "My Orders",   icon: ShoppingBag, href: "/customer/orders" },
    ],
  },
  {
    title: "Finances",
    items: [
      { label: "Payments",    icon: Wallet, href: "/customer/payments" },
      { label: "Reviews",     icon: Star,   href: "/customer/reviews" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile",     icon: User,    href: "/customer/profile" },
      { label: "Support",     icon: LifeBuoy, href: "/customer/support" },
    ],
  },
];

export function CustomerSidebar() {
  const pathname = usePathname();
  const [userName, setUserName]         = useState("Client");
  const [userInitials, setUserInitials] = useState("CL");
  const [confirmOpen, setConfirmOpen]   = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const first = user.first_name || "";
        const last  = user.last_name  || "";
        setUserName(`${first} ${last}`.trim() || "Client");
        setUserInitials(((first[0] || "C") + (last[0] || "L")).toUpperCase());
      } catch {}
    }
  }, []);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 flex flex-col bg-white border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-border flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="size-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor"/>
              <rect x="8" y="1" width="5" height="5" rx="1" fill="currentColor" opacity="0.7"/>
              <rect x="1" y="8" width="5" height="5" rx="1" fill="currentColor" opacity="0.7"/>
              <rect x="8" y="8" width="5" height="5" rx="1" fill="currentColor"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-foreground">ProjectHub</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="px-2 mb-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link key={item.href} href={item.href}>
                    <div className={cn(
                      "flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-violet-50 text-violet-700 font-medium"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}>
                      <item.icon className={cn("size-4 flex-shrink-0", isActive ? "text-violet-600" : "text-slate-400")} strokeWidth={isActive ? 2 : 1.75} />
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User tray */}
      <div className="px-3 pb-3 border-t border-border pt-3 flex-shrink-0">
        <Link href="/customer/profile" className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors group">
          <div className="size-7 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate leading-tight">{userName}</p>
            <p className="text-xs text-muted-foreground">Customer</p>
          </div>
        </Link>
        <button
          onClick={() => setConfirmOpen(true)}
          className="flex items-center gap-2.5 w-full px-2 py-2 rounded-lg text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors mt-0.5"
        >
          <LogOut className="size-4 flex-shrink-0" strokeWidth={1.75} />
          Sign out
        </button>
      </div>

      <LogoutConfirmDialog
        open={confirmOpen}
        onConfirm={() => authService.logout()}
        onCancel={() => setConfirmOpen(false)}
      />
    </aside>
  );
}
