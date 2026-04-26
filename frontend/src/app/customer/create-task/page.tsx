"use client";

import React from "react";
import {
  Calendar,
  Upload,
  ChevronRight,
  Info,
  X,
  File,
  Sparkles,
  ShieldCheck,
  Zap,
  Target,
  ArrowRight
} from "lucide-react";

import { academicService } from "@/services/academic.service";
import { taskService } from "@/services/task.service";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

/* ── Tiny UI Components ── */
const Label = ({ children, htmlFor, required }: { children: React.ReactNode; htmlFor?: string; required?: boolean }) => (
  <label htmlFor={htmlFor} className="text-[12px] font-bold text-[#332a4d] flex items-center gap-1 mb-1.5 ml-0.5">
    {children}
    {required && <span className="text-red-500">*</span>}
  </label>
);

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn(
    "rounded-[24px] bg-white border border-[#E8E6F0] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(124,92,252,0.06)]",
    className
  )}>
    {children}
  </div>
);

export default function CreateTask() {
  const router = useRouter();
  const [categories, setCategories] = React.useState<any[]>([]);
  const [educationLevels, setEducationLevels] = React.useState<any[]>([]);
  const [specializations, setSpecializations] = React.useState<any[]>([]);

  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    academic_category_id: "",
    specialization_id: "",
    education_level_id: "",
    deadline: "",
    is_urgent: false,
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
      if (!allowed.includes(f.type)) { alert(`${f.name}: unsupported file type`); return false; }
      if (f.size > maxSize) { alert(`${f.name}: exceeds 10 MB limit`); return false; }
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
  React.useEffect(() => {
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
    
    // Client-side validation
    if (formData.description.length < 10) {
      setError("Description must be at least 10 characters long.");
      return;
    }

    setIsLoading(true);
    console.log("Starting task creation...");

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
      
      console.log("Payload being sent:", payload);
      const response = await taskService.createTask(payload);
      console.log("Task created successfully:", response);
      
      router.push("/customer/orders");
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase = "w-full rounded-xl bg-white border border-[#E8E6F0] px-4 text-sm transition-all duration-200 outline-none placeholder:text-[#B4B1C1]/60 placeholder:text-[13px] placeholder:font-normal text-[#1a1033]";
  const inputCls = cn(inputBase, "h-11 focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5");

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── Header Section ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F3FF] text-[#7C5CFC] text-[10px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="size-3" />
            Project Creation
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1a1033]">
            What are we working on?
          </h1>
          <p className="text-[#9490a8] text-sm max-w-lg">
            Detailed requirements help our top experts provide more accurate bids and faster delivery.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-[#9490a8]">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="size-8 rounded-full border-2 border-white bg-[#F5F3FF] flex items-center justify-center text-[10px] text-[#7C5CFC] font-bold">
                {i}
              </div>
            ))}
          </div>
          <span>Active experts online</span>
        </div>
      </div>

      {/* ── Error Message ── */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="size-8 rounded-full bg-red-500 flex items-center justify-center shrink-0">
            <X className="size-4 text-white" />
          </div>
          <p className="text-sm font-bold text-red-600">{error}</p>
        </div>
      )}

      {/* ── Main Layout ── */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ────── Left: Main Form (8 cols) ────── */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <div className="space-y-6">
              {/* Task Title */}
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

              {/* Grid 1: Category & Specialization */}
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
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-[#9490a8] rotate-90 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="specialization" required>Specialization</Label>
                  <div className="relative">
                    <select
                      id="specialization"
                      required
                      disabled={!formData.academic_category_id}
                      className={cn(inputCls, "appearance-none pr-10 cursor-pointer disabled:bg-[#F8F7FA] disabled:text-[#B4B1C1]")}
                      value={formData.specialization_id}
                      onChange={(e) => setFormData({ ...formData, specialization_id: e.target.value })}
                    >
                      <option value="">Choose field</option>
                      {specializations.map((spec) => (
                        <option key={spec.id} value={spec.id}>{spec.name}</option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-[#9490a8] rotate-90 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Grid 2: Education & Deadline */}
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
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-[#9490a8] rotate-90 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="deadline" required>Submission Deadline</Label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#7C5CFC]" />
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

              {/* Description */}
              <div>
                <Label htmlFor="description" required>Project Brief & Instructions</Label>
                <textarea
                  id="description"
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Share details about the project, word count, formatting styles, and any specific requirements..."
                  className={cn(inputBase, "py-4 min-h-[160px] focus:border-[#7C5CFC] focus:ring-4 focus:ring-[#7C5CFC]/5 resize-none")}
                />
              </div>

              {/* Urgent Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F5F3FF] border border-[#7C5CFC]/10">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Zap className={cn("size-5 transition-colors", formData.is_urgent ? "text-amber-500 fill-amber-500" : "text-[#9490a8]")} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1a1033]">Mark as Urgent</p>
                    <p className="text-[11px] text-[#9490a8]">Prioritize this task to get bids within minutes.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_urgent: !formData.is_urgent })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    formData.is_urgent ? "bg-[#7C5CFC]" : "bg-[#E8E6F0]"
                  )}
                >
                  <div className={cn(
                    "size-4 bg-white rounded-full absolute top-1 transition-all",
                    formData.is_urgent ? "left-7" : "left-1"
                  )} />
                </button>
              </div>

              {/* File Upload Area */}
              <div>
                <Label>Supporting Documents</Label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={cn(
                    "relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300",
                    isDragging 
                      ? "border-[#7C5CFC] bg-[#F5F3FF]" 
                      : "border-[#E8E6F0] bg-[#FAFAFC] hover:border-[#7C5CFC]/50 hover:bg-white"
                  )}
                >
                  <div className="p-8 flex flex-col items-center text-center">
                    <div className="size-12 rounded-2xl bg-white shadow-sm border border-[#E8E6F0] flex items-center justify-center mb-4">
                      <Upload className={cn("size-6 transition-colors", isDragging ? "text-[#7C5CFC]" : "text-[#9490a8]")} />
                    </div>
                    <p className="text-sm font-bold text-[#1a1033] mb-1">
                      {isDragging ? "Drop your files here" : "Drag & drop files or click to upload"}
                    </p>
                    <p className="text-xs text-[#9490a8] mb-6">
                      PDF, DOCX, JPG, PNG (Max 10MB each)
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 h-9 rounded-xl border border-[#E8E6F0] bg-white text-[12px] font-bold text-[#1a1033] hover:bg-[#F5F3FF] hover:text-[#7C5CFC] hover:border-[#7C5CFC] transition-all"
                    >
                      Select Files
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

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {files.map((f) => (
                      <div
                        key={f.name}
                        className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E8E6F0] group hover:border-[#7C5CFC]/30 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="size-8 rounded-lg bg-[#F5F3FF] flex items-center justify-center shrink-0 text-[#7C5CFC]">
                            <File className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12px] font-bold text-[#1a1033] truncate">{f.name}</p>
                            <p className="text-[10px] text-[#9490a8]">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(f.name)}
                          className="size-7 rounded-full flex items-center justify-center hover:bg-red-50 text-[#9490a8] hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* ────── Right: Sidebar (4 cols) ────── */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
          
          {/* How it Works */}
          <Card className="bg-[#1a1033] border-none">
            <h2 className="text-white text-lg font-bold mb-6 flex items-center gap-2">
              <Zap className="size-5 text-[#7C5CFC]" />
              How it Works
            </h2>
            <div className="space-y-6">
              {[
                { icon: Target, title: "Post your task", desc: "Share details and let writers know what you need." },
                { icon: Sparkles, title: "Writers bid", desc: "Top experts compete by offering their best price." },
                { icon: ShieldCheck, title: "Safe Payment", desc: "Funds are held securely until you're 100% satisfied." },
              ].map((s, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="size-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                    <s.icon className="size-5 text-[#7C5CFC]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white text-sm font-bold">{s.title}</p>
                    <p className="text-white/60 text-[11px] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
              <Info className="size-4 text-[#7C5CFC] shrink-0 mt-0.5" />
              <p className="text-white/80 text-[11px] leading-relaxed">
                Expert bids typically start appearing within <strong>15 minutes</strong> of posting.
              </p>
            </div>
          </Card>

          {/* Secure Card */}
          <div className="p-6 rounded-[24px] bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-xl shadow-violet-500/10">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="size-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Secure Checkout</span>
            </div>
            <p className="text-sm font-medium leading-relaxed opacity-90 mb-8">
              Every project is protected by our Escrow Guarantee. No payment is released without your approval.
            </p>
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full h-14 rounded-2xl bg-white text-[#7C5CFC] text-base font-extrabold flex items-center justify-center gap-3 transition-all shadow-xl shadow-black/20 disabled:opacity-70 disabled:cursor-not-allowed",
                !isLoading && "hover:bg-[#F5F3FF] hover:scale-[1.02] active:scale-[0.98]"
              )}
            >
              {isLoading ? (
                <div className="size-6 border-[3px] border-[#7C5CFC] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create Project
                  <ArrowRight className="size-5" />
                </>
              )}
            </button>
          </div>

          <p className="text-center text-[10px] text-[#9490a8] px-4 leading-relaxed">
            By creating this project, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

      </form>
    </div>
  );
}
