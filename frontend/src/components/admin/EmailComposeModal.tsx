"use client";

import { useState } from "react";
import { Loader2, Mail, Send, X } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "react-toastify";

interface EmailComposeModalProps {
  userId: number;
  userName: string;
  userEmail: string;
  onClose: () => void;
}

export function EmailComposeModal({ userId, userName, userEmail, onClose }: EmailComposeModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!subject.trim() || !message.trim()) return;
    setSending(true);
    try {
      await adminService.sendEmailToUser(userId, subject.trim(), message.trim());
      toast.success(`Email sent to ${userName}.`);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to send email.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-border shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Mail className="size-4" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Send Email</h3>
              <p className="text-xs text-muted-foreground">To {userName} · {userEmail}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Subject</label>
            <input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Email subject"
              disabled={sending}
              className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors placeholder:text-muted-foreground/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Message</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={6}
              placeholder="Write your message…"
              disabled={sending}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors resize-none placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-border bg-muted/10 flex justify-end gap-2">
          <button onClick={onClose} disabled={sending}
            className="px-4 py-2 rounded-lg text-sm font-medium text-foreground border border-border hover:bg-muted/50 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={send} disabled={sending || !subject.trim() || !message.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
            {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            {sending ? "Sending…" : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
}
