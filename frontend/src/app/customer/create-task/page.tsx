"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Upload, ChevronDown, X, File, Loader2, Info } from "lucide-react";
import { academicService } from "@/services/academic.service";
import { taskService } from "@/services/task.service";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg", "image/png",
];
const MAX_SIZE = 10 * 1024 * 1024;

const inputCls = "w-full h-10 px-3 rounded-lg border border-border bg-white text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground/50";
const selectCls = cn(inputCls, "appearance-none pr-8 cursor-pointer disabled:bg-muted/50 disabled:cursor-not-allowed");

export default function CreateTask() {
  const router = useRouter();
  const [categories, setCategories]       = useState<any[]>([]);
  const [educationLevels, setEdLevels]    = useState<any[]>([]);
  const [specializations, setSpecs]       = useState<any[]>([]);
  const [pageLoading, setPageLoading]     = useState(true);
  const [submitting, setSubmitting]       = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [files, setFiles]                 = useState<File[]>([]);
  const [isDragging, setIsDragging]       = useState(false);
  const fileInputRef                      = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "", description: "", academic_category_id: "",
    specialization_id: "", education_level_id: "", deadline: "", is_urgent: false,
  });

  useEffect(() => {
    Promise.all([academicService.getAcademicCategories(), academicService.getEducationLevels()])
      .then(([cats, edus]) => { setCategories(cats.results || []); setEdLevels(edus.results || []); })
      .catch(console.error)
      .finally(() => setPageLoading(false));
  }, []);

  const handleCategoryChange = async (catId: string) => {
    setForm(f => ({ ...f, academic_category_id: catId, specialization_id: "" }));
    if (catId) {
      const r = await academicService.getSpecializations(parseInt(catId)).catch(() => ({ results: [] }));
      setSpecs(r.results || []);
    } else { setSpecs([]); }
  };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    Array.from(list).forEach(f => {
      if (!ALLOWED_TYPES.includes(f.type)) { toast.warning(`${f.name}: unsupported file type.`); return; }
      if (f.size > MAX_SIZE) { toast.warning(`${f.name}: exceeds 10 MB limit.`); return; }
      setFiles(p => { if (p.find(x => x.name === f.name)) return p; return [...p, f]; });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.title.length < 5)       { setError("Title must be at least 5 characters."); return; }
    if (form.description.length < 10){ setError("Description must be at least 10 characters."); return; }

    setSubmitting(true);
    try {
      const payload = {
        title: form.title, description: form.description, is_urgent: form.is_urgent,
        academic_category_id: form.academic_category_id ? parseInt(form.academic_category_id) : null,
        specialization_id: form.specialization_id ? parseInt(form.specialization_id) : null,
        education_level_id: form.education_level_id ? parseInt(form.education_level_id) : null,
        deadline: form.deadline ? `${form.deadline}T23:59:59Z` : null,
      };
      const res = await taskService.createTask(payload);
      const created = res.results;
      if (files.length && created?.id) {
        await taskService.addFilesToTask(created.id, files).catch(() => {
          toast.warning("Task created, but files failed to upload. You can add them later.");
        });
      }
      router.push("/customer/orders");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally { setSubmitting(false); }
  };

  if (pageLoading) return (
    <div className="flex items-center justify-center min-h-[50vh] gap-3">
      <Loader2 className="size-5 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">Loading…</span>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Post a New Task</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Provide detailed requirements to receive accurate bids from expert writers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            <X className="size-4 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Main form card */}
        <div className="bg-white border border-border rounded-xl p-5 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Project Title *</label>
            <input
              required value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Master's Thesis on Quantum Cryptography"
              className={inputCls}
            />
          </div>

          {/* Category + Specialization */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Academic Category *</label>
              <div className="relative">
                <select required value={form.academic_category_id}
                  onChange={e => handleCategoryChange(e.target.value)}
                  className={selectCls}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Specialization *</label>
              <div className="relative">
                <select required value={form.specialization_id} disabled={!form.academic_category_id}
                  onChange={e => setForm(f => ({ ...f, specialization_id: e.target.value }))}
                  className={selectCls}>
                  <option value="">Select specialization</option>
                  {specializations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Education + Deadline */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Education Level *</label>
              <div className="relative">
                <select required value={form.education_level_id}
                  onChange={e => setForm(f => ({ ...f, education_level_id: e.target.value }))}
                  className={selectCls}>
                  <option value="">Select level</option>
                  {educationLevels.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Submission Deadline *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <input
                  type="date" required value={form.deadline}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                  className={cn(inputCls, "pl-9 cursor-pointer")}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Project Brief & Instructions *</label>
            <textarea required rows={6} value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Share the project requirements, target word count, citation style, and any structural requirements…"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors resize-none placeholder:text-muted-foreground/50 min-h-[160px] leading-relaxed"
            />
          </div>

          {/* Urgent toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20">
            <div>
              <p className="text-sm font-medium text-foreground">Mark as Urgent</p>
              <p className="text-xs text-muted-foreground">Prioritizes your task for faster expert responses.</p>
            </div>
            <button type="button" onClick={() => setForm(f => ({ ...f, is_urgent: !f.is_urgent }))}
              className={cn("w-10 h-5.5 rounded-full transition-colors relative", form.is_urgent ? "bg-primary" : "bg-slate-200")}>
              <div className={cn("size-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm", form.is_urgent ? "left-5" : "left-0.5")} />
            </button>
          </div>

          {/* File upload */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">Reference Documents (optional)</label>
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={e => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragging ? "border-primary bg-violet-50" : "border-border hover:border-primary/40 hover:bg-muted/20"
              )}
            >
              <Upload className={cn("size-6 mx-auto mb-2", isDragging ? "text-primary" : "text-muted-foreground/50")} />
              <p className="text-sm font-medium text-foreground">
                {isDragging ? "Drop files here" : "Drag & drop or click to upload"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, JPEG, PNG — up to 10 MB each</p>
              <input ref={fileInputRef} type="file" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
            </div>

            {files.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-2">
                {files.map(f => (
                  <div key={f.name} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-white">
                    <div className="size-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
                      <File className="size-4 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{f.name}</p>
                      <p className="text-xs text-muted-foreground">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button type="button" onClick={() => setFiles(p => p.filter(x => x.name !== f.name))}
                      className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors">
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.back()}
            className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={submitting}
            className="flex-1 h-10 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
            {submitting ? <><Loader2 className="size-4 animate-spin" /> Publishing…</> : "Publish Task"}
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          By publishing, you agree to our Terms of Service and Escrow Refund Policy.
        </p>
      </form>
    </div>
  );
}
