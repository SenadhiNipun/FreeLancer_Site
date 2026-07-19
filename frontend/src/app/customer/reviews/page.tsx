"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Star, CheckCircle2, ThumbsUp, Calendar, FileText, Loader2, AlertCircle } from "lucide-react";
import { taskService } from "@/services/task.service";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button"
          onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => onChange(s)}>
          <Star className={cn("size-6 transition-colors cursor-pointer",
            s <= (hover || value) ? "text-amber-500 fill-amber-400" : "text-slate-200"
          )} />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm font-medium text-muted-foreground">
          {["","Poor","Fair","Good","Very Good","Excellent"][value]}
        </span>
      )}
    </div>
  );
}

function ReviewForm({ task, onSubmitted }: { task: any; onSubmitted: () => void }) {
  const [rating, setRating]     = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError("Please select a star rating."); return; }
    setLoading(true); setError(null);
    try {
      await taskService.submitReview(task.id, rating, feedback || undefined);
      onSubmitted();
    } catch (err) {
      setError((err as Error).message || "Failed to submit review.");
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="flex items-start gap-3 px-5 py-4 border-b border-border">
        <div className="size-9 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
          <FileText className="size-4 text-violet-600" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/customer/orders/${task.id}`}>
            <h3 className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate cursor-pointer">{task.title}</h3>
          </Link>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
            <span className="status-completed">Completed</span>
            {task.writer && <span>Writer: <Link href={`/profile/${task.writer.id}`} className="font-medium text-foreground hover:text-primary hover:underline">{task.writer.first_name} {task.writer.last_name}</Link></span>}
            <span>${parseFloat(task.budget || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Your Rating</label>
          <StarPicker value={rating} onChange={setRating} />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Feedback <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={3}
            placeholder="Share your experience with this writer…"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors resize-none placeholder:text-muted-foreground/50" />
        </div>
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            <AlertCircle className="size-4 flex-shrink-0" /> {error}
          </div>
        )}
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Submitting…" : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

function SubmittedCard({ task }: { task: any }) {
  const r = task.review;
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="flex items-start gap-3 px-5 py-4 border-b border-border">
        <div className="size-9 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="size-4 text-green-600" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/customer/orders/${task.id}`}>
            <h3 className="text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer truncate">{task.title}</h3>
          </Link>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
            {task.writer && <span>Writer: <span className="font-medium text-foreground">{task.writer.first_name} {task.writer.last_name}</span></span>}
            <span className="flex items-center gap-1"><Calendar className="size-3" /> {r.created_at ? format(new Date(r.created_at), "dd MMM yyyy") : ""}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {[1,2,3,4,5].map(s => (
            <Star key={s} className={cn("size-4", s <= r.rating ? "text-amber-500 fill-amber-400" : "text-slate-200")} />
          ))}
          <span className="ml-1 text-sm font-semibold text-foreground">{r.rating}.0</span>
        </div>
      </div>
      {r.feedback && (
        <div className="px-5 py-4">
          <p className="text-sm text-foreground/80 italic leading-relaxed p-3.5 rounded-lg bg-muted/30 border border-border/50">
            &ldquo;{r.feedback}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}

export default function CustomerReviewsPage() {
  const [tasks, setTasks]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [key, setKey]         = useState(0);

  useEffect(() => {
    setLoading(true);
    taskService.getCustomerTasks()
      .then(r => setTasks(r.results || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [key]);

  const completed  = tasks.filter(t => t.task_status === "COMPLETED");
  const reviewed   = completed.filter(t => t.review);
  const pending    = completed.filter(t => !t.review);
  const avgRating  = reviewed.length ? reviewed.reduce((s, t) => s + (t.review?.rating || 0), 0) / reviewed.length : 0;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="size-5 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-5 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Reviews</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Rate your writers and manage feedback.</p>
        </div>
        {completed.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-border">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={cn("size-3.5", s <= Math.round(avgRating) ? "text-amber-500 fill-amber-400" : "text-slate-200")} />
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">{avgRating > 0 ? avgRating.toFixed(1) : "—"}</span>
            <span className="text-xs text-muted-foreground">avg · {reviewed.length} reviews</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="size-9 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="size-4 text-green-600" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-green-600">{completed.length}</p>
            <p className="text-xs text-muted-foreground">Completed Projects</p>
          </div>
        </div>
        <div className="bg-white border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="size-9 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
            <ThumbsUp className="size-4 text-violet-600" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-violet-600">{reviewed.length}</p>
            <p className="text-xs text-muted-foreground">Reviews Submitted</p>
          </div>
        </div>
        <div className="bg-white border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="size-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
            <Star className="size-4 text-amber-600" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-2xl font-semibold text-amber-600">{pending.length}</p>
            <p className="text-xs text-muted-foreground">Awaiting Review</p>
          </div>
        </div>
      </div>

      {/* Pending reviews */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground">Awaiting Your Review ({pending.length})</h2>
          {pending.map(t => <ReviewForm key={t.id} task={t} onSubmitted={() => setKey(k => k + 1)} />)}
        </div>
      )}

      {/* Submitted reviews */}
      {reviewed.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground">Reviews Submitted ({reviewed.length})</h2>
          {reviewed.map(t => <SubmittedCard key={t.id} task={t} />)}
        </div>
      )}

      {/* Empty state */}
      {completed.length === 0 && (
        <div className="bg-white border border-dashed border-border rounded-xl py-14 text-center">
          <Star className="size-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-medium text-foreground">No completed projects yet</p>
          <p className="text-sm text-muted-foreground mt-1">Once a project is completed, you can leave a review here.</p>
        </div>
      )}
    </div>
  );
}
