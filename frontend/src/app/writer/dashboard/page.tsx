"use client";

import React from "react";
import {
  Briefcase,
  CheckCircle2,
  TrendingUp,
  Star,
  ArrowRight,
  Clock,
  DollarSign,
  Gavel,
  Zap,
  ChevronRight,
  Activity,
  FileText,
  Award,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { taskService } from "@/services/task.service";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ─── Card Components ─── */

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn(
      "rounded-2xl relative overflow-hidden transition-all duration-300",
      "hover:shadow-[0_8px_32px_oklch(0_0_0/0.08)] hover:-translate-y-0.5",
      className
    )}
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

function StatCard({ label, value, icon: Icon, trend, gradient, href }: {
  label: string;
  value: string;
  icon: any;
  trend?: { val: string; pos: boolean };
  gradient: string;
  href?: string;
}) {
  const content = (
    <Card className="p-5 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="size-10 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
          style={{ background: gradient, boxShadow: `0 4px 12px oklch(0.58 0.22 265 / 0.25)` }}>
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
            trend.pos
              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/15"
              : "bg-rose-500/10 text-rose-500 border border-rose-500/15"
          )}>
            {trend.val}
          </span>
        )}
      </div>
    </Card>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

/* ─── Main ─── */
export default function WriterDashboard() {
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [bids, setBids] = React.useState<any[]>([]);
  const [openTasks, setOpenTasks] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userName, setUserName] = React.useState("Writer");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, bidsRes, openRes] = await Promise.all([
          taskService.getWriterTasks(),
          taskService.getWriterBids(),
          taskService.getOpenTasksForWriter()
        ]);
        setTasks(tasksRes.results || []);
        setBids(bidsRes.results || []);
        setOpenTasks(openRes.results || []);
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserName(user.first_name || "Writer");
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeTasksCount = tasks.filter(t => t.task_status !== "COMPLETED" && t.task_status !== "CANCELLED" && t.task_status !== "SUBMITTED").length;
  const pendingBidsCount = bids.filter(b => b.bid_status === "PENDING").length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 animate-reveal">
        <div className="size-14 rounded-2xl flex items-center justify-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, oklch(0.62 0.22 265 / 0.15), oklch(0.52 0.26 280 / 0.1))", border: "1px solid oklch(0.58 0.22 265 / 0.2)" }}>
          <Activity className="size-6 text-primary animate-bounce" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-[13px] font-bold text-foreground uppercase tracking-[0.15em]">Loading Dashboard</p>
          <div className="w-36 h-1 rounded-full overflow-hidden" style={{ background: "oklch(0.88 0.018 260 / 0.5)" }}>
            <div className="h-full rounded-full animate-progress" style={{ background: "linear-gradient(90deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))", width: "65%" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 animate-reveal pb-10">

      {/* ── Hero Greeting ── */}
      <div className="rounded-2xl p-7 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, oklch(0.62 0.22 265 / 0.08) 0%, oklch(0.52 0.26 280 / 0.05) 100%)",
          border: "1px solid oklch(0.58 0.22 265 / 0.15)",
          boxShadow: "0 4px 24px oklch(0.58 0.22 265 / 0.08)"
        }}>
        <div className="absolute -right-20 -top-20 size-64 rounded-full opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(circle, oklch(0.62 0.22 265 / 0.3) 0%, transparent 70%)" }} />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="size-12 rounded-2xl flex items-center justify-center animate-float"
              style={{ background: "linear-gradient(135deg, oklch(0.62 0.22 265 / 0.15), oklch(0.52 0.26 280 / 0.1))", border: "1px solid oklch(0.58 0.22 265 / 0.2)" }}>
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h1 className="text-[28px] font-black text-foreground tracking-tight leading-tight">
                Welcome back, <span className="text-primary">{userName}!</span>
              </h1>
              <p className="text-[14px] text-muted-foreground font-medium mt-1 max-w-md">
                You have <span className="text-foreground font-bold">{activeTasksCount} active projects</span> and{" "}
                <span className="text-foreground font-bold">{openTasks.length} new opportunities</span> available.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Link href="/writer/tasks/available">
                <Button className="h-10 px-5 rounded-xl font-bold text-[13px] text-white gap-2 transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))", boxShadow: "0 4px 14px oklch(0.58 0.22 265 / 0.3)" }}>
                  <Zap className="size-4" />
                  Browse Marketplace
                </Button>
              </Link>
              <Link href="/writer/earnings"
                className="text-[13px] font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                Earnings <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Goal card */}
          <div className="rounded-2xl p-5 min-w-[220px]"
            style={{ background: "oklch(1 0 0 / 0.7)", border: "1px solid oklch(0.88 0.018 260 / 0.5)", boxShadow: "0 4px 16px oklch(0 0 0 / 0.06)" }}>
            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.15em] mb-3">Monthly Goal</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-xl flex items-center justify-center" style={{ background: "oklch(0.78 0.16 70 / 0.12)", border: "1px solid oklch(0.78 0.16 70 / 0.2)" }}>
                <Award className="size-5" style={{ color: "oklch(0.72 0.16 55)" }} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-foreground">$2,500 Target</p>
                <p className="text-[11px] text-muted-foreground font-medium">$1,850 earned</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary">74%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "oklch(0.88 0.018 260 / 0.4)" }}>
                <div className="h-full rounded-full" style={{ width: "74%", background: "linear-gradient(90deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Tasks" value={activeTasksCount.toString().padStart(2, '0')} icon={Briefcase}
          gradient="linear-gradient(135deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))"
          trend={{ val: "+2 New", pos: true }} href="/writer/tasks/active" />
        <StatCard label="Pending Bids" value={pendingBidsCount.toString().padStart(2, '0')} icon={Gavel}
          gradient="linear-gradient(135deg, oklch(0.58 0.2 240), oklch(0.5 0.22 260))"
          trend={{ val: "3 Active", pos: true }} href="/writer/tasks/available" />
        <StatCard label="Total Earnings" value="$1,240" icon={DollarSign}
          gradient="linear-gradient(135deg, oklch(0.65 0.18 145), oklch(0.55 0.2 160))"
          trend={{ val: "+15.2%", pos: true }} href="/writer/earnings" />
        <StatCard label="Success Rate" value="100%" icon={Star}
          gradient="linear-gradient(135deg, oklch(0.78 0.16 70), oklch(0.68 0.18 55))"
          trend={{ val: "Top Rated", pos: true }} href="/writer/profile" />
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — tasks + chart */}
        <div className="lg:col-span-2 space-y-6">

          {/* Active tasks */}
          <Card>
            <div className="flex items-center justify-between p-5 pb-0">
              <div>
                <h3 className="text-[14px] font-bold text-foreground">Active Workstreams</h3>
                <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Projects currently in progress</p>
              </div>
              <Link href="/writer/tasks/active"
                className="text-[12px] font-bold text-primary hover:underline">View All</Link>
            </div>
            <div className="divide-y mt-4" style={{ borderColor: "oklch(0.88 0.018 260 / 0.4)" }}>
              {tasks.filter(t => t.task_status !== 'COMPLETED' && t.task_status !== 'CANCELLED').length === 0 ? (
                <div className="p-10 text-center">
                  <div className="size-12 rounded-2xl mx-auto flex items-center justify-center mb-3 opacity-30"
                    style={{ background: "oklch(0.88 0.018 260 / 0.5)" }}>
                    <Briefcase className="size-6 text-muted-foreground" />
                  </div>
                  <p className="text-[13px] font-semibold text-muted-foreground">No active projects yet.</p>
                </div>
              ) : tasks.filter(t => t.task_status !== 'COMPLETED' && t.task_status !== 'CANCELLED').slice(0, 4).map((task) => (
                <div key={task.id} className="flex items-center gap-4 px-5 py-4 group hover:bg-foreground/[0.015] transition-colors">
                  <div className="size-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                    style={{ background: "linear-gradient(135deg, oklch(0.62 0.22 265 / 0.1), oklch(0.52 0.26 280 / 0.08))", border: "1px solid oklch(0.58 0.22 265 / 0.15)" }}>
                    <FileText className="size-4.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-foreground truncate group-hover:text-primary transition-colors">{task.title}</p>
                    <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                      <Clock className="size-3" />
                      Due {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[15px] font-bold text-foreground">${parseFloat(task.budget || 0).toFixed(2)}</p>
                    <Link href="/writer/tasks/active">
                      <button className="text-[11px] font-bold text-primary hover:underline mt-0.5">Open →</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Earnings chart */}
          <Card className="p-5">
            <h3 className="text-[14px] font-bold text-foreground mb-1">Earnings Overview</h3>
            <p className="text-[11px] text-muted-foreground font-medium mb-5">Income trajectory for the last 30 days</p>
            <div className="h-[200px] flex items-end gap-2 pt-4">
              {[40, 65, 35, 55, 80, 45, 90, 30, 70, 85, 40, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="relative w-full flex items-end justify-center" style={{ height: "160px" }}>
                    <div className="w-full rounded-t-lg absolute bottom-0 transition-all duration-300"
                      style={{ height: "100%", background: "oklch(0.65 0.18 145 / 0.08)" }} />
                    <div className="w-full rounded-t-lg absolute bottom-0 transition-all duration-500 group-hover:opacity-80"
                      style={{
                        height: `${h}%`,
                        background: "linear-gradient(180deg, oklch(0.65 0.18 145), oklch(0.55 0.2 160))",
                        boxShadow: "0 0 12px oklch(0.65 0.18 145 / 0.2)"
                      }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Marketplace spotlight */}
          <div className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, oklch(0.62 0.22 265) 0%, oklch(0.48 0.26 285) 100%)",
              boxShadow: "0 8px 32px oklch(0.58 0.22 265 / 0.25)"
            }}>
            <div className="absolute -bottom-12 -right-12 size-40 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
            <div className="relative z-10 space-y-4">
              <div className="size-10 rounded-xl flex items-center justify-center animate-float"
                style={{ background: "oklch(1 0 0 / 0.2)", border: "1px solid oklch(1 0 0 / 0.25)" }}>
                <Zap className="size-5 fill-white text-white" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-white">New Opportunities</h3>
                <p className="text-[12px] text-white/65 leading-relaxed mt-1 font-medium">
                  <span className="text-white font-bold">{openTasks.length} high-value projects</span> currently accepting bids.
                </p>
              </div>
              <Link href="/writer/tasks/available">
                <button className="w-full h-10 rounded-xl text-[13px] font-bold transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  style={{ background: "oklch(1 0 0 / 0.95)", color: "oklch(0.58 0.22 265)" }}>
                  Browse Marketplace <ChevronRight className="size-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Performance */}
          <Card className="p-5">
            <h3 className="text-[14px] font-bold text-foreground mb-4">Performance</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-muted-foreground">Profile Strength</span>
                  <span className="text-primary">85%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "oklch(0.88 0.018 260 / 0.5)" }}>
                  <div className="h-full rounded-full" style={{ width: "85%", background: "linear-gradient(90deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))" }} />
                </div>
              </div>
              {[
                { label: "Bids Won", val: "12", color: "oklch(0.55 0.2 145)", bg: "oklch(0.65 0.18 145 / 0.1)" },
                { label: "Avg. Rating", val: "4.9★", color: "oklch(0.65 0.18 70)", bg: "oklch(0.72 0.16 70 / 0.1)" },
                { label: "On Time", val: "100%", color: "oklch(0.52 0.22 260)", bg: "oklch(0.62 0.22 260 / 0.1)" }
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: s.bg, border: `1px solid ${s.color}20` }}>
                  <span className="text-[12px] font-semibold text-muted-foreground">{s.label}</span>
                  <span className="text-[12px] font-black" style={{ color: s.color }}>{s.val}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Active bids */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-bold text-foreground">Your Active Bids</h3>
              <button className="text-[11px] font-bold text-primary hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {bids.slice(0, 3).map((bid) => (
                <div key={bid.id} className="flex items-start gap-3 group">
                  <div className="size-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                    style={{ background: "oklch(0.52 0.22 260 / 0.1)", border: "1px solid oklch(0.52 0.22 260 / 0.15)" }}>
                    <Gavel className="size-4" style={{ color: "oklch(0.52 0.22 260)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {bid.task?.title || "Project Proposal"}
                    </p>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-[12px] font-bold text-primary">${parseFloat(bid.bid_amount).toFixed(2)}</p>
                      <span className="text-[10px] text-muted-foreground font-medium">{bid.bid_status}</span>
                    </div>
                  </div>
                </div>
              ))}
              {bids.length === 0 && (
                <p className="text-[12px] text-muted-foreground text-center py-3">No active bids found.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
