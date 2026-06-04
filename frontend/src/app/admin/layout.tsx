"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, PenSquare, MessageSquare,
  ClipboardCheck, LogOut, Shield, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard",        icon: LayoutDashboard },
  { href: "/admin/writers",   label: "Writers",          icon: PenSquare },
  { href: "/admin/customers", label: "Customers",        icon: Users },
  { href: "/admin/chats",     label: "All Chats",        icon: MessageSquare },
  { href: "/admin/pending",   label: "Pending Approvals",icon: ClipboardCheck },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router   = useRouter();

  const logout = () => {
    ["token","refresh_token","user_roles","user"].forEach(k => localStorage.removeItem(k));
    router.push("/sign-in");
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-white/10 flex-shrink-0">
        <div className="size-7 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
          <Shield className="size-4 text-white" strokeWidth={2} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">ProjectHub</p>
          <p className="text-[10px] text-slate-500 leading-none">Admin Panel</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors lg:hidden">
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-2 mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Control Center</p>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href} onClick={onClose}>
              <div className={cn(
                "flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors",
                active
                  ? "bg-violet-600/20 text-violet-300 font-medium"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}>
                <Icon className={cn("size-4 flex-shrink-0", active ? "text-violet-400" : "text-slate-500")} strokeWidth={1.75} />
                {label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3 flex-shrink-0">
        <button
          onClick={logout}
          className="flex items-center gap-2.5 w-full px-2 py-2 rounded-lg text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="size-4 flex-shrink-0" strokeWidth={1.75} />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router         = useRouter();
  const [open, setOpen]    = useState(false);
  const [checked, setChecked] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const roles: string[] = JSON.parse(localStorage.getItem("user_roles") || "[]");
    if (!roles.includes("SUPER_ADMIN") && !roles.includes("ADMIN")) {
      router.replace("/sign-in");
      return;
    }
    setChecked(true);
    import("@/services/user.service").then(({ userService }) => {
      userService.getMyProfile().then((res: any) => {
        const { first_name, last_name } = res?.results || {};
        setAdminName(`${first_name || ""} ${last_name || ""}`.trim() || "Admin");
      }).catch(() => {});
    });
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Shield className="size-8 text-violet-500 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-muted">
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {/* Sidebar mobile */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 flex flex-col lg:hidden transition-transform duration-300",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar onClose={() => setOpen(false)} />
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 h-14 flex items-center gap-3 px-4 lg:px-6 bg-white border-b border-border">
          <button className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors" onClick={() => setOpen(true)}>
            <Menu className="size-5 text-slate-600" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200">
              <Shield className="size-3" />
              Super Admin
            </span>
            <div className="size-7 rounded-full bg-violet-600 text-white text-xs font-semibold flex items-center justify-center">
              {adminName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
            </div>
            <span className="hidden sm:block text-sm font-medium text-foreground">{adminName}</span>
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
