"use client";

import React from "react";
import { 
  Search, 
  Filter, 
  Clock, 
  Star,
  Zap,
  Gavel,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Info,
  MoreHorizontal,
  FileText,
  Download,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, Textarea } from "@/components/ui";
import { taskService } from "@/services/task.service";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";

export default function AvailableTasks() {
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isBidding, setIsBidding] = React.useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<any>(null);
  const [bidAmount, setBidAmount] = React.useState("");
  const [bidMessage, setBidMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchTasks = async () => {
    try {
      const response = await taskService.getOpenTasksForWriter();
      setTasks(response.results || []);
    } catch (error) {
      console.error("Failed to fetch available tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpenBid = (task: any) => {
    setSelectedTask(task);
    setIsBidding(true);
    if (task.my_bid) {
      setBidAmount(task.my_bid.bid_amount.toString());
      setBidMessage(task.my_bid.message || "");
    } else {
      setBidAmount("");
      setBidMessage("");
    }
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid bid amount greater than zero.");
      return;
    }

    if (bidMessage.length > 1000) {
      alert("Your pitch must be 1000 characters or less.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await taskService.placeBid(selectedTask.id, {
        bid_amount: amount,
        message: bidMessage
      });
      setIsBidding(false);
      // Refresh task list or show success
      fetchTasks();
      alert("Bid placed successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to place bid");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1a1033]">Available Tasks</h1>
          <p className="text-sm text-[#9490a8] mt-1">Discover new academic projects matching your field of expertise.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-50 text-[#7C5CFC] border border-violet-100">
          <Zap className="size-4 fill-[#7C5CFC]" />
          <span className="text-xs font-bold uppercase tracking-wider">Field Matched</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9490a8]" />
          <Input placeholder="Search tasks by title..." className="pl-10 h-11 border-none bg-[#F5F3FF] focus-visible:ring-[#7C5CFC]/20 rounded-xl" />
        </div>
        <Button variant="outline" className="h-11 gap-2 rounded-xl border-border/50 text-[#6b6880] font-bold">
          <Filter className="size-4" /> Filter Subjects
        </Button>
      </div>

      {/* Task List */}
      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="size-8 border-[3px] border-[#7C5CFC] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-[#9490a8] uppercase tracking-widest">Scanning Marketplace...</p>
          </div>
        ) : tasks.length === 0 ? (
          <Card className="border-border/50 border-dashed bg-muted/5 p-16 rounded-3xl text-center space-y-4">
            <div className="size-16 rounded-full bg-violet-100 flex items-center justify-center mx-auto text-[#7C5CFC]">
              <Search className="size-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1a1033]">No open tasks found</h3>
              <p className="text-sm text-[#9490a8]">Check back later or refine your specialization in profile settings.</p>
            </div>
          </Card>
        ) : tasks.map((task) => (
          <Card key={task.id} className="border-border/50 overflow-hidden hover:border-[#7C5CFC]/40 hover:shadow-xl hover:shadow-violet-400/5 transition-all group rounded-2xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                <div className="p-6 lg:p-8 flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-violet-100 text-[#7C5CFC] text-[10px] font-bold uppercase tracking-wider border border-violet-200">
                      {task.academic_category?.name || "Academic"}
                    </span>
                  </div>
                  <h3 
                    onClick={() => {
                      setSelectedTask(task);
                      setIsDetailsOpen(true);
                    }}
                    className="text-xl font-bold text-[#1a1033] group-hover:text-[#7C5CFC] transition-colors cursor-pointer"
                  >
                    {task.title}
                  </h3>
                  <p className="text-sm text-[#6b6880] line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-6 pt-2 text-[11px] text-[#9490a8] font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-2 bg-[#F5F3FF] px-3 py-1.5 rounded-lg text-[#7C5CFC]">
                      <Clock className="size-3.5" /> Due {format(new Date(task.deadline), "dd MMM")}
                    </span>
                    <span className="flex items-center gap-2">
                      <Gavel className="size-3.5" /> Open for Bidding
                    </span>
                  </div>
                </div>
                
                <div className="bg-[#FAF9FF] lg:w-72 p-6 lg:p-8 flex flex-row lg:flex-col items-center justify-between lg:justify-center border-t lg:border-t-0 lg:border-l border-border/50 gap-6">
                  <div className="text-center lg:text-center w-full">
                    <p className="text-[10px] text-[#9490a8] uppercase font-bold tracking-widest mb-1">Status</p>
                    <p className="text-xl font-black text-[#1a1033]">Accepting Bids</p>
                  </div>
                  <Button 
                    onClick={() => handleOpenBid(task)}
                    className={cn(
                      "w-full h-11 rounded-xl shadow-lg font-bold transition-all group/btn",
                      task.my_bid 
                        ? "bg-amber-500 hover:bg-amber-600 shadow-amber-400/20" 
                        : "bg-[#7C5CFC] hover:bg-[#6d4ef0] shadow-violet-400/20"
                    )}
                  >
                    {task.my_bid ? (
                      <>Change Bid <MoreHorizontal className="size-4 ml-1" /></>
                    ) : (
                      <>Place Bid <ChevronRight className="size-4 ml-1 group-hover/btn:translate-x-1 transition-transform" /></>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bid Modal */}
      <Dialog 
        isOpen={isBidding} 
        onClose={() => setIsBidding(false)} 
        title="Submit Project Proposal"
      >
        <form onSubmit={handleSubmitBid} className="space-y-6">
          <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100 flex gap-3">
             <Info className="size-4 text-[#7C5CFC] shrink-0 mt-0.5" />
             <p className="text-[11px] text-[#4c1d95] leading-relaxed">
                You are bidding on <strong>{selectedTask?.title}</strong>. Your bid should include your professional fee and a brief pitch of why you're the best fit.
             </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1a1033] uppercase tracking-wider">Your Proposal Fee ($)</label>
            <div className="relative">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1033] font-bold">$</span>
               <Input 
                  type="number" 
                  step="0.01"
                  required
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="0.00" 
                  className="pl-8 h-12 bg-[#F5F3FF] border-none rounded-2xl focus-visible:ring-[#7C5CFC]/20 text-lg font-bold text-[#1a1033]"
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1a1033] uppercase tracking-wider">Short Pitch / Message</label>
            <Textarea 
              required
              value={bidMessage}
              onChange={(e) => setBidMessage(e.target.value)}
              placeholder="Briefly explain your experience relevant to this task..."
              className="min-h-[120px] bg-[#F5F3FF] border-none rounded-2xl p-4 text-sm focus-visible:ring-[#7C5CFC]/20"
            />
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-12 bg-[#7C5CFC] hover:bg-[#6d4ef0] text-white rounded-2xl font-bold shadow-xl shadow-violet-400/30 transition-all"
            >
              {isSubmitting ? (
                <Clock className="size-5 animate-spin" />
              ) : (
                "Submit Proposal"
              )}
            </Button>
            <button 
              type="button"
              onClick={() => setIsBidding(false)}
              className="w-full mt-3 text-xs font-bold text-[#9490a8] hover:text-[#1a1033] transition-colors"
            >
              Cancel & Go Back
            </button>
          </div>
        </form>
      </Dialog>

      {/* Task Details Modal */}
      <Dialog 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        title="Project Specifications"
      >
        {selectedTask && (
          <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-violet-50 text-[#7C5CFC] border-violet-100 hover:bg-violet-50 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg">
                  {selectedTask.academic_category?.name || "Academic"}
                </Badge>
                {selectedTask.is_urgent && (
                  <Badge className="bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-50 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg flex items-center gap-1">
                    <Zap className="size-3 fill-rose-600" /> Urgent
                  </Badge>
                )}
              </div>
              <h2 className="text-2xl font-black text-[#1a1033] leading-tight">{selectedTask.title}</h2>
              <div className="flex items-center gap-6 text-[11px] font-bold text-[#9490a8] uppercase tracking-widest pt-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" /> Created {format(new Date(selectedTask.created_at), "dd MMM yyyy")}
                </span>
                <span className="flex items-center gap-1.5 text-indigo-600">
                  <Info className="size-3.5" /> ID: {selectedTask.id.toString().padStart(6, '0')}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-[#1a1033] uppercase tracking-[0.2em] flex items-center gap-2">
                <FileText className="size-4 text-[#7C5CFC]" /> 
                Detailed Description
              </h4>
              <div className="bg-[#F8F9FF] p-6 rounded-2xl border border-[#F0EBFF]">
                <p className="text-sm text-[#4a4559] leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedTask.description}
                </p>
              </div>
            </div>

            {/* Reference Materials */}
            <div className="space-y-3 pt-4 border-t border-[#F0EBFF]">
              <h4 className="text-xs font-black text-[#1a1033] uppercase tracking-[0.2em] flex items-center gap-2">
                <Download className="size-4 text-[#7C5CFC]" /> 
                Client Attachments ({selectedTask.files?.length || 0})
              </h4>
              {selectedTask.files && selectedTask.files.length > 0 ? (
                <div className="grid gap-3">
                  {selectedTask.files.map((file: any) => (
                    <div key={file.id} className="group/file flex items-center justify-between p-4 rounded-2xl border border-dashed border-[#E0D9FF] bg-white hover:border-[#7C5CFC]/40 hover:bg-violet-50/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-violet-100 flex items-center justify-center text-[#7C5CFC] group-hover/file:bg-[#7C5CFC] group-hover/file:text-white transition-colors">
                          <FileText className="size-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#1a1033] group-hover/file:text-[#7C5CFC] transition-colors">{file.file_name}</span>
                          <span className="text-[10px] text-[#9490a8] font-bold uppercase">{file.file_type.replace('_', ' ')} • {(file.file_size / 1024).toFixed(1)} KB</span>
                        </div>
                      </div>
                      <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="ghost" className="rounded-lg h-9 w-9 p-0 hover:bg-[#7C5CFC] hover:text-white transition-colors">
                           <ChevronRight className="size-4" />
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#F8F9FF] p-6 rounded-2xl border border-dashed border-[#F0EBFF] text-center">
                  <p className="text-xs font-bold text-[#9490a8] uppercase tracking-widest">No attachments provided by client</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#F0EBFF] flex gap-4">
              <Button 
                onClick={() => {
                  setIsDetailsOpen(false);
                  handleOpenBid(selectedTask);
                }}
                className="flex-1 rounded-xl bg-[#7C5CFC] hover:bg-[#6d4ef0] font-bold h-12 shadow-lg shadow-violet-400/20"
              >
                Place Bid Now
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsDetailsOpen(false)}
                className="flex-1 rounded-xl border-[#F0EBFF] hover:bg-violet-50 font-bold h-12"
              >
                Close View
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
