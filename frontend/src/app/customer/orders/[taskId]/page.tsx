"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Clock, FileText, Download, MessageSquare,
  CheckCircle2, RotateCcw, Gavel, Star, Upload, X, Paperclip, Activity,
} from "lucide-react";
import { taskService } from "@/services/task.service";
import { chatService } from "@/services/chat.service";
import { format } from "date-fns";
import { getFileUrl } from "@/lib/api-client";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    OPEN:               "status-open",  PENDING_PAYMENT: "status-open",
    PENDING_ASSIGNMENT: "status-open",  ASSIGNED: "status-in-progress",
    IN_PROGRESS:        "status-in-progress", SUBMITTED: "status-submitted",
    REVISION_REQUESTED: "status-revision", COMPLETED: "status-completed",
    CANCELLED:          "status-cancelled",
  };
  const labels: Record<string, string> = {
    OPEN:"Bidding", PENDING_PAYMENT:"Payment Due", PENDING_ASSIGNMENT:"Assigning",
    ASSIGNED:"In Progress", IN_PROGRESS:"In Progress", SUBMITTED:"Submitted",
    REVISION_REQUESTED:"Revision Requested", COMPLETED:"Completed", CANCELLED:"Cancelled",
  };
  return <span className={map[status] || "status-cancelled"}>{labels[status] || status.replace(/_/g," ")}</span>;
}

