"use client";

import React, { useState } from "react";
import { LifeBuoy, MessageCircle, Mail, ShieldAlert, ChevronDown, Loader2, CheckCircle, ArrowLeft, FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  { q: "How do I request a refund?", a: "Refunds are handled through our dispute resolution center. If you're unsatisfied with the delivered work, you can request a revision first. If unresolved, open a dispute case and our team will review the submission." },
  { q: "How can I change my assigned writer?", a: "If a writer accepts your bid but you're not satisfied with their progress, you can request a reassignment through the order details page or by contacting support." },
  { q: "What happens if I miss a deadline?", a: "Task deadlines are agreed upon at bid acceptance. If you need an extension, contact your writer directly through the messaging system to negotiate a new deadline." },
  { q: "Is my payment information secure?", a: "Yes. All payments are processed through our secure escrow system. Your payment details are encrypted and never shared with writers or third parties." },
];

const inputCls = "w-full h-10 px-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors placeholder:text-muted-foreground/50";

export default function CustomerSupportPage() {
  const [subject, setSubject]       = useState("");
  const [message, setMessage]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [openFaq, setOpenFaq]       = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false); setSubmitted(true);
    setSubject(""); setMessage("");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Support & Help</h1>
        <p className="text-sm text-muted-foreground mt-0.5">We&apos;re here to help with any questions or issues.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { icon: MessageCircle, title: "Live Chat",       sub: "~5 min response",  color: "text-primary", bg: "bg-violet-50 border-violet-100", btn: "Start Chat" },
          { icon: Mail,          title: "Email Support",   sub: "Within 24 hours",  color: "text-amber-600", bg: "bg-amber-50 border-amber-100", btn: "Send Email", href: "mailto:support@projecthub.com" },
          { icon: ShieldAlert,   title: "Dispute Center",  sub: "Order & payment",  color: "text-red-600",   bg: "bg-red-50 border-red-100",   btn: "Open Case" },
        ].map(({ icon: Icon, title, sub, color, bg, btn, href }) => (
          <div key={title} className="bg-white border border-border rounded-xl p-4">
            <div className={cn("size-9 rounded-lg border flex items-center justify-center mb-3", bg)}>
              <Icon className={cn("size-4", color)} strokeWidth={1.75} />
            </div>
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground mb-3">{sub}</p>
            {href ? (
              <a href={href}><button className="w-full h-9 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted/50 transition-colors">{btn}</button></a>
            ) : (
              <button className="w-full h-9 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted/50 transition-colors">{btn}</button>
            )}
          </div>
        ))}
      </div>

      {/* Ticket form */}
      <div className="bg-white border border-border rounded-xl p-5">
        <h2 className="font-semibold text-foreground mb-4">Create a Support Ticket</h2>
        {submitted ? (
          <div className="flex flex-col items-center py-8 text-center space-y-3">
            <div className="size-12 rounded-full bg-green-100 border border-green-200 flex items-center justify-center">
              <CheckCircle className="size-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Ticket submitted!</p>
              <p className="text-sm text-muted-foreground">We&apos;ll get back to you within 24 hours.</p>
            </div>
            <button onClick={() => setSubmitted(false)} className="flex items-center gap-1.5 text-sm text-primary hover:underline">
              <ArrowLeft className="size-3.5" /> Submit another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Subject</label>
              <input required value={subject} onChange={e => setSubject(e.target.value)} placeholder="What is the issue?" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Message</label>
              <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={5}
                placeholder="Describe your problem in detail…"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors resize-none placeholder:text-muted-foreground/50" />
            </div>
            <button type="submit" disabled={submitting || !subject.trim() || !message.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {submitting ? "Submitting…" : "Submit Ticket"}
            </button>
          </form>
        )}
      </div>

      {/* FAQ */}
      <div className="space-y-3">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <FileQuestion className="size-4 text-primary" /> Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white border border-border rounded-xl overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left">
                <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                <ChevronDown className={cn("size-4 text-muted-foreground transition-transform flex-shrink-0", openFaq === i && "rotate-180 text-primary")} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
