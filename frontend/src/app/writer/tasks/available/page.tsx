"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search, Clock, FileText, DollarSign, Gavel,
  ChevronRight, X, Info, Loader2,
} from "lucide-react";
import { taskService } from "@/services/task.service";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

export default function AvailableTasks() {
  const [tasks, setTasks]             = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [modalTask, setModalTask]     = useState<any>(null);
  const [bidAmount, setBidAmount]     = useState("");
  const [bidMessage, setBidMessage]   = useState("");
  const [submitting, setSubmitting]   = useState(false);

  const fetchTasks = () => {
    setLoading(true);
    taskService.getOpenTasksForWriter()
      .then(r => setTasks(r.results || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTasks(); }, []);

  const openBid = (task: any) => {
    setModalTask(task);
    setBidAmount(task.my_bid?.bid_amount?.toString() || "");
    setBidMessage(task.my_bid?.message || "");
  };

  const closeBid = () => { setModalTask(null); setBidAmount(""); setBidMessage(""); };

  const submitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) { toast.warning("Enter a valid bid amount."); return; }
    if (bidMessage.length > 1000)     { toast.warning("Message must be ≤ 1000 characters."); return; }
    setSubmitting(true);
    try {
      await taskService.placeBid(modalTask.id, { bid_amount: amount, message: bidMessage });
      toast.success("Bid placed successfully!");
      closeBid();
      fetchTasks();
    } catch (err: any) {
      toast.error(err.message || "Failed to place bid.");
    } finally { setSubmitting(false); }
  };

  const displayed = tasks.filter(t =>
    !search || t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Available Tasks</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{tasks.length} open project{tasks.length !== 1 ? "s" : ""} accepting bids</p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl p-3 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors placeholder:text-muted-foreground/50" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 gap-2">
          <Loader2 className="size-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading tasks…</span>
        </div>
      ) : displayed.length === 0 ? (
        <div className="bg-white border border-dashed border-border rounded-xl flex flex-col items-center justify-center py-14 text-center">
          <Gavel className="size-10 text-muted-foreground/30 mb-3" />
          <p className="font-medium text-foreground">No tasks available</p>
          <p className="text-sm text-muted-foreground mt-1">Check back later for new projects matching your expertise.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((task) => (
            <div key={task.id} className="bg-white border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {task.academic_category && (
                      <span className="px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 text-xs font-medium">
                        {task.academic_category.name}
                      </span>
                    )}
                    {task.my_bid && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium">
                        Bid placed: ${parseFloat(task.my_bid.bid_amount).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <Link href={`/writer/tasks/${task.id}`}>
                    <h3 className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">
                      {task.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" /> Due {format(new Date(task.deadline), "dd MMM yyyy")}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="size-3" /> {task.files?.length || 0} files
                    </span>
                    <span className="flex items-center gap-1">
                      <Gavel className="size-3" /> Open for bids
                    </span>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2 flex-shrink-0">
                  {task.budget && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Budget</p>
                      <p className="font-semibold text-foreground">${parseFloat(task.budget).toFixed(2)}</p>
                    </div>
                  )}
                  <button
                    onClick={() => openBid(task)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-opacity",
                      task.my_bid ? "bg-amber-500 text-white hover:opacity-90" : "bg-primary text-white hover:opacity-90"
                    )}
                  >
                    {task.my_bid ? "Update Bid" : "Place Bid"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bid Modal */}
      {modalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Submit Proposal</h2>
              <button onClick={closeBid} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={submitBid} className="p-5 space-y-4">
              <div className="p-3 rounded-lg bg-violet-50 border border-violet-100 flex gap-2.5">
                <Info className="size-4 text-violet-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-violet-800 leading-relaxed">
                  Bidding on: <strong>{modalTask.title}</strong>
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">Proposed Fee ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="number" step="0.01" required value={bidAmount} onChange={e => setBidAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">Your Pitch</label>
                <textarea
                  required value={bidMessage} onChange={e => setBidMessage(e.target.value)}
                  placeholder="Briefly explain your experience and why you're a good fit…"
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors resize-none placeholder:text-muted-foreground/50"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={closeBid}
                  className="flex-1 h-10 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 h-10 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                  {submitting ? <><Loader2 className="size-4 animate-spin" /> Submitting…</> : "Submit Proposal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
