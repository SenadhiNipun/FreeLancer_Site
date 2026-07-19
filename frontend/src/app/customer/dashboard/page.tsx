"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText, Activity, CheckCircle2, Wallet,
  PlusCircle, Clock, TrendingUp, ArrowUpRight,
} from "lucide-react";
import { taskService } from "@/services/task.service";
import { userService } from "@/services/user.service";
import { formatDistanceToNow } from "date-fns";

/* ── helpers ── */
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

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    OPEN:                "status-open",
    ASSIGNED:            "status-in-progress",
    IN_PROGRESS:         "status-in-progress",
    SUBMITTED:           "status-submitted",
    REVISION_REQUESTED:  "status-revision",
    COMPLETED:           "status-completed",
    CANCELLED:           "status-cancelled",
  };
  const labels: Record<string, string> = {
    OPEN: "Bidding", ASSIGNED: "In Progress", IN_PROGRESS: "In Progress",
    SUBMITTED: "Submitted", REVISION_REQUESTED: "Revision", COMPLETED: "Completed", CANCELLED: "Cancelled",
  };
  return (
    <span className={map[status] || "status-cancelled"}>
      {labels[status] || status.replace(/_/g," ")}
    </span>
  );
}

export default function CustomerDashboard() {
  const [stats, setStats]       = useState<any>(null);
  const [userName, setUserName] = useState("there");
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      taskService.getDashboardStats(),
      userService.getMyProfile(),
    ]).then(([statsRes, profileRes]) => {
      setStats(statsRes.results);
      const p = profileRes?.results;
      if (p) setUserName(p.first_name || "there");
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] gap-3">
        <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground">Loading dashboard…</span>
      </div>
    );
  }

  const recent = stats?.recent_activity || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Good morning, {userName}!</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {stats?.active_accepted_count ?? 0} active assignments · {stats?.total_posted_count ?? 0} total projects
          </p>
        </div>
        <Link href="/customer/create-task">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
            <PlusCircle className="size-4" />
            New Project
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Projects"   value={stats?.total_posted_count ?? 0}           icon={FileText}     color="bg-violet-600" href="/customer/orders" />
        <StatCard label="Active"           value={stats?.active_accepted_count ?? 0}         icon={Activity}     color="bg-blue-600"   href="/customer/orders" />
        <StatCard label="Completed"        value={stats?.completed_tasks_count ?? 0}         icon={CheckCircle2} color="bg-green-600"  href="/customer/orders" />
        <StatCard label="This Week"        value={`$${(stats?.spending_this_week ?? 0).toFixed(2)}`} icon={Wallet} color="bg-amber-500" href="/customer/payments" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Project table */}
        <div className="lg:col-span-2 bg-white border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Recent Projects</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Your latest tasks and their status</p>
            </div>
            <Link href="/customer/orders" className="text-xs font-medium text-primary hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Project</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">Budget</th>
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-10 text-center text-sm text-muted-foreground">
                      No projects yet.{" "}
                      <Link href="/customer/create-task" className="text-primary hover:underline">Create your first one.</Link>
                    </td>
                  </tr>
                ) : recent.slice(0, 6).map((p: any) => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href={`/customer/orders/${p.id}`} className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
                        {p.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">ID #{p.id.toString().padStart(6,"0")}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium">
                      ${parseFloat(p.budget || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Pipeline */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Project Pipeline</h3>
            <div className="space-y-3">
              {[
                { label: "Open for Bids",  count: stats?.pipeline_bidding    ?? 0, color: "bg-amber-500" },
                { label: "In Progress",    count: stats?.pipeline_in_progress ?? 0, color: "bg-blue-500" },
                { label: "Completed",      count: stats?.completed_tasks_count ?? 0, color: "bg-green-500" },
              ].map(({ label, count, color }) => {
                const total = stats?.total_posted_count || 1;
                return (
                  <div key={label} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium text-foreground">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${(count / total) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
            <div className="space-y-1.5">
              {[
                { label: "New Project",   href: "/customer/create-task", icon: PlusCircle },
                { label: "View Orders",   href: "/customer/orders",      icon: FileText },
                { label: "Messages",      href: "/customer/messages",    icon: Activity },
                { label: "Payments",      href: "/customer/payments",    icon: Wallet },
              ].map(({ label, href, icon: Icon }) => (
                <Link key={href} href={href}>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted/60 transition-colors group">
                    <Icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={1.75} />
                    <span className="text-sm text-slate-600 group-hover:text-foreground transition-colors">{label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {recent.slice(0, 3).map((act: any) => (
                <Link key={act.id} href={`/customer/orders/${act.id}`}>
                  <div className="flex gap-3 group cursor-pointer">
                    <div className="size-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="size-3.5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">{act.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="size-3" />
                        {formatDistanceToNow(new Date(act.updated_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
              {recent.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">No recent activity.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
