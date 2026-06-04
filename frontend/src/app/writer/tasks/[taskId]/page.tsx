"use client";

import React from "react";
import { 
  ArrowLeft, 
  Clock, 
  User, 
  FileText, 
  Download, 
  MessageSquare, 
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  Upload,
  Info,
  ChevronRight,
  ArrowRight,
  Activity,
  RotateCcw,
  Paperclip,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, Textarea } from "@/components/ui";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { taskService } from "@/services/task.service";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CountdownTimer } from "@/components/tasks/CountdownTimer";
import { getFileUrl } from "@/lib/api-client";
import { toast } from "react-toastify";

export default function WriterTaskDetails() {
  const params = useParams();
  const taskIdParam = params.taskId as string;

  const [task, setTask] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [submissionNote, setSubmissionNote] = React.useState("");
  const [bidAmount, setBidAmount] = React.useState("");
  const [bidMessage, setBidMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const fetchTask = async () => {
      try {
        if (!taskIdParam) return;
        const taskId = parseInt(taskIdParam);
        if (isNaN(taskId)) {
          setIsLoading(false);
          return;
        }
        const response = await taskService.getWriterTaskDetails(taskId);
        const taskData = response.results;
        setTask(taskData);
        
        // If there's an existing bid, pre-fill the form
        if (taskData.my_bid) {
          setBidAmount(taskData.my_bid.bid_amount.toString());
          setBidMessage(taskData.my_bid.message || "");
        }
      } catch (error) {
        console.error("Failed to fetch task details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (taskIdParam) fetchTask();
  }, [taskIdParam]);

  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskIdParam) return;
    setIsSubmitting(true);
    try {
      const taskId = parseInt(taskIdParam);
      await taskService.submitTask(taskId, {
        submission_note: submissionNote,
        is_final: true,
        files: selectedFiles
      });
      toast.success("Work submitted successfully!");
      setSubmissionNote("");
      setSelectedFiles([]);
      // Refresh task
      const response = await taskService.getWriterTaskDetails(taskId);
      setTask(response.results);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit work");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskIdParam) return;
    
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.warning("Please enter a valid bid amount.");
      return;
    }

    setIsSubmitting(true);
    try {
      const taskId = parseInt(taskIdParam);
      await taskService.placeBid(taskId, {
        bid_amount: amount,
        message: bidMessage
      });
      toast.success("Bid placed successfully!");
      // Refresh task
      const response = await taskService.getWriterTaskDetails(taskId);
      setTask(response.results);
    } catch (error: any) {
      toast.error(error.message || "Failed to place bid");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="size-8 border-[3px] border-[#7C5CFC] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-[#9490a8] uppercase tracking-widest">Loading task details...</p>
      </div>
    );
  }

  if (!task) return <div className="text-center py-20 font-bold text-rose-500">Task record not found.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-reveal pb-20">
      {/* ── Top Navigation & Meta ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-8 glass rounded-[2.5rem] border-gradient relative overflow-hidden">
        <div className="absolute top-0 right-0 size-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center gap-6 relative z-10">
          <Link href="/writer/tasks/active">
            <button className="size-12 rounded-2xl glass border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 group shadow-xl">
              <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
            </button>
          </Link>
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                {task.academic_category?.name || "Academic Project"}
              </Badge>
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                task.task_status === "OPEN" 
                  ? "bg-violet-500/10 text-violet-600 border border-violet-500/10" 
                  : "bg-amber-500/10 text-amber-600 border border-amber-500/10"
              )}>
                <Clock className="size-3" />
                {task.task_status === "OPEN" ? "Bidding Open" : "In Progress"}
              </div>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground leading-tight">
              {task.title}
            </h1>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              Project ID: <span className="text-primary">{task.id.toString().padStart(6, '0')}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="hidden sm:block text-right">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Time Remaining</p>
            <CountdownTimer deadline={task.deadline} />
          </div>
          <div className="h-12 w-px bg-white/10 hidden sm:block mx-2" />
          <div className="p-4 glass bg-primary/5 rounded-2xl border-primary/10 min-w-[140px] text-center">
             <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
               {task.task_status === "OPEN" ? "Initial Budget" : "Total Payout"}
             </p>
             <p className="text-2xl font-black text-foreground">
               {task.budget ? `$${parseFloat(task.budget).toFixed(2)}` : "Awaiting Bids"}
             </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* ── Left Column: Detailed Content (8 cols) ── */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Assignment Brief */}
          <div className="glass rounded-[2rem] overflow-hidden border-white/5 shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Assignment Brief</h3>
                  <p className="text-[10px] text-muted-foreground font-medium">Core requirements and instructions</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-xl border border-white/5">
                <Clock className="size-3.5" />
                Posted {format(new Date(task.created_at), "MMM dd, yyyy")}
              </div>
            </div>
            
            <div className="p-8 space-y-10">
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
                <p className="text-[15px] text-foreground/80 leading-relaxed whitespace-pre-wrap font-medium pl-2">
                  {task.description}
                </p>
              </div>

              {/* Resource Materials - Prominent Section */}
              <div className="space-y-6 pt-10 border-t border-white/5">
                 <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                      <Download className="size-4 text-primary" /> Client Attachments
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-primary/10 text-primary">
                      {task.files?.length || 0} Files
                    </span>
                 </div>

                 {task.files && task.files.length > 0 ? (
                   <div className="grid gap-4 sm:grid-cols-2">
                      {task.files.map((file: any) => (
                        <div key={file.id} className="group/file flex items-center justify-between p-5 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] hover:border-primary/30 transition-all duration-300">
                           <div className="flex items-center gap-4 truncate">
                              <div className="size-11 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                                 <FileText className="size-5" />
                              </div>
                              <div className="flex flex-col truncate">
                                 <span className="text-[13px] font-bold text-foreground truncate">{file.file_name}</span>
                                 <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                                   {(file.file_size / 1024).toFixed(1)} KB • {file.file_type.split('/')[1]?.toUpperCase() || "FILE"}
                                 </span>
                              </div>
                           </div>
                           <a href={getFileUrl(file.file_url)} target="_blank" rel="noopener noreferrer">
                             <button className="size-10 rounded-xl glass border-white/10 text-primary hover:bg-primary hover:text-white transition-all shadow-lg flex items-center justify-center">
                                <Download className="size-4" />
                             </button>
                           </a>
                        </div>
                      ))}
                   </div>
                 ) : (
                   <div className="glass p-10 rounded-3xl border border-dashed border-white/10 text-center space-y-3">
                      <div className="size-12 rounded-full bg-white/5 flex items-center justify-center mx-auto opacity-40">
                        <FileText className="size-6" />
                      </div>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">No attachments provided by client</p>
                   </div>
                 )}
              </div>
            </div>
          </div>

          {/* Work Submission Panel or Bidding Panel */}
          {task.task_status !== "COMPLETED" && (
            task.task_status === "OPEN" ? (
              <div className="glass rounded-[2.5rem] overflow-hidden border-primary/20 shadow-2xl shadow-primary/5 bg-primary/[0.01]">
                <div className="p-8 border-b border-white/5 bg-primary/5 flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                    <DollarSign className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Place Your Proposal</h3>
                    <p className="text-[11px] text-muted-foreground font-medium">Pitch your expertise and set your professional fee</p>
                  </div>
                </div>
                <div className="p-8">
                  <form onSubmit={handleSubmitBid} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground uppercase tracking-widest ml-1">Your Proposed Fee ($)</label>
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/50 font-bold">$</span>
                          <input 
                            type="number" 
                            step="0.01"
                            required
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder="0.00" 
                            className="w-full h-14 glass bg-white/[0.02] border-white/10 rounded-2xl pl-10 pr-6 text-lg font-black focus:ring-primary/20 text-foreground"
                          />
                        </div>
                      </div>
                      <div className="flex items-end">
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 w-full">
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Platform Note</p>
                          <p className="text-[11px] text-muted-foreground mt-1">Clients prefer detailed pitches with specific timelines.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-foreground uppercase tracking-widest ml-1">Professional Pitch</label>
                      <Textarea 
                        placeholder="Explain why you are the best fit for this project..."
                        className="min-h-[140px] glass bg-white/[0.02] border-white/10 rounded-[2rem] p-6 text-[14px] focus-visible:ring-primary/20 text-foreground"
                        value={bidMessage}
                        onChange={(e) => setBidMessage(e.target.value)}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-base shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? (
                        <Activity className="size-5 animate-spin" />
                      ) : (
                        <>
                          {task.my_bid ? "Update My Proposal" : "Submit Proposal"}
                          <ArrowRight className="size-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="glass rounded-[2.5rem] overflow-hidden border-primary/20 shadow-2xl shadow-primary/5 bg-primary/[0.01]">
                <div className="p-8 border-b border-white/5 bg-primary/5 flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                    <Upload className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Deliver Final Work</h3>
                    <p className="text-[11px] text-muted-foreground font-medium">Upload completed documents for client review</p>
                  </div>
                </div>
                <div className="p-8">
                  <form onSubmit={handleSubmitWork} className="space-y-6">
                    <Textarea 
                        placeholder="Add a professional message for the client..."
                        className="min-h-[160px] glass bg-white/[0.02] border-white/10 rounded-[2rem] p-6 text-[14px] focus-visible:ring-primary/20 text-foreground"
                        value={submissionNote}
                        onChange={(e) => setSubmissionNote(e.target.value)}
                        required
                    />
                     <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      multiple 
                      className="hidden" 
                    />

                    {selectedFiles.length > 0 && (
                      <div className="space-y-2 border-t border-white/5 pt-4 mt-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                          <Paperclip className="size-3 text-primary" /> Selected Files ({selectedFiles.length})
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {selectedFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                              <div className="flex items-center gap-2 truncate">
                                <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-primary shrink-0">
                                  <FileText className="size-4" />
                                </div>
                                <div className="truncate">
                                  <p className="text-xs font-bold text-foreground truncate">{file.name}</p>
                                  <p className="text-[9px] text-muted-foreground uppercase font-bold">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => handleRemoveFile(idx)} 
                                className="size-7 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 flex items-center justify-center transition-colors"
                              >
                                <X className="size-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <button 
                          type="button" 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full md:w-auto h-14 rounded-2xl px-8 glass border-white/10 hover:bg-white/10 text-[13px] font-bold transition-all flex items-center justify-center gap-3"
                        >
                          <Upload className="size-5 text-primary" />
                          Attach Final Files
                        </button>
                        <Button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="w-full md:flex-1 h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-base shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3"
                        >
                          {isSubmitting ? (
                            <Activity className="size-5 animate-spin" />
                          ) : (
                            <>
                              Submit Project for Review
                              <ArrowRight className="size-5" />
                            </>
                          )}
                        </Button>
                    </div>
                  </form>
                </div>
              </div>
            )
          )}

          {/* ── Writer Submissions Section ── */}
          {task.submissions && task.submissions.length > 0 && (
            <div className="glass rounded-[2rem] overflow-hidden border-white/5 shadow-2xl space-y-6 p-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-5">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Main Submissions</h3>
                    <p className="text-[10px] text-muted-foreground font-medium">Work submitted by you</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-primary/10 text-primary">
                  {task.submissions.length} Submissions
                </span>
              </div>

              <div className="space-y-6">
                {[...task.submissions].reverse().map((sub: any, idx: number) => (
                  <div key={sub.id} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm shrink-0">
                          {task.submissions.length - idx}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-foreground leading-snug">
                            {sub.submission_note || "No note provided."}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                            Submitted on {format(new Date(sub.submitted_at), "MMM dd, yyyy · h:mm a")}
                          </p>
                        </div>
                      </div>
                      
                      <span className={cn(
                        "shrink-0 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                        sub.submission_status === "FINAL_SUBMISSION"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      )}>
                        {sub.submission_status.replace("_", " ")}
                      </span>
                    </div>

                    {/* Attached files */}
                    {sub.files && sub.files.length > 0 && (
                      <div className="pt-2 border-t border-white/5">
                        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground mb-3 flex items-center gap-1.5">
                          <Paperclip className="size-3 text-primary" /> Attached Files ({sub.files.length})
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {sub.files.map((file: any) => (
                            <div
                              key={file.id}
                              className="group/file flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-primary/30 transition-all duration-300"
                            >
                              <div className="flex items-center gap-3 truncate">
                                <div className="size-9 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover/file:scale-105 transition-all">
                                  <FileText className="size-4" />
                                </div>
                                <div className="flex flex-col truncate">
                                  <span className="text-[12px] font-bold text-foreground truncate">{file.file_name}</span>
                                  <span className="text-[9px] text-muted-foreground font-bold uppercase">
                                    {file.file_size ? `${(file.file_size / 1024).toFixed(1)} KB` : "Unknown size"}
                                  </span>
                                </div>
                              </div>
                              <a href={getFileUrl(file.file_url)} target="_blank" rel="noopener noreferrer">
                                <button className="size-8 rounded-lg glass border-white/10 text-primary hover:bg-primary hover:text-white transition-all shadow-lg flex items-center justify-center">
                                  <Download className="size-3.5" />
                                </button>
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Revision History Section ── */}
          {task.revisions && task.revisions.length > 0 && (
            <div id="revision-history" className="glass rounded-[2rem] overflow-hidden border-white/5 shadow-2xl space-y-6 p-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-5">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <RotateCcw className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Revision History</h3>
                    <p className="text-[10px] text-muted-foreground font-medium">Revisions requested by the client</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-amber-500/10 text-amber-500">
                  {task.revisions.length} Requests
                </span>
              </div>

              <div className="space-y-6">
                {[...task.revisions].reverse().map((rev: any, idx: number) => (
                  <div key={rev.id} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="size-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-black text-sm shrink-0">
                          {task.revisions.length - idx}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-foreground leading-snug">
                            {rev.revision_note}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                            Requested on {format(new Date(rev.requested_at), "MMM dd, yyyy · h:mm a")}
                          </p>
                        </div>
                      </div>
                      
                      <span className={cn(
                        "shrink-0 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                        rev.revision_status === "REQUESTED"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : rev.revision_status === "IN_PROGRESS"
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          : rev.revision_status === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      )}>
                        {rev.revision_status.replace("_", " ")}
                      </span>
                    </div>

                    {/* Attached files */}
                    {rev.files && rev.files.length > 0 && (
                      <div className="pt-2 border-t border-white/5">
                        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground mb-3 flex items-center gap-1.5">
                          <Paperclip className="size-3 text-amber-500" /> Attached Revision Materials ({rev.files.length})
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {rev.files.map((file: any) => (
                            <div
                              key={file.id}
                              className="group/file flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-amber-500/30 transition-all duration-300"
                            >
                              <div className="flex items-center gap-3 truncate">
                                <div className="size-9 rounded-lg bg-white/5 flex items-center justify-center text-amber-500 group-hover/file:scale-105 transition-all">
                                  <FileText className="size-4" />
                                </div>
                                <div className="flex flex-col truncate">
                                  <span className="text-[12px] font-bold text-foreground truncate">{file.file_name}</span>
                                  <span className="text-[9px] text-muted-foreground font-bold uppercase">
                                    {file.file_size ? `${(file.file_size / 1024).toFixed(1)} KB` : "Unknown size"}
                                  </span>
                                </div>
                              </div>
                              <a href={getFileUrl(file.file_url)} target="_blank" rel="noopener noreferrer">
                                <button className="size-8 rounded-lg glass border-white/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-all shadow-lg flex items-center justify-center">
                                  <Download className="size-3.5" />
                                </button>
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right Column: Context & Metadata (4 cols) ── */}
        <div className="lg:col-span-4 space-y-8">
           
           {/* Client Profile Card */}
           <div className="glass rounded-[2rem] p-8 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 size-32 bg-primary/5 rounded-full blur-2xl" />
              
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Project Owner</p>
                <div className="flex items-center gap-5 pt-2">
                  <div className="size-16 rounded-[1.25rem] glass bg-card/50 flex items-center justify-center text-primary border border-white/10 shadow-2xl group overflow-hidden">
                    {task.customer?.profile_image_url ? (
                      <img 
                        src={getFileUrl(task.customer.profile_image_url)} 
                        alt="Client Avatar" 
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <User className="size-8 group-hover:scale-110 transition-transform" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-foreground text-lg leading-tight">
                      {task.customer?.first_name} {task.customer?.last_name}
                    </h3>
                    <div className="flex items-center gap-2">
                       <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                       <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Verified Client</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-2xl glass bg-white/[0.02] border-white/5">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Region</p>
                    <p className="text-[13px] font-bold text-foreground">Global</p>
                 </div>
                 <div className="p-4 rounded-2xl glass bg-white/[0.02] border-white/5">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Joined</p>
                    <p className="text-[13px] font-bold text-foreground">May 2023</p>
                 </div>
              </div>

              <Link href={`/writer/messages?session=${task.id}`} className="block">
                <button className="w-full h-12 rounded-2xl glass border-primary/20 text-primary hover:bg-primary hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg">
                   <MessageSquare className="size-4" /> Message Principal
                </button>
              </Link>
           </div>

           {/* Financial Breakdown */}
           <div className="glass rounded-[2rem] p-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Agreed Budget</p>
                  <p className="text-3xl font-black text-foreground tracking-tight">${parseFloat(task.budget || 0).toFixed(2)}</p>
                </div>
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <DollarSign className="size-6" />
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                 <div className="flex items-center justify-between text-[13px] font-medium">
                    <span className="text-muted-foreground">Escrow Status</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                       <CheckCircle2 className="size-3.5" /> Secured
                    </span>
                 </div>
                 <div className="flex items-center justify-between text-[13px] font-medium">
                    <span className="text-muted-foreground">Platform Fee</span>
                    <span className="text-foreground font-bold">$0.00</span>
                 </div>
                 <div className="h-px bg-white/5 my-2" />
                 <div className="flex items-center justify-between pt-1">
                    <span className="text-foreground text-[15px] font-bold">Net Earnings</span>
                    <span className="text-primary text-[18px] font-black">${parseFloat(task.budget || 0).toFixed(2)}</span>
                 </div>
              </div>
           </div>

           {/* Safety Protocol */}
           <div className="bg-amber-500/10 rounded-[2rem] p-8 border border-amber-500/20 flex gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 size-24 bg-amber-500/10 rounded-full blur-2xl" />
              <AlertTriangle className="size-6 text-amber-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div className="space-y-2 relative z-10">
                 <p className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">Integrity Protocol</p>
                 <p className="text-[12px] text-amber-900/80 leading-relaxed font-semibold">
                    Always maintain academic integrity. Avoid external payments and keep all project communication within the platform for your protection.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
