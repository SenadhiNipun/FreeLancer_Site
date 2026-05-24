"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  MessageSquare,
  CheckCircle2,
  Calendar,
  FileText,
  Send,
  Loader2,
  AlertCircle,
  ThumbsUp,
  Clock,
} from "lucide-react";
import { taskService } from "@/services/task.service";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ─── Star Rating Input ─── */
function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            className={cn(
              "size-7 transition-colors duration-150",
              star <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/25 fill-transparent"
            )}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-[13px] font-bold text-muted-foreground">
          {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][value]}
        </span>
      )}
    </div>
  );
}

/* ─── Review Form Card ─── */
function ReviewFormCard({
  task,
  onSubmitted,
}: {
  task: any;
  onSubmitted: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await taskService.submitReview(task.id, rating, feedback || undefined);
      onSubmitted();
    } catch (err: any) {
      setError(err.message || "Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "oklch(1 0 0 / 0.88)",
        backdropFilter: "blur(16px)",
        border: "1px solid oklch(0.88 0.018 260 / 0.55)",
        boxShadow:
          "0 2px 8px oklch(0 0 0 / 0.05), inset 0 1px 0 oklch(1 0 0 / 0.7)",
      }}
    >
      {/* Task header */}
      <div
        className="flex items-start gap-4 p-5"
        style={{ borderBottom: "1px solid oklch(0.88 0.018 260 / 0.4)" }}
      >
        <div
          className="size-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.62 0.22 265 / 0.12), oklch(0.52 0.26 280 / 0.08))",
            border: "1px solid oklch(0.58 0.22 265 / 0.15)",
          }}
        >
          <FileText className="size-4.5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/customer/orders/${task.id}`}>
            <h3 className="text-[14px] font-bold text-foreground truncate hover:text-primary hover:underline transition-colors">
              {task.title}
            </h3>
          </Link>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                background: "oklch(0.65 0.18 145 / 0.12)",
                color: "oklch(0.52 0.18 145)",
                border: "1px solid oklch(0.65 0.18 145 / 0.2)",
              }}
            >
              <CheckCircle2 className="size-3" />
              Completed
            </span>
            <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
              <Clock className="size-3" />
              {task.deadline
                ? format(new Date(task.deadline), "MMM dd, yyyy")
                : "N/A"}
            </span>
            {task.writer && (
              <span className="text-[11px] text-muted-foreground font-medium">
                Writer:{" "}
                <Link href={`/profile/${task.writer.id}`} className="text-foreground font-semibold hover:text-primary hover:underline transition-colors">
                  {task.writer.first_name} {task.writer.last_name}
                </Link>
              </span>
            )}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[15px] font-black text-foreground">
            ${parseFloat(task.budget || 0).toFixed(2)}
          </p>
          <p className="text-[10px] text-muted-foreground/60 font-semibold uppercase tracking-wider mt-0.5">
            Budget
          </p>
        </div>
      </div>

      {/* Review form */}
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div>
          <p className="text-[12px] font-bold text-muted-foreground/70 uppercase tracking-wider mb-2.5">
            Your Rating
          </p>
          <StarRatingInput value={rating} onChange={setRating} />
        </div>

        <div>
          <p className="text-[12px] font-bold text-muted-foreground/70 uppercase tracking-wider mb-2.5">
            Feedback{" "}
            <span className="text-muted-foreground/40 font-normal normal-case tracking-normal">
              (optional)
            </span>
          </p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your experience with this writer..."
            rows={3}
            className="w-full rounded-xl px-4 py-3 text-[13px] font-medium resize-none outline-none transition-all duration-200 placeholder:text-muted-foreground/35"
            style={{
              background: "oklch(0 0 0 / 0.03)",
              border: "1px solid oklch(0.88 0.018 260 / 0.5)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "oklch(0.58 0.22 265 / 0.4)";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px oklch(0.58 0.22 265 / 0.08)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor =
                "oklch(0.88 0.018 260 / 0.5)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {error && (
          <div
            className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-[12px] font-medium animate-in fade-in"
            style={{
              background: "oklch(0.58 0.22 25 / 0.08)",
              border: "1px solid oklch(0.58 0.22 25 / 0.2)",
              color: "oklch(0.5 0.22 25)",
            }}
          >
            <AlertCircle className="size-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))",
            boxShadow: "0 4px 14px oklch(0.58 0.22 265 / 0.3)",
          }}
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

