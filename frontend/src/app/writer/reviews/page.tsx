"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageSquare, ThumbsUp, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { userService } from "@/services/user.service";
import { format } from "date-fns";

export default function ReviewsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getMyProfile();
        setProfile(response.results);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="size-8 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Loading reviews...</p>
      </div>
    );
  }

  const rating = profile?.rating || 0;
  const reviewsCount = profile?.reviews?.length || 0;
  const completedProjects = profile?.completed_projects || 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Reviews</h1>
          <p className="text-muted-foreground mt-1">See what clients are saying about your work and track your rating.</p>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/50 shadow-xl bg-primary text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-700">
             <Star size={120} />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-white/70 text-sm font-bold uppercase tracking-widest">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="text-5xl font-black">{rating.toFixed(1)}</div>
              <div className="flex gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn("size-5", i < Math.round(rating) ? "fill-current" : "opacity-30")} />
                ))}
              </div>
            </div>
            <p className="text-white/60 text-xs font-semibold mt-4 flex items-center gap-2">
               <TrendingUp className="size-4" /> Top 5% of writers
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{reviewsCount}</div>
            <p className="text-muted-foreground text-xs font-medium mt-2 flex items-center gap-1">
              <MessageSquare className="size-3" /> 100% response rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Job Success Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-500">98%</div>
            <p className="text-muted-foreground text-xs font-medium mt-2 flex items-center gap-1">
              <ThumbsUp className="size-3" /> {completedProjects} jobs completed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="size-5 text-primary" /> Recent Feedback
        </h2>
        
        <div className="grid gap-6">
          {reviewsCount > 0 ? (
            profile.reviews.map((review: any) => (
              <Card key={review.id} className="border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                        {review.customer_name}
                        <span className="flex items-center gap-1 text-sm bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded-full">
                          <Star className="size-3.5 fill-current" />
                          {review.rating.toFixed(1)}
                        </span>
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium mt-1">Client Feedback</p>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground font-medium bg-muted/50 px-3 py-1.5 rounded-full whitespace-nowrap">
                      <Calendar className="size-3.5 mr-1.5" />
                      {format(new Date(review.created_at), "MMM dd, yyyy")}
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-2xl text-sm leading-relaxed border border-border/50">
                    "{review.feedback}"
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-10 glass rounded-2xl border border-dashed border-white/10">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No reviews yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