export default function OrderDetails() {
  const params      = useParams();
  const router      = useRouter();
  const taskIdParam = params.taskId as string;

  const [task, setTask]           = useState<any>(null);
  const [bids, setBids]           = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [accepting, setAccepting] = useState<number | null>(null);
  const [approving, setApproving] = useState(false);
  const [chatting, setChatting]   = useState<number | null>(null);

  // Revision modal
  const [showRevision, setShowRevision]   = useState(false);
  const [revNote, setRevNote]             = useState("");
  const [revFiles, setRevFiles]           = useState<File[]>([]);
  const [submittingRev, setSubmittingRev] = useState(false);
  const revFileRef                        = useRef<HTMLInputElement>(null);

  // Review
  const [rating, setRating]       = useState(0);
  const [hoverRating, setHover]   = useState(0);
  const [feedback, setFeedback]   = useState("");
  const [submittingReview, setSR] = useState(false);

  // File upload for project docs
  const fileUploadRef = useRef<HTMLInputElement>(null);

  const loadData = async (id: number) => {
    const [tRes, bRes] = await Promise.all([taskService.getTaskDetails(id), taskService.getTaskBids(id)]);
    setTask(tRes.results);
    setBids(bRes.results || []);
  };

  useEffect(() => {
    if (!taskIdParam) return;
    const id = parseInt(taskIdParam);
    loadData(id).catch(console.error).finally(() => setLoading(false));
  }, [taskIdParam]);

  const handleChat = async (writerId: number) => {
    setChatting(writerId);
    try {
      const s = await chatService.initializeChat(parseInt(taskIdParam), writerId);
      router.push(`/customer/messages?session=${s.id}`);
    } catch (err: any) { toast.error(err.message || "Failed to open chat."); }
    finally { setChatting(null); }
  };

  const handleAcceptBid = async (bidId: number) => {
    setAccepting(bidId);
    try {
      await taskService.acceptBid(parseInt(taskIdParam), bidId);
      await loadData(parseInt(taskIdParam));
    } catch (err: any) { toast.error(err.message || "Failed to accept bid."); }
    finally { setAccepting(null); }
  };

  const handleApprove = async () => {
    if (!confirm("Approve and release payment? This is irreversible.")) return;
    setApproving(true);
    try {
      await taskService.approveTask(parseInt(taskIdParam));
      toast.success("Project approved and payment released!");
      await loadData(parseInt(taskIdParam));
    } catch (err: any) { toast.error(err.message || "Failed to approve."); }
    finally { setApproving(false); }
  };

  const handleRequestRevision = async () => {
    if (!revNote.trim()) { toast.warning("Please provide a revision message."); return; }
    setSubmittingRev(true);
    try {
      await taskService.requestRevision(parseInt(taskIdParam), { revision_note: revNote, files: revFiles });
      await loadData(parseInt(taskIdParam));
      setShowRevision(false); setRevNote(""); setRevFiles([]);
    } catch (err: any) { toast.error(err.message || "Failed to submit revision."); }
    finally { setSubmittingRev(false); }
  };

  const handleReview = async () => {
    if (rating === 0) { toast.warning("Please select a star rating."); return; }
    setSR(true);
    try {
      await taskService.submitReview(parseInt(taskIdParam), rating, feedback);
      toast.success("Review submitted successfully!");
      await loadData(parseInt(taskIdParam));
    } catch (err: any) { toast.error(err.message || "Failed to submit review."); }
    finally { setSR(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh] gap-3">
      <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-sm text-muted-foreground">Loading project…</span>
    </div>
  );

  if (!task) return <div className="text-center py-16 text-muted-foreground">Task not found.</div>;

  const isBidding = task.task_status === "OPEN";

  return (
    <div className="space-y-5 pb-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link href="/customer/orders">
          <button className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-4" /> Orders
          </button>
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium text-foreground truncate">{task.title}</span>
      </div>

      {/* Header */}
      <div className="bg-white border border-border rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={task.task_status} />
              <span className="text-xs text-muted-foreground">#{task.id.toString().padStart(4,"0")}</span>
            </div>
            <h1 className="text-xl font-semibold text-foreground">{task.title}</h1>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-muted-foreground">
              {isBidding ? "Budget (awaiting bids)" : "Agreed Budget"}
            </p>
            <p className="text-lg font-semibold text-foreground">
              {isBidding ? "Awaiting Bids" : `$${parseFloat(task.budget).toFixed(2)}`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left */}
        <div className="lg:col-span-2 space-y-5">
          {/* Description */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h2 className="font-semibold text-foreground mb-1">Project Description</h2>
            <div className="grid grid-cols-3 gap-4 mb-4 mt-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Category</p>
                <p className="font-medium">{task.academic_category?.name || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Deadline</p>
                <p className="font-medium flex items-center gap-1">
                  <Clock className="size-3.5 text-orange-500" />
                  {format(new Date(task.deadline), "dd MMM yyyy")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Budget</p>
                <p className="font-medium text-primary">{isBidding ? "Open" : `$${parseFloat(task.budget).toFixed(2)}`}</p>
              </div>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{task.description}</p>
          </div>

          {/* Project files */}
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h2 className="font-semibold text-foreground">Project Documents</h2>
                <p className="text-xs text-muted-foreground">Reference materials</p>
              </div>
              <div>
                <input ref={fileUploadRef} type="file" multiple className="hidden"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (!files.length) return;
                    setLoading(true);
                    try {
                      await taskService.addFilesToTask(parseInt(taskIdParam), files);
                      await loadData(parseInt(taskIdParam));
                      toast.success("Files uploaded successfully!");
                    } catch (err: any) { toast.error(err.message || "Failed to upload files."); }
                    finally { setLoading(false); }
                  }}
                />
                <button onClick={() => fileUploadRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:opacity-90 transition-opacity">
                  <Upload className="size-3.5" /> Add Files
                </button>
              </div>
            </div>
            <div>
              {!task.files?.length ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No documents attached yet.</div>
              ) : (
                <div className="divide-y divide-border/50">
                  {task.files.map((f: any) => (
                    <div key={f.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors">
                      <div className="size-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="size-4 text-violet-600" strokeWidth={1.75} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{f.file_name}</p>
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
              )}
            </div>
          </div>

          {/* Bids */}
          {isBidding && (
            <div className="bg-white border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Gavel className="size-4 text-primary" /> Writer Bids ({bids.length})
                </h2>
              </div>
              {bids.length === 0 ? (
                <div className="py-10 text-center">
                  <Clock className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Waiting for bids…</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {bids.map((bid) => (
                    <div key={bid.id} className="px-5 py-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link href={`/profile/${bid.writer_id}`} className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity">
                          <div className="size-10 rounded-full bg-violet-100 text-violet-700 font-semibold text-sm flex items-center justify-center flex-shrink-0">
                            {bid.writer?.first_name?.[0] || "W"}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{bid.writer?.first_name} {bid.writer?.last_name?.charAt(0)}.</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(bid.created_at), "h:mm a")}</p>
                          </div>
                        </Link>
                        {bid.message && (
                          <p className="text-sm text-muted-foreground italic flex-1 line-clamp-2">"{bid.message}"</p>
                        )}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Proposed fee</p>
                            <p className="font-semibold text-foreground">${parseFloat(bid.bid_amount).toFixed(2)}</p>
                          </div>
                          <button onClick={() => handleChat(bid.writer_id)} disabled={chatting !== null}
                            className="px-2.5 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50">
                            {chatting === bid.writer_id ? <Activity className="size-3.5 animate-spin" /> : <MessageSquare className="size-3.5" />}
                          </button>
                          <button onClick={() => handleAcceptBid(bid.id)} disabled={accepting !== null}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                            {accepting === bid.id ? <Activity className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Submissions */}
          {!isBidding && task.submissions?.length > 0 && (
            <div className="bg-white border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600" /> Expert Deliveries ({task.submissions.length})
                </h2>
              </div>
              <div className="divide-y divide-border/50">
                {[...task.submissions].reverse().map((sub: any) => (
                  <div key={sub.id} className="px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="status-submitted">{sub.submission_status.replace(/_/g," ")}</span>
                      <p className="text-xs text-muted-foreground">{format(new Date(sub.submitted_at), "MMM dd, yyyy · h:mm a")}</p>
                    </div>
                    {sub.submission_note && (
                      <p className="text-sm text-foreground/80 italic mb-3">"{sub.submission_note}"</p>
                    )}
                    {sub.files?.length > 0 && (
                      <div className="grid sm:grid-cols-2 gap-2">
                        {sub.files.map((f: any) => (
                          <div key={f.id} className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-muted/20">
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
              {task.task_status !== "COMPLETED" && (
                <div className="px-5 py-4 border-t border-border flex gap-3">
                  <button onClick={handleApprove} disabled={approving}
                    className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
                    {approving ? <Activity className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                    Approve & Release Payment
                  </button>
                  <button onClick={() => setShowRevision(true)}
                    className="flex items-center gap-2 px-4 h-10 rounded-lg border border-orange-200 text-orange-600 text-sm font-medium hover:bg-orange-50 transition-colors">
                    <RotateCcw className="size-4" /> Request Revision
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Revision history */}
          {!isBidding && task.revisions?.length > 0 && (
            <div className="bg-white border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <RotateCcw className="size-4 text-orange-500" /> Revision History
                </h2>
              </div>
              <div className="divide-y divide-border/50">
                {[...task.revisions].reverse().map((rev: any) => (
                  <div key={rev.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-foreground">{rev.revision_note}</p>
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0",
                        rev.revision_status === "COMPLETED" ? "bg-green-50 text-green-700 border border-green-200" : "bg-orange-50 text-orange-700 border border-orange-200"
                      )}>
                        {rev.revision_status.replace(/_/g," ")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{format(new Date(rev.requested_at), "MMM dd, yyyy · h:mm a")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review section */}
          {task.task_status === "COMPLETED" && (
            <div className="bg-white border border-border rounded-xl p-5">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Star className="size-4 text-amber-500" /> Expert Performance Review
              </h2>
              {task.review ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={cn("size-5", s <= task.review.rating ? "text-amber-500 fill-amber-500" : "text-slate-200")} />
                    ))}
                    <span className="text-sm font-medium text-foreground ml-2">{task.review.rating}/5</span>
                  </div>
                  {task.review.feedback && (
                    <p className="text-sm text-foreground/80 italic leading-relaxed">"{task.review.feedback}"</p>
                  )}
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="size-3.5 text-green-500" /> Submitted {format(new Date(task.review.created_at), "dd MMM yyyy")}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Rate {task.writer?.first_name || "the writer"}</p>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button"
                          onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
                          onClick={() => setRating(s)}
                          className="focus:outline-none">
                          <Star className={cn("size-7 transition-colors cursor-pointer",
                            s <= (hoverRating || rating) ? "text-amber-500 fill-amber-400" : "text-slate-200"
                          )} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-foreground">Feedback (optional)</label>
                    <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={3} maxLength={1000}
                      placeholder="Share your experience…"
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors resize-none placeholder:text-muted-foreground/50" />
                  </div>
                  <button onClick={handleReview} disabled={submittingReview || rating === 0}
                    className="w-full h-10 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                    {submittingReview ? <Activity className="size-4 animate-spin" /> : null}
                    Submit Review
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Assigned writer */}
          {!isBidding && (
            <div className="bg-white border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Assigned Expert</h3>
              {task.writer ? (
                <>
                  <Link href={`/profile/${task.writer.id}`} className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity group">
                    <div className="size-10 rounded-full bg-violet-100 text-violet-700 font-semibold text-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                      {task.writer.profile_image_url ? (
                        <img src={getFileUrl(task.writer.profile_image_url)} alt="" className="w-full h-full object-cover" />
                      ) : (task.writer.first_name?.[0] || "W")}
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:underline">
                        {task.writer.first_name} {task.writer.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">Expert Writer</p>
                    </div>
                  </Link>
                  <button onClick={() => task.writer && handleChat(task.writer.id)} disabled={chatting !== null}
                    className="w-full flex items-center justify-center gap-2 h-9 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
                    <MessageSquare className="size-4" /> Message Writer
                  </button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No writer assigned yet.</p>
              )}
            </div>
          )}

          {/* Payment */}
          {!isBidding && (
            <div className="bg-white border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Payment</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-medium">${parseFloat(task.budget).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className={cn("font-medium", task.payment_status === "PAID" ? "text-green-600" : "text-orange-600")}>
                    {task.payment_status === "PAID" ? "Released" : "In Escrow"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                Funds are released only after you approve the submitted work.
              </p>
            </div>
          )}

          {/* Bidding info */}
          {isBidding && (
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-violet-800 mb-2">How Bidding Works</h3>
              <div className="space-y-2 text-xs text-violet-700 leading-relaxed">
                <p>• You can accept only <strong>one</strong> bid. Accepting closes bidding.</p>
                <p>• After accepting, complete payment into escrow.</p>
                <p>• Payment is released when you approve the work.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Revision Modal */}
      {showRevision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <RotateCcw className="size-4 text-orange-500" /> Request Revision
              </h2>
              <button onClick={() => { setShowRevision(false); setRevNote(""); setRevFiles([]); }}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">Revision Message *</label>
                <textarea value={revNote} onChange={e => setRevNote(e.target.value)} rows={4}
                  placeholder="Describe what needs to be changed…"
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors resize-none placeholder:text-muted-foreground/50" />
              </div>

              <div>
                <input ref={revFileRef} type="file" multiple className="hidden"
                  onChange={e => { setRevFiles(p => [...p, ...Array.from(e.target.files || [])]); if (revFileRef.current) revFileRef.current.value = ""; }} />
                <button type="button" onClick={() => revFileRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 h-9 rounded-lg border-2 border-dashed border-orange-200 text-orange-600 text-sm hover:border-orange-400 hover:bg-orange-50 transition-colors">
                  <Paperclip className="size-4" /> Attach Files (optional)
                </button>
                {revFiles.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {revFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-muted/20 text-xs">
                        <FileText className="size-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="truncate flex-1">{f.name}</span>
                        <button onClick={() => setRevFiles(p => p.filter((_,j)=>j!==i))} className="text-muted-foreground hover:text-red-500 transition-colors">
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={() => { setShowRevision(false); setRevNote(""); setRevFiles([]); }}
                  className="flex-1 h-10 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleRequestRevision} disabled={submittingRev || !revNote.trim()}
                  className="flex-1 h-10 rounded-lg bg-orange-500 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                  {submittingRev ? <Activity className="size-4 animate-spin" /> : <RotateCcw className="size-4" />}
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
