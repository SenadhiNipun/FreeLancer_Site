"use client";

import React from "react";
import { 
  ArrowLeft, 
  Clock, 
  User, 
  FileText, 
  Download, 
  MessageSquare, 
  RotateCcw,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  Gavel,
  Check,
  Info,
  Upload,
  X,
  Paperclip
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { taskService } from "@/services/task.service";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getFileUrl } from "@/lib/api-client";

export default function OrderDetails() {
  const params = useParams();
  const router = useRouter();
  const taskIdParam = params.taskId as string;

  const [task, setTask] = React.useState<any>(null);
  const [bids, setBids] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAccepting, setIsAccepting] = React.useState<number | null>(null);

  // Revision modal state
  const [showRevisionModal, setShowRevisionModal] = React.useState(false);
  const [revisionNote, setRevisionNote] = React.useState("");
  const [revisionFiles, setRevisionFiles] = React.useState<File[]>([]);
  const [isSubmittingRevision, setIsSubmittingRevision] = React.useState(false);
  const revisionFileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (!taskIdParam) return;
        const taskId = parseInt(taskIdParam);
        const [taskRes, bidsRes] = await Promise.all([
          taskService.getTaskDetails(taskId),
          taskService.getTaskBids(taskId)
        ]);
        setTask(taskRes.results);
        setBids(bidsRes.results || []);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (taskIdParam) fetchData();
  }, [taskIdParam]);

  const handleRequestRevision = async () => {
    if (!revisionNote.trim()) {
      alert("Please provide a revision message.");
      return;
    }
    if (!taskIdParam) return;
    setIsSubmittingRevision(true);
    try {
      const taskId = parseInt(taskIdParam);
      await taskService.requestRevision(taskId, {
        revision_note: revisionNote,
        files: revisionFiles,
      });
      // Refetch task data
      const taskRes = await taskService.getTaskDetails(taskId);
      setTask(taskRes.results);
      setShowRevisionModal(false);
      setRevisionNote("");
      setRevisionFiles([]);
    } catch (error: any) {
      alert(error.message || "Failed to submit revision request");
    } finally {
      setIsSubmittingRevision(false);
    }
  };

  const handleAcceptBid = async (bidId: number) => {
    if (!taskIdParam) return;
    setIsAccepting(bidId);
    try {
      const taskId = parseInt(taskIdParam);
      await taskService.acceptBid(taskId, bidId);
      router.refresh();
      // Refetch data
      const taskRes = await taskService.getTaskDetails(taskId);
      setTask(taskRes.results);
      setBids([]); // Bids are closed
    } catch (error: any) {
      alert(error.message || "Failed to accept bid");
    } finally {
      setIsAccepting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="size-8 border-[3px] border-[#7C5CFC] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-[#9490a8] uppercase tracking-widest">Loading project details...</p>
      </div>
    );
  }

  if (!task) return <div className="text-center py-20">Task not found</div>;

  const isBiddingPhase = task.task_status === "OPEN";

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Link href="/customer/orders">
          <Button variant="ghost" size="icon" className="rounded-xl border border-border/50">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1a1033]">{task.title}</h1>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant="outline" className={cn(
              "uppercase text-[10px] font-bold border-none px-2.5 py-0.5 rounded-full",
              isBiddingPhase ? "bg-violet-100 text-violet-700" : "bg-emerald-100 text-emerald-700"
            )}>
              {task.task_status.replace('_', ' ')}
            </Badge>
            <span className="text-xs text-[#9490a8]">Project ID: {task.id.toString().padStart(6, '0')}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Details & Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Description & Documents */}
          <div className="space-y-6">
            <Card className="border-border/50 shadow-sm overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-muted/10 border-b border-border/50">
                <CardTitle className="text-lg text-[#1a1033]">Project Description</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <p className="text-[#1a1033]/80 leading-relaxed text-sm whitespace-pre-wrap">
                  {task.description}
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-border/50">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-[#9490a8] tracking-widest">Category</p>
                    <p className="text-sm font-bold text-[#1a1033]">{task.academic_category?.name || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-[#9490a8] tracking-widest">Deadline</p>
                    <p className="text-sm font-bold text-[#1a1033] flex items-center gap-2">
                      <Clock className="size-3.5 text-orange-500" /> 
                      {format(new Date(task.deadline), "dd MMM yyyy")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-[#9490a8] tracking-widest">Budget</p>
                    <p className="text-sm font-bold text-[#7C5CFC]">
                      {isBiddingPhase ? "Awaiting Bids" : `$${parseFloat(task.budget).toFixed(2)}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Documents Section */}
            <Card className="border-border/50 shadow-sm overflow-hidden rounded-2xl bg-white">
              <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-border/50">
                <div>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-[#1a1033]">Project Documents</CardTitle>
                  <CardDescription className="text-[10px]">Reference materials and guidelines</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (!files || files.length === 0 || !taskIdParam) return;
                      
                      setIsLoading(true);
                      try {
                        const taskId = parseInt(taskIdParam);
                        const fileList = Array.from(files);
                        await taskService.addFilesToTask(taskId, fileList);
                        
                        // Refetch data
                        const taskRes = await taskService.getTaskDetails(taskId);
                        setTask(taskRes.results);
                        alert("Files uploaded successfully!");
                      } catch (err: any) {
                        alert(err.message || "Failed to upload files");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  />
                  <Button 
                    onClick={() => document.getElementById('file-upload')?.click()}
                    size="sm" 
                    className="h-9 px-4 rounded-xl bg-[#7C5CFC] hover:bg-[#6d4ef0] text-white font-bold text-xs gap-2"
                  >
                    <Download className="size-3.5 rotate-180" /> Add Files
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {task.files && task.files.length > 0 ? (
                    task.files.map((file: any) => (
                      <div key={file.id} className="p-4 flex items-center justify-between hover:bg-violet-50/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-xl bg-violet-100 flex items-center justify-center text-[#7C5CFC]">
                            <FileText className="size-4.5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1a1033]">{file.file_name}</p>
                            <p className="text-[10px] text-[#9490a8] font-bold uppercase tracking-tighter">
                              {(file.file_size / 1024).toFixed(1)} KB • {file.file_type.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                        <a href={getFileUrl(file.file_url)} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-[#9490a8] hover:text-[#7C5CFC]">
                            <Download className="size-4" />
                          </Button>
                        </a>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center space-y-2">
                      <div className="size-12 rounded-full bg-muted/30 flex items-center justify-center mx-auto opacity-40">
                        <FileText className="size-6" />
                      </div>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">No documents attached</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bids Section (Only if in bidding phase) */}
          {isBiddingPhase && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#1a1033] flex items-center gap-2">
                   <Gavel className="size-5 text-[#7C5CFC]" /> Writer Bids ({bids.length})
                </h2>
              </div>
              
              {bids.length === 0 ? (
                <div className="bg-white/50 border-2 border-dashed border-border/50 rounded-2xl p-12 text-center space-y-3">
                  <div className="size-12 rounded-full bg-violet-100 flex items-center justify-center mx-auto text-[#7C5CFC]">
                    <Clock className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1a1033]">Finding the best writers...</h3>
                    <p className="text-xs text-[#9490a8]">Writers in your field are reviewing your task. Bids will appear here shortly.</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {bids.map((bid) => (
                    <Card key={bid.id} className="border-border/50 shadow-sm hover:border-[#7C5CFC]/40 transition-all bg-white group overflow-hidden rounded-2xl">
                      <div className="p-6 flex flex-col sm:flex-row gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-violet-100 flex items-center justify-center text-[#7C5CFC] font-bold text-lg">
                              {bid.writer?.first_name?.[0] || "W"}
                            </div>
                            <div>
                              <h3 className="font-bold text-[#1a1033]">
                                {bid.writer?.first_name} {bid.writer?.last_name?.charAt(0)}.
                              </h3>
                              <div className="flex items-center gap-2 text-[11px] text-[#9490a8]">
                                <span className="flex items-center gap-0.5 text-amber-500 font-bold">★ 4.9</span>
                                <span>• Academic Expert</span>
                                <span>• {format(new Date(bid.created_at), "h:mm a")}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-[#6b6880] leading-relaxed italic">
                            "{bid.message || "I am highly interested in this project and have relevant experience in this academic field."}"
                          </p>
                        </div>
                        <div className="sm:w-48 flex flex-col justify-center items-center sm:items-end gap-3 sm:pl-6 sm:border-l border-border/50">
                          <div className="text-center sm:text-right">
                            <p className="text-[10px] uppercase font-bold text-[#9490a8] tracking-widest mb-1">Proposed Fee</p>
                            <p className="text-2xl font-black text-[#1a1033]">${parseFloat(bid.bid_amount).toFixed(2)}</p>
                          </div>
                          <div className="flex flex-col sm:flex-row w-full gap-2">
                            <Link href="/customer/messages" className="flex-1">
                              <Button 
                                variant="outline"
                                className="w-full border-border/50 hover:bg-violet-50 hover:text-[#7C5CFC] rounded-xl h-10 font-bold gap-2 text-xs transition-colors"
                              >
                                <MessageSquare className="size-3.5" />
                                Chat
                              </Button>
                            </Link>
                            <Button 
                              onClick={() => handleAcceptBid(bid.id)}
                              disabled={isAccepting !== null}
                              className="flex-[2] bg-[#7C5CFC] hover:bg-[#6d4ef0] text-white rounded-xl h-10 shadow-lg shadow-violet-400/20 font-bold gap-2 text-xs"
                            >
                              {isAccepting === bid.id ? (
                                <Clock className="size-3.5 animate-spin" />
                              ) : (
                                <Check className="size-3.5" />
                              )}
                              Accept Bid
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Submissions Section (If assigned/completed) */}
          {!isBiddingPhase && task.submissions?.length > 0 && (
            <div id="expert-submissions" className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-[#1a1033]">
                 <CheckCircle2 className="size-5 text-emerald-500" /> Expert Deliveries ({task.submissions.length})
              </h2>
              <div className="space-y-4">
                {[...task.submissions].reverse().map((sub: any) => (
                  <Card key={sub.id} className="border-emerald-500/10 shadow-sm bg-white rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-emerald-500/5 bg-emerald-500/[0.02] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          {sub.submission_status.replace("_", " ")}
                        </span>
                        <p className="text-[10px] text-[#9490a8] font-bold mt-1.5 uppercase tracking-wider">
                          Delivered on {format(new Date(sub.submitted_at), "MMM dd, yyyy · h:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      {sub.submission_note && (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-[#1a1033] leading-relaxed italic">
                          "{sub.submission_note}"
                        </div>
                      )}

                      {sub.files && sub.files.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#9490a8] flex items-center gap-1.5">
                            <Paperclip className="size-3.5 text-emerald-500" /> Delivered Files ({sub.files.length})
                          </p>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {sub.files.map((file: any) => (
                              <div
                                key={file.id}
                                className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 hover:border-emerald-500/30 transition-all duration-300"
                              >
                                <div className="flex items-center gap-3 truncate">
                                  <div className="size-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-emerald-600 shrink-0">
                                    <FileText className="size-4.5" />
                                  </div>
                                  <div className="flex flex-col truncate">
                                    <span className="text-[12px] font-bold text-[#1a1033] truncate">{file.file_name}</span>
                                    <span className="text-[9px] text-[#9490a8] font-bold uppercase">
                                      {file.file_size ? `${(file.file_size / 1024).toFixed(1)} KB` : "Unknown size"}
                                    </span>
                                  </div>
                                </div>
                                <a href={getFileUrl(file.file_url)} target="_blank" rel="noopener noreferrer">
                                  <Button variant="outline" size="sm" className="size-8 p-0 rounded-lg border-emerald-500/20 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center">
                                    <Download className="size-4" />
                                  </Button>
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-6 border border-dashed border-slate-200 rounded-xl">
                          <p className="text-xs font-bold text-[#9490a8] uppercase">No physical files attached to this submission</p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4 pt-4">
                 <Button className="rounded-xl flex-1 h-12 shadow-lg shadow-[#7C5CFC]/20 bg-[#7C5CFC] hover:bg-[#6d4ef0] gap-2 font-bold">
                    Approve & Release Payment
                 </Button>
                 <Button
                   variant="outline"
                   onClick={() => setShowRevisionModal(true)}
                   className="rounded-xl flex-1 h-12 border-orange-500/20 text-orange-600 hover:bg-orange-500/10 gap-2 font-bold"
                 >
                    <RotateCcw className="size-4" /> Request Revision
                 </Button>
              </div>
            </div>
          )}

          {/* ── Revision History Section ── */}
          {!isBiddingPhase && task.revisions?.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-[#1a1033]">
                <RotateCcw className="size-5 text-orange-500" /> Revision History
                <span className="ml-1 text-sm font-semibold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">
                  {task.revisions.length}
                </span>
              </h2>

              <div className="space-y-3">
                {[...task.revisions].reverse().map((rev: any, idx: number) => (
                  <Card key={rev.id} className="border-orange-200/60 bg-orange-50/30 rounded-2xl overflow-hidden shadow-sm">
                    {/* Revision header */}
                    <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
                      <div className="flex items-start gap-3">
                        {/* Step number bubble */}
                        <div className="size-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 font-black text-xs shrink-0 mt-0.5">
                          {task.revisions.length - idx}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-[#1a1033] leading-snug">
                            {rev.revision_note}
                          </p>
                          <p className="text-[11px] text-[#9490a8]">
                            Requested on {format(new Date(rev.requested_at), "dd MMM yyyy · h:mm a")}
                          </p>
                        </div>
                      </div>
                      {/* Status badge */}
                      <span className={cn(
                        "shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border",
                        rev.revision_status === "REQUESTED"
                          ? "bg-orange-100 text-orange-600 border-orange-200"
                          : rev.revision_status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-600 border-blue-200"
                          : rev.revision_status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-600 border-emerald-200"
                          : "bg-red-100 text-red-600 border-red-200"
                      )}>
                        {rev.revision_status.replace("_", " ")}
                      </span>
                    </div>

                    {/* Attached files */}
                    {rev.files && rev.files.length > 0 && (
                      <div className="px-5 pb-4 pt-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#9490a8] mb-2 flex items-center gap-1.5">
                          <Paperclip className="size-3" /> Attached Files ({rev.files.length})
                        </p>
                        <div className="grid gap-2">
                          {rev.files.map((file: any) => (
                            <div
                              key={file.id}
                              className="flex items-center justify-between gap-3 bg-white border border-orange-100 rounded-xl px-3 py-2"
                            >
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                <div className="size-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 shrink-0">
                                  <FileText className="size-3.5" />
                                </div>
                                <div className="overflow-hidden">
                                  <p className="text-xs font-semibold text-[#1a1033] truncate">{file.file_name}</p>
                                  <p className="text-[10px] text-[#9490a8]">
                                    {file.file_size ? `${(file.file_size / 1024).toFixed(1)} KB` : "Unknown size"}
                                  </p>
                                </div>
                              </div>
                              <a href={getFileUrl(file.file_url)} target="_blank" rel="noopener noreferrer">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-lg text-[#9490a8] hover:text-orange-500 hover:bg-orange-50"
                                >
                                  <Download className="size-3.5" />
                                </Button>
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No files indicator */}
                    {(!rev.files || rev.files.length === 0) && (
                      <div className="px-5 pb-4">
                        <p className="text-[11px] text-[#9490a8] italic flex items-center gap-1.5">
                          <Paperclip className="size-3 opacity-50" /> No files attached
                        </p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Writer & Stats */}
        <div className="space-y-8">
          {/* Expert Info */}
          {!isBiddingPhase && (
            <Card className="border-border/50 shadow-sm rounded-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-[#1a1033]">Assigned Expert</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-violet-100 flex items-center justify-center text-xl font-bold text-[#7C5CFC] border border-[#7C5CFC]/20">
                    {task.writer?.first_name?.[0] || "W"}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-[#1a1033]">{task.writer?.first_name} {task.writer?.last_name}</h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold">★ 4.9</span>
                      <span className="text-[#9490a8]">• Expert Writer</span>
                    </div>
                  </div>
                </div>
                <Link href="/customer/messages" className="w-full">
                  <Button variant="outline" className="w-full rounded-xl gap-2 h-11 border-border/50 hover:bg-violet-50 hover:text-[#7C5CFC] transition-colors font-bold text-xs">
                    <MessageSquare className="size-4" /> Open Secure Channel
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Payment Summary */}
          {!isBiddingPhase && (
            <Card className="border-border/50 shadow-sm bg-muted/20 rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg text-[#1a1033]">Financial Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9490a8]">Agreed Budget</span>
                    <span className="font-bold text-[#1a1033]">${parseFloat(task.budget).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9490a8]">Status</span>
                    <span className={cn(
                      "font-bold italic",
                      task.payment_status === "PAID" ? "text-emerald-600" : "text-orange-600"
                    )}>
                      {task.payment_status === "PAID" ? "Paid" : "Held in Escrow"}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-orange-500/5 border-t border-orange-500/10 flex gap-3 text-[10px] text-orange-700 leading-relaxed">
                  <AlertTriangle className="size-4 shrink-0" />
                  <p>Funds will only be released after your explicit approval of the submitted project files.</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Bidding Info Card */}
          {isBiddingPhase && (
            <Card className="border-[#7C5CFC]/20 shadow-sm bg-violet-50/50 rounded-2xl overflow-hidden">
               <CardHeader className="bg-[#7C5CFC]/5 border-b border-[#7C5CFC]/10">
                  <CardTitle className="text-sm font-bold text-[#7C5CFC] flex items-center gap-2">
                     <Info className="size-4" /> Bidding Guidelines
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-5 space-y-4">
                  <div className="space-y-3">
                     <p className="text-[11px] text-[#6b6880] leading-relaxed">
                        • You can accept only <strong>one</strong> bid. Accepting a bid will close the project to other writers.
                     </p>
                     <p className="text-[11px] text-[#6b6880] leading-relaxed">
                        • After accepting a bid, you will be redirected to complete the payment into <strong>escrow</strong>.
                     </p>
                     <p className="text-[11px] text-[#6b6880] leading-relaxed">
                        • Once paid, your expert will begin working on the project immediately.
                     </p>
                  </div>
               </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ── Revision Request Modal ── */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/50 bg-orange-50/50">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
                  <RotateCcw className="size-5" />
                </div>
                <div>
                  <h2 className="font-bold text-[#1a1033] text-base">Request a Revision</h2>
                  <p className="text-[11px] text-[#9490a8]">Describe what changes you need</p>
                </div>
              </div>
              <button
                onClick={() => { setShowRevisionModal(false); setRevisionNote(""); setRevisionFiles([]); }}
                className="size-8 rounded-xl hover:bg-orange-100 flex items-center justify-center text-[#9490a8] hover:text-orange-500 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Message */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#9490a8]">Revision Message <span className="text-red-400">*</span></label>
                <textarea
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                  placeholder="Explain clearly what needs to be changed or corrected..."
                  rows={4}
                  className="w-full rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm text-[#1a1033] placeholder:text-[#9490a8]/60 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400/60 resize-none transition-all"
                />
              </div>

              {/* File attachments */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#9490a8]">Attach Files <span className="text-[#9490a8] font-normal lowercase">(optional)</span></label>
                <input
                  type="file"
                  multiple
                  ref={revisionFileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files || []);
                    setRevisionFiles((prev) => [...prev, ...newFiles]);
                    if (revisionFileInputRef.current) revisionFileInputRef.current.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => revisionFileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-orange-300/60 bg-orange-50/30 py-4 text-orange-500 hover:border-orange-400 hover:bg-orange-50 transition-all text-sm font-semibold"
                >
                  <Paperclip className="size-4" />
                  Click to attach files
                </button>

                {revisionFiles.length > 0 && (
                  <div className="space-y-2">
                    {revisionFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3 bg-orange-50/60 border border-orange-100 rounded-xl px-3 py-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className="size-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500 shrink-0">
                            <FileText className="size-3.5" />
                          </div>
                          <span className="text-xs font-medium text-[#1a1033] truncate">{file.name}</span>
                          <span className="text-[10px] text-[#9490a8] shrink-0">{(file.size / 1024).toFixed(1)} KB</span>
                        </div>
                        <button
                          onClick={() => setRevisionFiles((prev) => prev.filter((_, i) => i !== idx))}
                          className="size-6 rounded-lg hover:bg-red-100 flex items-center justify-center text-[#9490a8] hover:text-red-500 transition-colors shrink-0"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-border/50 bg-muted/10">
              <Button
                variant="outline"
                onClick={() => { setShowRevisionModal(false); setRevisionNote(""); setRevisionFiles([]); }}
                className="flex-1 rounded-xl h-10 border-border/60 text-[#9490a8] hover:bg-muted/30 font-bold text-xs"
                disabled={isSubmittingRevision}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRequestRevision}
                disabled={isSubmittingRevision || !revisionNote.trim()}
                className="flex-[2] rounded-xl h-10 bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-400/20 font-bold gap-2 text-xs"
              >
                {isSubmittingRevision ? (
                  <><Clock className="size-3.5 animate-spin" /> Submitting...</>
                ) : (
                  <><RotateCcw className="size-3.5" /> Submit Revision Request</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
