"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  PenSquare,
  MessageSquare,
  ClipboardCheck,
  LogOut,
  Shield,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/writers",   label: "Writers",   icon: PenSquare },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/chats",     label: "All Chats", icon: MessageSquare },
  { href: "/admin/pending",   label: "Pending Approvals", icon: ClipboardCheck },
];

function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_roles");
    localStorage.removeItem("user");
    router.push("/sign-in");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-6 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="size-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
          }}
        >
          <Shield className="size-4 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[13px] font-black text-white tracking-tight">
            Project<span style={{ color: "#818cf8" }}>Hub</span>
          </p>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
            Super Admin
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all lg:hidden"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/25 px-3 mb-3">
          Control Center
        </p>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href} onClick={onClose}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 group",
                  active
                    ? "text-white"
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.05]"
                )}
                style={
                  active
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))",
                        border: "1px solid rgba(99,102,241,0.3)",
                      }
                    : {}
                }
              >
                <Icon
                  className={cn(
                    "size-4 flex-shrink-0 transition-colors",
                    active ? "text-indigo-400" : "text-white/30 group-hover:text-white/60"
                  )}
                  strokeWidth={2.5}
                />
                {label}
                {active && (
                  <ChevronRight className="size-3.5 ml-auto text-indigo-400" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div
        className="px-3 pb-5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 mt-3"
        >
          <LogOut className="size-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminName, setAdminName] = useState("Super Admin");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const roles: string[] = JSON.parse(localStorage.getItem("user_roles") || "[]");
    if (!roles.includes("SUPER_ADMIN") && !roles.includes("ADMIN")) {
      router.replace("/sign-in");
      return;
    }
    setChecked(true);

    // Fetch profile name
    import("@/services/user.service").then(({ userService }) => {
      userService
        .getMyProfile()
        .then((res: any) => {
          if (res?.results) {
            const { first_name, last_name } = res.results;
            setAdminName(`${first_name} ${last_name}`.trim() || "Super Admin");
          }
        })
        .catch(() => {});
    });
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0f18" }}>
        <div className="size-10 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
          <Shield className="size-5 text-white animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "oklch(0.97 0.005 260)" }}
    >
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop */}
      <aside
        className="hidden lg:flex flex-col w-[260px] fixed inset-y-0 left-0 z-30"
        style={{
          background: "linear-gradient(180deg, #0f0e1e 0%, #12101f 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <AdminSidebar />
      </aside>

      {/* Sidebar — mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col lg:hidden transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          background: "linear-gradient(180deg, #0f0e1e 0%, #12101f 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <AdminSidebar onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        {/* Topbar */}
        <header
          className="sticky top-0 z-20 flex items-center h-[58px] px-5 lg:px-8 gap-4"
          style={{
            background: "oklch(0.97 0.005 260 / 0.9)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid oklch(0.88 0.018 260 / 0.4)",
            boxShadow: "0 1px 0 oklch(1 0 0 / 0.7)",
          }}
        >
          <button
            className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06] transition-all"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </button>

          <div className="flex-1" />

          {/* Admin badge */}
          <div
            className="hidden sm:flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))",
              border: "1px solid rgba(99,102,241,0.25)",
              color: "#818cf8",
            }}
          >
            <Shield className="size-3" />
            Super Admin
          </div>

          {/* Avatar */}
          <div
            className="size-8 rounded-xl flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            {adminName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
          </div>

          <div className="hidden sm:block">
            <p className="text-[12px] font-bold text-foreground leading-none">{adminName}</p>
            <p className="text-[10px] text-muted-foreground/50 font-semibold uppercase tracking-wider mt-0.5">
              Super Admin
            </p>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 lg:p-8">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
