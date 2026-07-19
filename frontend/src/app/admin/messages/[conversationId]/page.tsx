"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { adminMessageService } from "@/services/adminMessage.service";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

export default function AdminConversationDetailPage() {
  const { conversationId }         = useParams<{ conversationId: string }>();
  const [conversation, setConversation] = useState<any>(null);
  const [loading, setLoading]      = useState(true);
  const [reply, setReply]          = useState("");
  const [sending, setSending]      = useState(false);

  const load = () =>
    adminMessageService.getConversation(Number(conversationId))
      .then((r: any) => setConversation(r.results))
      .catch(() => toast.error("Failed to load conversation."))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, [conversationId]);

  const sendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await adminMessageService.replyAsAdmin(Number(conversationId), reply.trim());
      setReply("");
      toast.success("Message sent!");
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed to send message.");
    } finally { setSending(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh] gap-2">
      <Loader2 className="size-5 animate-spin text-primary" />
    </div>
  );

  if (!conversation) return (
    <div className="text-center py-16">
      <p className="text-muted-foreground">Conversation not found.</p>
      <Link href="/admin/messages" className="text-primary hover:underline text-sm mt-2 block">← Back</Link>
    </div>
  );

  return (
    <div className="space-y-5 pb-10 max-w-3xl">
      <Link href="/admin/messages"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="size-4" /> Direct Messages
      </Link>

      {/* Header card */}
      <div className="bg-white border border-border rounded-xl p-5 space-y-1">
        <h1 className="text-lg font-semibold text-foreground">{conversation.subject || "Conversation"}</h1>
        <p className="text-sm text-muted-foreground">
          With <span className="font-medium text-foreground">{conversation.user_name}</span>
          {conversation.user_email && <span> · {conversation.user_email}</span>}
        </p>
      </div>

      {/* Messages */}
      <div className="space-y-3">
        <h2 className="font-semibold text-foreground text-sm">
          Conversation ({(conversation.messages || []).length})
        </h2>

        {(conversation.messages || []).length === 0 ? (
          <div className="bg-white border border-border rounded-xl px-5 py-8 text-center text-sm text-muted-foreground">
            No messages yet. Send the first one below.
          </div>
        ) : (
          (conversation.messages || []).map((m: any) => (
            <div key={m.id} className={cn(
              "rounded-xl p-4 border text-sm",
              m.is_admin ? "bg-violet-50 border-violet-200 ml-8" : "bg-white border-border"
            )}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={cn("text-xs font-semibold", m.is_admin ? "text-violet-700" : "text-foreground")}>
                  {m.is_admin ? "You (Admin)" : m.sender_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {m.created_at ? new Date(m.created_at).toLocaleString() : ""}
                </span>
              </div>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{m.message}</p>
            </div>
          ))
        )}
      </div>

      {/* Reply box */}
      <div className="bg-white border border-border rounded-xl p-5 space-y-3">
        <h2 className="font-semibold text-foreground text-sm">Send Message</h2>
        <textarea
          value={reply} onChange={e => setReply(e.target.value)}
          rows={4} placeholder="Type your message…"
          className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors resize-none placeholder:text-muted-foreground/50"
        />
        <div className="flex justify-end">
          <button onClick={sendReply} disabled={sending || !reply.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
            {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            {sending ? "Sending…" : "Send Message"}
          </button>
        </div>
      </div>
    </div>
  );
}
