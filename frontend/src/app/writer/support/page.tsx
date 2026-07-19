"use client";

import React, { useState } from "react";
import { LifeBuoy, MessageCircle, Mail, ShieldAlert, ChevronDown, Loader2, CheckCircle, ArrowLeft, FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  { q: "How do I withdraw my earnings?", a: "Once a customer approves your completed task, funds are released from escrow to your balance. You can initiate a transfer via the Earnings page using your linked banking details or digital wallet." },
  { q: "What is the escrow guarantee?", a: "Before you start work, the customer must deposit the full budget in escrow. Once you complete the task and the customer approves, funds are automatically released to your wallet." },
  { q: "How do revision requests work?", a: "Customers can request revisions if the delivered work doesn't meet the initial requirements. You'll receive a detailed change list and the task will appear under Active Tasks." },
  { q: "What happens if a client stops responding?", a: "If you deliver the final work and the client doesn't respond within 3 days, the system opens an auto-resolution case. Our team reviews your submission and releases payment if it meets requirements." },
];

const inputCls = "w-full h-10 px-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors placeholder:text-muted-foreground/50";

export default function WriterSupportPage() {
  const [subject, setSubject]     = useState("");
  const [category, setCategory]   = useState("General Support");
  const [message, setMessage]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq]     = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false); setSubmitted(true);
    setSubject(""); setMessage("");
  };

  return (
    <div className="space-y-5 pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Help & Support</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Our support team is available 24/7 to help you.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 items-start">
        {/* Support channels */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Support Channels</p>
          {[
            { icon: MessageCircle, title: "Live Chat",          sub: "Typical response: 5 min",  color: "text-primary", bg: "bg-violet-50 border-violet-100", btn: "Start Chat" },
            { icon: Mail,          title: "Email Helpdesk",     sub: "Response within 24 hours", color: "text-amber-600", bg: "bg-amber-50 border-amber-100", btn: "Send Email", href: "mailto:support@projecthub.com" },
            { icon: ShieldAlert,   title: "Dispute Resolution", sub: "For task & payment issues", color: "text-red-600", bg: "bg-red-50 border-red-100", btn: "Open Case" },
          ].map(({ icon: Icon, title, sub, color, bg, btn, href }) => (
            <div key={title} className="bg-white border border-border rounded-xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className={cn("size-9 rounded-lg border flex items-center justify-center flex-shrink-0", bg)}>
                  <Icon className={cn("size-4", color)} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              </div>
              {href ? (
                <a href={href}>
                  <button className="w-full h-9 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted/50 transition-colors">
                    {btn}
                  </button>
                </a>
              ) : (
                <button className="w-full h-9 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted/50 transition-colors">{btn}</button>
              )}
            </div>
          ))}
        </div>

        {/* Ticket form + FAQ */}
        <div className="lg:col-span-2 space-y-5">
          {/* Ticket form */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <LifeBuoy className="size-4 text-primary" /> Submit a Support Ticket
            </h2>

            {submitted ? (
              <div className="flex flex-col items-center py-8 text-center space-y-3">
                <div className="size-12 rounded-full bg-green-100 border border-green-200 flex items-center justify-center">
                  <CheckCircle className="size-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Ticket submitted!</p>
                  <p className="text-sm text-muted-foreground mt-0.5">A support engineer will follow up shortly.</p>
                </div>
                <button onClick={() => setSubmitted(false)} className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                  <ArrowLeft className="size-3.5" /> Submit another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-foreground">Subject</label>
                    <input required value={subject} onChange={e => setSubject(e.target.value)} placeholder="What is the issue?" className={inputCls} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-foreground">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors cursor-pointer">
                      <option>General Support</option>
                      <option>Payments & Escrow</option>
                      <option>Task Dispute</option>
                      <option>Technical Issue</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">Message</label>
                  <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={5}
                    placeholder="Describe your issue in detail…"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors resize-none placeholder:text-muted-foreground/50" />
                </div>
                <button type="submit" disabled={submitting || !subject.trim() || !message.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
                  {submitting ? <Loader2 className="size-4 animate-spin" /> : <LifeBuoy className="size-4" />}
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
                    <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
