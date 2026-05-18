"use client";

import React, { useState, useEffect } from "react";
import { 
  Bell, 
  BellOff, 
  Check, 
  CheckSquare, 
  Briefcase, 
  CheckCircle2, 
  MessageSquare, 
  Star, 
  RefreshCw, 
  Sparkles, 
  Clock,
  ArrowRight,
  Activity,
  Layers,
  MessagesSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { notificationService } from "@/services/notification.service";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ChatNotification {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  related_id?: number | null;
  is_read: boolean;
  created_at: string;
}

export default function WriterNotificationsPage() {
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<"all" | "system" | "messages">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read">("all");
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications(50);
      setNotifications(res.results || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    // Only mark unread notifications of the current category as read
    const currentUnread = notifications.filter(n => {
      const matchesCategory = 
        category === "all" ||
        (category === "system" && n.notification_type !== "NEW_MESSAGE") ||
        (category === "messages" && n.notification_type === "NEW_MESSAGE");
      return matchesCategory && !n.is_read;
    });

    if (currentUnread.length === 0) return;

    setMarkingAll(true);
    try {
      await Promise.all(currentUnread.map(n => notificationService.markAsRead(n.id)));
      const readIds = new Set(currentUnread.map(n => n.id));
      setNotifications(prev => prev.map(n => readIds.has(n.id) ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    } finally {
      setMarkingAll(false);
    }
  };

  const getNotificationConfig = (type: string) => {
    switch (type) {
      case "TASK_AVAILABLE":
        return {
          icon: Briefcase,
          bg: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 dark:bg-emerald-500/20 dark:text-emerald-400",
          link: "/writer/tasks/available"
        };
      case "BID_ACCEPTED":
        return {
          icon: CheckCircle2,
          bg: "bg-indigo-500/10 text-indigo-500 border border-indigo-500/10 dark:bg-indigo-500/20 dark:text-indigo-400",
          link: "/writer/tasks/active"
        };
      case "NEW_MESSAGE":
        return {
          icon: MessageSquare,
          bg: "bg-sky-500/10 text-sky-500 border border-sky-500/10 dark:bg-sky-500/20 dark:text-sky-400",
          link: "/writer/messages"
        };
      case "REVIEW_RECEIVED":
        return {
          icon: Star,
          bg: "bg-amber-500/10 text-amber-500 border border-amber-500/10 dark:bg-amber-500/20 dark:text-amber-400",
          link: "/writer/reviews"
        };
      case "TASK_APPROVED":
        return {
          icon: Sparkles,
          bg: "bg-purple-500/10 text-purple-500 border border-purple-500/10 dark:bg-purple-500/20 dark:text-purple-400",
          link: "/writer/tasks/completed"
        };
      case "REVISION_REQUESTED":
        return {
          icon: RefreshCw,
          bg: "bg-rose-500/10 text-rose-500 border border-rose-500/10 dark:bg-rose-500/20 dark:text-rose-400",
          link: "/writer/tasks/active"
        };
      default:
        return {
          icon: Bell,
          bg: "bg-slate-500/10 text-slate-500 border border-slate-500/10 dark:bg-slate-500/20 dark:text-slate-400",
          link: "/writer/dashboard"
        };
    }
  };

  // Filter based on both Category and Status filters
  const filteredNotifications = notifications.filter(n => {
    // 1. Category filter
    if (category === "system" && n.notification_type === "NEW_MESSAGE") return false;
    if (category === "messages" && n.notification_type !== "NEW_MESSAGE") return false;

    // 2. Status filter
    if (statusFilter === "unread") return !n.is_read;
    if (statusFilter === "read") return n.is_read;

    return true;
  });

  // Calculate Global Counts for Category Tabs
  const totalCount = notifications.length;
  const systemCount = notifications.filter(n => n.notification_type !== "NEW_MESSAGE").length;
  const messagesCount = notifications.filter(n => n.notification_type === "NEW_MESSAGE").length;

  // Calculate Contextual Status Counts based on selected Category
  const activeCategoryNotifs = notifications.filter(n => {
    if (category === "system") return n.notification_type !== "NEW_MESSAGE";
    if (category === "messages") return n.notification_type === "NEW_MESSAGE";
    return true;
  });

  const catAllCount = activeCategoryNotifs.length;
  const catUnreadCount = activeCategoryNotifs.filter(n => !n.is_read).length;
  const catReadCount = activeCategoryNotifs.filter(n => n.is_read).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-reveal">
        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/20 animate-pulse" />
          <Activity className="size-6 text-primary animate-bounce" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-sm font-bold text-foreground tracking-tight uppercase tracking-[0.2em]">Synchronizing Notifications</p>
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-progress" style={{ width: '40%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-reveal pb-10">
      
      {/* ── Page Header ── */}
      <div className="glass rounded-[2rem] p-8 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 border-gradient">
        <div className="absolute -bottom-24 -left-24 size-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2.5 text-center sm:text-left">
          <div className="size-12 rounded-2xl glass bg-card/50 flex items-center justify-center mx-auto sm:mx-0 shadow-lg shadow-black/5 text-primary">
            <Bell className="size-5.5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Notification Center</h1>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Stay updated with active bids, work deliveries, customer feedback, and message streams.
            </p>
          </div>
        </div>

        {catUnreadCount > 0 && (
          <Button 
            onClick={handleMarkAllAsRead}
            disabled={markingAll}
            className="h-11 px-6 rounded-xl font-bold bg-primary text-white shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all gap-2.5 cursor-pointer select-none"
          >
            <CheckSquare className="size-4" />
            Mark Current as Read
          </Button>
        )}
      </div>

      {/* ── Notification Management Container ── */}
      <div className="glass rounded-3xl overflow-hidden border border-white/10 dark:border-white/5 shadow-2xl shadow-black/5 bg-card/50">
        
        {/* Navigation Tabs bar */}
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between p-6 border-b border-white/5 gap-6 bg-slate-50/20 dark:bg-slate-900/10">
          
          {/* Main Category Switches */}
          <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl gap-1 self-start">
            {[
              { id: "all", label: "All Updates", icon: Layers, count: totalCount },
              { id: "system", label: "System Alerts", icon: Bell, count: systemCount },
              { id: "messages", label: "Chat Messages", icon: MessagesSquare, count: messagesCount }
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCategory(tab.id as any);
                    setStatusFilter("all"); // reset status filter on category switch
                  }}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer select-none",
                    category === tab.id 
                      ? "bg-white dark:bg-slate-800 text-foreground shadow-sm scale-[1.02]" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <TabIcon className="size-3.5" />
                  {tab.label}
                  <span className={cn(
                    "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider",
                    category === tab.id
                      ? "bg-primary/10 text-primary"
                      : "bg-slate-200/50 dark:bg-slate-800/80 text-muted-foreground/80"
                  )}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Status Sub-Filters */}
          <div className="flex items-center gap-4 flex-wrap xl:self-end">
            <span className="text-[10px] font-bold text-muted-foreground/55 uppercase tracking-widest">Filter status:</span>
            <div className="flex bg-slate-200/40 dark:bg-slate-900/30 p-1 rounded-xl gap-0.5">
              {[
                { id: "all", label: "All", count: catAllCount },
                { id: "unread", label: "Unread", count: catUnreadCount },
                { id: "read", label: "Read", count: catReadCount }
              ].map(statusTab => (
                <button
                  key={statusTab.id}
                  onClick={() => setStatusFilter(statusTab.id as any)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none",
                    statusFilter === statusTab.id
                      ? "bg-white dark:bg-slate-800 text-foreground shadow-sm scale-[1.01]"
                      : "text-muted-foreground/80 hover:text-foreground"
                  )}
                >
                  {statusTab.label}
                  {statusTab.count > 0 && (
                    <span className={cn(
                      "px-1.5 py-0.2 rounded-md text-[8px] font-bold",
                      statusFilter === statusTab.id
                        ? "bg-primary/10 text-primary"
                        : "bg-slate-200/80 dark:bg-slate-800/80 text-muted-foreground"
                    )}>
                      {statusTab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stream List */}
        <div className="divide-y divide-white/5">
          {filteredNotifications.length === 0 ? (
            <div className="p-20 text-center space-y-4">
              <div className="size-16 rounded-3xl glass mx-auto flex items-center justify-center opacity-40">
                <BellOff className="size-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground tracking-tight">No matching notifications found.</p>
                <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                  There are no updates in this segment. Try switching filters or categories above.
                </p>
              </div>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const cfg = getNotificationConfig(notif.notification_type);
              const Icon = cfg.icon;

              return (
                <div 
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id)}
                  className={cn(
                    "p-6 flex items-start gap-4 transition-all relative group cursor-pointer",
                    notif.is_read 
                      ? "hover:bg-white/[0.01]" 
                      : "bg-primary/[0.01] hover:bg-primary/[0.02]"
                  )}
                >
                  {/* Left Accent indicator for unread */}
                  {!notif.is_read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" />
                  )}

                  {/* Icon Card Bubble */}
                  <div className={cn("size-12 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform", cfg.bg)}>
                    <Icon className="size-5.5" />
                  </div>

                  {/* Notification Details */}
                  <div className="flex-1 space-y-1.5 min-w-0 pr-4 select-none">
                    <div className="flex items-center gap-3.5 flex-wrap select-none">
                      <h4 className={cn("text-[14px] font-bold tracking-tight truncate select-none", notif.is_read ? "text-foreground" : "text-foreground font-black")}>
                        {notif.title}
                      </h4>
                      {!notif.is_read && (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[9px] font-bold tracking-widest uppercase select-none">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium select-none">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-3.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider select-none">
                      <span className="flex items-center gap-1 select-none">
                        <Clock className="size-3.5" />
                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  {/* Inline Mark as Read check option */}
                  <div className="flex items-center gap-2 self-center flex-shrink-0">
                    <Link href={cfg.link}>
                      <button className="h-9 px-4.5 rounded-xl text-[10px] font-black uppercase tracking-wider border border-white/10 hover:bg-white/10 hover:border-primary/40 text-muted-foreground hover:text-primary transition-all flex items-center gap-1.5 cursor-pointer select-none">
                        Open
                        <ArrowRight className="size-3.5" />
                      </button>
                    </Link>
                    
                    {!notif.is_read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notif.id);
                        }}
                        title="Mark as Read"
                        className="size-9 rounded-xl border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/40 text-muted-foreground hover:text-emerald-500 flex items-center justify-center transition-all cursor-pointer select-none"
                      >
                        <Check className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
}
