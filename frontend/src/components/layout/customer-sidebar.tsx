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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white/90 backdrop-blur-xl border-r border-[#ede9ff]/80 shadow-[2px_0_16px_rgba(120,80,220,0.05)] flex flex-col hidden lg:flex">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[#f0ebff]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="size-8 rounded-xl bg-[#7C5CFC] flex items-center justify-center shadow-md shadow-violet-400/30 group-hover:shadow-violet-400/40 transition-shadow">
            <LayoutGrid className="size-4 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="block text-[14px] font-bold text-[#1a1033] leading-none">
              Project<span className="text-[#7C5CFC]">Hub</span>
            </span>
            <span className="block text-[10px] text-[#9490a8] font-medium mt-0.5 leading-none">
              Academic Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-0.5">
        <p className="px-3 pb-3 text-[10px] font-bold text-[#c4bfd8] uppercase tracking-widest">
          Menu
        </p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150 group",
                isActive
                  ? "bg-[#7C5CFC]/10 text-[#7C5CFC]"
                  : "text-[#6b6880] hover:text-[#1a1033] hover:bg-[#f5f2ff]"
              )}
            >
              <item.icon
                className={cn(
                  "size-4 flex-shrink-0 transition-colors",
                  isActive
                    ? "text-[#7C5CFC]"
                    : "text-[#c4bfd8] group-hover:text-[#7C5CFC]"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {item.label}
              {isActive && (
                <div className="ml-auto size-1.5 rounded-full bg-[#7C5CFC]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User card at bottom */}
      <div className="px-4 py-4 border-t border-[#f0ebff]">
        <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#f5f2ff] transition-colors cursor-pointer">
          <div className="size-9 rounded-full bg-gradient-to-br from-[#7C5CFC] to-[#A78BFA] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md shadow-violet-400/20">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-[#1a1033] truncate leading-none">
              John Doe
            </p>
            <p className="text-[10px] text-[#9490a8] mt-0.5 truncate">
              Premium member
            </p>
          </div>
        </div>
        <button
          onClick={() => authService.logout()}
          className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-[12px] font-medium text-[#9490a8] hover:text-rose-500 hover:bg-rose-50 transition-all duration-150 group mt-1"
        >
          <LogOut className="size-4 flex-shrink-0 group-hover:text-rose-500 transition-colors" strokeWidth={2} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
