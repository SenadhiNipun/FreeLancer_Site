"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, Clock, FileText, Download, MessageSquare,
  CheckCircle2, DollarSign, Upload, Paperclip, X, RotateCcw,
} from "lucide-react";
import { taskService } from "@/services/task.service";
import { format } from "date-fns";
import { getFileUrl } from "@/lib/api-client";
import { CountdownTimer } from "@/components/tasks/CountdownTimer";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    OPEN:                "status-open",
    ASSIGNED:            "status-in-progress",
    IN_PROGRESS:         "status-in-progress",
    SUBMITTED:           "status-submitted",
    REVISION_REQUESTED:  "status-revision",
    COMPLETED:           "status-completed",
  };
  return <span className={map[status] || "status-cancelled"}>{status.replace(/_/g," ")}</span>;
}

export default function WriterTaskDetails() {
  const params         = typeof window !== "undefined" ? { taskId: window.location.pathname.split("/").pop() } : { taskId: "" };
  const [taskIdParam, setTaskIdParam] = useState<string>("");

  useEffect(() => {
    const parts = window.location.pathname.split("/");
    setTaskIdParam(parts[parts.length - 1] || "");
  }, []);

  const [task, setTask]               = useState<any>(null);
  const [loading, setLoading]         = useState(true);
  const [submissionNote, setNote]     = useState("");
  const [bidAmount, setBidAmount]     = useState("");
  const [bidMessage, setBidMessage]   = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [selectedFiles, setFiles]     = useState<File[]>([]);
  const fileInputRef                  = useRef<HTMLInputElement>(null);

  const loadTask = async (id: number) => {
    const r = await taskService.getWriterTaskDetails(id);
    setTask(r.results);
  };

  useEffect(() => {
    if (!taskIdParam) return;
    const id = parseInt(taskIdParam);
    if (isNaN(id)) { setLoading(false); return; }
    loadTask(id).catch(console.error).finally(() => setLoading(false));
  }, [taskIdParam]);

  useEffect(() => {
    if (task?.my_bid) {
      setBidAmount(task.my_bid.bid_amount.toString());
      setBidMessage(task.my_bid.message || "");
    }
  }, [task]);

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) { toast.warning("Enter a valid bid amount."); return; }
    setSubmitting(true);
    try {
      await taskService.placeBid(parseInt(taskIdParam), { bid_amount: amount, message: bidMessage });
      toast.success("Bid placed successfully!");
      await loadTask(parseInt(taskIdParam));
    } catch (err: any) { toast.error(err.message || "Failed to place bid."); }
    finally { setSubmitting(false); }
  };

  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await taskService.submitTask(parseInt(taskIdParam), { submission_note: submissionNote, is_final: true, files: selectedFiles });
      toast.success("Work submitted successfully!");
      setNote(""); setFiles([]);
      await loadTask(parseInt(taskIdParam));
    } catch (err: any) { toast.error(err.message || "Failed to submit work."); }
    finally { setSubmitting(false); }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[50vh] gap-3">
      <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-sm text-muted-foreground">Loading task…</span>
    </div>;
  }

  if (!task) return <div className="text-center py-16 text-muted-foreground">Task not found.</div>;

  return (
    <div className="space-y-5 pb-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link href="/writer/tasks/active">
          <button className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-4" /> Back
          </button>
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium text-foreground truncate">{task.title}</span>
      </div>

      {/* Header card */}
      <div className="bg-white border border-border rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {task.academic_category && (
                <span className="px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 text-xs font-medium">
                  {task.academic_category.name}
                </span>
              )}
              <StatusBadge status={task.task_status} />
            </div>
            <h1 className="text-xl font-semibold text-foreground">{task.title}</h1>
            <p className="text-xs text-muted-foreground">Project ID: #{task.id.toString().padStart(6,"0")}</p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-0.5">Time remaining</p>
              <CountdownTimer deadline={task.deadline} />
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-0.5">Budget</p>
              <p className="text-lg font-semibold text-foreground">
                {task.budget ? `$${parseFloat(task.budget).toFixed(2)}` : "TBD"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Left main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Description */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h2 className="font-semibold text-foreground mb-3">Assignment Brief</h2>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{task.description}</p>
          </div>

          {/* Files */}
          {task.files?.length > 0 && (
            <div className="bg-white border border-border rounded-xl p-5">
              <h2 className="font-semibold text-foreground mb-3">Client Attachments ({task.files.length})</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {task.files.map((f: any) => (
                  <div key={f.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors">
                    <div className="size-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="size-4 text-violet-600" strokeWidth={1.75} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{f.file_name}</p>
                      <p className="text-xs text-muted-foreground">{(f.file_size / 1024).toFixed(1)} KB</p>
                    </div>
                    <a href={getFileUrl(f.file_url)} target="_blank" rel="noopener noreferrer">
                      <button className="size-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">
                        <Download className="size-3.5" />
                      </button>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bid / Submit form */}
          {task.task_status !== "COMPLETED" && (
            task.task_status === "OPEN" ? (
              <div className="bg-white border border-border rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <h2 className="font-semibold text-foreground">Place Your Proposal</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Set your fee and pitch your expertise</p>
                </div>
                <form onSubmit={handleSubmitBid} className="p-5 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-foreground">Proposed Fee ($)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                        <input type="number" step="0.01" required value={bidAmount} onChange={e => setBidAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full h-10 pl-7 pr-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-foreground">Professional Pitch</label>
                    <textarea required value={bidMessage} onChange={e => setBidMessage(e.target.value)}
                      placeholder="Why are you the best fit for this project?" rows={4}
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors resize-none placeholder:text-muted-foreground/50" />
                  </div>
                  <button type="submit" disabled={submitting}
                    className="w-full h-10 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
                    {submitting ? "Submitting…" : task.my_bid ? "Update Proposal" : "Submit Proposal"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white border border-border rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <h2 className="font-semibold text-foreground">Submit Your Work</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Upload completed documents for client review</p>
                </div>
                <form onSubmit={handleSubmitWork} className="p-5 space-y-4">
                  <textarea required value={submissionNote} onChange={e => setNote(e.target.value)}
                    placeholder="Add a message for the client…" rows={4}
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors resize-none placeholder:text-muted-foreground/50" />

                  <input ref={fileInputRef} type="file" multiple className="hidden" onChange={e => {
                    if (e.target.files) setFiles(p => [...p, ...Array.from(e.target.files!)]);
                  }} />

                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      {selectedFiles.map((f, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-muted/20">
                          <FileText className="size-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm text-foreground truncate flex-1">{f.name}</span>
                          <button type="button" onClick={() => setFiles(p => p.filter((_,j) => j !== i))}
                            className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors">
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
                      <Upload className="size-4" /> Attach Files
                    </button>
                    <button type="submit" disabled={submitting}
                      className="flex-1 h-10 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
                      {submitting ? "Submitting…" : "Submit for Review"}
                    </button>
                  </div>
                </form>
              </div>
            )
          )}

          {/* Submissions */}
          {task.submissions?.length > 0 && (
            <div className="bg-white border border-border rounded-xl p-5">
              <h2 className="font-semibold text-foreground mb-4">My Submissions ({task.submissions.length})</h2>
              <div className="space-y-3">
                {[...task.submissions].reverse().map((sub: any, idx: number) => (
                  <div key={sub.id} className="p-4 rounded-lg border border-border">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="size-7 rounded-full border border-border flex items-center justify-center text-xs font-semibold text-muted-foreground flex-shrink-0">
                          {task.submissions.length - idx}
                        </div>
                        <div>
                          <p className="text-sm text-foreground">{sub.submission_note || "No note."}</p>
                          <p className="text-xs text-muted-foreground mt-1">{format(new Date(sub.submitted_at), "MMM dd, yyyy · h:mm a")}</p>
                        </div>
                      </div>
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0",
                        sub.submission_status === "FINAL_SUBMISSION" ? "bg-green-50 text-green-700 border border-green-200" : "bg-blue-50 text-blue-700 border border-blue-200"
                      )}>
                        {sub.submission_status.replace(/_/g," ")}
                      </span>
                    </div>
                    {sub.files?.length > 0 && (
                      <div className="mt-3 grid sm:grid-cols-2 gap-2">
                        {sub.files.map((f: any) => (
                          <div key={f.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/30 border border-border/50">
                            <FileText className="size-3.5 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs text-foreground truncate flex-1">{f.file_name}</span>
                            <a href={getFileUrl(f.file_url)} target="_blank" rel="noopener noreferrer">
                              <Download className="size-3.5 text-muted-foreground hover:text-primary transition-colors" />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Revisions */}
          {task.revisions?.length > 0 && (
            <div className="bg-white border border-border rounded-xl p-5">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <RotateCcw className="size-4 text-orange-500" /> Revision History ({task.revisions.length})
              </h2>
              <div className="space-y-3">
                {[...task.revisions].reverse().map((rev: any, idx: number) => (
                  <div key={rev.id} className="p-4 rounded-lg border border-orange-100 bg-orange-50/30">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="size-7 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-xs font-semibold text-orange-700 flex-shrink-0">
                          {task.revisions.length - idx}
                        </div>
                        <div>
                          <p className="text-sm text-foreground">{rev.revision_note}</p>
                          <p className="text-xs text-muted-foreground mt-1">{format(new Date(rev.requested_at), "MMM dd, yyyy · h:mm a")}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200 flex-shrink-0">
                        {rev.revision_status.replace(/_/g," ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Client info */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Project Owner</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-violet-100 text-violet-700 font-semibold flex items-center justify-center flex-shrink-0 overflow-hidden">
                {task.customer?.profile_image_url ? (
                  <img src={getFileUrl(task.customer.profile_image_url)} alt="" className="w-full h-full object-cover" />
                ) : (task.customer?.first_name?.[0] || "C")}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{task.customer?.first_name} {task.customer?.last_name}</p>
                <p className="text-xs text-green-600">Verified Client</p>
              </div>
            </div>
            <Link href={`/writer/messages?session=${task.id}`}>
              <button className="w-full flex items-center justify-center gap-2 h-9 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
                <MessageSquare className="size-4" /> Message Client
              </button>
            </Link>
          </div>

          {/* Finances */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Financials</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Agreed Budget</span>
                <span className="font-semibold">${parseFloat(task.budget || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform Fee</span>
                <span>$0.00</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-medium">Net Earnings</span>
                <span className="font-semibold text-primary">${parseFloat(task.budget || 0).toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-green-600 mt-1">
                <CheckCircle2 className="size-3.5" /> Funds held in escrow
              </div>
            </div>
          </div>

          {/* Deadline */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-1">Deadline</h3>
            <p className="text-sm text-foreground">{format(new Date(task.deadline), "EEEE, dd MMM yyyy")}</p>
            <div className="mt-2">
              <CountdownTimer deadline={task.deadline} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
