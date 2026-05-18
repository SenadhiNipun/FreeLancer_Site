"use client";

import React, { useState } from "react";
import { 
  LifeBuoy, 
  MessageCircle, 
  Mail, 
  FileQuestion, 
  ChevronRight, 
  ShieldAlert,
  Loader2,
  CheckCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowLeft,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "How do I withdraw my earnings?",
    a: "Withdrawals are processed instantly. Once a customer approves your completed task, the project funds are released from escrow and credited to your balance. You can initiate a transfer directly via the Earnings page using your linked banking details or digital wallet."
  },
  {
    q: "What is the escrow guarantee?",
    a: "ProjectHub employs a secure escrow system. Before you start work on any assignment, the customer must deposit the full budget in escrow. Once you complete the tasks and the customer approves, the funds are automatically released to your wallet. This guarantees your payout!"
  },
  {
    q: "How do revision requests work?",
    a: "Customers can request revisions if the delivered work doesn't meet the initial requirements. You'll receive a detailed change list and the task will show up under your Active Tasks. Revisions must be addressed within the agreed timeframe to protect your expert score."
  },
  {
    q: "What should I do if a client stops responding?",
    a: "If you have delivered the final assignment and the client doesn't respond or approve within 3 days, the system will automatically open an auto-resolution case. Our administrative team will review your submission against the initial guidelines and release the payment."
  }
];

export default function WriterSupportPage() {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("General Support");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    // Simulate ticket submission API latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Clear state
    setSubject("");
    setMessage("");
  };

  return (
    <div className="space-y-8 animate-reveal pb-10">
      
      {/* ── Page Header ── */}
      <div className="glass rounded-[2rem] p-8 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 border-gradient">
        <div className="absolute -bottom-24 -left-24 size-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2.5 text-center sm:text-left">
          <div className="size-12 rounded-2xl glass bg-card/50 flex items-center justify-center mx-auto sm:mx-0 shadow-lg shadow-black/5 text-primary animate-float">
            <LifeBuoy className="size-5.5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Help & Support</h1>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Have questions or run into technical issues? Our premium helpdesk is active 24/7.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 items-start">
        
        {/* ── Column 1: Curated Support Channels ── */}
        <div className="space-y-6">
          <p className="text-[10px] font-extrabold text-muted-foreground/60 uppercase tracking-[0.2em] px-1">Support Channels</p>
          
          <div className="glass bg-card/50 border border-white/10 dark:border-white/5 rounded-3xl p-6 relative overflow-hidden group transition-all hover:shadow-xl">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <MessageCircle className="size-6" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="text-sm font-bold text-foreground">Premium Live Chat</h3>
                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">Discuss task disputes or payment questions live with specialists.</p>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-2">
                  <Clock className="size-3.5" /> Online Now
                </div>
              </div>
            </div>
            <button className="w-full mt-5 py-3 rounded-xl border border-white/10 hover:bg-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none">
              Start Chat Session <ChevronRight className="size-3.5" />
            </button>
          </div>

          <div className="glass bg-card/50 border border-white/10 dark:border-white/5 rounded-3xl p-6 relative overflow-hidden group transition-all hover:shadow-xl">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform">
                <Mail className="size-6" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="text-sm font-bold text-foreground">Email Helpdesk</h3>
                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">Submit complex inquiries, tax documentation, or bank verification details.</p>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">
                  <Clock className="size-3.5" /> Resp. within 24h
                </div>
              </div>
            </div>
            <a href="mailto:support@projecthub.com" className="block w-full mt-5">
              <button className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none">
                Send Email <ChevronRight className="size-3.5" />
              </button>
            </a>
          </div>

          <div className="glass bg-card/50 border border-white/10 dark:border-white/5 rounded-3xl p-6 relative overflow-hidden group transition-all hover:shadow-xl">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:scale-105 transition-transform">
                <ShieldAlert className="size-6" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="text-sm font-bold text-foreground">Dispute Resolution</h3>
                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">Initiate a formal review for active task cancellations or contract issues.</p>
              </div>
            </div>
            <button className="w-full mt-5 py-3 rounded-xl border border-white/10 hover:bg-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none">
              Open Case <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* ── Columns 2 & 3: Ticket Form & Accordion FAQs ── */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Dynamic Ticket submission panel */}
          <div className="glass bg-card/50 border border-white/10 dark:border-white/5 rounded-3xl p-8 shadow-xl shadow-black/5">
            <div className="mb-6 space-y-1">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <LifeBuoy className="size-4.5 text-primary" />
                Submit a Support Ticket
              </h2>
              <p className="text-xs text-muted-foreground">Describe your issue in detail and we will assign a specialized support engineer immediately.</p>
            </div>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-300">
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary animate-float">
                  <CheckCircle className="size-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-[15px] font-bold text-foreground">Support Ticket Submitted!</h3>
                  <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                    Thank you. Your ticket has been logged inside our SaaS queue. A helpdesk engineer will follow up shortly.
                  </p>
                </div>
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="rounded-xl h-10 px-5 text-xs font-bold gap-1.5 cursor-pointer select-none mt-2"
                >
                  <ArrowLeft className="size-3.5" /> Create another ticket
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-xs font-bold text-muted-foreground/80">Subject</Label>
                    <Input 
                      id="subject" 
                      required
                      placeholder="What is the issue?" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="rounded-xl h-11 border-white/10 bg-white/5 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/30 text-sm font-semibold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-xs font-bold text-muted-foreground/80">Category</Label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl h-11 border border-white/10 dark:border-white/5 bg-slate-50 dark:bg-slate-900 px-3.5 py-1 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary cursor-pointer select-none"
                    >
                      <option value="General Support">General Support</option>
                      <option value="Payments & Escrow">Payments & Escrow</option>
                      <option value="Task dispute">Task dispute</option>
                      <option value="Technical issue">Technical issue</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-xs font-bold text-muted-foreground/80">Message Description</Label>
                  <Textarea 
                    id="message" 
                    required
                    placeholder="Describe your request or technical issue in detail..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[160px] rounded-xl border-white/10 bg-white/5 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/30 resize-none p-4.5 text-sm font-semibold leading-relaxed"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting || !subject.trim() || !message.trim()}
                  className="w-full h-12 rounded-xl shadow-lg shadow-primary/20 bg-primary text-white font-bold gap-2 cursor-pointer select-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Logging Ticket...
                    </>
                  ) : (
                    <>
                      <LifeBuoy className="size-4" />
                      Submit Helpdesk Ticket
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Interactive Accordion FAQ Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 px-1">
              <FileQuestion className="size-4.5 text-primary" />
              Frequently Asked Questions
            </h2>
            <div className="grid gap-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx} 
                    className="glass bg-card/40 border border-white/10 dark:border-white/5 rounded-2xl overflow-hidden hover:bg-white/[0.01] transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-5 flex items-center justify-between text-left cursor-pointer select-none"
                    >
                      <span className="text-sm font-bold text-foreground tracking-tight pr-4">{faq.q}</span>
                      <ChevronDown 
                        className={cn(
                          "size-4 text-muted-foreground transition-transform duration-300", 
                          isOpen && "rotate-180 text-primary"
                        )} 
                      />
                    </button>
                    
                    <div 
                      className={cn(
                        "grid transition-all duration-300 ease-in-out",
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="px-5 pb-5 pt-1 text-xs text-muted-foreground leading-relaxed font-medium">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
