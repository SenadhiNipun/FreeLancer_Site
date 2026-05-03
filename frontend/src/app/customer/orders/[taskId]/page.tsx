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
  Info
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
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-[#1a1033]">
                 <CheckCircle2 className="size-5 text-emerald-500" /> Expert Submissions
              </h2>
              <Card className="border-emerald-500/10 shadow-sm bg-emerald-500/5 rounded-2xl">
                <div className="divide-y divide-emerald-500/10">
                  {task.submissions.map((file: any) => (
                    <div key={file.id} className="p-6 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-white border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-sm">
                          <FileText className="size-5" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-bold text-sm text-[#1a1033]">{file.name || "Project_Submission.docx"}</h3>
                          <p className="text-xs text-[#9490a8]">{file.size || "1.2 MB"} • Uploaded on {format(new Date(file.submitted_at), "dd MMM yyyy")}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/10 gap-2">
                        <Download className="size-4" /> Download
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
              
              <div className="flex flex-wrap gap-4 pt-4">
                 <Button className="rounded-xl flex-1 h-12 shadow-lg shadow-[#7C5CFC]/20 bg-[#7C5CFC] hover:bg-[#6d4ef0] gap-2 font-bold">
                    Approve & Release Payment
                 </Button>
                 <Button variant="outline" className="rounded-xl flex-1 h-12 border-orange-500/20 text-orange-600 hover:bg-orange-500/10 gap-2 font-bold">
                    <RotateCcw className="size-4" /> Request Revision
                 </Button>
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
    </div>
  );
}
