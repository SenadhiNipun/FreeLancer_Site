"use client";

import React, { useEffect, useState, useRef } from "react";
import { Bell, Check, Clock, Info, MessageSquare, Zap, RotateCcw, Award, Shield, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { notificationService } from "@/services/notification.service";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [isOpen, setIsOpen]               = useState(false);
  const dropdownRef                        = useRef<HTMLDivElement>(null);
  const router                             = useRouter();

  const fetchNotifications = async () => {
    try {
      const r = await notificationService.getNotifications() as any;
      if (!r.is_error) {
        const general = (r.results || []).filter((n: any) => n.notification_type !== "NEW_MESSAGE");
        setNotifications(general);
        setUnreadCount(general.filter((n: any) => !n.is_read).length);
      }
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const iv = setInterval(fetchNotifications, 10000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markRead = async (id: number) => {
    await notificationService.markAsRead(id).catch(() => {});
    setNotifications(p => p.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(p => Math.max(0, p - 1));
  };

  const getIcon = (type: string) => {
    const map: Record<string, { icon: any; cls: string }> = {
      TASK_AVAILABLE:     { icon: Zap,           cls: "bg-amber-50 border-amber-100 text-amber-600" },
      BID_ACCEPTED:       { icon: Check,         cls: "bg-green-50 border-green-100 text-green-600" },
      BID_RECEIVED:       { icon: Info,          cls: "bg-blue-50 border-blue-100 text-blue-600" },
      REVISION_REQUESTED: { icon: RotateCcw,     cls: "bg-orange-50 border-orange-100 text-orange-600" },
      REVISION_DELIVERED: { icon: Check,         cls: "bg-green-50 border-green-100 text-green-600" },
      WORK_DELIVERED:     { icon: Check,         cls: "bg-green-50 border-green-100 text-green-600" },
      REVIEW_RECEIVED:    { icon: Award,         cls: "bg-amber-50 border-amber-100 text-amber-600" },
      NEW_MESSAGE:        { icon: MessageSquare, cls: "bg-violet-50 border-violet-100 text-violet-600" },
      ADMIN_MESSAGE:      { icon: Shield,        cls: "bg-violet-50 border-violet-100 text-violet-600" },
      TASK_OVERDUE:       { icon: AlertTriangle, cls: "bg-red-50 border-red-100 text-red-600" },
      TASK_DUE_7_DAYS:    { icon: Clock,         cls: "bg-amber-50 border-amber-100 text-amber-600" },
      TASK_DUE_48_HOURS:  { icon: Clock,         cls: "bg-orange-50 border-orange-100 text-orange-600" },
      TASK_DUE_24_HOURS:  { icon: Clock,         cls: "bg-red-50 border-red-100 text-red-600" },
    };
    return map[type] || { icon: Info, cls: "bg-blue-50 border-blue-100 text-blue-600" };
  };

  const handleNotifClick = async (n: any) => {
    if (!n.is_read) await markRead(n.id);
    setIsOpen(false);
    const roles: string[] = JSON.parse(localStorage.getItem("user_roles") || "[]");
    const isWriter = roles.includes("WRITER");
    if (n.notification_type === "NEW_MESSAGE" && n.related_id) router.push(`${isWriter ? "/writer" : "/customer"}/messages?session=${n.related_id}`);
    else if (n.notification_type === "ADMIN_MESSAGE" && n.related_id) router.push(`${isWriter ? "/writer" : "/customer"}/admin-messages?conv=${n.related_id}`);
    else if (n.notification_type === "BID_RECEIVED" && n.related_id) router.push(`/customer/orders/${n.related_id}`);
    else if (n.notification_type === "BID_ACCEPTED" && n.related_id) router.push(`/writer/tasks/${n.related_id}`);
    else if (n.notification_type === "REVISION_REQUESTED" && n.related_id) router.push(`/writer/tasks/${n.related_id}`);
    else if ((n.notification_type === "WORK_DELIVERED" || n.notification_type === "REVISION_DELIVERED") && n.related_id) router.push(`/customer/orders/${n.related_id}`);
    else if (n.notification_type === "TASK_AVAILABLE") router.push("/writer/tasks/available");
    else if (n.notification_type === "REVIEW_RECEIVED" && n.related_id) router.push("/writer/tasks/completed");
    else if (n.notification_type === "TASK_OVERDUE" && n.related_id) router.push(isWriter ? `/writer/tasks/${n.related_id}` : `/customer/orders/${n.related_id}`);
    else if (n.notification_type?.startsWith("TASK_DUE_") && n.related_id) router.push(isWriter ? `/writer/tasks/${n.related_id}` : `/customer/orders/${n.related_id}`);
  };

  const viewAll = () => {
    setIsOpen(false);
    const roles: string[] = JSON.parse(localStorage.getItem("user_roles") || "[]");
    const isWriter = roles.includes("WRITER");
    router.push(isWriter ? "/writer/notifications" : "/customer/notifications");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative size-8 rounded-lg flex items-center justify-center transition-colors",
          isOpen ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        )}>
        <Bell className="size-4" strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 size-4.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-border rounded-xl shadow-xl overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-xs font-medium text-red-600">{unreadCount} new</span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <Bell className="size-7 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No notifications</p>
              </div>
            ) : (
              <div className="py-1">
                {notifications.map(n => {
                  const { icon: Icon, cls } = getIcon(n.notification_type);
                  return (
                    <div key={n.id} onClick={() => handleNotifClick(n)}
                      className={cn(
                        "flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/30",
                        !n.is_read && "bg-violet-50/40"
                      )}>
                      <div className={cn("size-8 rounded-lg border flex items-center justify-center flex-shrink-0", cls)}>
                        <Icon className="size-4" strokeWidth={1.75} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm leading-tight", n.is_read ? "text-foreground" : "font-medium text-foreground")}>{n.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.message}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1 flex items-center gap-1">
                          <Clock className="size-3" />
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      {!n.is_read && <div className="size-2 rounded-full bg-primary flex-shrink-0 mt-1" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-border bg-muted/20 text-center">
              <button onClick={viewAll} className="text-xs font-medium text-primary hover:underline">View all</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
