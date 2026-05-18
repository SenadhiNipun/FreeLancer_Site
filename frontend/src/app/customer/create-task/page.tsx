"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Upload,
  ChevronDown,
  Info,
  X,
  File,
  Sparkles,
  ShieldCheck,
  Zap,
  Target,
  ArrowRight,
  Activity,
  Award
} from "lucide-react";

import { academicService } from "@/services/academic.service";
import { taskService } from "@/services/task.service";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

/* ── Refined Custom Labels ── */
const Label = ({ children, htmlFor, required }: { children: React.ReactNode; htmlFor?: string; required?: boolean }) => (
  <label htmlFor={htmlFor} className="text-[10px] font-extrabold text-muted-foreground/80 uppercase tracking-widest flex items-center gap-1.5 mb-2 ml-0.5 select-none">
    {children}
    {required && <span className="text-rose-500 font-bold">*</span>}
  </label>
);

/* ── Frosted Glass Cards ── */
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn(
    "rounded-[2rem] glass p-8 shadow-2xl shadow-black/5 border border-white/10 dark:border-white/5 relative overflow-hidden transition-all duration-500 hover:shadow-primary/5",
    className
  )}>
    {children}
  </div>
);

export default function CreateTask() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [educationLevels, setEducationLevels] = useState<any[]>([]);
  const [specializations, setSpecializations] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    academic_category_id: "",
    specialization_id: "",
    education_level_id: "",
    deadline: "",
    is_urgent: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── File helpers ── */
  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];
    const maxSize = 10 * 1024 * 1024;
    const valid = Array.from(incoming).filter((f) => {
      if (!allowed.includes(f.type)) { alert(`${f.name}: unsupported file type. Please upload PDF, DOCX, JPEG, or PNG.`); return false; }
      if (f.size > maxSize) { alert(`${f.name}: exceeds 10 MB limit.`); return false; }
      return true;
    });
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...valid.filter((f) => !names.has(f.name))];
    });
  };

  const removeFile = (name: string) =>
    setFiles((prev) => prev.filter((f) => f.name !== name));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  /* ── Data fetching ── */
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [cats, edus] = await Promise.all([
          academicService.getAcademicCategories(),
          academicService.getEducationLevels(),
        ]);
        setCategories(cats.results || []);
        setEducationLevels(edus.results || []);
      } catch (error) {
        console.error("Failed to fetch metadata:", error);
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchMetadata();
  }, []);

  const handleCategoryChange = async (categoryId: string) => {
    setFormData({ ...formData, academic_category_id: categoryId, specialization_id: "" });
    if (categoryId) {
      try {
        const response = await academicService.getSpecializations(parseInt(categoryId));
        setSpecializations(response.results || []);
      } catch (error) {
        console.error("Failed to fetch specializations:", error);
      }
    } else {
      setSpecializations([]);
    }
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (formData.title.length < 5) {
      setError("Project title must be at least 5 characters long.");
      return;
    }

    if (formData.description.length < 10) {
      setError("Description must be at least 10 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        is_urgent: formData.is_urgent,
        academic_category_id: formData.academic_category_id ? parseInt(formData.academic_category_id) : null,
        specialization_id: formData.specialization_id ? parseInt(formData.specialization_id) : null,
        education_level_id: formData.education_level_id ? parseInt(formData.education_level_id) : null,
        deadline: formData.deadline ? `${formData.deadline}T23:59:59Z` : null,
      };
      
      const response = await taskService.createTask(payload);
      const createdTask = response.results;
      
      if (files.length > 0 && createdTask?.id) {
        try {
          await taskService.addFilesToTask(createdTask.id, files);
        } catch (fileErr) {
          console.error("Failed to upload files:", fileErr);
          alert("Task created, but files failed to upload. You can add them later in project details.");
        }
      }
      
      router.push("/customer/orders");
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Base styling for modern frosted inputs
  const inputBase = "w-full rounded-2xl bg-white/40 dark:bg-slate-900/30 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/40 px-4 text-sm transition-all duration-300 outline-none placeholder:text-muted-foreground/35 placeholder:text-[13px] placeholder:font-normal text-foreground focus:border-primary focus:ring-4 focus:ring-primary/10";
  const inputCls = cn(inputBase, "h-12.5");

  if (isPageLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-reveal">
        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/20 animate-pulse" />
          <Activity className="size-6 text-primary animate-bounce" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-sm font-bold text-foreground tracking-tight uppercase tracking-[0.2em]">Initializing Portal</p>
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-progress" style={{ width: '50%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-10 animate-reveal">

      {/* ── Page Header Hero ── */}
      <div className="glass rounded-[2rem] p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border-gradient">
        <div className="absolute -bottom-24 -left-24 size-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass bg-primary/10 border border-primary/25 text-primary text-[10px] font-black uppercase tracking-wider animate-float">
            <Sparkles className="size-3.5" />
            Project Creation Portal
          </div>
          <div className="space-y-1.5">
            <h1 className="text-3xl font-black text-foreground tracking-tight leading-tight">
              What are we working on?
            </h1>
            <p className="text-sm text-muted-foreground font-medium max-w-md leading-relaxed">
              Detailed requirements help our top academic experts provide highly accurate bids and faster turnarounds.
            </p>
          </div>
        </div>

        <div className="relative z-10 w-full md:w-auto flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
          <div className="flex -space-x-2.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="size-8 rounded-full border-2 border-white dark:border-slate-900 bg-gradient-to-tr from-primary to-[#8B5CF6] flex items-center justify-center text-[10px] text-white font-black shadow-md">
                {i}
              </div>
            ))}
          </div>
          <div className="text-xs font-black text-foreground uppercase tracking-widest">
            142 Experts <span className="text-emerald-500 font-black animate-pulse">● Online</span>
          </div>
        </div>
      </div>

      {/* ── Submission Error Alert ── */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="size-8 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 text-rose-500">
            <X className="size-4" />
          </div>
          <p className="text-sm font-bold text-rose-500">{error}</p>
        </div>
      )}

      {/* ── Main Workspace Grid ── */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ────── Left: Main Assignment Builder (8 cols) ────── */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <div className="space-y-6">
              
              {/* Project Title */}
              <div>
                <Label htmlFor="title" required>Project Title</Label>
                <input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Master's Thesis on Quantum Cryptography"
                  className={inputCls}
                />
              </div>

              {/* Grid 1: Academic Scope & Domain */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="category" required>Academic Category</Label>
                  <div className="relative">
                    <select
                      id="category"
                      required
                      className={cn(inputCls, "appearance-none pr-10 cursor-pointer")}
                      value={formData.academic_category_id}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="specialization" required>Specialization</Label>
                  <div className="relative">
                    <select
                      id="specialization"
                      required
                      disabled={!formData.academic_category_id}
                      className={cn(inputCls, "appearance-none pr-10 cursor-pointer disabled:bg-slate-100/50 dark:disabled:bg-slate-900/30 disabled:text-muted-foreground/40")}
                      value={formData.specialization_id}
                      onChange={(e) => setFormData({ ...formData, specialization_id: e.target.value })}
                    >
                      <option value="">Choose field</option>
                      {specializations.map((spec) => (
                        <option key={spec.id} value={spec.id}>{spec.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Grid 2: Target Standard & Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="education_level" required>Education Level</Label>
                  <div className="relative">
                    <select
                      id="education_level"
                      required
                      className={cn(inputCls, "appearance-none pr-10 cursor-pointer")}
                      value={formData.education_level_id}
                      onChange={(e) => setFormData({ ...formData, education_level_id: e.target.value })}
                    >
                      <option value="">Select level</option>
                      {educationLevels.map((edu) => (
                        <option key={edu.id} value={edu.id}>{edu.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="deadline" required>Submission Deadline</Label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-4.5 text-primary" />
                    <input
                      id="deadline"
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className={cn(inputCls, "pl-11 cursor-pointer")}
                    />
                  </div>
                </div>
              </div>

              {/* Description Brief block */}
              <div>
                <Label htmlFor="description" required>Project Brief & Instructions</Label>
                <textarea
                  id="description"
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Share details about the project, target word count, citation formatting styles, and any structural requirements..."
                  className={cn(inputBase, "py-4.5 min-h-[180px] resize-none leading-relaxed")}
                />
              </div>

              {/* Urgent Escrow Toggle Capsule */}
              <div className="flex items-center justify-between p-5 rounded-2xl bg-primary/[0.02] border border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 flex items-center justify-center shadow-sm">
                    <Zap className={cn("size-5 transition-colors", formData.is_urgent ? "text-amber-500 fill-amber-500" : "text-muted-foreground/70")} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-foreground">Mark as Urgent Project</p>
                    <p className="text-[10px] text-muted-foreground font-medium">Prioritize this task to receive verified expert bids within minutes.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_urgent: !formData.is_urgent })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative cursor-pointer select-none",
                    formData.is_urgent ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
                  )}
                >
                  <div className={cn(
                    "size-4.5 bg-white rounded-full absolute top-0.75 transition-all shadow-sm",
                    formData.is_urgent ? "left-6.5" : "left-1"
                  )} />
                </button>
              </div>

              {/* Supporting Attachments Section */}
              <div className="space-y-3">
                <Label>Supporting Reference Documents</Label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={cn(
                    "relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-500 cursor-pointer",
                    isDragging 
                      ? "border-primary bg-primary/5 dark:bg-primary/10" 
                      : "border-slate-200/80 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/10 hover:border-primary/50 hover:bg-white/40 dark:hover:bg-slate-900/20"
                  )}
                >
                  <div className="p-8 flex flex-col items-center text-center">
                    <div className="size-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 shadow-sm flex items-center justify-center mb-4">
                      <Upload className={cn("size-5.5 transition-colors", isDragging ? "text-primary animate-bounce" : "text-muted-foreground/60")} />
                    </div>
                    <p className="text-sm font-bold text-foreground mb-1">
                      {isDragging ? "Drop documents here" : "Drag & drop files or click to upload"}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mb-5 leading-none">
                      Acceptable types: PDF, DOCX, JPEG, PNG (Up to 10MB per file)
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-foreground transition-all cursor-pointer select-none"
                    >
                      Browse Storage
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => addFiles(e.target.files)}
                    />
                  </div>
                </div>

                {/* Staged file tags */}
                {files.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    {files.map((f) => (
                      <div
                        key={f.name}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-white/50 dark:bg-slate-900/20 border border-slate-200/60 dark:border-slate-800/40 group hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="size-8.5 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <File className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground truncate">{f.name}</p>
                            <p className="text-[10px] text-muted-foreground/75 font-semibold">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(f.name)}
                          className="size-7 rounded-full flex items-center justify-center hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 cursor-pointer select-none"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </Card>
        </div>

        {/* ────── Right: Informative Sidebar Guides (4 cols) ────── */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
          
          {/* Guide card container */}
          <Card className="bg-gradient-to-br from-[#1E1B4B] to-[#0F172A] dark:from-[#090D1A] dark:to-black border-none text-white shadow-2xl relative">
            <div className="absolute top-0 right-0 size-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-white text-base font-black uppercase tracking-wider mb-6 flex items-center gap-2 relative z-10">
              <Zap className="size-5 text-[#8B5CF6]" />
              How it Works
            </h2>
            <div className="space-y-6 relative z-10">
              {[
                { icon: Target, title: "Post your assignment", desc: "Share instructions and let the platform catalog your academic requirements." },
                { icon: Sparkles, title: "Writers place bids", desc: "Verified experts bid competitively for your task. Choose the best rate." },
                { icon: ShieldCheck, title: "Secured Escrow Wallet", desc: "Your payment remains safe in escrow. Release only when 100% satisfied." },
              ].map((s, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="size-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                    <s.icon className="size-4 text-[#8B5CF6]" strokeWidth={2.5} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white text-xs font-bold tracking-tight">{s.title}</p>
                    <p className="text-white/60 text-[10.5px] leading-relaxed font-medium">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3 relative z-10">
              <Info className="size-4 text-primary shrink-0 mt-0.5" />
              <p className="text-white/80 text-[10.5px] leading-relaxed font-medium">
                Expert responses and bids typically start appearing within <strong>15 minutes</strong> of project submission.
              </p>
            </div>
          </Card>

          {/* Secure Escrow Payment Panel */}
          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary to-[#8B5CF6] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 size-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-4">
              <Award className="size-5 text-white animate-float" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/90">SaaS Escrow Protection</span>
            </div>
            <p className="text-[12.5px] font-bold leading-relaxed text-white/90 mb-8">
              Every assignment is fully protected by our Escrow Guarantee. No payment is released until you approve the delivered work.
            </p>
            
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full h-13 rounded-2xl bg-white text-primary text-sm font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-black/10 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer select-none",
                !isLoading && "hover:bg-slate-50 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-0.5 active:translate-y-0"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4.5 animate-spin text-primary" />
                  Creating Project...
                </>
              ) : (
                <>
                  Publish Project Task
                  <ArrowRight className="size-4.5" />
                </>
              )}
            </button>
          </div>

          <p className="text-center text-[10px] text-muted-foreground/60 px-4 leading-relaxed font-medium select-none">
            By publishing, you agree to our ProjectHub Terms of Use and Escrow Refund Policy.
          </p>
        </div>

      </form>
    </div>
  );
}

// Inline Spinner loader helper
function Loader2({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
