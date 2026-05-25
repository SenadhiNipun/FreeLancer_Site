"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  PenSquare,
  ClipboardCheck,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  ArrowUpRight,
  Loader2,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { adminService } from "@/services/admin.service";

/* ── Stat card ── */
function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
  href,
  sub,
}: {
  label: string;
  value: string | number;
  icon: any;
  gradient: string;
  href?: string;
  sub?: string;
}) {
  const inner = (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 cursor-pointer group transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: "oklch(1 0 0 / 0.9)",
        border: "1px solid oklch(0.88 0.018 260 / 0.5)",
        boxShadow: "0 2px 8px oklch(0 0 0 / 0.05)",
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="size-10 rounded-xl flex items-center justify-center shadow-md"
          style={{ background: gradient }}
        >
          <Icon className="size-4.5 text-white" strokeWidth={2.5} />
        </div>
        <ArrowUpRight className="size-4 text-muted-foreground/25 group-hover:text-indigo-500 transition-colors" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-muted-foreground/45 uppercase tracking-[0.15em] mb-1">
          {label}
        </p>
        <p className="text-[28px] font-black text-foreground tracking-tight leading-none">
          {value}
        </p>
        {sub && (
          <p className="text-[11px] text-muted-foreground/60 font-medium mt-1">{sub}</p>
        )}
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

/* ── Status badge ── */
function Badge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    APPROVED:        { bg: "oklch(0.65 0.18 145 / 0.12)", color: "oklch(0.45 0.2 145)" },
    PENDING_APPROVAL:{ bg: "oklch(0.78 0.16 70 / 0.12)",  color: "oklch(0.58 0.18 70)" },
    REJECTED:        { bg: "oklch(0.58 0.22 25 / 0.12)",  color: "oklch(0.48 0.22 25)" },
    ACTIVE:          { bg: "oklch(0.65 0.18 145 / 0.12)", color: "oklch(0.45 0.2 145)" },
    SUSPENDED:       { bg: "oklch(0.58 0.22 25 / 0.12)",  color: "oklch(0.48 0.22 25)" },
    INCOMPLETE:      { bg: "oklch(0.88 0.018 260 / 0.4)",  color: "oklch(0.5 0.05 260)" },
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

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [pendingWriters, setPendingWriters] = useState<any[]>([]);
  const [recentChats, setRecentChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminService.getStats(),
      adminService.getPendingWriters(),
      adminService.getAllChatSessions(),
    ])
      .then(([statsRes, pendingRes, chatsRes]) => {
        setStats(statsRes.results);
        setPendingWriters((pendingRes.results || []).slice(0, 5));
        setRecentChats((chatsRes.results || []).slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (writerId: number) => {
    await adminService.approveWriter(writerId);
    setPendingWriters((p) => p.filter((w) => w.id !== writerId));
    setStats((s: any) => s && { ...s, pending_writers: Math.max(0, s.pending_writers - 1) });
  };

  const handleReject = async (writerId: number) => {
    await adminService.rejectWriter(writerId);
    setPendingWriters((p) => p.filter((w) => w.id !== writerId));
    setStats((s: any) => s && { ...s, pending_writers: Math.max(0, s.pending_writers - 1) });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="size-6 animate-spin text-indigo-500" />
        <p className="text-[13px] font-bold text-muted-foreground uppercase tracking-widest">
          Loading Dashboard…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-black text-foreground tracking-tight flex items-center gap-3">
            <ShieldCheck className="size-7 text-indigo-500" />
            Control Center
          </h1>
          <p className="text-[13px] text-muted-foreground font-medium mt-1">
            Full platform overview — manage writers, customers, tasks & chats.
          </p>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Writers"
          value={stats?.total_writers ?? 0}
          icon={PenSquare}
          gradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
          href="/admin/writers"
          sub={`${stats?.pending_writers ?? 0} pending approval`}
        />
        <StatCard
          label="Total Customers"
          value={stats?.total_customers ?? 0}
          icon={Users}
          gradient="linear-gradient(135deg, oklch(0.55 0.22 240), oklch(0.48 0.24 260))"
          href="/admin/customers"
        />
        <StatCard
          label="Total Tasks"
          value={stats?.total_tasks ?? 0}
          icon={ClipboardCheck}
          gradient="linear-gradient(135deg, oklch(0.65 0.18 145), oklch(0.55 0.2 160))"
          sub={`${stats?.active_tasks ?? 0} active`}
        />
        <StatCard
          label="Platform Revenue"
          value={`$${(stats?.total_revenue ?? 0).toFixed(2)}`}
          icon={TrendingUp}
          gradient="linear-gradient(135deg, oklch(0.78 0.16 70), oklch(0.68 0.18 55))"
          sub={`${stats?.completed_tasks ?? 0} completed tasks`}
        />
      </div>

      {/* ── Two-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pending Writers */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "oklch(1 0 0 / 0.9)",
            border: "1px solid oklch(0.88 0.018 260 / 0.5)",
            boxShadow: "0 2px 8px oklch(0 0 0 / 0.04)",
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid oklch(0.88 0.018 260 / 0.4)" }}
          >
            <div>
              <h2 className="text-[14px] font-bold text-foreground">Pending Approvals</h2>
              <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                Writers awaiting review
              </p>
            </div>
            <Link
              href="/admin/pending"
              className="text-[12px] font-bold text-indigo-500 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-border/40">
            {pendingWriters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/40">
                <CheckCircle2 className="size-9 mb-2" />
                <p className="text-[13px] font-semibold">All caught up!</p>
              </div>
            ) : (
              pendingWriters.map((w: any) => (
                <div key={w.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div
                    className="size-9 rounded-xl flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                  >
                    {(w.first_name?.[0] || "") + (w.last_name?.[0] || "")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground truncate">
                      {w.first_name} {w.last_name}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">{w.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(w.id)}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 transition-colors border border-emerald-200"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(w.id)}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-rose-500 hover:bg-rose-50 transition-colors border border-rose-200"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Chats */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "oklch(1 0 0 / 0.9)",
            border: "1px solid oklch(0.88 0.018 260 / 0.5)",
            boxShadow: "0 2px 8px oklch(0 0 0 / 0.04)",
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid oklch(0.88 0.018 260 / 0.4)" }}
          >
            <div>
              <h2 className="text-[14px] font-bold text-foreground">Recent Chats</h2>
              <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                Live platform conversations
              </p>
            </div>
            <Link
              href="/admin/chats"
              className="text-[12px] font-bold text-indigo-500 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-border/40">
            {recentChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/40">
                <MessageSquare className="size-9 mb-2" />
                <p className="text-[13px] font-semibold">No conversations yet</p>
              </div>
            ) : (
              recentChats.map((s: any) => (
                <Link key={s.id} href={`/admin/chats/${s.id}`}>
                  <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-indigo-50/40 transition-colors cursor-pointer group">
                    <div
                      className="size-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))",
                        border: "1px solid rgba(99,102,241,0.2)",
                      }}
                    >
                      <MessageSquare className="size-4 text-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-foreground truncate group-hover:text-indigo-600 transition-colors">
                        {s.task_title}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {s.customer_name} ↔ {s.writer_name}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[11px] font-bold text-muted-foreground">{s.message_count} msgs</p>
                      <div className="flex items-center gap-1 mt-0.5 justify-end">
                        <Clock className="size-2.5 text-muted-foreground/40" />
                        <p className="text-[10px] text-muted-foreground/40">
                          {s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
