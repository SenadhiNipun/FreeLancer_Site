"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users, PenSquare, ClipboardCheck, TrendingUp,
  CheckCircle2, MessageSquare, Clock, ArrowUpRight, Loader2,
} from "lucide-react";
import { adminService } from "@/services/admin.service";

function StatCard({ label, value, sub, icon: Icon, color, href }: {
  label: string; value: string | number; sub?: string;
  icon: any; color: string; href?: string;
}) {
  const card = (
    <div className="bg-white border border-border rounded-xl p-5 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-3">
        <div className={`size-9 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="size-4.5 text-white" strokeWidth={2} />
        </div>
        {href && <ArrowUpRight className="size-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />}
      </div>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
      {sub && <p className="text-xs text-muted-foreground/60 mt-0.5">{sub}</p>}
    </div>
  );
  return href ? <Link href={href}>{card}</Link> : card;
}

function WriterStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    APPROVED:         "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200",
    PENDING_APPROVAL: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200",
    REJECTED:         "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200",
    SUSPENDED:        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200",
    INCOMPLETE:       "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200",
  };
  return <span className={map[status] || map.INCOMPLETE}>{status.replace(/_/g," ")}</span>;
}

export default function AdminDashboard() {
  const [stats, setStats]               = useState<any>(null);
  const [pending, setPending]           = useState<any[]>([]);
  const [chats, setChats]               = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    Promise.all([
      adminService.getStats(),
      adminService.getPendingWriters(),
      adminService.getAllChatSessions(),
    ]).then(([sRes, pRes, cRes]) => {
      setStats(sRes.results);
      setPending((pRes.results || []).slice(0, 5));
      setChats((cRes.results || []).slice(0, 5));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Platform Overview</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage writers, customers, tasks and monitor activity.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Writers"          value={stats?.total_writers ?? 0}
          sub={`${stats?.pending_writers ?? 0} awaiting approval`}
          icon={PenSquare}      color="bg-violet-600" href="/admin/writers"
        />
        <StatCard
          label="Customers"        value={stats?.total_customers ?? 0}
          icon={Users}          color="bg-blue-600" href="/admin/customers"
        />
        <StatCard
          label="Total Tasks"      value={stats?.total_tasks ?? 0}
          sub={`${stats?.active_tasks ?? 0} active`}
          icon={ClipboardCheck} color="bg-green-600"
        />
        <StatCard
          label="Platform Revenue" value={`$${(stats?.total_revenue ?? 0).toFixed(2)}`}
          sub={`${stats?.completed_tasks ?? 0} completed`}
          icon={TrendingUp}     color="bg-amber-500"
        />
      </div>

      {/* Two-col content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pending approvals */}
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Pending Approvals</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Writers awaiting review</p>
            </div>
            <Link href="/admin/pending" className="text-xs font-medium text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-border/50">
            {pending.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
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
                <div className="flex items-center gap-2">
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

        {/* Recent chats */}
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Recent Conversations</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Active chat sessions</p>
            </div>
            <Link href="/admin/chats" className="text-xs font-medium text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-border/50">
            {chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
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