/* ─── Submitted Review Card ─── */
function SubmittedReviewCard({ task }: { task: any }) {
  const review = task.review;
  if (!review) return null;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "oklch(1 0 0 / 0.88)",
        backdropFilter: "blur(16px)",
        border: "1px solid oklch(0.88 0.018 260 / 0.55)",
        boxShadow:
          "0 2px 8px oklch(0 0 0 / 0.05), inset 0 1px 0 oklch(1 0 0 / 0.7)",
      }}
    >
      {/* Task header */}
      <div
        className="flex items-start gap-4 p-5"
        style={{ borderBottom: "1px solid oklch(0.88 0.018 260 / 0.4)" }}
      >
        <div
          className="size-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.65 0.18 145 / 0.15), oklch(0.55 0.2 160 / 0.08))",
            border: "1px solid oklch(0.65 0.18 145 / 0.2)",
          }}
        >
          <FileText className="size-4.5" style={{ color: "oklch(0.52 0.18 145)" }} />
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/customer/orders/${task.id}`}>
            <h3 className="text-[14px] font-bold text-foreground truncate hover:text-primary hover:underline transition-colors">
              {task.title}
            </h3>
          </Link>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {task.writer && (
              <span className="text-[11px] text-muted-foreground font-medium">
                Writer:{" "}
                <span className="text-foreground font-semibold">
                  {task.writer.first_name} {task.writer.last_name}
                </span>
              </span>
            )}
            <span className="text-[11px] text-muted-foreground/60 flex items-center gap-1">
              <Calendar className="size-3" />
              Reviewed{" "}
              {review.created_at
                ? format(new Date(review.created_at), "MMM dd, yyyy")
                : ""}
            </span>
          </div>
        </div>
        {/* Stars */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={cn(
                "size-4",
                s <= review.rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-muted-foreground/20"
              )}
            />
          ))}
          <span className="ml-1.5 text-[13px] font-black text-foreground">
            {review.rating}.0
          </span>
        </div>
      </div>

      {/* Feedback */}
      {review.feedback && (
        <div className="px-5 py-4">
          <p
            className="text-[13px] leading-relaxed text-muted-foreground font-medium italic px-4 py-3 rounded-xl"
            style={{
              background: "oklch(0 0 0 / 0.025)",
              border: "1px solid oklch(0.88 0.018 260 / 0.35)",
            }}
          >
            "{review.feedback}"
          </p>
        </div>
      )}
      {!review.feedback && (
        <div className="px-5 py-3">
          <p className="text-[12px] text-muted-foreground/50 italic">
            No written feedback provided.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ─── */
export default function CustomerReviewsPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const res = await taskService.getCustomerTasks();
        setTasks(res.results || []);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [refreshKey]);

  const completedTasks = tasks.filter((t) => t.task_status === "COMPLETED");
  const reviewedTasks = completedTasks.filter((t) => t.review);
  const pendingReviewTasks = completedTasks.filter((t) => !t.review);

  const totalRating =
    reviewedTasks.length > 0
      ? reviewedTasks.reduce((sum, t) => sum + (t.review?.rating || 0), 0) /
        reviewedTasks.length
      : 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div
          className="size-12 rounded-2xl flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.62 0.22 265 / 0.15), oklch(0.52 0.26 280 / 0.1))",
            border: "1px solid oklch(0.58 0.22 265 / 0.2)",
          }}
        >
          <Loader2 className="size-5 text-primary animate-spin" />
        </div>
        <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
          Loading Reviews...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-black text-foreground tracking-tight">
            Reviews
          </h1>
          <p className="text-[14px] text-muted-foreground font-medium mt-1">
            Rate your writers and manage feedback for completed projects.
          </p>
        </div>

        {/* Stats summary */}
        {completedTasks.length > 0 && (
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
              style={{
                background: "oklch(1 0 0 / 0.88)",
                border: "1px solid oklch(0.88 0.018 260 / 0.55)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      "size-3.5",
                      s <= Math.round(totalRating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-transparent text-muted-foreground/20"
                    )}
                  />
                ))}
              </div>
              <span className="text-[13px] font-black text-foreground">
                {totalRating > 0 ? totalRating.toFixed(1) : "—"}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                avg · {reviewedTasks.length} reviews
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Completed Projects",
            value: completedTasks.length,
            icon: CheckCircle2,
            color: "oklch(0.52 0.18 145)",
            bg: "oklch(0.65 0.18 145 / 0.1)",
            border: "oklch(0.65 0.18 145 / 0.2)",
          },
          {
            label: "Reviews Submitted",
            value: reviewedTasks.length,
            icon: ThumbsUp,
            color: "oklch(0.52 0.22 265)",
            bg: "oklch(0.62 0.22 265 / 0.1)",
            border: "oklch(0.62 0.22 265 / 0.2)",
          },
          {
            label: "Awaiting Review",
            value: pendingReviewTasks.length,
            icon: Star,
            color: "oklch(0.62 0.18 65)",
            bg: "oklch(0.72 0.16 70 / 0.1)",
            border: "oklch(0.72 0.16 70 / 0.2)",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{
              background: "oklch(1 0 0 / 0.88)",
              backdropFilter: "blur(16px)",
              border: "1px solid oklch(0.88 0.018 260 / 0.55)",
              boxShadow:
                "0 2px 8px oklch(0 0 0 / 0.04), inset 0 1px 0 oklch(1 0 0 / 0.7)",
            }}
          >
            <div
              className="size-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: stat.bg, border: `1px solid ${stat.border}` }}
            >
              <stat.icon className="size-5" style={{ color: stat.color }} />
            </div>
            <div>
              <p
                className="text-[28px] font-black leading-none"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
              <p className="text-[11px] text-muted-foreground/60 font-bold uppercase tracking-wider mt-1">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Pending Reviews ── */}
      {pendingReviewTasks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div
              className="size-8 rounded-xl flex items-center justify-center"
              style={{
                background: "oklch(0.72 0.16 70 / 0.12)",
                border: "1px solid oklch(0.72 0.16 70 / 0.2)",
              }}
            >
              <Star
                className="size-4"
                style={{ color: "oklch(0.62 0.18 65)" }}
              />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-foreground">
                Awaiting Your Review
              </h2>
              <p className="text-[12px] text-muted-foreground font-medium">
                {pendingReviewTasks.length} completed project
                {pendingReviewTasks.length !== 1 ? "s" : ""} without feedback
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {pendingReviewTasks.map((task) => (
              <ReviewFormCard
                key={task.id}
                task={task}
                onSubmitted={() => setRefreshKey((k) => k + 1)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Submitted Reviews ── */}
      {reviewedTasks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div
              className="size-8 rounded-xl flex items-center justify-center"
              style={{
                background: "oklch(0.62 0.22 265 / 0.1)",
                border: "1px solid oklch(0.62 0.22 265 / 0.2)",
              }}
            >
              <MessageSquare className="size-4 text-primary" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-foreground">
                Reviews Submitted
              </h2>
              <p className="text-[12px] text-muted-foreground font-medium">
                Your past feedback for writers
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {reviewedTasks.map((task) => (
              <SubmittedReviewCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* ── Empty State ── */}
      {completedTasks.length === 0 && (
        <div
          className="rounded-2xl p-16 text-center"
          style={{
            background: "oklch(1 0 0 / 0.7)",
            border: "1px dashed oklch(0.88 0.018 260 / 0.6)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div
            className="size-16 rounded-2xl mx-auto flex items-center justify-center mb-4 opacity-30"
            style={{ background: "oklch(0.88 0.018 260 / 0.5)" }}
          >
            <Star className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-[16px] font-bold text-foreground mb-2">
            No completed projects yet
          </h3>
          <p className="text-[13px] text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">
            Once a project is marked as completed, you'll be able to leave a
            review for your writer here.
          </p>
        </div>
      )}
    </div>
  );
}
