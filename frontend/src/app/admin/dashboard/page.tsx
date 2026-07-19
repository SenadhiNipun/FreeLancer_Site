"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Users, PenSquare, ClipboardCheck, TrendingUp, TrendingDown,
  CheckCircle2, MessageSquare, Clock, ArrowUpRight, Loader2, RefreshCw,
  ClipboardList,
} from "lucide-react";
import { adminService } from "@/services/admin.service";

// ── Shared helpers ───────────────────────────────────────────────────────────

function isWithinDays(dateStr: string | null | undefined, days: number): boolean {
  if (!dateStr) return false;
  const ms = Date.now() - new Date(dateStr).getTime();
  return ms >= 0 && ms <= days * 24 * 60 * 60 * 1000;
}

/** Buckets a list of ISO date strings into `weeks` consecutive 7-day windows, oldest first. */
function bucketWeekly(dates: (string | null | undefined)[], weeks = 6): number[] {
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  const buckets = new Array(weeks).fill(0);
  for (const raw of dates) {
    if (!raw) continue;
    const t = new Date(raw).getTime();
    const ageDays = (now - t) / DAY;
    if (ageDays < 0) continue;
    const bucketFromEnd = Math.floor(ageDays / 7); // 0 = this week
    const idx = weeks - 1 - bucketFromEnd;
    if (idx >= 0 && idx < weeks) buckets[idx] += 1;
  }
  return buckets;
}

const STATUS_BUCKETS: { key: string; label: string; statuses: string[]; bar: string; dot: string }[] = [
  { key: "OPEN",      label: "Open / Unassigned", statuses: ["OPEN", "PENDING_PAYMENT", "PENDING_ASSIGNMENT"], bar: "bg-amber-400",  dot: "bg-amber-500" },
  { key: "ACTIVE",    label: "Assigned / In Progress", statuses: ["ASSIGNED", "IN_PROGRESS"],                  bar: "bg-blue-500",   dot: "bg-blue-500" },
  { key: "SUBMITTED", label: "Submitted",        statuses: ["SUBMITTED"],                                     bar: "bg-violet-500", dot: "bg-violet-500" },
  { key: "REVISION",  label: "Revision Requested",statuses: ["REVISION_REQUESTED"],                           bar: "bg-orange-400", dot: "bg-orange-500" },
  { key: "COMPLETED", label: "Completed",        statuses: ["COMPLETED"],                                     bar: "bg-green-500",  dot: "bg-green-500" },
  { key: "CANCELLED", label: "Cancelled",        statuses: ["CANCELLED"],                                     bar: "bg-slate-300",  dot: "bg-slate-400" },
];

// ── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, delta, icon: Icon, color, href }: {
  label: string; value: string | number; sub?: string; delta?: number;
  icon: any; color: string; href?: string;
}) {
  const hasDelta = typeof delta === "number" && delta !== 0;
  const card = (
    <div className="bg-white border border-border rounded-xl p-5 hover:shadow-md transition-shadow group h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className={`size-9 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="size-4.5 text-white" strokeWidth={2} />
        </div>
        {href && <ArrowUpRight className="size-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />}
      </div>
      <p className="text-2xl font-semibold text-foreground leading-tight">{value}</p>
      <div className="h-4 mt-1">
        {hasDelta && (
          <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${delta! > 0 ? "text-green-700" : "text-red-600"}`}>
            {delta! > 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {delta! > 0 ? "+" : ""}{delta} this week
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
      <p className="text-xs text-muted-foreground/60 mt-0.5">{sub || " "}</p>
    </div>
  );
  return href ? <Link href={href} className="h-full block">{card}</Link> : card;
}

function TaskStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    COMPLETED:          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200",
    IN_PROGRESS:        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200",
    ASSIGNED:           "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200",
    SUBMITTED:          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200",
    REVISION_REQUESTED: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200",
    CANCELLED:          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200",
  };
  return <span className={map[status] || "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"}>{status.replace(/_/g," ")}</span>;
}

// ── Task status breakdown (part-to-whole, stacked proportion bar) ──────────

function TaskStatusBreakdown({ tasks }: { tasks: any[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const total = tasks.length;

  const segments = STATUS_BUCKETS.map(b => ({
    ...b,
    count: tasks.filter(t => b.statuses.includes(t.task_status)).length,
  })).filter(s => s.count > 0);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <ClipboardList className="size-8 text-muted-foreground/30 mb-2" />
        <p className="text-sm text-muted-foreground">No tasks to summarize yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex gap-0.5 h-5 rounded-full overflow-hidden bg-muted">
          {segments.map(s => (
            <div
              key={s.key}
              className={`${s.bar} h-full transition-opacity cursor-default`}
              style={{ flexGrow: s.count, flexBasis: 0 }}
              onMouseEnter={() => setHovered(s.key)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </div>
        {hovered && (() => {
          const s = segments.find(x => x.key === hovered)!;
          return (
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-medium whitespace-nowrap shadow-lg z-10">
              {s.label}: {s.count} ({((s.count / total) * 100).toFixed(0)}%)
            </div>
          );
        })()}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {segments.map(s => (
          <div key={s.key} className="flex items-center gap-2 text-xs">
            <span className={`size-2 rounded-full ${s.dot} flex-shrink-0`} />
            <span className="text-muted-foreground truncate flex-1">{s.label}</span>
            <span className="font-medium text-foreground flex-shrink-0">{s.count}</span>
            <span className="text-muted-foreground/60 flex-shrink-0">({((s.count / total) * 100).toFixed(0)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Weekly signups (trend over time, grouped columns) ───────────────────────

function WeeklySignupsChart({ customers, writers }: { customers: any[]; writers: any[] }) {
  const [hovered, setHovered] = useState<{ series: "c" | "w"; idx: number } | null>(null);
  const WEEKS = 6;
  const customerBuckets = bucketWeekly(customers.map(c => c.created_at), WEEKS);
  const writerBuckets = bucketWeekly(writers.map(w => w.created_at), WEEKS);
  const max = Math.max(1, ...customerBuckets, ...writerBuckets);
  const CHART_H = 88;

  const weekLabel = (idxFromEnd: number) => idxFromEnd === 0 ? "This wk" : `-${idxFromEnd}w`;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-blue-500" /> Customers</span>
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-violet-500" /> Writers</span>
      </div>
      <div className="flex items-end justify-between gap-2" style={{ height: CHART_H + 28 }}>
        {Array.from({ length: WEEKS }).map((_, i) => {
          const cVal = customerBuckets[i];
          const wVal = writerBuckets[i];
          const isLast = i === WEEKS - 1;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full flex items-end justify-center gap-1" style={{ height: CHART_H }}>
                <div className="relative flex flex-col items-center justify-end h-full w-full max-w-[18px]">
                  {isLast && cVal > 0 && <span className="text-[10px] font-medium text-foreground mb-0.5">{cVal}</span>}
                  <div
                    className="w-full max-w-[18px] rounded-t-[4px] bg-blue-500 transition-opacity"
                    style={{ height: `${Math.max(cVal > 0 ? 4 : 0, (cVal / max) * CHART_H)}px`, opacity: hovered && !(hovered.series === "c" && hovered.idx === i) ? 0.55 : 1 }}
                    onMouseEnter={() => setHovered({ series: "c", idx: i })}
                    onMouseLeave={() => setHovered(null)}
                  />
                  {hovered?.series === "c" && hovered.idx === i && (
                    <div className="absolute -top-7 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-medium whitespace-nowrap shadow-lg z-10">{cVal} customers</div>
                  )}
                </div>
                <div className="relative flex flex-col items-center justify-end h-full w-full max-w-[18px]">
                  {isLast && wVal > 0 && <span className="text-[10px] font-medium text-foreground mb-0.5">{wVal}</span>}
                  <div
                    className="w-full max-w-[18px] rounded-t-[4px] bg-violet-500 transition-opacity"
                    style={{ height: `${Math.max(wVal > 0 ? 4 : 0, (wVal / max) * CHART_H)}px`, opacity: hovered && !(hovered.series === "w" && hovered.idx === i) ? 0.55 : 1 }}
                    onMouseEnter={() => setHovered({ series: "w", idx: i })}
                    onMouseLeave={() => setHovered(null)}
                  />
                  {hovered?.series === "w" && hovered.idx === i && (
                    <div className="absolute -top-7 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-medium whitespace-nowrap shadow-lg z-10">{wVal} writers</div>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground/70">{weekLabel(WEEKS - 1 - i)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [stats, setStats]         = useState<any>(null);
  const [pending, setPending]     = useState<any[]>([]);
  const [chats, setChats]         = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [writers, setWriters]     = useState<any[]>([]);
  const [tasks, setTasks]         = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback((isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    Promise.all([
      adminService.getStats(),
      adminService.getPendingWriters(),
      adminService.getAllChatSessions(),
      adminService.getAllCustomers(),
      adminService.getAllWriters(),
      adminService.getAllTasks("ALL"),
    ]).then(([sRes, pRes, cRes, custRes, wrRes, tRes]: any[]) => {
      setStats(sRes.results);
      setPending((pRes.results || []).slice(0, 5));
      setChats((cRes.results || []).slice(0, 5));
      setCustomers(custRes.results || []);
      setWriters(wrRes.results || []);
      setTasks(tRes.results || []);
      setLastUpdated(new Date());
    }).catch(console.error).finally(() => { setLoading(false); setRefreshing(false); });
  }, []);

  useEffect(() => { load(); }, [load]);

  const approve = async (id: number) => {
    await adminService.approveWriter(id);
    setPending(p => p.filter(w => w.id !== id));
    setStats((s: any) => s && { ...s, pending_writers: Math.max(0, s.pending_writers - 1) });
  };

  const reject = async (id: number) => {
    await adminService.rejectWriter(id);
    setPending(p => p.filter(w => w.id !== id));
    setStats((s: any) => s && { ...s, pending_writers: Math.max(0, s.pending_writers - 1) });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="size-5 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Loading dashboard…</span>
      </div>
    );
  }

  const writersThisWeek   = writers.filter(w => isWithinDays(w.created_at, 7)).length;
  const customersThisWeek = customers.filter(c => isWithinDays(c.created_at, 7)).length;
  const tasksThisWeek     = tasks.filter(t => isWithinDays(t.created_at, 7)).length;
  const customersActive   = customers.filter(c => c.status === "ACTIVE").length;

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Platform Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage writers, customers, tasks and monitor activity.</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Writers"          value={stats?.total_writers ?? 0}
          sub={`${stats?.pending_writers ?? 0} awaiting approval`}
          delta={writersThisWeek}
          icon={PenSquare}      color="bg-violet-600" href="/admin/writers"
        />
        <StatCard
          label="Customers"        value={stats?.total_customers ?? 0}
          sub={`${customersActive} active account${customersActive !== 1 ? "s" : ""}`}
          delta={customersThisWeek}
          icon={Users}          color="bg-blue-600" href="/admin/customers"
        />
        <StatCard
          label="Total Tasks"      value={stats?.total_tasks ?? 0}
          sub={`${stats?.active_tasks ?? 0} active`}
          delta={tasksThisWeek}
          icon={ClipboardCheck} color="bg-green-600" href="/admin/tasks"
        />
        <StatCard
          label="Platform Revenue" value={`$${(stats?.total_revenue ?? 0).toFixed(2)}`}
          sub={`${stats?.completed_tasks ?? 0} completed`}
          icon={TrendingUp}     color="bg-amber-500"
        />
      </div>

      {/* Row 1: charts + pending approvals — same row so they bottom out together */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        <div className="bg-white border border-border rounded-xl overflow-hidden flex flex-col h-full">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Task Status Breakdown</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Distribution across all {tasks.length} tasks</p>
          </div>
          <div className="p-5 flex-1">
            <TaskStatusBreakdown tasks={tasks} />
          </div>
        </div>

        <div className="bg-white border border-border rounded-xl overflow-hidden flex flex-col h-full">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">New Signups</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Weekly customer & writer registrations</p>
          </div>
          <div className="p-5 flex-1">
            <WeeklySignupsChart customers={customers} writers={writers} />
          </div>
        </div>

        <div className="bg-white border border-border rounded-xl overflow-hidden flex flex-col h-full">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Pending Approvals</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Writers awaiting review</p>
            </div>
            <Link href="/admin/pending" className="text-xs font-medium text-primary hover:underline flex-shrink-0">View all</Link>
          </div>
          <div className="divide-y divide-border/50 flex-1 flex flex-col">
            {pending.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle2 className="size-8 text-green-500 mb-2" />
                <p className="text-sm font-medium text-foreground">All caught up!</p>
                <p className="text-xs text-muted-foreground">No pending writer approvals.</p>
              </div>
            ) : pending.map((w: any) => (
              <div key={w.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="size-8 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                  {(w.first_name?.[0] || "") + (w.last_name?.[0] || "")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{w.first_name} {w.last_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{w.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => approve(w.id)} className="px-2.5 py-1 rounded-md text-xs font-medium text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 transition-colors">
                    Approve
                  </button>
                  <button onClick={() => reject(w.id)} className="px-2.5 py-1 rounded-md text-xs font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: recent tasks + recent conversations — same row so they bottom out together */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        <div className="lg:col-span-2 bg-white border border-border rounded-xl overflow-hidden flex flex-col h-full">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Recent Tasks</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Newest tasks uploaded to the platform</p>
            </div>
            <Link href="/admin/tasks" className="text-xs font-medium text-primary hover:underline flex-shrink-0">View all</Link>
          </div>
          <div className="divide-y divide-border/50 flex-1 flex flex-col">
            {recentTasks.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                <ClipboardList className="size-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No tasks uploaded yet.</p>
              </div>
            ) : recentTasks.map((t: any) => (
              <Link key={t.id} href={`/admin/tasks/${t.id}`}>
                <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/20 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{t.title}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {t.customer_name}{t.writer_name ? ` · ${t.writer_name}` : ""}
                    </p>
                  </div>
                  <TaskStatusBadge status={t.task_status} />
                  <span className="text-xs text-muted-foreground flex-shrink-0 w-20 text-right">
                    {t.created_at ? new Date(t.created_at).toLocaleDateString() : "—"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white border border-border rounded-xl overflow-hidden flex flex-col h-full">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Recent Conversations</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Active chat sessions</p>
            </div>
            <Link href="/admin/chats" className="text-xs font-medium text-primary hover:underline flex-shrink-0">View all</Link>
          </div>
          <div className="divide-y divide-border/50 flex-1 flex flex-col">
            {chats.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                <MessageSquare className="size-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No conversations yet.</p>
              </div>
            ) : chats.map((s: any) => (
              <Link key={s.id} href={`/admin/chats/${s.id}`}>
                <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/20 transition-colors group">
                  <div className="size-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="size-4 text-violet-600" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{s.task_title}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.customer_name} ↔ {s.writer_name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium text-foreground">{s.message_count} msgs</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-0.5 mt-0.5">
                      <Clock className="size-3" />
                      {s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
