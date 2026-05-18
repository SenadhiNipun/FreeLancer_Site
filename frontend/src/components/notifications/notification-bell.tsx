"use client";

import React, { useEffect, useState, useRef } from "react";
import { Bell, Check, Clock, Info, MessageSquare, Zap, RotateCcw, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { notificationService } from "@/services/notification.service";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications() as any;
      if (!response.is_error) {
        // Filter OUT message notifications
        const generalNotifications = response.results.filter(
          (n: any) => n.notification_type !== "NEW_MESSAGE"
        );
        setNotifications(generalNotifications);
        setUnreadCount(generalNotifications.filter((n: any) => !n.is_read).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 10 seconds for a more responsive feel
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "TASK_AVAILABLE":
        return { icon: Zap, color: "text-amber-500", bg: "bg-amber-50" };
      case "BID_ACCEPTED":
        return { icon: Check, color: "text-green-500", bg: "bg-green-50" };
      case "NEW_MESSAGE":
        return { icon: MessageSquare, color: "text-[#7C5CFC]", bg: "bg-violet-50" };
      case "BID_RECEIVED":
        return { icon: Info, color: "text-indigo-500", bg: "bg-indigo-50" };
      case "REVISION_REQUESTED":
        return { icon: RotateCcw, color: "text-amber-500", bg: "bg-amber-50" };
      case "REVISION_DELIVERED":
        return { icon: Check, color: "text-emerald-500", bg: "bg-emerald-50" };
      case "WORK_DELIVERED":
        return { icon: Check, color: "text-emerald-500", bg: "bg-emerald-50" };
      case "REVIEW_RECEIVED":
        return { icon: Award, color: "text-amber-500", bg: "bg-amber-50" };
      default:
        return { icon: Info, color: "text-blue-500", bg: "bg-blue-50" };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative size-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-white/10 hover:border-red-500/30 hover:text-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]",
          isOpen ? "bg-red-500/10 text-red-500 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]" : "text-muted-foreground"
        )}
      >
        <Bell className="size-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-red-500 border border-white text-[8px] font-black text-white flex items-center justify-center shadow-lg shadow-red-500/40">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white/95 dark:bg-[#120B24]/95 border border-slate-200/50 dark:border-white/10 shadow-2xl shadow-black/10 backdrop-blur-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-4 border-b border-slate-200/50 dark:border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                {unreadCount} New
              </span>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto py-2">
            {notifications.length === 0 ? (
              <div className="p-10 flex flex-col items-center text-center">
                <div className="size-12 rounded-2xl bg-muted/50 flex items-center justify-center mb-3">
                  <Bell className="size-6 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => {
                const styles = getTypeStyles(n.notification_type);
                const Icon = styles.icon;
                return (
                  <div
                    key={n.id}
                    onClick={async () => {
                      if (!n.is_read) await handleMarkAsRead(n.id);
                      setIsOpen(false);
                      
                      const rolesStr = localStorage.getItem("user_roles");
                      const roles = rolesStr ? JSON.parse(rolesStr) : [];
                      const isWriter = roles.includes("WRITER");

                      if (n.notification_type === "NEW_MESSAGE" && n.related_id) {
                        const basePath = isWriter ? "/writer" : "/customer";
                        router.push(`${basePath}/messages?session=${n.related_id}`);
                      } else if (n.notification_type === "BID_RECEIVED" && n.related_id) {
                        router.push(`/customer/orders/${n.related_id}`);
                      } else if (n.notification_type === "BID_ACCEPTED" && n.related_id) {
                        router.push(`/writer/tasks/${n.related_id}`);
                      } else if (n.notification_type === "REVISION_REQUESTED" && n.related_id) {
                        router.push(`/writer/tasks/${n.related_id}#revision-history`);
                      } else if ((n.notification_type === "WORK_DELIVERED" || n.notification_type === "REVISION_DELIVERED") && n.related_id) {
                        router.push(`/customer/orders/${n.related_id}#expert-submissions`);
                      } else if (n.notification_type === "TASK_AVAILABLE" && n.related_id) {
                        router.push(`/writer/tasks/available`);
                      } else if (n.notification_type === "REVIEW_RECEIVED" && n.related_id) {
                        router.push(`/writer/tasks/completed#task-${n.related_id}`);
                      }
                    }}
                    className={cn(
                      "mx-2 my-1 p-3 flex gap-3.5 cursor-pointer rounded-xl transition-all duration-200",
                      n.is_read 
                        ? "opacity-50 hover:bg-slate-50 dark:hover:bg-white/5" 
                        : "bg-primary/5 hover:bg-primary/10 border-l-2 border-primary"
                    )}
                  >
                    <div className={cn("size-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm", styles.bg)}>
                      <Icon className={cn("size-5.5", styles.color)} />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="text-[13px] font-bold text-foreground leading-tight">{n.title}</p>
                      <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed">{n.message}</p>
                      <div className="flex items-center gap-1.5 pt-1 text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider">
                        <Clock className="size-3.5" />
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    {!n.is_read && (
                      <div className="size-2 rounded-full bg-primary shrink-0 mt-2" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 bg-muted/20 border-t border-border text-center">
              <button className="text-[11px] font-bold text-primary hover:underline">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
