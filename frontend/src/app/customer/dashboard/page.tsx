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
  Target,
  Award,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { taskService } from "@/services/task.service";
import { formatDistanceToNow } from "date-fns";

/* ─── Advanced Premium Card Component ────────────────────── */
function PremiumCard({ className, children, title, subtitle, action }: { 
  className?: string; 
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("glass rounded-[2rem] p-7.5 relative group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 border border-white/10 dark:border-white/5 relative overflow-hidden", className)}>
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 relative z-20">
          <div>
            {title && <h3 className="text-[15px] font-black text-foreground tracking-tight uppercase tracking-wider">{title}</h3>}
            {subtitle && <p className="text-[11px] text-muted-foreground font-semibold mt-1.5">{subtitle}</p>}
          </div>
          {action && <div className="relative z-30">{action}</div>}
        </div>
      )}
      <div className="relative z-10">{children}</div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-[2rem]" />
    </div>
  );
}

/* ─── Premium Stat Cards ────────────────────── */
function StatCard({ label, value, icon: Icon, trend, color, href }: { 
  label: string; 
  value: string; 
  icon: any; 
  trend?: { val: string; pos: boolean };
  color: string;
  href?: string;
}) {
  const CardContent = (
    <PremiumCard className="p-6 cursor-pointer hover:bg-white/[0.01] h-full flex flex-col justify-between select-none">
      <div className="flex items-start justify-between mb-5">
        <div className={cn("size-11 rounded-2xl flex items-center justify-center shadow-lg shadow-black/5 border border-white/10 dark:border-white/5", color)}>
          <Icon className="size-5.5 text-white" strokeWidth={2.5} />
        </div>
        <div className="text-muted-foreground/30 hover:text-foreground transition-colors pt-1">
          <ArrowUpRight className="size-4.5" />
        </div>
      </div>
      <div>
        <p className="text-[10px] font-extrabold text-muted-foreground/50 uppercase tracking-[0.2em] mb-2">{label}</p>
        <div className="flex items-end justify-between">
          <span className="text-2xl font-black text-foreground tracking-tight leading-none">
            {value}
          </span>
          {trend && (
            <span className={cn(
              "text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider",
              trend.pos ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10" : "bg-rose-500/10 text-rose-500 border border-rose-500/10"
            )}>
              {trend.val}
            </span>
          )}
        </div>
      </div>
    </PremiumCard>
  );

  if (href) {
    return <Link href={href} className="h-full">{CardContent}</Link>;
  }

  return <div className="h-full">{CardContent}</div>;
}

