"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, MessageSquare, Paperclip, Clock, ShieldCheck, Download } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { getFileUrl } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export default function AdminChatViewer() {
  const { sessionId }                     = useParams<{ sessionId: string }>();
  const [data, setData]                   = useState<{ session: any; messages: any[] } | null>(null);
  const [loading, setLoading]             = useState(true);
  const scrollRef                         = useRef<HTMLDivElement>(null);

  useEffect(() => {
    adminService.getChatMessages(Number(sessionId))
      .then(res => setData(res.results))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sessionId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [data]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh] gap-3">
      <Loader2 className="size-5 animate-spin text-primary" />
    </div>
  );

  if (!data) return (
    <div className="text-center py-16">
      <p className="text-muted-foreground">Chat session not found.</p>
      <Link href="/admin/chats" className="text-primary hover:underline text-sm mt-2 block">← Back to Chats</Link>
    </div>
  );

  const { session, messages } = data;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] min-h-[600px] space-y-4 pb-6">
      {/* Nav */}
      <div className="flex items-center justify-between">
        <Link href="/admin/chats" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-4" /> Back to Chats
        </Link>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-xs font-medium text-violet-700">
          <ShieldCheck className="size-3.5" /> Read-only Observer
        </span>
      </div>

      <div className="flex-1 bg-white border border-border rounded-xl overflow-hidden flex flex-col">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <div className="size-9 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="size-4 text-violet-600" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{session.task_title}</h2>
            <p className="text-xs text-muted-foreground">
              {session.customer_name} (Client) ↔ {session.writer_name} (Writer)
            </p>
          </div>
          <div className="ml-auto text-xs text-muted-foreground">
            {messages.length} messages
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <MessageSquare className="size-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No messages yet.</p>
            </div>
          ) : messages.map((m: any) => {
            const isCustomer = m.sender_name === session.customer_name;
            return (
              <div key={m.id} className={cn("flex gap-2.5", isCustomer ? "flex-row" : "flex-row-reverse")}>
                <div className={cn("size-8 rounded-full text-white text-xs font-semibold flex items-center justify-center flex-shrink-0",
                  isCustomer ? "bg-blue-600" : "bg-violet-600"
                )} title={m.sender_name}>
                  {m.sender_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                </div>
                <div className={cn("max-w-[70%]", isCustomer ? "items-start" : "items-end")}>
                  <p className={cn("text-xs text-muted-foreground mb-1", isCustomer ? "text-left" : "text-right")}>
                    {m.sender_name} · {isCustomer ? "Client" : "Writer"}
                  </p>
                  <div className={cn(
                    "px-4 py-3 rounded-xl text-sm leading-relaxed",
                    isCustomer
                      ? "bg-white border border-border rounded-tl-sm"
                      : "bg-violet-600 text-white rounded-tr-sm"
                  )}>
                    {m.message_text && <p className="whitespace-pre-wrap">{m.message_text}</p>}

                    {m.message_type === "BID_CHANGE" && m.proposed_amount && (
                      <div className={cn("mt-2 p-2.5 rounded-lg", isCustomer ? "bg-amber-50 border border-amber-200" : "bg-white/20")}>
                        <p className={cn("text-xs font-semibold", isCustomer ? "text-amber-700" : "text-white/90")}>
                          Bid Change: ${m.proposed_amount.toFixed(2)} · {m.bid_change_status || "PENDING"}
                        </p>
                      </div>
                    )}

                    {m.attachments?.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {m.attachments.map((att: any) => (
                          <a key={att.id} href={getFileUrl(att.file_url)} target="_blank" rel="noreferrer"
                            className={cn("flex items-center gap-2 p-2 rounded-lg transition-colors",
                              isCustomer ? "bg-muted/40 hover:bg-muted/60 border border-border" : "bg-white/20 hover:bg-white/30"
                            )}>
                            <Paperclip className={cn("size-3.5 flex-shrink-0", isCustomer ? "text-muted-foreground" : "text-white/80")} />
                            <span className={cn("text-xs truncate", isCustomer ? "text-foreground" : "text-white")}>{att.file_name}</span>
                            <Download className={cn("size-3 flex-shrink-0 ml-auto", isCustomer ? "text-muted-foreground" : "text-white/60")} />
                          </a>
                        ))}
                      </div>
                    )}

                    <div className={cn("flex items-center gap-1 mt-1.5", isCustomer ? "text-muted-foreground/50" : "text-white/50")}>
                      <Clock className="size-2.5" />
                      <span className="text-[10px]">
                        {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
