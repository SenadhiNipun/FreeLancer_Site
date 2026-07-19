"use client";

import React, { useEffect, useState, useRef } from "react";
import { MessageSquare, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { notificationService } from "@/services/notification.service";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export function MessageNotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [isOpen, setIsOpen]               = useState(false);
  const dropdownRef                        = useRef<HTMLDivElement>(null);
  const router                             = useRouter();

  const fetchNotifications = async () => {
    try {
      const r = await notificationService.getNotifications() as any;
      if (!r.is_error) {
        const msgs = (r.results || []).filter((n: any) => n.notification_type === "NEW_MESSAGE");
        setNotifications(msgs);
        setUnreadCount(msgs.filter((n: any) => !n.is_read).length);
      }
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const iv = setInterval(fetchNotifications, 60000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markRead = async (id: number) => {
    await notificationService.markAsRead(id).catch(() => {});
    setNotifications(p => p.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(p => Math.max(0, p - 1));
  };

  const navToMessages = () => {
    const roles: string[] = JSON.parse(localStorage.getItem("user_roles") || "[]");
    return roles.includes("WRITER") ? "/writer/messages" : "/customer/messages";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative size-8 rounded-lg flex items-center justify-center transition-colors",
          isOpen ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        )}>
        <MessageSquare className="size-4" strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 size-4.5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center border border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-border rounded-xl shadow-xl overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Messages</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-violet-50 border border-violet-200 text-xs font-medium text-violet-700">{unreadCount} new</span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <MessageSquare className="size-7 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No new messages</p>
              </div>
            ) : (
              <div className="py-1">
                {notifications.map(n => (
                  <div key={n.id}
                    onClick={async () => {
                      if (!n.is_read) await markRead(n.id);
                      setIsOpen(false);
                      if (n.related_id) router.push(`${navToMessages()}?session=${n.related_id}`);
                    }}
                    className={cn("flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/30", !n.is_read && "bg-violet-50/40")}>
                    <div className="size-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="size-4 text-violet-600" strokeWidth={1.75} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm leading-tight", !n.is_read && "font-medium text-foreground")}>{n.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.message}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1 flex items-center gap-1">
                        <Clock className="size-3" />
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    {!n.is_read && <div className="size-2 rounded-full bg-primary flex-shrink-0 mt-1" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-4 py-2.5 border-t border-border bg-muted/20 text-center">
            <button onClick={() => { setIsOpen(false); router.push(navToMessages()); }}
              className="text-xs font-medium text-primary hover:underline">
              View all messages
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
