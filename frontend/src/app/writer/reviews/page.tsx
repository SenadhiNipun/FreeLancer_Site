"use client";

import React, { useEffect, useState } from "react";
import { Star, MessageSquare, ThumbsUp, Calendar, TrendingUp, Loader2 } from "lucide-react";
import { userService } from "@/services/user.service";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function ReviewsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getMyProfile()
      .then(r => setProfile(r.results))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="size-5 animate-spin text-primary" />
    </div>
  );

  const rating         = profile?.rating || 0;
  const reviews        = profile?.reviews || [];
  const completed      = profile?.completed_projects || 0;

  return (
    <div className="space-y-5 pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Client Reviews</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Feedback from clients and your performance metrics.</p>
      </div>

      {/* Metrics */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-primary rounded-xl p-5 text-white">
          <p className="text-xs font-medium text-white/70 mb-2">Average Rating</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-semibold">{rating.toFixed(1)}</p>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn("size-4", i < Math.round(rating) ? "fill-white text-white" : "text-white/30")} />
              ))}
            </div>
          </div>
          <p className="text-xs text-white/60 mt-2 flex items-center gap-1">
            <TrendingUp className="size-3.5" /> Top 5% of writers
          </p>
        </div>

        <div className="bg-white border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground mb-2">Total Reviews</p>
          <p className="text-3xl font-semibold text-foreground">{reviews.length}</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <MessageSquare className="size-3.5" /> 100% response rate
          </p>
        </div>

        <div className="bg-white border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground mb-2">Job Success Score</p>
          <p className="text-3xl font-semibold text-green-600">98%</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <ThumbsUp className="size-3.5" /> {completed} jobs completed
          </p>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        <h2 className="font-semibold text-foreground">Recent Feedback</h2>
        {reviews.length === 0 ? (
          <div className="bg-white border border-dashed border-border rounded-xl py-12 text-center">
            <Star className="size-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No reviews yet. Complete tasks to receive feedback.</p>
          </div>
        ) : reviews.map((review: any) => (
          <div key={review.id} className="bg-white border border-border rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground">{review.customer_name}</h3>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-medium text-amber-700">
                    <Star className="size-3 fill-amber-500 text-amber-500" /> {review.rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Client Feedback</p>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0">
                <Calendar className="size-3.5" />
                {format(new Date(review.created_at), "dd MMM yyyy")}
              </span>
            </div>
            <div className="p-3.5 rounded-lg bg-muted/30 border border-border/50 text-sm text-foreground/80 leading-relaxed italic">
              &ldquo;{review.feedback}&rdquo;
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
