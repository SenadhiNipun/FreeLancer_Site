"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Loader2, FileText, BookOpen, GraduationCap, Tag,
  CalendarClock, CalendarCheck, MessageSquare, Paperclip, User, PenSquare,
  History, Upload, Gavel, UserCheck, XCircle, RotateCcw, CheckCircle2, Star,
} from "lucide-react";
import { adminService } from "@/services/admin.service";
import { getFileUrl } from "@/lib/api-client";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    COMPLETED:           "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200",
    APPROVED_BY_CUSTOMER:"inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200",
    IN_PROGRESS:         "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200",
    ASSIGNED:            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200",
    SUBMITTED:           "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200",
    FINAL_SUBMISSION:    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200",
    DRAFT_SUBMISSION:    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200",
    REVISION_REQUESTED:  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200",
    REQUESTED:           "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200",
    OPEN:                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200",
    PENDING_PAYMENT:     "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200",
    UNPAID:              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200",
    PAID:                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200",
    CANCELLED:           "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200",
    REJECTED:            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200",
  };
  return <span className={map[status] || "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200"}>{status.replace(/_/g, " ")}</span>;
}

const ACTIVITY_ICON: Record<string, { icon: any; cls: string }> = {
  TASK_CREATED:         { icon: Upload,       cls: "bg-slate-50 border-slate-200 text-slate-600" },
  BID_PLACED:           { icon: Gavel,        cls: "bg-amber-50 border-amber-200 text-amber-600" },
  BID_ACCEPTED:         { icon: CheckCircle2, cls: "bg-green-50 border-green-200 text-green-600" },
  BID_REJECTED:         { icon: XCircle,      cls: "bg-red-50 border-red-200 text-red-600" },
  BID_WITHDRAWN:        { icon: XCircle,      cls: "bg-slate-50 border-slate-200 text-slate-500" },
  WRITER_ASSIGNED:      { icon: UserCheck,    cls: "bg-blue-50 border-blue-200 text-blue-600" },
  ASSIGNMENT_ACCEPTED:  { icon: CheckCircle2, cls: "bg-green-50 border-green-200 text-green-600" },
  ASSIGNMENT_REJECTED:  { icon: XCircle,      cls: "bg-red-50 border-red-200 text-red-600" },
  SUBMISSION:           { icon: FileText,     cls: "bg-violet-50 border-violet-200 text-violet-600" },
  REVISION_REQUESTED:   { icon: RotateCcw,    cls: "bg-orange-50 border-orange-200 text-orange-600" },
  REVISION_COMPLETED:   { icon: CheckCircle2, cls: "bg-green-50 border-green-200 text-green-600" },
  REVIEW_SUBMITTED:     { icon: Star,         cls: "bg-amber-50 border-amber-200 text-amber-600" },
};

