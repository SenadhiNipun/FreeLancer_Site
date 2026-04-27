"use client";

import React, { useEffect, useState, useRef } from "react";
import { MessageSquare, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { notificationService } from "@/services/notification.service";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export function MessageNotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications();
      if (!response.is_error) {
        // Filter ONLY message notifications
        const messageNotifications = response.results.filter(
          (n: any) => n.notification_type === "NEW_MESSAGE"
        );
        setNotifications(messageNotifications);
        setUnreadCount(messageNotifications.filter((n: any) => !n.is_read).length);
      }
    } catch (error) {
      console.error("Failed to fetch message notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative size-9 flex items-center justify-center rounded-lg transition-all",
          isOpen ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        )}
      >
        <MessageSquare className="size-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 size-4 rounded-full bg-[#7C5CFC] border-2 border-white text-[9px] font-bold text-white flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-border shadow-2xl shadow-black/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-border flex items-center justify-between bg-white">
            <h3 className="text-sm font-bold text-foreground">Messages</h3>
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
                  <MessageSquare className="size-6 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground">No new messages</p>
              </div>
            ) : (
              notifications.map((n) => {
                return (
                  <div
                    key={n.id}
                    onClick={async () => {
                      if (!n.is_read) await handleMarkAsRead(n.id);
                      setIsOpen(false);
                      
                      if (n.related_id) {
                        const rolesStr = localStorage.getItem("user_roles");
                        const roles = rolesStr ? JSON.parse(rolesStr) : [];
                        const basePath = roles.includes("WRITER") ? "/writer" : "/customer";
                        router.push(`${basePath}/messages?session=${n.related_id}`);
                      }
                    }}
                    className={cn(
                      "p-4 flex gap-4 cursor-pointer transition-colors border-b border-border/50 last:border-0",
                      n.is_read ? "opacity-60 grayscale-[0.5]" : "hover:bg-muted/30"
                    )}
                  >
                    <div className="size-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                      <MessageSquare className="size-5 text-[#7C5CFC]" />
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

          <div className="p-3 bg-muted/20 border-t border-border text-center">
            <button 
              onClick={() => {
                setIsOpen(false);
                const rolesStr = localStorage.getItem("user_roles");
                const roles = rolesStr ? JSON.parse(rolesStr) : [];
                const basePath = roles.includes("WRITER") ? "/writer" : "/customer";
                router.push(`${basePath}/messages`);
              }}
              className="text-[11px] font-bold text-primary hover:underline"
            >
              View all messages
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
