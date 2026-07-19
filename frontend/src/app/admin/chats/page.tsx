"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Loader2, MessageSquare, Clock, ChevronRight } from "lucide-react";
import { adminService } from "@/services/admin.service";

export default function AdminChatsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    adminService.getAllChatSessions()
      .then(r => setSessions(r.results || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? sessions.filter(s =>
        [s.task_title, s.customer_name, s.writer_name].some(v =>
          v?.toLowerCase().includes(search.toLowerCase())
        )
      )
    : sessions;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">All Chats</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Monitor communication across {sessions.length} chat sessions</p>
      </div>

      <div className="bg-white border border-border rounded-xl p-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks, clients, or writers…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors placeholder:text-muted-foreground/50" />
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2">
            <Loader2 className="size-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Loading chats…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="size-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No chat sessions found.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filtered.map((s: any) => (
              <Link key={s.id} href={`/admin/chats/${s.id}`}>
                <div className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors group">
                  <div className="size-9 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="size-4 text-violet-600" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">{s.task_title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.customer_name} ↔ {s.writer_name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-violet-50 border border-violet-100 text-xs font-medium text-violet-700">
                      {s.message_count} msgs
                    </span>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 justify-end">
                      <Clock className="size-3" />
                      {s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="px-5 py-3 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground">Showing {filtered.length} of {sessions.length}</p>
        </div>
      </div>
    </div>
  );
}
