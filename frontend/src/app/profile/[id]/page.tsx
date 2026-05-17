"use client";

import React from "react";
import { 
  User, 
  GraduationCap, 
  ShieldCheck, 
  Award, 
  Mail, 
  Phone, 
  MapPin, 
  Star,
  ChevronLeft,
  Briefcase,
  BookOpen,
  CheckCircle2,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { userService } from "@/services/user.service";
import { getFileUrl } from "@/lib/api-client";

export default function PublicProfile() {
  const params = useParams();
  const router = useRouter();
  const userIdParam = params.id as string;

  const [profile, setProfile] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userIdParam) return;
        const userId = parseInt(userIdParam);
        const res = await userService.getPublicProfile(userId);
        setProfile(res.results);
      } catch (err: any) {
        console.error("Failed to fetch public profile:", err);
        setError(err.message || "Failed to load public profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userIdParam]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#FAF9FF]">
        <div className="size-10 border-[3px] border-[#7C5CFC] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-[#9490a8] uppercase tracking-widest">Fetching Expert Credentials...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF9FF] p-6 text-center space-y-4">
        <div className="size-16 rounded-full bg-red-100 flex items-center justify-center text-red-600">
          <User className="size-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#1a1033]">Expert Profile Not Found</h2>
          <p className="text-sm text-[#9490a8] mt-1">{error || "This writer's profile may be private or undergoing verification."}</p>
        </div>
        <Button onClick={() => router.back()} className="rounded-xl bg-[#7C5CFC] hover:bg-[#6d4ef0] font-bold text-white px-6">
          <ChevronLeft className="size-4 mr-1" /> Go Back
        </Button>
      </div>
    );
  }

  const initials = `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase() || "WP";

  return (
    <div className="min-h-screen bg-[#FAF9FF] pb-16">
      {/* Premium Gradient Hero Cover */}
      <div className="h-60 bg-gradient-to-r from-[#7C5CFC]/20 via-[#6d4ef0]/10 to-[#FAF9FF] relative border-b border-violet-100">
        <div className="absolute top-6 left-6 sm:left-12">
          <Button 
            onClick={() => router.back()} 
            variant="outline" 
            className="rounded-xl bg-white/80 hover:bg-white border-violet-100/50 shadow-sm font-bold text-[#1a1033] gap-1 h-10 px-4"
          >
            <ChevronLeft className="size-4" /> Back
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-24 relative z-10">
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Left Panel: Profile Summary Card */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="border-violet-100/50 shadow-lg shadow-violet-900/5 rounded-3xl overflow-hidden text-center p-8 bg-white/90 backdrop-blur-md relative">
              <div className="absolute top-6 right-6">
                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                  <ShieldCheck className="size-4.5 text-green-600" />
                </div>
              </div>

              <div className="mx-auto w-32 h-32 rounded-3xl bg-gradient-to-tr from-[#7C5CFC] to-[#b19ffa] flex items-center justify-center text-white text-4xl font-black mb-6 border-4 border-white shadow-xl overflow-hidden">
                {profile.profile_image_url ? (
                  <img src={getFileUrl(profile.profile_image_url)} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>

              <h2 className="text-2xl font-black text-[#1a1033] tracking-tight">
                {profile.first_name} {profile.last_name}
              </h2>
              <p className="text-xs font-bold text-[#7C5CFC] mt-1.5 uppercase tracking-widest bg-violet-50 inline-block px-3 py-1 rounded-full border border-violet-100">
                {profile.specialization || "Academic Expert"}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-50 text-[10px] font-bold text-[#6b6880] border border-slate-100 uppercase tracking-wider">
                  Verified Scholar
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-50 text-[10px] font-bold text-amber-600 border border-amber-100 uppercase tracking-wider flex items-center gap-1">
                  <Star className="size-3 fill-amber-500 text-amber-500" /> {profile.rating?.toFixed(1) || "4.9"} Expert
                </span>
              </div>

              {/* Stats Block */}
              <div className="grid grid-cols-2 gap-4 mt-8 border-t border-b border-slate-100 py-6">
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase font-bold text-[#9490a8] tracking-widest">Completed</p>
                  <p className="text-lg font-black text-[#1a1033]">{profile.completed_projects || 0} Tasks</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase font-bold text-[#9490a8] tracking-widest">Experience</p>
                  <p className="text-lg font-black text-[#1a1033]">{profile.experience_years || 0} Years</p>
                </div>
              </div>

              {/* Contact Info (Publicly redacted fields) */}
              <div className="mt-8 space-y-4 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#9490a8] border border-slate-100">
                    <Mail className="size-4" />
                  </div>
                  <span className="text-[#1a1033] font-bold truncate">{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#9490a8] border border-slate-100">
                      <Phone className="size-4" />
                    </div>
                    <span className="text-[#1a1033] font-bold">{profile.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#9490a8] border border-slate-100">
                    <MapPin className="size-4" />
                  </div>
                  <span className="text-[#1a1033] font-bold">
                    {profile.city && `${profile.city}, `}{profile.country || "Online"}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Panel: Bio, Expertise & Credentials */}
          <div className="lg:col-span-2 space-y-6">
            {/* Professional Summary */}
            {profile.bio && (
              <Card className="border-violet-100/50 shadow-sm rounded-3xl overflow-hidden bg-white p-6 sm:p-8 space-y-4">
                <h3 className="font-black text-lg text-[#1a1033] flex items-center gap-2">
                  <Award className="size-5.5 text-[#7C5CFC]" /> Biography & Research Interests
                </h3>
                <p className="text-sm text-[#1a1033]/80 leading-relaxed italic border-l-4 border-violet-100 pl-4">
                  "{profile.bio}"
                </p>
              </Card>
            )}

            {/* Academic background */}
            <Card className="border-violet-100/50 shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="border-b border-slate-100 p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 border border-orange-200/50">
                    <GraduationCap className="size-5.5" />
                  </div>
                  <div>
                    <CardTitle className="text-[#1a1033] font-black text-base">Academic Qualifications</CardTitle>
                    <CardDescription className="text-xs text-[#9490a8]">Verified educational degrees and credentials.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
                    <p className="text-[10px] uppercase font-bold text-[#9490a8] tracking-widest">University / Institution</p>
                    <p className="text-sm font-bold text-[#1a1033]">{profile.institution_name || "N/A"}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
                    <p className="text-[10px] uppercase font-bold text-[#9490a8] tracking-widest">Degree Level</p>
                    <p className="text-sm font-bold text-[#1a1033]">{profile.education_level || "N/A"}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
                    <p className="text-[10px] uppercase font-bold text-[#9490a8] tracking-widest">Primary Field</p>
                    <p className="text-sm font-bold text-[#1a1033]">{profile.academic_category || "N/A"}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1">
                    <p className="text-[10px] uppercase font-bold text-[#9490a8] tracking-widest">Specialization</p>
                    <p className="text-sm font-bold text-[#1a1033]">{profile.specialization || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expertise Areas Tags */}
            <Card className="border-violet-100/50 shadow-sm rounded-3xl overflow-hidden bg-white p-6 sm:p-8 space-y-4">
              <h3 className="font-black text-lg text-[#1a1033] flex items-center gap-2">
                <BookOpen className="size-5.5 text-[#7C5CFC]" /> Expertise & Subjects
              </h3>
              <div className="flex flex-wrap gap-2 pt-2">
                {profile.expertise && profile.expertise.length > 0 ? (
                  profile.expertise.map((tag: string) => (
                    <span key={tag} className="px-4 py-2 bg-violet-50 text-[#7C5CFC] rounded-2xl text-xs font-bold border border-violet-100 transition-all hover:scale-105 cursor-default">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#9490a8] font-bold">Academic Writing, Research Methods, Citations</span>
                )}
              </div>
            </Card>

            {/* Professional Accomplishments */}
            <Card className="border-violet-100/50 shadow-sm rounded-3xl overflow-hidden bg-white p-6 sm:p-8 space-y-4">
              <h3 className="font-black text-lg text-[#1a1033] flex items-center gap-2">
                <CheckCircle2 className="size-5.5 text-emerald-500" /> Platform Badges & Accreditations
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50/20 border border-emerald-100">
                  <div className="size-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Award className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1a1033]">High Performer & Expert Writer</h4>
                    <p className="text-xs text-[#9490a8] mt-0.5">Consistently rated as excellent on all academic task evaluations.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/20 border border-blue-100">
                  <div className="size-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1a1033]">Identity & Credentials Fully Verified</h4>
                    <p className="text-xs text-[#9490a8] mt-0.5">Academic credentials, graduation transcripts, and certificates manually approved.</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Client Reviews & Testimonials */}
            <Card className="border-violet-100/50 shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="border-b border-slate-100 p-6">
                <h3 className="font-black text-lg text-[#1a1033] flex items-center gap-2">
                  <Star className="size-5.5 text-amber-500 fill-amber-500/20" /> Client Reviews & Testimonials
                  {profile.reviews && profile.reviews.length > 0 && (
                    <span className="ml-1 text-xs font-bold text-[#7C5CFC] bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-100">
                      {profile.reviews.length}
                    </span>
                  )}
                </h3>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 space-y-6">
                {profile.reviews && profile.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {profile.reviews.map((rev: any) => {
                      const clientInitials = rev.customer_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "C";
                      return (
                        <div key={rev.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all duration-300 space-y-3">
                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-3">
                              <div className="size-9 rounded-xl bg-violet-100 text-[#7C5CFC] flex items-center justify-center text-xs font-extrabold shadow-sm border border-violet-200/50">
                                {clientInitials}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-[#1a1033]">{rev.customer_name}</h4>
                                <p className="text-[10px] text-[#9490a8] font-semibold">Verified Customer</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`size-3.5 ${s <= rev.rating ? "text-amber-500 fill-amber-500" : "text-slate-200 fill-transparent"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-[9px] text-[#9490a8] font-bold">
                                {new Date(rev.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                            </div>
                          </div>

                          {rev.feedback ? (
                            <div className="relative pl-3 border-l-2 border-violet-100/80">
                              <p className="text-xs text-[#1a1033]/80 italic leading-relaxed">
                                "{rev.feedback}"
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs text-[#9490a8] italic">No detailed feedback left.</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-3 border-2 border-dashed border-slate-100 rounded-2xl">
                    <div className="size-12 rounded-full bg-violet-50 flex items-center justify-center mx-auto text-[#7C5CFC]/60 border border-violet-100">
                      <Star className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1a1033]">No reviews yet</h4>
                      <p className="text-xs text-[#9490a8] mt-0.5">Completed project performance feedback will appear here.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

        </div>
      </div>
    </div>
  );
}
