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
import Link from "next/link";
import { taskService } from "@/services/task.service";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";

export default function AvailableTasks() {
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isBidding, setIsBidding] = React.useState(false);
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
                  <Link href={`/writer/tasks/${task.id}`}>
                    <h3 className="text-xl font-bold text-[#1a1033] hover:text-[#7C5CFC] transition-colors cursor-pointer">
                      {task.title}
                    </h3>
                  </Link>
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
                    <span className="flex items-center gap-2">
                      <FileText className="size-3.5" /> {task.files?.length || 0} Files
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

      </Dialog>
    </div>
  );
}
