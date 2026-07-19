"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronRight, Clock, Loader2, MessageSquare, Send, Shield } from "lucide-react";
import { adminMessageService } from "@/services/adminMessage.service";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

export function AdminMessagesPanel() {
  const searchParams = useSearchParams();
  const convParam = searchParams.get("conv");

  const [conversations, setConversations]       = useState<any[]>([]);
  const [loadingList, setLoadingList]           = useState(true);
  const [selected, setSelected]                 = useState<any>(null);
  const [loadingDetail, setLoadingDetail]       = useState(false);
  const [reply, setReply]                       = useState("");
  const [sending, setSending]                   = useState(false);

  useEffect(() => {
    adminMessageService.getMyConversations()
      .then((r: any) => setConversations(r.results || []))
      .catch(console.error)
      .finally(() => setLoadingList(false));
  }, []);

  useEffect(() => {
    if (convParam) openDetail(Number(convParam));
  }, [convParam]);

  const openDetail = async (conversationId: number) => {
    setLoadingDetail(true);
    try {
      const res = await adminMessageService.getMyConversation(conversationId) as any;
      setSelected(res.results);
    } catch {
      toast.error("Failed to load conversation.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const sendReply = async () => {
    if (!reply.trim() || !selected) return;
    setSending(true);
    try {
      await adminMessageService.replyAsUser(selected.id, reply.trim());
      setReply("");
      const res = await adminMessageService.getMyConversation(selected.id) as any;
      setSelected(res.results);
      toast.success("Message sent!");
    } catch (err: any) {
      toast.error(err.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  if (selected) {
    return (
      <div className="max-w-3xl mx-auto space-y-5 pb-10">
        <button onClick={() => setSelected(null)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-4" /> Back to Messages
        </button>

        <div className="bg-white border border-border rounded-xl p-5 space-y-1">
          <h2 className="font-semibold text-foreground">{selected.subject || "Conversation with Admin"}</h2>
          <p className="text-xs text-muted-foreground">Direct message from the platform team</p>
        </div>

        <div className="space-y-3">
          {(selected.messages || []).length === 0 ? (
            <div className="bg-white border border-border rounded-xl px-5 py-8 text-center">
              <Clock className="size-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No messages yet.</p>
            </div>
          ) : (
            (selected.messages || []).map((m: any) => (
              <div key={m.id} className={cn("rounded-xl p-4 border text-sm", m.is_admin ? "bg-violet-50 border-violet-200" : "bg-white border-border ml-6")}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-medium text-foreground text-xs flex items-center gap-1.5">
                    {m.is_admin && <Shield className="size-3 text-violet-600" />}
                    {m.is_admin ? "Admin Team" : "You"}
                  </span>
                  <span className="text-xs text-muted-foreground">{m.created_at ? new Date(m.created_at).toLocaleString() : ""}</span>
                </div>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{m.message}</p>
              </div>
            ))
          )}
        </div>

        <div className="bg-white border border-border rounded-xl p-5 space-y-3">
          <textarea
            value={reply} onChange={e => setReply(e.target.value)}
            rows={3} placeholder="Reply to the admin team…"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors resize-none placeholder:text-muted-foreground/50"
          />
          <div className="flex justify-end">
            <button onClick={sendReply} disabled={sending || !reply.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
              {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              {sending ? "Sending…" : "Send Reply"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Messages from Admin</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Direct messages sent to you by the platform team.</p>
      </div>

      {loadingList || loadingDetail ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-5 animate-spin text-primary" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="bg-white border border-border rounded-xl flex flex-col items-center justify-center py-14 text-center">
          <MessageSquare className="size-10 text-muted-foreground/30 mb-3" />
          <p className="font-medium text-foreground">No messages yet</p>
          <p className="text-sm text-muted-foreground mt-1">You&apos;ll see direct messages from the admin team here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((c: any) => (
            <button key={c.id} onClick={() => openDetail(c.id)}
              className="w-full bg-white border border-border rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors text-left">
              <div className="size-9 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
                <Shield className="size-4 text-violet-600" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{c.subject || "Message from Admin"}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{c.last_message || "No messages yet"}</p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {c.last_message_at ? new Date(c.last_message_at).toLocaleDateString() : ""}
              </span>
              <ChevronRight className="size-4 text-muted-foreground flex-shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