export default function CustomerDashboard() {
  const [statsData, setStatsData] = useState<any>(null);
  const [userName, setUserName] = useState("Premium Client");
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
            // Handle if database name was set to generic Academic placeholder
            if (full && first !== "Academic") {
              setUserName(full);
            } else if (first) {
              setUserName(first);
            } else {
              setUserName("Premium Client");
            }
          } catch (e) {
            console.error("Failed to parse user in customer dashboard:", e);
          }
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-reveal">
        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/20 animate-pulse" />
          <Activity className="size-6 text-primary animate-bounce" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-sm font-bold text-foreground tracking-tight uppercase tracking-[0.2em]">Synchronizing Portal</p>
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-progress" style={{ width: '40%' }} />
          </div>
        </div>
      </div>
    );
  }

  // Find most active task title if available
  const activeTasks = statsData?.recent_activity?.filter((p: any) => p.status !== 'OPEN' && p.status !== 'COMPLETED' && p.status !== 'CANCELLED') || [];
  const mostActiveTitle = activeTasks.length > 0 ? activeTasks[0].title : "AI Healthcare System";

  return (
    <div className="space-y-8 animate-reveal pt-10 pb-10 px-2 lg:px-0">
      
      {/* ── Greeting & Welcome Hero ── */}
      <div className="glass rounded-[2rem] p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border-gradient">
        <div className="absolute -bottom-24 -left-24 size-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 text-center md:text-left">
          <div className="size-12 rounded-2xl glass bg-card/50 flex items-center justify-center mx-auto md:mx-0 shadow-lg shadow-black/5 text-primary animate-float">
            <Sparkles className="size-5.5" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-foreground tracking-tight leading-tight">
              Good morning, <span className="text-primary">{userName}!</span>
            </h1>
            <p className="text-xs text-muted-foreground font-semibold max-w-md leading-relaxed mx-auto md:mx-0">
              You have <span className="text-foreground font-black">{activeProjectsCount} active assignments</span> in escrow and several new verified expert bids awaiting your review.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
            <Link href="/customer/create-task">
              <Button className="h-11 px-6 rounded-xl font-bold bg-primary text-white shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all gap-2 cursor-pointer select-none">
                <PlusCircle className="size-4.5" />
                New Project
              </Button>
            </Link>
            <Link href="/customer/orders">
              <button className="text-xs font-black text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 cursor-pointer select-none">
                View All Deadlines <ChevronRight className="size-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* Most Active Project Card */}
        <div className="relative z-10 w-full md:w-auto">
          <div className="glass bg-white/10 dark:bg-slate-900/10 p-6 rounded-3xl border border-white/20 dark:border-white/5 shadow-2xl shadow-black/5 max-w-xs ml-auto">
            <p className="text-[10px] font-extrabold text-muted-foreground/60 uppercase tracking-[0.1em] mb-4">Most Active Project</p>
            <div className="flex items-center gap-4 mb-4">
              <div className="size-11 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/10 text-indigo-500">
                <Activity className="size-5.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-black text-foreground truncate max-w-[130px]" title={mostActiveTitle}>{mostActiveTitle}</p>
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Research Domain</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-muted-foreground uppercase tracking-wider">Progress Status</span>
                <span className="text-primary font-black">75%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-200/50 dark:bg-slate-800/80 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '75%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Posted Tasks" 
          value={statsData ? (statsData.total_posted_count || 0).toString().padStart(2, '0') : "00"} 
          icon={FileText} 
          color="bg-[#7C5CFC]" 
          trend={{ val: "Total", pos: true }}
          href="/customer/orders"
        />
        <StatCard 
          label="Active Tasks" 
          value={statsData ? (statsData.active_accepted_count || 0).toString().padStart(2, '0') : "00"} 
          icon={Activity} 
          color="bg-[#4F46E5]" 
          trend={{ val: "Accepted", pos: true }}
          href="/customer/orders?status=active"
        />
        <StatCard 
          label="Completed Tasks" 
          value={statsData ? (statsData.completed_tasks_count || 0).toString().padStart(2, '0') : "00"} 
          icon={CheckCircle2} 
          color="bg-emerald-500" 
          trend={{ val: "+20.0%", pos: true }}
          href="/customer/orders"
        />
        <StatCard 
          label="Weekly Spending" 
          value={statsData ? `$${statsData.spending_this_week.toFixed(2)}` : "$0.00"} 
          icon={Wallet} 
          color="bg-amber-500" 
          trend={{ val: "-6.2%", pos: false }}
          href="/customer/payments"
        />
      </div>

      {/* ── Main Dashboard Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Performance Overview Analytics */}
          <PremiumCard 
            title="Performance Overview" 
            subtitle="Monthly breakdown of project investments"
            action={
              <select className="glass px-4.5 py-2.5 rounded-xl text-[11px] font-bold outline-none border border-white/10 dark:border-white/5 cursor-pointer bg-slate-50 dark:bg-slate-900 select-none">
                <option>This Month</option>
                <option>Last Month</option>
              </select>
            }
          >
            <div className="h-[280px] flex items-end justify-between gap-4 pt-10 pb-2 relative px-4">
              {(() => {
                const data = statsData?.monthly_data || [
                  {month: 'Jan', value: 0}, {month: 'Feb', value: 0}, {month: 'Mar', value: 0},
                  {month: 'Apr', value: 0}, {month: 'May', value: 0}, {month: 'Jun', value: 0},
                  {month: 'Jul', value: 0}, {month: 'Aug', value: 0}, {month: 'Sep', value: 0},
                  {month: 'Oct', value: 0}, {month: 'Nov', value: 0}, {month: 'Dec', value: 0}
                ];
                const maxVal = Math.max(...data.map((m: any) => m.value), 5);
                
                return data.map((item: any, i: number) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3.5 h-full group">
                    <div className="relative w-full flex-1 flex items-end justify-center">
                      {/* background tracking capsule */}
                      <div className="w-2.5 bg-slate-200/40 dark:bg-slate-900/30 rounded-t-full absolute inset-y-0 mx-auto" />
                      
                      {/* glowing metric bar */}
                      <div 
                        className="w-2.5 bg-primary rounded-t-full shadow-[0_0_12px_rgba(var(--primary),0.3)] transition-all duration-700 relative z-10" 
                        style={{ height: `${(item.value / maxVal) * 100}%` }}
                      />
                      {item.value > 0 && (
                        <div className="absolute -top-8 bg-foreground text-background text-[9px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-xl border border-white/10 select-none">
                          ${item.value.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground/50 group-hover:text-primary transition-colors select-none">
                      {item.month}
                    </span>
                  </div>
                ));
              })()}
            </div>
          </PremiumCard>

          {/* Active Projects Table-like List */}
          <PremiumCard 
            title="Active Projects" 
            subtitle="Real-time status of your ongoing tasks"
            action={
              <Link href="/customer/orders">
                <button className="text-xs font-black text-primary hover:underline cursor-pointer select-none">View All</button>
              </Link>
            }
            className="overflow-hidden p-0"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/20 dark:bg-slate-950/20 border-b border-white/5">
                  <tr className="text-[10px] font-extrabold text-muted-foreground/60 uppercase tracking-widest select-none">
                    <th className="px-6 py-4.5">Project Name</th>
                    <th className="px-6 py-4.5">Status</th>
                    <th className="px-6 py-4.5 text-right">Budget</th>
                    <th className="px-6 py-4.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {statsData?.recent_activity?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center space-y-4">
                        <div className="size-16 rounded-3xl glass mx-auto flex items-center justify-center opacity-40">
                          <ShoppingBag className="size-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-foreground">No active assignments found.</p>
                          <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                            Create a project proposal and publish it in our marketplace to receive expert bids.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    statsData.recent_activity.slice(0, 4).map((proj: any) => (
                      <tr key={proj.id} className="group hover:bg-white/[0.01] transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-2xl glass flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                              <FileText className="size-5" />
                            </div>
                            <div className="min-w-0 max-w-[240px]">
                              <p className="text-[13px] font-bold text-foreground truncate">{proj.title}</p>
                              <p className="text-[10px] text-muted-foreground font-semibold">Academic Writing</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "size-1.5 rounded-full", 
                                proj.status === 'OPEN' ? 'bg-amber-500 animate-pulse' : 
                                proj.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-indigo-500'
                              )} />
                              <span className={cn(
                                "text-[10.5px] font-bold", 
                                proj.status === 'OPEN' ? 'text-amber-500' : 
                                proj.status === 'COMPLETED' ? 'text-emerald-500' : 'text-indigo-500'
                              )}>
                                {proj.status}
                              </span>
                            </div>
                            <div className="w-24 h-1 bg-slate-200/50 dark:bg-slate-800/80 rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: proj.status === 'OPEN' ? '20%' : proj.status === 'COMPLETED' ? '100%' : '60%' }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right font-bold text-[13px] text-foreground">
                          ${parseFloat(proj.budget || 500).toFixed(2)}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Link href={`/customer/orders`}>
                            <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all cursor-pointer select-none">
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </PremiumCard>
        </div>

        {/* ── Right Sidebar Column ── */}
        <div className="space-y-8">
          
          {/* Project Pipeline */}
          <PremiumCard title="Project Pipeline">
            <div className="space-y-5">
              {[
                { label: 'Posted Tasks', count: statsData?.total_posted_count ?? 0, color: 'bg-indigo-500' },
                { 
                  label: 'Bidding Status', 
                  count: statsData?.pipeline_bidding ?? statsData?.pipeline?.bidding ?? (statsData?.recent_activity?.filter((a: any) => a.status === 'OPEN').length || 0), 
                  color: 'bg-amber-500' 
                },
                { 
                  label: 'In Progress', 
                  count: statsData?.pipeline_in_progress ?? statsData?.pipeline?.in_progress ?? (statsData?.recent_activity?.filter((a: any) => ['ASSIGNED', 'IN_PROGRESS', 'REVISION_REQUESTED', 'SUBMITTED', 'PENDING_PAYMENT'].includes(a.status)).length || 0), 
                  color: 'bg-primary' 
                },
                { label: 'Completed Deliveries', count: statsData?.completed_tasks_count ?? 0, color: 'bg-emerald-500' },
              ].map((item, i) => (
                <div key={i} className="space-y-2 select-none">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-foreground">{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200/50 dark:bg-slate-800/80 overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000", item.color)} 
                      style={{ width: `${((statsData?.total_posted_count ?? 0) > 0) ? (item.count / (statsData?.total_posted_count ?? 1)) * 100 : 0}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>

          {/* Success Rate Progress Circle */}
          <PremiumCard title="Success Rate">
            <div className="flex items-center justify-center py-4 select-none">
              <div className="relative size-36">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-200/40 dark:text-slate-800/40" />
                  <circle 
                    cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" 
                    className="text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)] transition-all duration-1000" 
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - (statsData?.total_posted_count > 0 ? (statsData?.completed_tasks_count / statsData?.total_posted_count) : 0))}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-foreground">
                    {statsData?.total_posted_count > 0 
                      ? Math.round((statsData?.completed_tasks_count / statsData?.total_posted_count) * 100) 
                      : 0}%
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mt-1">
                    <TrendingUp className="size-3.5" />
                    +{(statsData?.completed_tasks_count || 0) > 0 ? "5.2%" : "0%"}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground text-center leading-relaxed font-medium select-none">
              Your project success rate is calculated based on <span className="text-foreground font-bold">completed</span> tasks vs total posted.
            </p>
          </PremiumCard>

          {/* Quick Action grid */}
          <PremiumCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-3.5">
              {[
                { label: 'New Project', icon: PlusCircle, color: 'text-primary', bg: 'bg-primary/10', href: '/customer/create-task' },
                { label: 'Messages', icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-500/10', href: '/customer/messages' },
                { label: 'Add Funds', icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-500/10', href: '/customer/payments' },
                { label: 'Reports Feed', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10', href: '/customer/dashboard' },
              ].map((action, i) => (
                <Link key={i} href={action.href}>
                  <div className="glass bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-3 group hover:bg-white/10 hover:shadow-md transition-all text-center cursor-pointer select-none">
                    <div className={cn("size-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform", action.bg)}>
                      <action.icon className={cn("size-5", action.color)} />
                    </div>
                    <span className="text-[10.5px] font-black text-foreground uppercase tracking-wider">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </PremiumCard>

          {/* Recent Activity feed */}
          <PremiumCard title="Recent Activity" action={<button className="text-[11px] font-bold text-primary hover:underline cursor-pointer select-none">View All</button>}>
            <div className="space-y-6">
              {statsData?.recent_activity?.slice(0, 3).map((act: any) => (
                <Link key={act.id} href={`/customer/orders`} className="block">
                  <div className="flex gap-4 relative group cursor-pointer">
                    <div className="absolute left-[15px] top-8 bottom-[-24px] w-0.5 bg-slate-200/20 dark:bg-slate-800/20 last:hidden" />
                    <div className="size-8.5 rounded-full glass border border-white/10 flex items-center justify-center flex-shrink-0 z-10 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                      <Zap className="size-3.5 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[12px] font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-1">
                        {act.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                        <Clock className="size-3" />
                        {formatDistanceToNow(new Date(act.updated_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
              {(!statsData?.recent_activity || statsData.recent_activity.length === 0) && (
                <p className="text-[11px] text-muted-foreground italic text-center py-4 select-none">No recent activity logged.</p>
              )}
            </div>
          </PremiumCard>
        </div>
      </div>
    </div>
  );
}