function ActivityLog({ events }: { events: any[] }) {
  if (!events?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <History className="size-8 text-muted-foreground/30 mb-2" />
        <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="px-5 py-4 space-y-0">
      {events.map((e, idx) => {
        const cfg = ACTIVITY_ICON[e.type] || { icon: History, cls: "bg-slate-50 border-slate-200 text-slate-500" };
        const Icon = cfg.icon;
        const isLast = idx === events.length - 1;
        return (
          <div key={idx} className="flex gap-3.5">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`size-8 rounded-lg border flex items-center justify-center ${cfg.cls}`}>
                <Icon className="size-4" strokeWidth={1.75} />
              </div>
              {!isLast && <div className="w-px flex-1 bg-border my-1" />}
            </div>
            <div className={`min-w-0 flex-1 ${isLast ? "pb-0" : "pb-5"}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{e.title}</p>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {new Date(e.timestamp).toLocaleString()}
                </span>
              </div>
              {e.detail && <p className="text-xs text-muted-foreground mt-0.5 whitespace-pre-wrap">{e.detail}</p>}
              {e.actor && <p className="text-xs text-muted-foreground/70 mt-0.5">by {e.actor}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FileRow({ file }: { file: any }) {
  return (
    <a href={getFileUrl(file.file_url)} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-border hover:bg-muted/30 transition-colors">
      <Paperclip className="size-3.5 text-muted-foreground flex-shrink-0" />
      <span className="text-sm text-foreground truncate flex-1">{file.file_name}</span>
      {file.file_type && (
        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded flex-shrink-0">{file.file_type.replace(/_/g, " ").toLowerCase()}</span>
      )}
      {file.file_size != null && (
        <span className="text-xs text-muted-foreground flex-shrink-0">{(file.file_size / 1024).toFixed(0)} KB</span>
      )}
    </a>
  );
}

export default function AdminTaskDetailPage() {
  const { taskId }         = useParams<{ taskId: string }>();
  const [task, setTask]    = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getTaskDetails(Number(taskId))
      .then(r => setTask(r.results))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [taskId]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh] gap-3">
      <Loader2 className="size-5 animate-spin text-primary" />
    </div>
  );

  if (!task) return (
    <div className="text-center py-16">
      <p className="text-muted-foreground">Task not found.</p>
      <Link href="/admin/tasks" className="text-primary hover:underline text-sm mt-2 block">← Back to Tasks</Link>
    </div>
  );

  return (
    <div className="space-y-5 pb-10">
      <Link href="/admin/tasks" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="size-4" /> Tasks
      </Link>

      {/* Header */}
      <div className="bg-white border border-border rounded-xl p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold text-foreground">{task.title}</h1>
              <StatusBadge status={task.task_status} />
              {task.is_urgent && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">Urgent</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-1">#{task.id.toString().padStart(6,"0")}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Payment:</span> <StatusBadge status={task.payment_status} />
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-muted-foreground">Budget</p>
            <p className="text-lg font-semibold text-foreground">{task.budget != null ? `$${Number(task.budget).toFixed(2)}` : "—"}</p>
          </div>
        </div>
      </div>

      {/* People */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="bg-white border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2"><User className="size-4 text-slate-500" /> Client</h2>
          {task.customer ? (
            <div>
              <p className="text-sm font-medium text-foreground">{task.customer.first_name} {task.customer.last_name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{task.customer.email}</p>
              <Link href={`/admin/customers/${task.customer.id}`} className="text-xs text-primary hover:underline mt-2 inline-block">View customer →</Link>
            </div>
          ) : <p className="text-sm text-muted-foreground">Unknown client.</p>}
        </div>
        <div className="bg-white border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2"><PenSquare className="size-4 text-slate-500" /> Assigned Writer</h2>
          {task.writer ? (
            <div>
              <p className="text-sm font-medium text-foreground">{task.writer.first_name} {task.writer.last_name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{task.writer.email}</p>
              <Link href={`/admin/writers/${task.writer.id}`} className="text-xs text-primary hover:underline mt-2 inline-block">View writer →</Link>
            </div>
          ) : <p className="text-sm text-muted-foreground">Not yet assigned.</p>}
        </div>
      </div>

      {/* Task details */}
      <div className="bg-white border border-border rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-foreground">Task Details</h2>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{task.description}</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {task.academic_category && (
            <div className="flex items-start gap-3">
              <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0"><BookOpen className="size-4 text-slate-500" strokeWidth={1.75} /></div>
              <div><p className="text-xs text-muted-foreground">Academic Category</p><p className="text-sm font-medium text-foreground">{task.academic_category.name}</p></div>
            </div>
          )}
          {task.specialization && (
            <div className="flex items-start gap-3">
              <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0"><Tag className="size-4 text-slate-500" strokeWidth={1.75} /></div>
              <div><p className="text-xs text-muted-foreground">Specialization</p><p className="text-sm font-medium text-foreground">{task.specialization.name}</p></div>
            </div>
          )}
          {task.education_level && (
            <div className="flex items-start gap-3">
              <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0"><GraduationCap className="size-4 text-slate-500" strokeWidth={1.75} /></div>
              <div><p className="text-xs text-muted-foreground">Education Level</p><p className="text-sm font-medium text-foreground">{task.education_level.name}</p></div>
            </div>
          )}
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0"><Upload className="size-4 text-slate-500" strokeWidth={1.75} /></div>
            <div><p className="text-xs text-muted-foreground">Uploaded On</p><p className="text-sm font-medium text-foreground">{task.created_at ? new Date(task.created_at).toLocaleString() : "—"}</p></div>
          </div>
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0"><CalendarCheck className="size-4 text-slate-500" strokeWidth={1.75} /></div>
            <div><p className="text-xs text-muted-foreground">Confirmed On</p><p className="text-sm font-medium text-foreground">{task.confirmed_at ? new Date(task.confirmed_at).toLocaleDateString() : "—"}</p></div>
          </div>
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0"><CalendarClock className="size-4 text-slate-500" strokeWidth={1.75} /></div>
            <div><p className="text-xs text-muted-foreground">Due Date</p><p className="text-sm font-medium text-foreground">{task.deadline ? new Date(task.deadline).toLocaleDateString() : "—"}</p></div>
          </div>
        </div>
      </div>

      {/* Uploaded Files (attached by the client when the task was created) */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Uploaded Files ({task.files?.length || 0})</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Requirement and reference files attached by the client.</p>
        </div>
        {!task.files?.length ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Paperclip className="size-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No files uploaded.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-2 p-5">
            {task.files.map((f: any) => <FileRow key={f.id} file={f} />)}
          </div>
        )}
      </div>

      {/* Conversation */}
      <div className="bg-white border border-border rounded-xl p-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-foreground">Conversation</h2>
          <p className="text-xs text-muted-foreground mt-0.5">View the chat between the client and the writer for this task.</p>
        </div>
        {task.chat_session_id ? (
          <Link href={`/admin/chats/${task.chat_session_id}`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors flex-shrink-0">
            <MessageSquare className="size-3.5" /> View Conversation
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-muted-foreground bg-muted flex-shrink-0">
            <MessageSquare className="size-3.5" /> No conversation yet
          </span>
        )}
      </div>

      {/* Submitted Reports */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Submitted Reports ({task.submissions?.length || 0})</h2>
        </div>
        {!task.submissions?.length ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="size-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No submissions yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {task.submissions.map((s: any) => (
              <div key={s.id} className="px-5 py-4 space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <StatusBadge status={s.submission_status} />
                  <span className="text-xs text-muted-foreground">{s.submitted_at ? new Date(s.submitted_at).toLocaleString() : "—"}</span>
                </div>
                {s.submission_note && <p className="text-sm text-muted-foreground">{s.submission_note}</p>}
                {s.files?.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-2">
                    {s.files.map((f: any) => <FileRow key={f.id} file={f} />)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revision Reports */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Revision Reports ({task.revisions?.length || 0})</h2>
        </div>
        {!task.revisions?.length ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="size-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No revisions requested.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {task.revisions.map((r: any) => (
              <div key={r.id} className="px-5 py-4 space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <StatusBadge status={r.revision_status} />
                  <span className="text-xs text-muted-foreground">{r.requested_at ? new Date(r.requested_at).toLocaleString() : "—"}</span>
                </div>
                {r.revision_note && <p className="text-sm text-muted-foreground">{r.revision_note}</p>}
                {r.files?.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-2">
                    {r.files.map((f: any) => <FileRow key={f.id} file={f} />)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Log */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <History className="size-4 text-slate-500" strokeWidth={1.75} />
          <h2 className="font-semibold text-foreground">Activity Log</h2>
        </div>
        <ActivityLog events={task.activity_log || []} />
      </div>
    </div>
  );
}
