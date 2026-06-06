"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Send, CheckCircle2 } from "lucide-react";
import { supportService } from "@/services/support.service";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<string, string> = {
  OPEN:        "bg-amber-50 text-amber-700 border-amber-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
  RESOLVED:    "bg-green-50 text-green-700 border-green-200",
  CLOSED:      "bg-slate-100 text-slate-500 border-slate-200",
};

const NEXT_STATUSES: Record<string, { label: string; value: string; cls: string }[]> = {
  OPEN:        [{ label: "Mark In Progress", value: "IN_PROGRESS", cls: "bg-blue-600 text-white hover:bg-blue-700" }],
  IN_PROGRESS: [{ label: "Mark Resolved",    value: "RESOLVED",    cls: "bg-green-600 text-white hover:bg-green-700" }],
  RESOLVED:    [{ label: "Close Ticket",     value: "CLOSED",      cls: "bg-slate-600 text-white hover:bg-slate-700" }],
  CLOSED:      [],
};

export default function AdminTicketDetailPage() {
  const { ticketId }               = useParams<{ ticketId: string }>();
  const [ticket, setTicket]        = useState<any>(null);
  const [loading, setLoading]      = useState(true);
  const [reply, setReply]          = useState("");
  const [sending, setSending]      = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const load = () =>
    supportService.getAdminTicket(Number(ticketId))
      .then(r => setTicket(r.results))
      .catch(() => toast.error("Failed to load ticket."))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, [ticketId]);

  const sendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await supportService.replyToTicket(Number(ticketId), reply.trim());
      setReply("");
      toast.success("Reply sent!");
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed to send reply.");
    } finally { setSending(false); }
  };

  const changeStatus = async (status: string) => {
    setUpdatingStatus(true);
    try {
      await supportService.updateStatus(Number(ticketId), status);
      toast.success(`Ticket marked as ${status.replace("_", " ").toLowerCase()}.`);
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status.");
    } finally { setUpdatingStatus(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh] gap-2">
      <Loader2 className="size-5 animate-spin text-primary" />
    </div>
  );

  if (!ticket) return (
    <div className="text-center py-16">
      <p className="text-muted-foreground">Ticket not found.</p>
      <Link href="/admin/support" className="text-primary hover:underline text-sm mt-2 block">← Back</Link>
    </div>
  );

  const nextActions = NEXT_STATUSES[ticket.status] || [];

  return (
    <div className="space-y-5 pb-10 max-w-3xl">
      <Link href="/admin/support"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="size-4" /> Support Tickets
      </Link>

      {/* Header card */}
      <div className="bg-white border border-border rounded-xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <p className="text-xs font-mono text-muted-foreground">{ticket.ticket_number}</p>
            <h1 className="text-lg font-semibold text-foreground mt-0.5">{ticket.subject}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              From <span className="font-medium text-foreground">{ticket.user_name}</span>
              {ticket.user_email && <span> · {ticket.user_email}</span>}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", STATUS_STYLE[ticket.status] || STATUS_STYLE.CLOSED)}>
              {ticket.status.replace("_", " ")}
            </span>
            {nextActions.map(a => (
              <button key={a.value} onClick={() => changeStatus(a.value)} disabled={updatingStatus}
                className={cn("px-3 py-1 rounded-lg text-xs font-medium transition-colors disabled:opacity-50", a.cls)}>
                {updatingStatus ? <Loader2 className="size-3 animate-spin inline" /> : a.label}
              </button>
            ))}
            {ticket.status === "RESOLVED" && (
              <span className="flex items-center gap-1 text-xs text-green-700">
                <CheckCircle2 className="size-3.5" /> Resolved
              </span>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-1">Original message</p>
          <p className="text-sm text-foreground leading-relaxed">{ticket.message}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {ticket.created_at ? new Date(ticket.created_at).toLocaleString() : ""}
          </p>
        </div>
      </div>

      {/* Replies */}
      <div className="space-y-3">
        <h2 className="font-semibold text-foreground text-sm">
          Conversation ({(ticket.replies || []).length})
        </h2>

        {(ticket.replies || []).length === 0 ? (
          <div className="bg-white border border-border rounded-xl px-5 py-8 text-center text-sm text-muted-foreground">
            No replies yet. Send the first response below.
          </div>
        ) : (
          (ticket.replies || []).map((r: any) => (
            <div key={r.id} className={cn(
              "rounded-xl p-4 border text-sm",
              r.is_admin ? "bg-violet-50 border-violet-200 ml-8" : "bg-white border-border"
            )}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={cn("text-xs font-semibold", r.is_admin ? "text-violet-700" : "text-foreground")}>
                  {r.is_admin ? "Support Team (Admin)" : r.author}
                </span>
                <span className="text-xs text-muted-foreground">
                  {r.created_at ? new Date(r.created_at).toLocaleString() : ""}
                </span>
              </div>
              <p className="text-foreground leading-relaxed">{r.message}</p>
            </div>
          ))
        )}
      </div>

      {/* Reply box — hidden for closed tickets */}
      {ticket.status !== "CLOSED" && (
        <div className="bg-white border border-border rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-foreground text-sm">Send Reply</h2>
          <textarea
            value={reply} onChange={e => setReply(e.target.value)}
            rows={4} placeholder="Type your response to the customer…"
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
      )}
    </div>
  );
}
