"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Mail, MapPin, GraduationCap, ShieldCheck,
  Award, Star, CheckCircle2, BookOpen, Loader2, Briefcase,
  Clock, MessageSquare, Calendar,
} from "lucide-react";
import { userService } from "@/services/user.service";
import { getFileUrl } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function PublicProfile() {
  const params      = useParams();
  const router      = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const id = parseInt(params.id as string);
    if (!id) { setError("Invalid profile."); setLoading(false); return; }
    userService.getPublicProfile(id)
      .then(r => setProfile(r.results))
      .catch(err => setError((err as Error).message || "Failed to load profile."))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <Loader2 className="size-6 animate-spin text-primary" />
    </div>
  );

  if (error || !profile) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted gap-4 text-center p-6">
      <div className="size-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
        <Briefcase className="size-7 text-red-400" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">Profile Not Found</h2>
      <p className="text-sm text-muted-foreground">{error || "This profile may be private or under review."}</p>
      <button onClick={() => router.back()} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
        <ArrowLeft className="size-4" /> Go Back
      </button>
    </div>
  );

  const initials    = `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase() || "WP";
  const reviews     = profile.reviews || [];
  const avgRating   = reviews.length ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length : profile.rating || 0;
  const completed   = profile.completed_projects || 0;
  const expYears    = profile.experience_years || 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Banner ── */}
      <div className="h-40 bg-slate-800 relative overflow-hidden">
        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
        {/* Left accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent" />
        {/* Back button */}
        <button onClick={() => router.back()}
          className="absolute top-4 left-4 sm:left-8 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/80 text-sm font-medium transition-colors border border-white/15">
          <ArrowLeft className="size-4" /> Back
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* ── Profile identity row ── */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-16 mb-6 relative z-10">
          {/* Avatar */}
          <div className="size-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white flex-shrink-0 flex items-center justify-center">
            {profile.profile_image_url ? (
              <img src={getFileUrl(profile.profile_image_url)} alt={`${profile.first_name} ${profile.last_name}`}
                className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-700 flex items-center justify-center text-white text-3xl font-semibold">
                {initials}
              </div>
            )}
          </div>

          {/* Identity info */}
          <div className="flex-1 pb-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                {profile.first_name} {profile.last_name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 border border-green-200 text-xs font-medium text-green-700">
                <CheckCircle2 className="size-3" /> Verified
              </span>
            </div>

            {profile.specialization && (
              <p className="text-sm font-medium text-violet-600 mb-2">{profile.specialization}</p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              {profile.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3.5" /> {profile.email}
                </span>
              )}
              {(profile.city || profile.country) && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {profile.city ? `${profile.city}${profile.country ? `, ${profile.country}` : ""}` : profile.country}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Tasks Completed", value: completed,              icon: Briefcase, color: "text-violet-600",  bg: "bg-violet-50"  },
            { label: "Years Experience",value: `${expYears}+`,         icon: Clock,     color: "text-blue-600",    bg: "bg-blue-50"    },
            { label: "Avg. Rating",     value: avgRating > 0 ? avgRating.toFixed(1) : "—", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Reviews",         value: reviews.length,          icon: MessageSquare, color: "text-green-600", bg: "bg-green-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
              <div className={cn("size-8 rounded-lg flex items-center justify-center mx-auto mb-2", bg)}>
                <Icon className={cn("size-4", color)} strokeWidth={1.75} />
              </div>
              <p className="text-xl font-bold text-slate-900 leading-tight">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Main content ── */}
        <div className="grid lg:grid-cols-3 gap-5 pb-12">

          {/* Left column */}
          <div className="space-y-4">

            {/* Bio */}
            {profile.bio && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3">
                  <span className="size-5 rounded bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <Award className="size-3 text-violet-600" />
                  </span>
                  About
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Expertise tags */}
            {profile.expertise?.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3">
                  <span className="size-5 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="size-3 text-blue-600" />
                  </span>
                  Expertise
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.expertise.map((tag: string) => (
                    <span key={tag}
                      className="px-2.5 py-1 rounded-lg bg-violet-50 border border-violet-200 text-xs font-medium text-violet-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Platform badges */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3">
                <span className="size-5 rounded bg-green-100 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="size-3 text-green-600" />
                </span>
                Badges & Verification
              </h2>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                  <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Identity Verified</p>
                    <p className="text-xs text-slate-500">Credentials manually approved</p>
                  </div>
                </div>
                {completed >= 1 && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-violet-50 border border-violet-100">
                    <Award className="size-4 text-violet-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Active Writer</p>
                      <p className="text-xs text-slate-500">{completed} task{completed !== 1 ? "s" : ""} completed</p>
                    </div>
                  </div>
                )}
                {avgRating >= 4.5 && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                    <Star className="size-4 text-amber-600 flex-shrink-0 fill-amber-500" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Top Rated</p>
                      <p className="text-xs text-slate-500">{avgRating.toFixed(1)} average rating</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-4">

            {/* Academic qualifications */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
                <span className="size-7 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="size-4 text-orange-600" strokeWidth={1.75} />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Academic Qualifications</h2>
                  <p className="text-xs text-slate-500">Education and credentials</p>
                </div>
              </div>
              <div className="p-5 grid sm:grid-cols-2 gap-3">
                {[
                  { label: "Institution",    value: profile.institution_name },
                  { label: "Degree Level",   value: profile.education_level  },
                  { label: "Primary Field",  value: profile.academic_category },
                  { label: "Specialization", value: profile.specialization   },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 border border-slate-100 rounded-lg p-3.5">
                    <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-slate-800">{value || <span className="text-slate-400 font-normal">Not provided</span>}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="size-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Star className="size-4 text-amber-600" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">Client Reviews</h2>
                    <p className="text-xs text-slate-500">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                {avgRating > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={cn("size-4", s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-800">{avgRating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center px-6">
                  <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <Star className="size-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">No reviews yet</p>
                  <p className="text-xs text-slate-400 mt-1">Completed project reviews will appear here.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {reviews.map((rev: any) => {
                    const initials2 = rev.customer_name?.split(" ").map((n: string) => n[0]).join("").slice(0,2).toUpperCase() || "C";
                    return (
                      <div key={rev.id} className="px-5 py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                              {initials2}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{rev.customer_name}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                {[1,2,3,4,5].map(s => (
                                  <Star key={s} className={cn("size-3", s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
                                ))}
                                <span className="text-xs text-slate-500 ml-1">{rev.rating}.0</span>
                              </div>
                            </div>
                          </div>
                          {rev.created_at && (
                            <span className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
                              <Calendar className="size-3" />
                              {format(new Date(rev.created_at), "dd MMM yyyy")}
                            </span>
                          )}
                        </div>
                        {rev.feedback && (
                          <div className="mt-3 pl-12">
                            <p className="text-sm text-slate-600 leading-relaxed italic">
                              &ldquo;{rev.feedback}&rdquo;
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
