"use client";

import React, { useEffect, useState, useRef } from "react";
import { Bell, Check, Clock, Info, MessageSquare, Zap } from "lucide-react";
import { notificationService } from "@/services/notification.service";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications();
      if (!response.is_error) {
        setNotifications(response.results);
        setUnreadCount(response.results.filter((n: any) => !n.is_read).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
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
      default:
        return { icon: Info, color: "text-blue-500", bg: "bg-blue-50" };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative size-9 flex items-center justify-center rounded-lg transition-all",
          isOpen ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        )}
      >
        <Bell className="size-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 size-4 rounded-full bg-red-500 border-2 border-white text-[9px] font-bold text-white flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-border shadow-2xl shadow-black/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-border flex items-center justify-between bg-white">
            <h3 className="text-sm font-bold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                {unreadCount} New
              </span>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
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
                    onClick={() => !n.is_read && handleMarkAsRead(n.id)}
                    className={cn(
                      "p-4 flex gap-4 cursor-pointer transition-colors border-b border-border/50 last:border-0",
                      n.is_read ? "opacity-60 grayscale-[0.5]" : "hover:bg-muted/30"
                    )}
                  >
                    <div className={cn("size-10 rounded-xl flex items-center justify-center shrink-0", styles.bg)}>
                      <Icon className={cn("size-5", styles.color)} />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <p className="text-[13px] font-bold text-foreground leading-tight">{n.title}</p>
                      <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed">{n.message}</p>
                      <div className="flex items-center gap-1.5 pt-1 text-[10px] text-muted-foreground/60 font-medium">
                        <Clock className="size-3" />
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
