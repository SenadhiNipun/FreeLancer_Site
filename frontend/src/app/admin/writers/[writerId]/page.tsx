"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, FileText, MapPin, Building, Clock, Phone, BookOpen, GraduationCap, Tag, CheckCircle2, XCircle } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "react-toastify";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    APPROVED:         "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200",
    PENDING_APPROVAL: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200",
    REJECTED:         "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200",
    ACTIVE:           "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200",
    SUSPENDED:        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200",
    COMPLETED:        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200",
    IN_PROGRESS:      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200",
    ASSIGNED:         "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200",
    SUBMITTED:        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200",
    OPEN:             "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200",
    ACCEPTED:         "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200",
    PENDING:          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200",
    CANCELLED:        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200",
    INCOMPLETE:       "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200",
  };
  return <span className={map[status] || map.INCOMPLETE}>{status.replace(/_/g," ")}</span>;
}

export default function WriterDetailPage() {
  const { writerId }              = useParams<{ writerId: string }>();
  const router                    = useRouter();
  const [writer, setWriter]       = useState<any>(null);
  const [tasks, setTasks]         = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [actioning, setActioning] = useState<"approve" | "reject" | null>(null);

  const load = () =>
    Promise.all([adminService.getAllWriters(), adminService.getWriterTasks(Number(writerId))])
      .then(([wRes, tRes]) => {
        setWriter((wRes.results || []).find((w: any) => w.id === Number(writerId)) || null);
        setTasks(tRes.results || []);
      }).catch(console.error).finally(() => setLoading(false));

  useEffect(() => { load(); }, [writerId]);

  const approve = async () => {
    setActioning("approve");
    try {
      await adminService.approveWriter(Number(writerId));
      toast.success("Writer approved successfully!");
      load();
    } catch { toast.error("Failed to approve writer."); }
    finally { setActioning(null); }
  };

  const reject = async () => {
    setActioning("reject");
    try {
      await adminService.rejectWriter(Number(writerId));
      toast.success("Writer rejected.");
      load();
    } catch { toast.error("Failed to reject writer."); }
    finally { setActioning(null); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh] gap-3">
      <Loader2 className="size-5 animate-spin text-primary" />
    </div>
  );

  if (!writer) return (
    <div className="text-center py-16">
      <p className="text-muted-foreground">Writer not found.</p>
      <Link href="/admin/writers" className="text-primary hover:underline text-sm mt-2 block">← Back</Link>
    </div>
  );

  const wp = writer.writer_profile;

  return (
    <div className="space-y-5 pb-10">
      <Link href="/admin/writers" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="size-4" /> Writers
      </Link>

      {/* Pending approval action banner */}
      {wp?.profile_status === "PENDING_APPROVAL" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Clock className="size-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900">Awaiting Your Review</p>
              <p className="text-xs text-amber-700 mt-0.5">
                This writer has submitted their application and is waiting for approval.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              disabled={!!actioning}
              onClick={reject}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-red-600 bg-white border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {actioning === "reject" ? <Loader2 className="size-3.5 animate-spin" /> : <XCircle className="size-3.5" />}
              Reject
            </button>
            <button
              disabled={!!actioning}
              onClick={approve}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {actioning === "approve" ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
              Approve
            </button>
          </div>
        </div>
      )}

      {/* Profile header */}
      <div className="bg-white border border-border rounded-xl p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="size-14 rounded-full bg-violet-100 text-violet-700 text-lg font-semibold flex items-center justify-center flex-shrink-0">
            {(writer.first_name?.[0] || "") + (writer.last_name?.[0] || "")}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold text-foreground">{writer.first_name} {writer.last_name}</h1>
              <StatusBadge status={writer.status} />
              {wp && <StatusBadge status={wp.profile_status} />}
            </div>
            <p className="text-sm text-muted-foreground">{writer.email}</p>
            {wp && (
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                {wp.city && <span className="flex items-center gap-1"><MapPin className="size-3" />{wp.city}{wp.country ? `, ${wp.country}` : ""}</span>}
                {wp.institution_name && <span className="flex items-center gap-1"><Building className="size-3" />{wp.institution_name}</span>}
                {wp.experience_years != null && <span className="flex items-center gap-1"><Clock className="size-3" />{wp.experience_years} yr{wp.experience_years !== 1 ? "s" : ""} exp</span>}
              </div>
            )}
            {wp?.bio && <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-2xl">{wp.bio}</p>}
          </div>
          <div className="text-right text-xs text-muted-foreground flex-shrink-0">
            <p>Joined {writer.created_at ? new Date(writer.created_at).toLocaleDateString() : "—"}</p>
            <p className="font-semibold text-foreground mt-1">{tasks.length} tasks</p>
          </div>
        </div>
      </div>

      {/* Profile details */}
      {wp && (
        <div className="bg-white border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-foreground">Profile Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {writer.mobile_number && (
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <Phone className="size-4 text-slate-500" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Mobile</p>
                  <p className="text-sm font-medium text-foreground">{writer.mobile_number}</p>
                </div>
              </div>
            )}
            {wp.education_level && (
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="size-4 text-slate-500" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Education Level</p>
                  <p className="text-sm font-medium text-foreground">{wp.education_level}</p>
                </div>
              </div>
            )}
            {wp.academic_category && (
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="size-4 text-slate-500" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Academic Category</p>
                  <p className="text-sm font-medium text-foreground">{wp.academic_category}</p>
                </div>
              </div>
            )}
            {wp.specialization && (
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <Tag className="size-4 text-slate-500" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Specialization</p>
                  <p className="text-sm font-medium text-foreground">{wp.specialization}</p>
                </div>
              </div>
            )}
          </div>
          {wp.qualifications?.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Qualifications</p>
              <div className="flex flex-wrap gap-2">
                {wp.qualifications.map((q: string) => (
                  <span key={q} className="px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-medium border border-violet-200">
                    {q}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tasks */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Tasks ({tasks.length})</h2>
        </div>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="size-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No tasks yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Task</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Client</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Budget</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t: any) => (
                  <tr key={t.id} onClick={() => router.push(`/admin/tasks/${t.id}`)}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer">
                    <td className="px-5 py-3.5 font-medium text-foreground truncate max-w-[220px]">{t.title}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={t.task_status} /></td>
                    <td className="px-5 py-3.5 text-muted-foreground">{t.customer_name}</td>
                    <td className="px-5 py-3.5 font-medium">{t.budget != null ? `$${t.budget.toFixed(2)}` : "—"}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{t.deadline ? new Date(t.deadline).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
