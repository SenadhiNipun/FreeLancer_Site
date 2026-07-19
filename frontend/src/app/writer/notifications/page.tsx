"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell, BellOff, Check, CheckSquare, Briefcase, CheckCircle2,
  MessageSquare, Star, RefreshCw, Sparkles, Clock, ArrowRight, Loader2,
} from "lucide-react";
import { notificationService } from "@/services/notification.service";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Notif {
  id: number; title: string; message: string;
  notification_type: string; related_id?: number | null;
  is_read: boolean; created_at: string;
}

const TYPE_CFG: Record<string, { icon: any; color: string; link: string }> = {
  TASK_AVAILABLE:    { icon: Briefcase,     color: "bg-green-50 border-green-100 text-green-600",  link: "/writer/tasks/available" },
  BID_ACCEPTED:      { icon: CheckCircle2,  color: "bg-blue-50 border-blue-100 text-blue-600",    link: "/writer/tasks/active" },
  NEW_MESSAGE:       { icon: MessageSquare, color: "bg-sky-50 border-sky-100 text-sky-600",       link: "/writer/messages" },
  REVIEW_RECEIVED:   { icon: Star,          color: "bg-amber-50 border-amber-100 text-amber-600", link: "/writer/reviews" },
  TASK_APPROVED:     { icon: Sparkles,      color: "bg-violet-50 border-violet-100 text-violet-600", link: "/writer/tasks/completed" },
  REVISION_REQUESTED:{ icon: RefreshCw,     color: "bg-orange-50 border-orange-100 text-orange-600", link: "/writer/tasks/active" },
};

const CATS = [
  { id: "all",      label: "All" },
  { id: "system",   label: "System" },
  { id: "messages", label: "Messages" },
];

export default function NotificationsPage() {
  const [notifs, setNotifs]         = useState<Notif[]>([]);
  const [loading, setLoading]       = useState(true);
  const [cat, setCat]               = useState("all");
  const [statusFilter, setStatus]   = useState("all");
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    notificationService.getNotifications(50)
      .then(r => setNotifs(r.results || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id: number) => {
    await notificationService.markAsRead(id).catch(console.error);
    setNotifs(p => p.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllRead = async () => {
    const unread = filtered.filter(n => !n.is_read);
    if (!unread.length) return;
    setMarkingAll(true);
    await Promise.all(unread.map(n => notificationService.markAsRead(n.id))).catch(console.error);
    const ids = new Set(unread.map(n => n.id));
    setNotifs(p => p.map(n => ids.has(n.id) ? { ...n, is_read: true } : n));
    setMarkingAll(false);
  };

  const filtered = notifs.filter(n => {
    if (cat === "system" && n.notification_type === "NEW_MESSAGE") return false;
    if (cat === "messages" && n.notification_type !== "NEW_MESSAGE") return false;
    if (statusFilter === "unread") return !n.is_read;
    if (statusFilter === "read") return n.is_read;
    return true;
  });

  const unreadCount = filtered.filter(n => !n.is_read).length;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="size-5 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {notifs.filter(n => !n.is_read).length} unread notification{notifs.filter(n => !n.is_read).length !== 1 ? "s" : ""}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} disabled={markingAll}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50">
            <CheckSquare className="size-4" />
            {markingAll ? "Marking…" : "Mark all read"}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white border border-border rounded-xl p-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex gap-1.5">
          {CATS.map(c => (
            <button key={c.id} onClick={() => { setCat(c.id); setStatus("all"); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${cat === c.id ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 sm:ml-auto">
          {["all","unread","read"].map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${statusFilter === s ? "bg-slate-900 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BellOff className="size-8 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-foreground">No notifications here</p>
            <p className="text-xs text-muted-foreground mt-1">Try switching the filters above.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filtered.map((n) => {
              const cfg  = TYPE_CFG[n.notification_type] || { icon: Bell, color: "bg-slate-50 border-slate-100 text-slate-500", link: "/writer/dashboard" };
              const Icon = cfg.icon;
              return (
                <div key={n.id} onClick={() => markRead(n.id)}
                  className={cn(
                    "flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors relative",
                    n.is_read ? "hover:bg-muted/20" : "bg-violet-50/30 hover:bg-violet-50/50"
                  )}>
                  {!n.is_read && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-r" />}
                  <div className={cn("size-9 rounded-lg border flex items-center justify-center flex-shrink-0", cfg.color)}>
                    <Icon className="size-4" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={cn("text-sm truncate", n.is_read ? "text-foreground" : "font-medium text-foreground")}>{n.title}</p>
                      {!n.is_read && <span className="px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-medium">New</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1 flex items-center gap-1">
                      <Clock className="size-3" />
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Link href={cfg.link} onClick={e => e.stopPropagation()}>
                      <button className="h-8 px-3 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1">
                        View <ArrowRight className="size-3" />
                      </button>
                    </Link>
                    {!n.is_read && (
                      <button onClick={e => { e.stopPropagation(); markRead(n.id); }}
                        className="size-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-green-600 hover:border-green-200 hover:bg-green-50 transition-colors">
                        <Check className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
