"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, PenSquare, MessageSquare,
  ClipboardCheck, LogOut, Shield, Menu, X, TicketCheck,
  Bell, UserCheck, TicketIcon, CheckCheck, ClipboardList, Send, AlertTriangle, Clock,
} from "lucide-react";
import { LogoutConfirmDialog } from "@/components/ui/logout-confirm-dialog";
import { notificationService } from "@/services/notification.service";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard",         icon: LayoutDashboard },
  { href: "/admin/writers",   label: "Writers",           icon: PenSquare },
  { href: "/admin/customers", label: "Customers",         icon: Users },
  { href: "/admin/tasks",     label: "Tasks",             icon: ClipboardList },
  { href: "/admin/chats",     label: "All Chats",         icon: MessageSquare },
  { href: "/admin/messages",  label: "Direct Messages",   icon: Send },
  { href: "/admin/pending",   label: "Pending Approvals", icon: ClipboardCheck },
  { href: "/admin/support",   label: "Support Tickets",   icon: TicketCheck },
];

function notifLink(n: any): string {
  if ((n.notification_type === "SUPPORT_TICKET" || n.notification_type === "SUPPORT_REPLY") && n.related_id) return `/admin/support/${n.related_id}`;
  if (n.notification_type === "WRITER_REGISTRATION")               return "/admin/pending";
  if (n.notification_type === "ADMIN_MESSAGE_REPLY" && n.related_id) return `/admin/messages/${n.related_id}`;
  if (n.notification_type === "TASK_OVERDUE" && n.related_id) return `/admin/tasks/${n.related_id}`;
  if (n.notification_type?.startsWith("TASK_DUE_") && n.related_id) return `/admin/tasks/${n.related_id}`;
  return "/admin/dashboard";
}

function notifIcon(type: string) {
  if (type === "SUPPORT_TICKET" || type === "SUPPORT_REPLY") return <TicketIcon className="size-4 text-amber-600" strokeWidth={1.75} />;
  if (type === "WRITER_REGISTRATION") return <UserCheck className="size-4 text-violet-600" strokeWidth={1.75} />;
  if (type === "ADMIN_MESSAGE_REPLY") return <Send className="size-4 text-violet-600" strokeWidth={1.75} />;
  if (type === "TASK_OVERDUE") return <AlertTriangle className="size-4 text-red-600" strokeWidth={1.75} />;
  if (type === "TASK_DUE_24_HOURS") return <Clock className="size-4 text-red-600" strokeWidth={1.75} />;
  if (type === "TASK_DUE_48_HOURS") return <Clock className="size-4 text-orange-600" strokeWidth={1.75} />;
  if (type === "TASK_DUE_7_DAYS") return <Clock className="size-4 text-amber-600" strokeWidth={1.75} />;
  return <Bell className="size-4 text-slate-500" strokeWidth={1.75} />;
}

// ── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const doLogout = () => {
    ["token", "refresh_token", "user_roles", "user"].forEach(k => localStorage.removeItem(k));
    router.push("/sign-in");
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <LogoutConfirmDialog open={confirmOpen} onConfirm={doLogout} onCancel={() => setConfirmOpen(false)} />

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
                active ? "bg-violet-600/20 text-violet-300 font-medium" : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}>
                <Icon className={cn("size-4 flex-shrink-0", active ? "text-violet-400" : "text-slate-500")} strokeWidth={1.75} />
                {label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3 flex-shrink-0">
        <button onClick={() => setConfirmOpen(true)}
          className="flex items-center gap-2.5 w-full px-2 py-2 rounded-lg text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
          <LogOut className="size-4 flex-shrink-0" strokeWidth={1.75} />
          Sign out
        </button>
      </div>
    </div>
  );
}

// ── Notification bell ─────────────────────────────────────────────────────────

function NotificationBell() {
  const [notifs, setNotifs]     = useState<any[]>([]);
  const [open, setOpen]         = useState(false);
  const ref                     = useRef<HTMLDivElement>(null);

  const load = () =>
    notificationService.getNotifications(30)
      .then((r: any) => setNotifs(r.results || []))
      .catch(() => {});

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifs.filter(n => !n.is_read).length;

  const markRead = async (n: any) => {
    if (!n.is_read) {
      await notificationService.markAsRead(n.id).catch(() => {});
      setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, is_read: true } : x));
    }
    setOpen(false);
  };

  const markAllRead = async () => {
    const unreadOnes = notifs.filter(n => !n.is_read);
    await Promise.all(unreadOnes.map(n => notificationService.markAsRead(n.id).catch(() => {})));
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
        <Bell className="size-5 text-slate-600" strokeWidth={1.75} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 size-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-border rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold text-foreground">Notifications</span>
            {unread > 0 && (
              <button onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-primary hover:underline">
                <CheckCheck className="size-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
            {notifs.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">No notifications</div>
            ) : (
              notifs.map(n => (
                <Link key={n.id} href={notifLink(n)} onClick={() => markRead(n)}>
                  <div className={cn(
                    "flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors cursor-pointer",
                    !n.is_read && "bg-violet-50/60"
                  )}>
                    <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {notifIcon(n.notification_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm leading-tight", !n.is_read ? "font-semibold text-foreground" : "text-foreground")}>
                        {n.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">
                        {n.created_at ? new Date(n.created_at).toLocaleString() : ""}
                      </p>
                    </div>
                    {!n.is_read && <span className="size-2 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" />}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router                    = useRouter();
  const [open, setOpen]           = useState(false);
  const [checked, setChecked]     = useState(false);
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

      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 flex flex-col lg:hidden transition-transform duration-300",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar onClose={() => setOpen(false)} />
      </aside>

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 h-14 flex items-center gap-3 px-4 lg:px-6 bg-white border-b border-border">
          <button className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors" onClick={() => setOpen(true)}>
            <Menu className="size-5 text-slate-600" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <NotificationBell />
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
