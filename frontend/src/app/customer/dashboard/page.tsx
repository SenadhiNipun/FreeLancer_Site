"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  CheckCircle2,
  Wallet,
  MessageSquare,
  Clock,
  TrendingUp,
  FileText,
  PlusCircle,
  ArrowUpRight,
  ChevronRight,
  Activity,
  Zap,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { taskService } from "@/services/task.service";
import { formatDistanceToNow } from "date-fns";

/* ─── Card ─── */
function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-2xl relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_oklch(0_0_0/0.08)] hover:-translate-y-0.5", className)}
      style={{
        background: "oklch(1 0 0 / 0.88)",
        backdropFilter: "blur(16px)",
        border: "1px solid oklch(0.88 0.018 260 / 0.55)",
        boxShadow: "0 2px 8px oklch(0 0 0 / 0.05), inset 0 1px 0 oklch(1 0 0 / 0.7)"
      }}>
      {children}
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({ label, value, icon: Icon, trend, gradient, href }: {
  label: string; value: string; icon: any; trend?: { val: string; pos: boolean }; gradient: string; href?: string;
}) {
  const content = (
    <Card className="p-5 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="size-10 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
          style={{ background: gradient, boxShadow: "0 4px 12px oklch(0.58 0.22 265 / 0.2)" }}>
          <Icon className="size-4.5 text-white" strokeWidth={2.5} />
        </div>
        <ArrowUpRight className="size-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
      </div>
      <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.15em] mb-1.5">{label}</p>
      <div className="flex items-end gap-2.5">
        <span className="text-[26px] font-black text-foreground tracking-tight leading-none">{value}</span>
        {trend && (
          <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-lg mb-0.5",
            trend.pos ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/15"
              : "bg-rose-500/10 text-rose-500 border border-rose-500/15"
          )}>{trend.val}</span>
        )}
      </div>
    </Card>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string; label: string }> = {
    OPEN:       { color: "oklch(0.65 0.18 70)",  bg: "oklch(0.78 0.16 70 / 0.12)",  label: "Open" },
    COMPLETED:  { color: "oklch(0.55 0.2 145)",  bg: "oklch(0.65 0.18 145 / 0.12)", label: "Completed" },
    ASSIGNED:   { color: "oklch(0.55 0.22 260)",  bg: "oklch(0.62 0.22 260 / 0.12)", label: "Assigned" },
    IN_PROGRESS:{ color: "oklch(0.55 0.22 260)",  bg: "oklch(0.62 0.22 260 / 0.12)", label: "In Progress" },
    SUBMITTED:  { color: "oklch(0.52 0.22 220)",  bg: "oklch(0.62 0.2 220 / 0.12)",  label: "Submitted" },
    CANCELLED:  { color: "oklch(0.55 0.22 25)",   bg: "oklch(0.58 0.22 25 / 0.12)",  label: "Cancelled" },
  };
  const s = map[status] || { color: "oklch(0.5 0.05 260)", bg: "oklch(0.88 0.018 260 / 0.4)", label: status };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}30` }}>
      <span className="size-1.5 rounded-full animate-pulse" style={{ background: s.color }} />
      {s.label}
    </span>
  );
}

export default function CustomerDashboard() {
  const [statsData, setStatsData] = useState<any>(null);
  const [userName, setUserName] = useState("Client");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await taskService.getDashboardStats();
        setStatsData(response.results);
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            const first = user.first_name || "";
            const last = user.last_name || "";
            const full = `${first} ${last}`.trim();
            setUserName(full && first !== "Academic" ? full : first || "Client");
          } catch { /* ignore */ }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeProjectsCount = statsData?.active_projects_count ?? statsData?.active_accepted_count ?? 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 animate-reveal">
        <div className="size-14 rounded-2xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, oklch(0.62 0.22 265 / 0.15), oklch(0.52 0.26 280 / 0.1))", border: "1px solid oklch(0.58 0.22 265 / 0.2)" }}>
          <Activity className="size-6 text-primary animate-bounce" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-[13px] font-bold text-foreground uppercase tracking-[0.15em]">Loading Dashboard</p>
          <div className="w-36 h-1 rounded-full overflow-hidden" style={{ background: "oklch(0.88 0.018 260 / 0.5)" }}>
            <div className="h-full rounded-full animate-progress" style={{ background: "linear-gradient(90deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))", width: "45%" }} />
          </div>
        </div>
      </div>
    );
  }

  const activeTasks = statsData?.recent_activity?.filter((p: any) => p.status !== 'OPEN' && p.status !== 'COMPLETED' && p.status !== 'CANCELLED') || [];
  const mostActiveTitle = activeTasks.length > 0 ? activeTasks[0].title : "No active project";

  return (
    <div className="space-y-7 animate-reveal pt-2 pb-10">

      {/* ── Hero Greeting ── */}
      <div className="rounded-2xl p-7 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, oklch(0.62 0.22 265 / 0.08) 0%, oklch(0.65 0.2 310 / 0.05) 100%)",
          border: "1px solid oklch(0.58 0.22 265 / 0.15)",
          boxShadow: "0 4px 24px oklch(0.58 0.22 265 / 0.08)"
        }}>
        <div className="absolute -right-20 -top-20 size-64 rounded-full pointer-events-none opacity-30"
          style={{ background: "radial-gradient(circle, oklch(0.65 0.2 310 / 0.3) 0%, transparent 70%)" }} />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="size-11 rounded-2xl flex items-center justify-center animate-float"
              style={{ background: "linear-gradient(135deg, oklch(0.62 0.22 265 / 0.15), oklch(0.65 0.2 310 / 0.1))", border: "1px solid oklch(0.58 0.22 265 / 0.2)" }}>
              <Sparkles className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-[28px] font-black text-foreground tracking-tight leading-tight">
                Good morning, <span className="text-primary">{userName}!</span>
              </h1>
              <p className="text-[14px] text-muted-foreground font-medium mt-1 max-w-md">
                You have <span className="text-foreground font-bold">{activeProjectsCount} active assignments</span> and{" "}
                <span className="text-foreground font-bold">expert bids</span> awaiting review.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Link href="/customer/create-task">
                <Button className="h-10 px-5 rounded-xl font-bold text-[13px] text-white gap-2 transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))", boxShadow: "0 4px 14px oklch(0.58 0.22 265 / 0.3)" }}>
                  <PlusCircle className="size-4" />
                  New Project
                </Button>
              </Link>
              <Link href="/customer/orders"
                className="text-[13px] font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                View All <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Active project card */}
          <div className="rounded-2xl p-5 min-w-[220px]"
            style={{ background: "oklch(1 0 0 / 0.7)", border: "1px solid oklch(0.88 0.018 260 / 0.5)", boxShadow: "0 4px 16px oklch(0 0 0 / 0.06)" }}>
            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.15em] mb-3">Most Active Project</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-xl flex items-center justify-center"
                style={{ background: "oklch(0.52 0.22 260 / 0.1)", border: "1px solid oklch(0.52 0.22 260 / 0.15)" }}>
                <Activity className="size-5" style={{ color: "oklch(0.52 0.22 260)" }} />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-foreground truncate max-w-[140px]" title={mostActiveTitle}>{mostActiveTitle}</p>
                <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">Research Domain</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary">75%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "oklch(0.88 0.018 260 / 0.4)" }}>
                <div className="h-full rounded-full" style={{ width: "75%", background: "linear-gradient(90deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Posted Tasks" value={statsData ? (statsData.total_posted_count || 0).toString().padStart(2,'0') : "00"}
          icon={FileText} gradient="linear-gradient(135deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))"
          trend={{ val: "Total", pos: true }} href="/customer/orders" />
        <StatCard label="Active Tasks" value={statsData ? (statsData.active_accepted_count || 0).toString().padStart(2,'0') : "00"}
          icon={Activity} gradient="linear-gradient(135deg, oklch(0.55 0.22 240), oklch(0.48 0.24 260))"
          trend={{ val: "Accepted", pos: true }} href="/customer/orders" />
        <StatCard label="Completed" value={statsData ? (statsData.completed_tasks_count || 0).toString().padStart(2,'0') : "00"}
          icon={CheckCircle2} gradient="linear-gradient(135deg, oklch(0.65 0.18 145), oklch(0.55 0.2 160))"
          trend={{ val: "+20%", pos: true }} href="/customer/orders" />
        <StatCard label="Weekly Spend" value={statsData ? `$${statsData.spending_this_week.toFixed(2)}` : "$0.00"}
          icon={Wallet} gradient="linear-gradient(135deg, oklch(0.78 0.16 70), oklch(0.68 0.18 55))"
          trend={{ val: "-6.2%", pos: false }} href="/customer/payments" />
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — chart + table */}
        <div className="lg:col-span-2 space-y-6">

          {/* Spending chart */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-[14px] font-bold text-foreground">Performance Overview</h3>
                <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Monthly investment breakdown</p>
              </div>
              <select className="text-[11px] font-semibold outline-none rounded-xl px-3 py-1.5 cursor-pointer"
                style={{ background: "oklch(0 0 0 / 0.04)", border: "1px solid oklch(0.88 0.018 260 / 0.5)", color: "inherit" }}>
                <option>This Month</option>
                <option>Last Month</option>
              </select>
            </div>
            <div className="h-[220px] flex items-end gap-2">
              {(() => {
                const data = statsData?.monthly_data || Array(12).fill(null).map((_, i) => ({ month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i], value: 0 }));
                const maxVal = Math.max(...data.map((m: any) => m.value), 5);
                return data.map((item: any, i: number) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group" style={{ height: "100%" }}>
                    <div className="relative w-full flex-1 flex items-end justify-center">
                      <div className="w-full rounded-t-lg absolute inset-0"
                        style={{ background: "oklch(0.62 0.22 265 / 0.06)" }} />
                      <div className="w-full rounded-t-lg absolute bottom-0 transition-all duration-500 group-hover:opacity-75"
                        style={{
                          height: `${(item.value / maxVal) * 100}%`,
                          minHeight: item.value > 0 ? "4px" : "0px",
                          background: "linear-gradient(180deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))",
                          boxShadow: "0 0 12px oklch(0.62 0.22 265 / 0.2)"
                        }} />
                    </div>
                    <span className="text-[9px] font-bold text-muted-foreground/40 group-hover:text-primary transition-colors">{item.month}</span>
                  </div>
                ));
              })()}
            </div>
          </Card>

          {/* Projects table */}
          <Card>
            <div className="flex items-center justify-between p-5 pb-0">
              <div>
                <h3 className="text-[14px] font-bold text-foreground">Active Projects</h3>
                <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Real-time status of your ongoing tasks</p>
              </div>
              <Link href="/customer/orders" className="text-[12px] font-bold text-primary hover:underline">View All</Link>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.12em]"
                    style={{ borderBottom: "1px solid oklch(0.88 0.018 260 / 0.4)" }}>
                    <th className="px-5 py-3">Project</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Budget</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {!statsData?.recent_activity?.length ? (
                    <tr>
                      <td colSpan={4} className="py-14 text-center">
                        <div className="size-12 rounded-2xl mx-auto flex items-center justify-center mb-3 opacity-25"
                          style={{ background: "oklch(0.88 0.018 260 / 0.5)" }}>
                          <ShoppingBag className="size-6 text-muted-foreground" />
                        </div>
                        <p className="text-[13px] font-semibold text-muted-foreground">No projects yet.</p>
                        <p className="text-[12px] text-muted-foreground/60 mt-1 max-w-[240px] mx-auto">Create your first project to get started.</p>
                      </td>
                    </tr>
                  ) : statsData.recent_activity.slice(0, 5).map((proj: any) => (
                    <tr key={proj.id} className="group transition-colors"
                      style={{ borderBottom: "1px solid oklch(0.88 0.018 260 / 0.3)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.62 0.22 265 / 0.03)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "")}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                            style={{ background: "linear-gradient(135deg, oklch(0.62 0.22 265 / 0.1), oklch(0.52 0.26 280 / 0.08))", border: "1px solid oklch(0.58 0.22 265 / 0.15)" }}>
                            <FileText className="size-4 text-primary" />
                          </div>
                          <p className="text-[13px] font-semibold text-foreground truncate max-w-[200px] group-hover:text-primary transition-colors">{proj.title}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={proj.status} /></td>
                      <td className="px-5 py-4 text-right text-[13px] font-bold text-foreground">${parseFloat(proj.budget || 500).toFixed(2)}</td>
                      <td className="px-5 py-4 text-right">
                        <Link href="/customer/orders">
                          <button className="text-[11px] font-bold text-primary hover:underline px-3 py-1.5 rounded-lg transition-colors hover:bg-primary/5">
                            View →
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Pipeline */}
          <Card className="p-5">
            <h3 className="text-[14px] font-bold text-foreground mb-4">Project Pipeline</h3>
            <div className="space-y-4">
              {[
                { label: 'Posted Tasks', count: statsData?.total_posted_count ?? 0, color: "oklch(0.62 0.22 265)", bg: "linear-gradient(90deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))" },
                { label: 'Bidding', count: statsData?.pipeline_bidding ?? 0, color: "oklch(0.72 0.16 70)", bg: "linear-gradient(90deg, oklch(0.72 0.16 70), oklch(0.68 0.18 55))" },
                { label: 'In Progress', count: statsData?.pipeline_in_progress ?? 0, color: "oklch(0.55 0.22 240)", bg: "linear-gradient(90deg, oklch(0.58 0.22 240), oklch(0.5 0.24 260))" },
                { label: 'Completed', count: statsData?.completed_tasks_count ?? 0, color: "oklch(0.55 0.2 145)", bg: "linear-gradient(90deg, oklch(0.65 0.18 145), oklch(0.55 0.2 160))" },
              ].map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-foreground">{item.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "oklch(0.88 0.018 260 / 0.4)" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(statsData?.total_posted_count ?? 0) > 0 ? (item.count / (statsData?.total_posted_count ?? 1)) * 100 : 0}%`, background: item.bg }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Success Rate */}
          <Card className="p-5">
            <h3 className="text-[14px] font-bold text-foreground mb-4">Success Rate</h3>
            <div className="flex items-center justify-center py-2">
              <div className="relative size-32">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/60" />
                  <circle cx="50" cy="50" r="40" fill="none" strokeWidth="8"
                    stroke="url(#grad)"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - (statsData?.total_posted_count > 0 ? (statsData?.completed_tasks_count / statsData?.total_posted_count) : 0))}
                    strokeLinecap="round" className="transition-all duration-1000" />
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="oklch(0.62 0.22 265)" />
                      <stop offset="100%" stopColor="oklch(0.52 0.26 280)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[28px] font-black text-foreground leading-none">
                    {statsData?.total_posted_count > 0 ? Math.round((statsData?.completed_tasks_count / statsData?.total_posted_count) * 100) : 0}%
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="size-3 text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-500">+5.2%</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground text-center leading-relaxed mt-3">
              Based on <span className="text-foreground font-semibold">completed</span> vs total posted tasks.
            </p>
          </Card>

          {/* Quick Actions */}
          <Card className="p-5">
            <h3 className="text-[14px] font-bold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'New Project', icon: PlusCircle, color: "oklch(0.58 0.22 265)", bg: "oklch(0.62 0.22 265 / 0.1)", href: '/customer/create-task' },
                { label: 'Messages', icon: MessageSquare, color: "oklch(0.52 0.22 240)", bg: "oklch(0.55 0.22 240 / 0.1)", href: '/customer/messages' },
                { label: 'Add Funds', icon: Wallet, color: "oklch(0.52 0.2 145)", bg: "oklch(0.65 0.18 145 / 0.1)", href: '/customer/payments' },
                { label: 'Analytics', icon: TrendingUp, color: "oklch(0.65 0.18 70)", bg: "oklch(0.72 0.16 70 / 0.1)", href: '/customer/dashboard' },
              ].map((action) => (
                <Link key={action.label} href={action.href}>
                  <div className="p-3.5 rounded-xl flex flex-col items-center gap-2.5 group hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                    style={{ background: action.bg, border: `1px solid ${action.color}20` }}>
                    <div className="size-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ background: action.color + "20" }}>
                      <action.icon className="size-4.5" style={{ color: action.color }} />
                    </div>
                    <span className="text-[11px] font-bold text-foreground text-center">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-bold text-foreground">Recent Activity</h3>
              <button className="text-[11px] font-bold text-primary hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {statsData?.recent_activity?.slice(0, 3).map((act: any) => (
                <Link key={act.id} href="/customer/orders">
                  <div className="flex gap-3 group cursor-pointer">
                    <div className="size-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all group-hover:scale-110"
                      style={{ background: "linear-gradient(135deg, oklch(0.62 0.22 265 / 0.12), oklch(0.52 0.26 280 / 0.08))", border: "1px solid oklch(0.58 0.22 265 / 0.15)" }}>
                      <Zap className="size-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-1">{act.title}</p>
                      <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                        <Clock className="size-3" />
                        {formatDistanceToNow(new Date(act.updated_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
              {(!statsData?.recent_activity || statsData.recent_activity.length === 0) && (
                <p className="text-[12px] text-muted-foreground text-center py-3">No recent activity.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
