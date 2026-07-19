"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Loader2, MessageSquare, ChevronRight, Plus, X, Send } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { adminMessageService } from "@/services/adminMessage.service";
import { toast } from "react-toastify";

function NewMessageModal({ onClose, onSent }: { onClose: () => void; onSent: (conversationId: number) => void }) {
  const [people, setPeople]       = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [selected, setSelected]   = useState<any>(null);
  const [subject, setSubject]     = useState("");
  const [message, setMessage]     = useState("");
  const [sending, setSending]     = useState(false);

  useEffect(() => {
    Promise.all([adminService.getAllCustomers(), adminService.getAllWriters()])
      .then(([cRes, wRes]: any[]) => {
        const customers = (cRes.results || []).map((c: any) => ({ ...c, role: "Customer" }));
        const writers = (wRes.results || []).map((w: any) => ({ ...w, role: "Writer" }));
        setPeople([...customers, ...writers]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? people.filter(p => `${p.first_name} ${p.last_name} ${p.email}`.toLowerCase().includes(search.toLowerCase()))
    : people;

  const send = async () => {
    if (!selected || !subject.trim() || !message.trim()) return;
    setSending(true);
    try {
      const res = await adminMessageService.startConversation(selected.id, subject.trim(), message.trim()) as any;
      toast.success(`Message sent to ${selected.first_name} ${selected.last_name}.`);
      onSent(res.results.id);
    } catch (err: any) {
      toast.error(err.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-border shadow-2xl w-full max-w-lg overflow-hidden max-h-[85vh] flex flex-col">
        <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center justify-between flex-shrink-0">
          <h3 className="font-semibold text-foreground text-sm">New Message</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {!selected ? (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers or writers…"
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors placeholder:text-muted-foreground/50" />
              </div>
              <div className="border border-border rounded-lg divide-y divide-border/50 max-h-64 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8"><Loader2 className="size-4 animate-spin text-primary" /></div>
                ) : filtered.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No matches found.</p>
                ) : (
                  filtered.map(p => (
                    <button key={`${p.role}-${p.id}`} onClick={() => setSelected(p)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 text-left hover:bg-muted/30 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.first_name} {p.last_name}</p>
                        <p className="text-xs text-muted-foreground">{p.email}</p>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{p.role}</span>
                    </button>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-violet-50 border border-violet-100">
                <div>
                  <p className="text-sm font-medium text-foreground">{selected.first_name} {selected.last_name}</p>
                  <p className="text-xs text-muted-foreground">{selected.email} · {selected.role}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-xs font-medium text-primary hover:underline">Change</button>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">Subject</label>
                <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Message subject"
                  className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors placeholder:text-muted-foreground/50" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">Message</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} placeholder="Write your message…"
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors resize-none placeholder:text-muted-foreground/50" />
              </div>
            </>
          )}
        </div>

        {selected && (
          <div className="px-5 py-4 border-t border-border bg-muted/10 flex justify-end gap-2 flex-shrink-0">
            <button onClick={onClose} disabled={sending}
              className="px-4 py-2 rounded-lg text-sm font-medium text-foreground border border-border hover:bg-muted/50 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button onClick={send} disabled={sending || !subject.trim() || !message.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
              {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              {sending ? "Sending…" : "Send Message"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminMessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(true);
  const [showNew, setShowNew]   = useState(false);

  const load = () =>
    adminMessageService.getAllConversations()
      .then((r: any) => setConversations(r.results || []))
      .catch(console.error)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const filtered = search
    ? conversations.filter(c =>
        [c.user_name, c.user_email, c.subject].some(v => v?.toLowerCase().includes(search.toLowerCase()))
      )
    : conversations;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Direct Messages</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Message customers and writers directly, {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity flex-shrink-0">
          <Plus className="size-4" /> New Message
        </button>
      </div>

      <div className="bg-white border border-border rounded-xl p-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or subject…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors placeholder:text-muted-foreground/50" />
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2">
            <Loader2 className="size-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Loading conversations…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="size-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No conversations found.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filtered.map((c: any) => (
              <Link key={c.id} href={`/admin/messages/${c.id}`}>
                <div className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors group">
                  <div className="size-9 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="size-4 text-violet-600" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">{c.user_name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{c.subject || c.last_message || "No messages yet"}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-violet-50 border border-violet-100 text-xs font-medium text-violet-700">
                      {c.message_count} msgs
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {c.last_message_at ? new Date(c.last_message_at).toLocaleDateString() : ""}
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showNew && (
        <NewMessageModal
          onClose={() => setShowNew(false)}
          onSent={(conversationId) => { setShowNew(false); router.push(`/admin/messages/${conversationId}`); }}
        />
      )}
    </div>
  );
}
