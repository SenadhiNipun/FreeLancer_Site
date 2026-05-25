"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  FileText,
  MapPin,
  Building,
  Clock,
  DollarSign,
} from "lucide-react";
import { adminService } from "@/services/admin.service";

function Badge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    APPROVED:         { bg: "oklch(0.65 0.18 145 / 0.12)", color: "oklch(0.45 0.2 145)" },
    PENDING_APPROVAL: { bg: "oklch(0.78 0.16 70 / 0.12)",  color: "oklch(0.58 0.18 70)" },
    REJECTED:         { bg: "oklch(0.58 0.22 25 / 0.12)",  color: "oklch(0.48 0.22 25)" },
    ACTIVE:           { bg: "oklch(0.65 0.18 145 / 0.12)", color: "oklch(0.45 0.2 145)" },
    SUSPENDED:        { bg: "oklch(0.58 0.22 25 / 0.12)",  color: "oklch(0.48 0.22 25)" },
    COMPLETED:        { bg: "oklch(0.65 0.18 145 / 0.12)", color: "oklch(0.45 0.2 145)" },
    IN_PROGRESS:      { bg: "oklch(0.55 0.22 260 / 0.12)", color: "oklch(0.45 0.22 260)" },
    ASSIGNED:         { bg: "oklch(0.55 0.22 260 / 0.12)", color: "oklch(0.45 0.22 260)" },
    SUBMITTED:        { bg: "oklch(0.52 0.22 220 / 0.12)", color: "oklch(0.42 0.2 220)" },
    OPEN:             { bg: "oklch(0.78 0.16 70 / 0.12)",  color: "oklch(0.58 0.18 70)" },
    CANCELLED:        { bg: "oklch(0.58 0.22 25 / 0.12)",  color: "oklch(0.48 0.22 25)" },
    ACCEPTED:         { bg: "oklch(0.65 0.18 145 / 0.12)", color: "oklch(0.45 0.2 145)" },
    PENDING:          { bg: "oklch(0.78 0.16 70 / 0.12)",  color: "oklch(0.58 0.18 70)" },
  };
  const s = map[status] || { bg: "oklch(0.88 0.018 260 / 0.4)", color: "oklch(0.5 0.05 260)" };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}25` }}
    >
      <span className="size-1.5 rounded-full" style={{ background: s.color }} />
      {status.replace(/_/g, " ")}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "oklch(1 0 0 / 0.9)",
        border: "1px solid oklch(0.88 0.018 260 / 0.5)",
        boxShadow: "0 2px 8px oklch(0 0 0 / 0.04)",
      }}
    >
      <div
        className="px-5 py-4"
        style={{ borderBottom: "1px solid oklch(0.88 0.018 260 / 0.4)" }}
      >
        <h2 className="text-[14px] font-bold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function WriterDetailPage() {
  const { writerId } = useParams<{ writerId: string }>();
  const [writer, setWriter] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminService.getAllWriters(),
      adminService.getWriterTasks(Number(writerId)),
    ])
      .then(([writersRes, tasksRes]) => {
        const found = (writersRes.results || []).find(
          (w: any) => w.id === Number(writerId)
        );
        setWriter(found || null);
        setTasks(tasksRes.results || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [writerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="size-5 animate-spin text-indigo-500" />
        <p className="text-[13px] font-bold text-muted-foreground uppercase tracking-widest">Loading…</p>
      </div>
    );
  }

  if (!writer) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-[14px] font-semibold">Writer not found.</p>
        <Link href="/admin/writers" className="text-indigo-500 font-bold text-[13px] hover:underline mt-2 block">
          ← Back to Writers
        </Link>
      </div>
    );
  }

  const wp = writer.writer_profile;

  return (
    <div className="space-y-7 pb-10 animate-in fade-in duration-500">
      {/* Back */}
      <Link href="/admin/writers" className="inline-flex items-center gap-2 text-[13px] font-bold text-muted-foreground hover:text-indigo-500 transition-colors">
        <ArrowLeft className="size-4" /> Back to Writers
      </Link>

      {/* Hero Card */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.04) 100%)",
          border: "1px solid rgba(99,102,241,0.15)",
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div
            className="size-16 rounded-2xl flex items-center justify-center text-white text-xl font-black flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 8px 20px rgba(99,102,241,0.3)" }}
          >
            {(writer.first_name?.[0] || "") + (writer.last_name?.[0] || "")}
          </div>
          <div className="flex-1">
            <h1 className="text-[22px] font-black text-foreground tracking-tight">
              {writer.first_name} {writer.last_name}
            </h1>
            <p className="text-[13px] text-muted-foreground mt-0.5">{writer.email}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge status={writer.status} />
              {wp && <Badge status={wp.profile_status} />}
            </div>
          </div>
          <div className="text-right text-[12px] text-muted-foreground">
            <p>Joined {writer.created_at ? new Date(writer.created_at).toLocaleDateString() : "—"}</p>
            {writer.last_login_at && (
              <p className="mt-1">Last login {new Date(writer.last_login_at).toLocaleDateString()}</p>
            )}
            <p className="font-bold text-foreground mt-1">{tasks.length} tasks</p>
          </div>
        </div>

        {/* Profile Info */}
        {wp && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5" style={{ borderTop: "1px solid rgba(99,102,241,0.12)" }}>
            {wp.city && (
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <MapPin className="size-3.5 text-indigo-400 flex-shrink-0" />
                {wp.city}{wp.country ? `, ${wp.country}` : ""}
              </div>
            )}
            {wp.institution_name && (
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <Building className="size-3.5 text-indigo-400 flex-shrink-0" />
                {wp.institution_name}
              </div>
            )}
            {wp.experience_years != null && (
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <Clock className="size-3.5 text-indigo-400 flex-shrink-0" />
                {wp.experience_years} yr{wp.experience_years !== 1 ? "s" : ""} experience
              </div>
            )}
            {wp.academic_status && (
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <FileText className="size-3.5 text-indigo-400 flex-shrink-0" />
                {wp.academic_status}
              </div>
            )}
          </div>
        )}

        {wp?.bio && (
          <p className="mt-4 text-[13px] text-muted-foreground leading-relaxed max-w-2xl">{wp.bio}</p>
        )}
      </div>

      {/* Tasks Table */}
      <Section title={`Tasks (${tasks.length})`}>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-muted-foreground/40">
            <FileText className="size-10 mb-2" />
            <p className="text-[13px] font-semibold">No tasks yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr
                  className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.12em]"
                  style={{ borderBottom: "1px solid oklch(0.88 0.018 260 / 0.4)" }}
                >
                  <th className="px-5 py-3.5">Task</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Client</th>
                  <th className="px-5 py-3.5">Budget</th>
                  <th className="px-5 py-3.5">Bid</th>
                  <th className="px-5 py-3.5">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t: any) => (
                  <tr
                    key={t.id}
                    className="group transition-colors"
                    style={{ borderBottom: "1px solid oklch(0.88 0.018 260 / 0.25)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "oklch(0.62 0.22 265 / 0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="size-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}
                        >
                          <FileText className="size-3.5 text-indigo-500" />
                        </div>
                        <p className="text-[13px] font-semibold text-foreground truncate max-w-[200px]">{t.title}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4"><Badge status={t.task_status} /></td>
                    <td className="px-5 py-4 text-[12px] text-muted-foreground">{t.customer_name}</td>
                    <td className="px-5 py-4 text-[13px] font-bold text-foreground">
                      {t.budget != null ? `$${t.budget.toFixed(2)}` : "—"}
                    </td>
                    <td className="px-5 py-4">
                      {t.bid_amount != null ? (
                        <div>
                          <p className="text-[13px] font-bold text-foreground">${t.bid_amount.toFixed(2)}</p>
                          {t.bid_status && <Badge status={t.bid_status} />}
                        </div>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-4 text-[12px] text-muted-foreground">
                      {t.deadline ? new Date(t.deadline).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  );
}
