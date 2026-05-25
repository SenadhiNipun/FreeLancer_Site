"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, MessageSquare, Paperclip, Clock, ShieldCheck, Download } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { getFileUrl } from "@/lib/api-client";

export default function AdminChatViewer() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [data, setData] = useState<{ session: any; messages: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    adminService
      .getChatMessages(Number(sessionId))
      .then((res) => {
        setData(res.results);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="size-5 animate-spin text-indigo-500" />
        <p className="text-[13px] font-bold text-muted-foreground uppercase tracking-widest">Loading Conversation…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-[14px] font-semibold">Chat session not found.</p>
        <Link href="/admin/chats" className="text-indigo-500 font-bold text-[13px] hover:underline mt-2 block">
          ← Back to Chats
        </Link>
      </div>
    );
  }

  const { session, messages } = data;

  return (
    <div className="h-[calc(100vh-140px)] min-h-[600px] flex flex-col space-y-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Link href="/admin/chats" className="inline-flex items-center gap-2 text-[13px] font-bold text-muted-foreground hover:text-indigo-500 transition-colors">
          <ArrowLeft className="size-4" /> Back to Chats
        </Link>
        <div className="flex items-center gap-2 bg-indigo-50/50 border border-indigo-100 text-indigo-600 px-3 py-1.5 rounded-full">
          <ShieldCheck className="size-3.5" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Read Only Observer</span>
        </div>
      </div>

      <div
        className="flex-1 flex flex-col rounded-2xl overflow-hidden relative"
        style={{
          background: "oklch(1 0 0 / 0.9)",
          border: "1px solid oklch(0.88 0.018 260 / 0.5)",
          boxShadow: "0 4px 20px oklch(0 0 0 / 0.05)",
        }}
      >
        {/* Chat Header */}
        <div
          className="flex items-center gap-4 px-6 py-4 bg-white/50 backdrop-blur-md z-10 sticky top-0"
          style={{ borderBottom: "1px solid oklch(0.88 0.018 260 / 0.5)" }}
        >
          <div
            className="size-11 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            <MessageSquare className="size-5" />
          </div>
          <div>
            <h2 className="text-[15px] font-black text-foreground truncate max-w-xl">{session.task_title}</h2>
            <p className="text-[12px] text-muted-foreground font-medium mt-0.5">
              Client: <span className="text-foreground">{session.customer_name}</span> 
              <span className="mx-2 text-muted-foreground/30">|</span> 
              Writer: <span className="text-foreground">{session.writer_name}</span>
            </p>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6"
          style={{
            backgroundImage: "radial-gradient(oklch(0.88 0.018 260 / 0.3) 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40">
              <MessageSquare className="size-10 mb-3 text-muted-foreground/20" />
              <p className="text-[13px] font-semibold">No messages in this conversation yet</p>
            </div>
          ) : (
            messages.map((m, idx) => {
              const isCustomer = m.sender_name === session.customer_name;
              
              return (
                <div key={m.id} className="flex flex-col mb-4">
                  <div className="flex items-end gap-2 max-w-[85%]">
                    {/* Avatar */}
                    <div
                      className="size-8 rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mb-1"
                      style={{ 
                        background: isCustomer 
                          ? "linear-gradient(135deg, oklch(0.55 0.22 240), oklch(0.48 0.24 260))"
                          : "linear-gradient(135deg, #6366f1, #8b5cf6)"
                      }}
                      title={m.sender_name}
                    >
                      {m.sender_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                    
                    {/* Bubble Container */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted-foreground/70 ml-1 mb-1">
                        {m.sender_name} {isCustomer ? "(Client)" : "(Writer)"}
                      </span>
                      
                      <div
                        className="rounded-2xl px-4 py-3 shadow-sm relative group"
                        style={{
                          background: isCustomer ? "oklch(0.97 0.02 240)" : "white",
                          border: `1px solid ${isCustomer ? "oklch(0.9 0.04 240)" : "oklch(0.9 0.02 260)"}`,
                          borderBottomLeftRadius: "4px"
                        }}
                      >
                        {/* Text Content */}
                        {m.message_text && (
                          <p className="text-[13px] text-foreground whitespace-pre-wrap leading-relaxed">
                            {m.message_text}
                          </p>
                        )}
                        
                        {/* Bid Change Block */}
                        {m.message_type === "BID_CHANGE" && m.proposed_amount && (
                          <div className="mt-3 bg-white border border-rose-100 rounded-xl p-3 shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="size-2 rounded-full bg-rose-500" />
                              <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Bid Change Requested</p>
                            </div>
                            <p className="text-[14px] font-black text-foreground">New Amount: ${m.proposed_amount.toFixed(2)}</p>
                            <div className="mt-2 text-[11px] font-bold">
                              Status: 
                              <span className={`ml-1 ${m.bid_change_status === 'ACCEPTED' ? 'text-emerald-500' : m.bid_change_status === 'REJECTED' ? 'text-rose-500' : 'text-amber-500'}`}>
                                {m.bid_change_status || 'PENDING'}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Attachments */}
                        {m.attachments && m.attachments.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {m.attachments.map((att: any) => (
                              <a
                                key={att.id}
                                href={getFileUrl(att.file_url)}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 p-2.5 rounded-xl border transition-colors group/att hover:border-indigo-200 hover:bg-indigo-50/30"
                                style={{ background: "white", borderColor: "oklch(0.9 0.02 260)" }}
                              >
                                <div className="size-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 group-hover/att:bg-indigo-100 transition-colors">
                                  <Paperclip className="size-3.5 text-indigo-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[12px] font-bold text-foreground truncate group-hover/att:text-indigo-600 transition-colors">
                                    {att.file_name}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground">
                                    {(att.file_size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                                <Download className="size-3.5 text-muted-foreground/40 group-hover/att:text-indigo-500 transition-colors mr-1" />
                              </a>
                            ))}
                          </div>
                        )}
                        
                        {/* Timestamp */}
                        <div className="flex items-center gap-1 justify-end mt-2 opacity-50">
                          <Clock className="size-2.5" />
                          <span className="text-[9px] font-bold tracking-wide">
                            {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                          </span>
                        </div>
                      </div>
                    </div>
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
