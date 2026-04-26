"use client";

import React from "react";
import {
  ShoppingBag,
  CheckCircle2,
  Wallet,
  MessageSquare,
  RotateCcw,
  Clock,
  TrendingUp,
  FileText,
  PlusCircle,
  ArrowUpRight,
  MoreHorizontal,
  ChevronRight,
  CalendarDays,
  AlertCircle,
  Gavel
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { taskService } from "@/services/task.service";
import { formatDistanceToNow } from "date-fns";

/* ─── tiny helpers ──────────────────────────────── */
function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-[20px] bg-white/80 backdrop-blur-sm shadow-[0_2px_16px_rgba(120,80,220,0.06)] border border-white/60", className)}>
      {children}
    </div>
  );
}

function StatBadge({ value, positive }: { value: string; positive: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold",
        positive
          ? "bg-emerald-100 text-emerald-700"
          : "bg-red-100 text-red-600"
      )}
    >
      {value}
    </span>
  );
}

/* ─── main component ─────────────────────────────── */
export default function CustomerDashboard() {
  const [statsData, setStatsData] = React.useState<any>(null);
  const [userName, setUserName] = React.useState("Academic");
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await taskService.getDashboardStats();
        setStatsData(response.results);
        
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserName(user.first_name || "Academic");
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      label: "Your account balance",
      value: statsData ? `$${statsData.balance.toFixed(2)}` : "$0.00",
      icon: Wallet,
      badge: null,
    },
    {
      label: "Active projects",
      value: statsData ? statsData.active_projects_count.toString().padStart(2, '0') : "00",
      icon: ShoppingBag,
      badge: null,
    },
    {
      label: "Completed tasks",
      value: statsData ? statsData.completed_tasks_count.toString().padStart(2, '0') : "00",
      icon: CheckCircle2,
      badge: null,
    },
    {
      label: "This week's spending",
      value: statsData ? `$${statsData.spending_this_week.toFixed(2)}` : "$0.00",
      icon: TrendingUp,
      badge: <StatBadge value="+0%" positive />,
    },
  ];

  const barData = [
    { month: "Jan", offline: 35, online: 55 },
    { month: "Feb", offline: 58, online: 75 },
    { month: "Mar", offline: 42, online: 48 },
    { month: "Apr", offline: 70, online: 90 },
    { month: "May", offline: 78, online: 100 },
    { month: "Jun", offline: 55, online: 68 },
    { month: "Jul", offline: 40, online: 50 },
    { month: "Aug", offline: 48, online: 60 },
    { month: "Sep", offline: 30, online: 42 },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="size-8 border-[3px] border-[#7C5CFC] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-[#9490a8] uppercase tracking-widest">Compiling Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ── Greeting ─────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1033] tracking-tight">
            Good morning, {userName}! 👋
          </h1>
          <p className="text-sm text-[#9490a8] mt-0.5">
            Here's what's happening with your academic projects today.
          </p>
        </div>
        <Link href="/customer/create-task">
          <Button className="h-10 px-5 rounded-full text-sm font-semibold bg-[#7C5CFC] hover:bg-[#6d4ef0] text-white shadow-md shadow-violet-400/20 gap-2 border-none transition-all">
            <PlusCircle className="size-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* ── Two-column layout ─────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">

        {/* ── LEFT COLUMN ── */}
        <div className="space-y-5">

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <Card key={i} className="p-5 group hover:shadow-[0_4px_24px_rgba(120,80,220,0.12)] transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="size-9 rounded-xl bg-[#F2EEFF] flex items-center justify-center">
                    <s.icon className="size-4 text-[#7C5CFC]" strokeWidth={1.8} />
                  </div>
                  <button className="text-[#c4bfd8] hover:text-[#9490a8] transition-colors">
                    <MoreHorizontal className="size-4" />
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-[#1a1033] tracking-tight leading-none">
                      {s.value}
                    </span>
                    {s.badge}
                  </div>
                  <p className="text-xs text-[#9490a8] leading-snug">{s.label}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* ── Chart card ── */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-1">
              <div>
                <h2 className="text-base font-bold text-[#1a1033]">Project Activity</h2>
                <p className="text-xs text-[#9490a8] mt-0.5">Monthly overview of academic expenditure</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 text-xs text-[#6b7280] bg-[#F5F3FF] border border-[#ebe5ff] rounded-full px-3 py-1.5 hover:bg-[#ede9ff] transition-colors">
                  <CalendarDays className="size-3 text-[#7C5CFC]" />
                  Current Month
                  <svg className="size-3" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button className="size-8 rounded-xl bg-[#F5F3FF] border border-[#ebe5ff] flex items-center justify-center text-[#7C5CFC] hover:bg-[#ede9ff] transition-colors">
                  <ArrowUpRight className="size-4" />
                </button>
              </div>
            </div>

            {/* Metric pills */}
            <div className="flex items-center gap-6 my-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#1a1033]">$1,200.00</span>
                  <StatBadge value="-11%" positive={false} />
                </div>
                <p className="text-[11px] text-[#9490a8] mt-0.5">Escrow balance</p>
              </div>
              <div className="w-px h-10 bg-[#ede9ff]" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#1a1033]">$3,450.00</span>
                  <StatBadge value="+6%" positive />
                </div>
                <p className="text-[11px] text-[#9490a8] mt-0.5">Total project value</p>
              </div>
            </div>

            {/* Bar chart */}
            <div className="flex items-end gap-2 h-36">
              <div className="flex flex-col justify-between h-full pr-2 flex-shrink-0">
                {["$1.2k", "$1k", "$800", "$600", "$400", "$200", "0"].map((v) => (
                  <span key={v} className="text-[9px] text-[#c4bfd8] font-medium leading-none">{v}</span>
                ))}
              </div>
              {barData.map((d, i) => {
                const isHighlight = i === 4;
                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group/bar">
                    <div className="w-full flex items-end justify-center gap-0.5 h-28">
                      <div
                        className={cn("w-[45%] rounded-t-md transition-all duration-500", isHighlight ? "bg-[#7C5CFC]" : "bg-[#DDD6FE] group-hover/bar:bg-[#c4b5fd]")}
                        style={{ height: `${d.offline}%` }}
                      />
                      <div
                        className={cn("w-[45%] rounded-t-md transition-all duration-500", isHighlight ? "bg-[#A78BFA]" : "bg-[#EDE9FE] group-hover/bar:bg-[#ddd6fe]")}
                        style={{ height: `${d.online}%` }}
                      />
                    </div>
                    <span className={cn("text-[9px] font-medium", isHighlight ? "text-[#7C5CFC]" : "text-[#c4bfd8]")}>
                      {d.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* ── Recent activity ── */}
          <Card>
            <div className="flex items-center justify-between px-6 pt-5 pb-4">
              <h2 className="text-base font-bold text-[#1a1033]">Recent Activity</h2>
              <Link href="/customer/orders">
                <button className="flex items-center gap-1 text-xs font-semibold text-[#7C5CFC] hover:text-[#6d4ef0] transition-colors">
                  See all <ChevronRight className="size-3.5" />
                </button>
              </Link>
            </div>
            <div className="divide-y divide-[#f5f3ff]">
              {statsData?.recent_activity?.length > 0 ? (
                statsData.recent_activity.map((a: any) => (
                  <div key={a.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-[#faf9ff] transition-colors">
                    <div className={cn(
                      "size-9 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br",
                      a.status === "OPEN" ? "from-violet-500 to-indigo-600" :
                      a.status === "SUBMITTED" ? "from-emerald-400 to-teal-600" :
                      "from-[#7C5CFC] to-[#A78BFA]"
                    )}>
                      {a.status === "OPEN" ? <Gavel className="size-4 text-white" /> : <FileText className="size-4 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#1a1033] truncate">{a.title}</p>
                      <p className="text-[11px] text-[#9490a8] mt-0.5">{formatDistanceToNow(new Date(a.updated_at), { addSuffix: true })}</p>
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap",
                      a.status === "OPEN" ? "bg-violet-100 text-violet-700" :
                      a.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" :
                      "bg-indigo-50 text-indigo-700"
                    )}>
                      {a.status.replace('_', ' ')}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-[#9490a8] text-xs font-medium italic">
                  No recent activity found. Start a new project to get started!
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="space-y-4">

          {/* Account Card */}
          <Card className="p-5">
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="text-sm font-bold text-[#1a1033]">Project Flow</h3>
                <p className="text-[11px] text-[#7C5CFC] font-semibold mt-0.5">Bidding active</p>
              </div>
              <button className="size-7 rounded-lg bg-[#F5F3FF] flex items-center justify-center text-[#7C5CFC] hover:bg-[#ede9ff] transition-colors">
                <ArrowUpRight className="size-3.5" />
              </button>
            </div>
            <div className="mt-4 h-2.5 rounded-full bg-[#EDE9FE] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7C5CFC] to-[#A78BFA]"
                style={{ width: "65%" }}
              />
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-[11px] text-[#9490a8]">Awaiting Expert Bids</p>
              <p className="text-xs font-semibold text-[#1a1033]">Check your active tasks</p>
            </div>
            <Link href="/customer/orders">
              <button className="mt-4 w-full h-9 rounded-xl border border-[#e5e0f5] text-[12px] font-semibold text-[#1a1033] hover:bg-[#faf9ff] transition-colors">
                Review Bids
              </button>
            </Link>
          </Card>

          {/* Success Rate */}
          <Card className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#1a1033]">Success Rate</h3>
                <p className="text-[11px] text-[#9490a8] mt-0.5">Projects completed on time</p>
              </div>
              <button className="size-7 rounded-lg bg-[#F5F3FF] flex items-center justify-center text-[#7C5CFC] hover:bg-[#ede9ff] transition-colors">
                <ArrowUpRight className="size-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-center my-2">
              <div className="relative size-28">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#EDE9FE" strokeWidth="9" strokeLinecap="round"/>
                  <circle
                    cx="50" cy="50" r="38" fill="none"
                    stroke="#7C5CFC"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 38 * 0.512} ${2 * Math.PI * 38}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-[#1a1033]">51.2%</span>
                  <span className="text-[10px] text-emerald-500 font-bold">+5%</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#9490a8] text-center leading-relaxed mb-5">
              Your academic trajectory is looking great!
            </p>

            <div className="flex divide-x divide-[#f0ebff]">
              <div className="flex-1 text-center pr-3">
                <p className="text-xs text-[#9490a8] mb-1">Active</p>
                <p className="text-lg font-bold text-[#1a1033]">{statsData?.active_projects_count || 0}</p>
              </div>
              <div className="flex-1 text-center pl-3">
                <p className="text-xs text-[#9490a8] mb-1">Done</p>
                <p className="text-lg font-bold text-[#1a1033]">{statsData?.completed_tasks_count || 0}</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-5">
            <h3 className="text-sm font-bold text-[#1a1033] mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: "New Project", desc: "Post a task for bidding", icon: FileText, href: "/customer/create-task" },
                { label: "Messages", desc: "Chat with experts", icon: MessageSquare, href: "/customer/messages" },
                { label: "My Projects", desc: "Review bids & status", icon: RotateCcw, href: "/customer/orders" },
              ].map((a, i) => (
                <Link key={i} href={a.href}>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#faf9ff] transition-colors group">
                    <div className="size-8 rounded-lg bg-[#F2EEFF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#e9e0fd] transition-colors">
                      <a.icon className="size-4 text-[#7C5CFC]" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-[#1a1033]">{a.label}</p>
                      <p className="text-[10px] text-[#9490a8]">{a.desc}</p>
                    </div>
                    <ChevronRight className="size-3.5 text-[#c4bfd8] group-hover:text-[#7C5CFC] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
