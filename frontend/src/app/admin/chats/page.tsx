"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, Search, Clock, ChevronRight, Loader2 } from "lucide-react";
import { adminService } from "@/services/admin.service";

export default function AdminChatsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getAllChatSessions()
      .then((res) => {
        setSessions(res.results || []);
        setFiltered(res.results || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      setFiltered(
        sessions.filter(
          (s) =>
            s.task_title.toLowerCase().includes(q) ||
            s.customer_name.toLowerCase().includes(q) ||
            s.writer_name.toLowerCase().includes(q)
        )
      );
    } else {
      setFiltered(sessions);
    }
  }, [sessions, search]);

  return (
    <div className="space-y-7 pb-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-black text-foreground tracking-tight flex items-center gap-3">
            <MessageSquare className="size-6 text-indigo-500" />
            All Chat Sessions
          </h1>
          <p className="text-[13px] text-muted-foreground font-medium mt-1">
            Monitor communication across {sessions.length} active tasks
          </p>
        </div>
      </div>

      {/* Search */}
      <div
        className="rounded-2xl p-4 flex flex-col sm:flex-row gap-3"
        style={{
          background: "oklch(1 0 0 / 0.9)",
          border: "1px solid oklch(0.88 0.018 260 / 0.5)",
        }}
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks, clients, or writers…"
            className="w-full h-10 pl-9 pr-4 rounded-xl text-[13px] font-medium outline-none"
            style={{
              background: "oklch(0 0 0 / 0.04)",
              border: "1px solid oklch(0.88 0.018 260 / 0.5)",
            }}
          />
        </div>
      </div>

      {/* List */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "oklch(1 0 0 / 0.9)",
          border: "1px solid oklch(0.88 0.018 260 / 0.5)",
          boxShadow: "0 2px 8px oklch(0 0 0 / 0.04)",
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-indigo-500" />
            <span className="text-[13px] font-semibold">Loading chats…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/40">
            <MessageSquare className="size-10 mb-3 text-muted-foreground/20" />
            <p className="text-[14px] font-semibold">No chats found</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {filtered.map((s) => (
              <Link key={s.id} href={`/admin/chats/${s.id}`}>
                <div
                  className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4 hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                >
                  <div
                    className="size-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{
                      background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))",
                      border: "1px solid rgba(99,102,241,0.2)",
                    }}
                  >
                    <MessageSquare className="size-4.5 text-indigo-500" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-bold text-foreground truncate group-hover:text-indigo-600 transition-colors">
                      {s.task_title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-[12px] font-semibold text-muted-foreground">
                        {s.customer_name} <span className="text-muted-foreground/40 font-normal mx-1">↔</span> {s.writer_name}
                      </p>
                      <span className="size-1 rounded-full bg-border" />
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <Clock className="size-3" />
                        {s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:ml-auto">
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                        {s.message_count} msgs
                      </span>
                    </div>
                    <ChevronRight className="size-4.5 text-muted-foreground/30 group-hover:text-indigo-500 transition-colors hidden sm:block" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
