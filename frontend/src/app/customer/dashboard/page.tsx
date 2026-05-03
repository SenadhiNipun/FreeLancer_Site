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
  Gavel,
  Search,
  Bell,
  Activity,
  Zap,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { taskService } from "@/services/task.service";
import { formatDistanceToNow } from "date-fns";

/* ─── Advanced UI Components ────────────────────── */

function PremiumCard({ className, children, title, subtitle, action }: { 
  className?: string; 
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("glass rounded-[2rem] p-8 relative group transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 border border-white/10", className)}>
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-20">
          <div>
            {title && <h3 className="text-lg font-bold text-foreground tracking-tight">{title}</h3>}
            {subtitle && <p className="text-[12px] text-muted-foreground font-medium mt-1">{subtitle}</p>}
          </div>
          {action && <div className="relative z-30">{action}</div>}
        </div>
      )}
      <div className="relative z-10">{children}</div>
      {/* Subtle inner glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-[2rem]" />
    </div>
  );
}

function StatCard({ label, value, icon: Icon, trend, color, href }: { 
  label: string; 
  value: string; 
  icon: any; 
  trend?: { val: string; pos: boolean };
  color: string;
  href?: string;
}) {
  const CardContent = (
    <PremiumCard className="p-6 cursor-pointer hover:bg-white/[0.02] h-full flex flex-col justify-between">
      <div className="flex items-start justify-between mb-6">
        <div className={cn("size-12 rounded-2xl flex items-center justify-center shadow-lg shadow-black/5", color)}>
          <Icon className="size-6 text-white" strokeWidth={2.5} />
        </div>
        <div className="text-muted-foreground/40 hover:text-foreground transition-colors pt-1">
          <ArrowUpRight className="size-5" />
        </div>
      </div>
      <div>
        <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] mb-2">{label}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-foreground tracking-tight leading-none">
            {value}
          </span>
          {trend && (
            <span className={cn(
              "text-[10px] font-bold px-2 py-1 rounded-lg",
              trend.pos ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
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

  return (
    <div className="space-y-12 animate-reveal pt-10 pb-10 px-2 lg:px-0">
      
      {/* Page content starts here */}

      {/* ── Greeting & Welcome Hero ── */}
      <div className="glass rounded-[2rem] p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border-gradient">
        <div className="absolute -bottom-24 -left-24 size-64 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 space-y-4">
          <div className="size-14 rounded-2xl glass bg-white/50 flex items-center justify-center animate-float">
            <span className="text-3xl">👋</span>
          </div>
          <div className="space-y-1.5">
            <h1 className="text-3xl font-bold text-foreground tracking-tight leading-tight">
              Good morning, <span className="text-primary">{userName}!</span>
            </h1>
            <p className="text-sm text-muted-foreground font-medium max-w-md leading-relaxed">
              You have <span className="text-foreground font-bold">{statsData?.active_projects_count ?? statsData?.active_accepted_count ?? 0} active projects</span> and several new expert bids awaiting your review.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-4">
            <Link href="/customer/create-task">
              <Button className="h-11 px-6 rounded-xl font-bold bg-primary text-white shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all gap-2">
                <PlusCircle className="size-4.5" />
                New Project
              </Button>
            </Link>
            <Link href="/customer/orders">
              <button className="text-[13px] font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                View All Deadlines <ChevronRight className="size-4" />
              </button>
            </Link>
          </div>
        </div>

        <div className="relative z-10 w-full md:w-auto">
          <div className="glass bg-white/40 p-6 rounded-3xl border-white/50 shadow-2xl shadow-black/5 max-w-xs ml-auto">
            <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.1em] mb-4">Most Active Project</p>
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                <Activity className="size-6 text-indigo-500" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-foreground truncate max-w-[120px]">AI Healthcare System</p>
                <p className="text-[10px] text-muted-foreground font-semibold">Machine Learning</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary">75%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
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
          icon={TrendingUp} 
          color="bg-amber-500" 
          trend={{ val: "-6.2%", pos: false }}
          href="/customer/payments"
        />
      </div>

      {/* ── Main Dashboard Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Performance Overview (Chart placeholder style) */}
          <PremiumCard 
            title="Performance Overview" 
            subtitle="Monthly breakdown of project investments"
            action={
              <select className="glass px-4 py-2 rounded-xl text-[11px] font-bold outline-none border-white/5 cursor-pointer">
                <option>This Month</option>
                <option>Last Month</option>
              </select>
            }
          >
            <div className="h-[350px] flex items-end justify-between gap-4 pt-12 pb-4 relative">
              {(() => {
                const data = statsData?.monthly_data || [
                  {month: 'Jan', value: 0}, {month: 'Feb', value: 0}, {month: 'Mar', value: 0},
                  {month: 'Apr', value: 0}, {month: 'May', value: 0}, {month: 'Jun', value: 0},
                  {month: 'Jul', value: 0}, {month: 'Aug', value: 0}, {month: 'Sep', value: 0},
                  {month: 'Oct', value: 0}, {month: 'Nov', value: 0}, {month: 'Dec', value: 0}
                ];
                const maxVal = Math.max(...data.map((m: any) => m.value), 5);
                
                return data.map((item: any, i: number) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4 group h-full">
                    <div className="relative w-full flex-1 flex items-end justify-center min-h-[150px]">
                      <div className="w-2 bg-primary/10 rounded-t-full absolute inset-y-0 mx-auto" />
                      <div 
                        className="w-2 bg-primary rounded-t-full shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all duration-700 relative z-10" 
                        style={{ height: `${(item.value / maxVal) * 100}%` }}
                      />
                      {item.value > 0 && (
                        <div className="absolute -top-8 bg-foreground text-background text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          ${item.value.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground/40 group-hover:text-primary transition-colors">
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
              <button className="text-[12px] font-bold text-primary hover:underline">View All</button>
            }
            className="min-h-[400px]"
          >
            <div className="overflow-x-auto pt-4">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-y border-white/5">
                  <tr className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.15em]">
                    <th className="px-6 py-4">Project Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Budget</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {statsData?.recent_activity?.filter((p: any) => p.status !== 'OPEN' && p.status !== 'COMPLETED' && p.status !== 'CANCELLED' && p.status !== 'SUBMITTED').slice(0, 4).map((proj: any) => (
                    <tr key={proj.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-xl glass flex items-center justify-center text-primary">
                            <FileText className="size-4.5" />
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-foreground">{proj.title}</p>
                            <p className="text-[10px] text-muted-foreground font-semibold">Academic Writing</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className={cn("size-1.5 rounded-full", proj.status === 'OPEN' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500')} />
                            <span className={cn("text-[11px] font-bold", proj.status === 'OPEN' ? 'text-amber-500' : 'text-emerald-500')}>{proj.status}</span>
                          </div>
                          <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: proj.status === 'OPEN' ? '20%' : '100%' }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right font-bold text-[13px] text-foreground">
                        $500.00
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Link href={`/customer/orders`}>
                          <Button variant="ghost" size="sm" className="h-8 px-4 rounded-xl text-[11px] font-bold border border-white/10 hover:bg-white/10">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PremiumCard>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-12">
          
          {/* Project Pipeline */}
          <PremiumCard title="Project Pipeline">
            <div className="space-y-5">
              {[
                { label: 'Posted', count: statsData?.total_posted_count ?? 0, color: 'bg-indigo-500' },
                { 
                  label: 'Bidding', 
                  count: statsData?.pipeline_bidding ?? statsData?.pipeline?.bidding ?? (statsData?.recent_activity?.filter((a: any) => a.status === 'OPEN').length || 0), 
                  color: 'bg-amber-500' 
                },
                { 
                  label: 'In Progress', 
                  count: statsData?.pipeline_in_progress ?? statsData?.pipeline?.in_progress ?? (statsData?.recent_activity?.filter((a: any) => ['ASSIGNED', 'IN_PROGRESS', 'REVISION_REQUESTED', 'SUBMITTED', 'PENDING_PAYMENT'].includes(a.status)).length || 0), 
                  color: 'bg-primary' 
                },
                { label: 'Completed', count: statsData?.completed_tasks_count ?? 0, color: 'bg-emerald-500' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-foreground">{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000", item.color)} 
                      style={{ width: `${((statsData?.total_posted_count ?? 0) > 0) ? (item.count / (statsData?.total_posted_count ?? 1)) * 100 : 0}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>

          {/* Success Rate */}
          <PremiumCard title="Success Rate">
            <div className="flex items-center justify-center py-4">
              <div className="relative size-36">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                  <circle 
                    cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" 
                    className="text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)] transition-all duration-1000" 
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - (statsData?.total_posted_count > 0 ? (statsData?.completed_tasks_count / statsData?.total_posted_count) : 0))}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-foreground">
                    {statsData?.total_posted_count > 0 
                      ? Math.round((statsData?.completed_tasks_count / statsData?.total_posted_count) * 100) 
                      : 0}%
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold">
                    <TrendingUp className="size-3" />
                    +{(statsData?.completed_tasks_count || 0) > 0 ? "5.2%" : "0%"}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground text-center leading-relaxed font-medium">
              Your project success rate is calculated based on <span className="text-foreground font-bold">completed</span> tasks vs total posted.
            </p>
          </PremiumCard>

          {/* Quick Actions */}
          <PremiumCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'New Project', icon: PlusCircle, color: 'text-primary', bg: 'bg-primary/10', href: '/customer/create-task' },
                { label: 'Messages', icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-500/10', href: '/customer/messages' },
                { label: 'Add Funds', icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-500/10', href: '/customer/payments' },
                { label: 'Reports', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10', href: '/customer/dashboard' },
              ].map((action, i) => (
                <Link key={i} href={action.href}>
                  <div className="glass bg-white/5 border-white/5 p-4 rounded-2xl flex flex-col items-center gap-3 group hover:bg-white/10 transition-all text-center">
                    <div className={cn("size-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform", action.bg)}>
                      <action.icon className={cn("size-5", action.color)} />
                    </div>
                    <span className="text-[11px] font-bold text-foreground">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </PremiumCard>

          {/* Recent Activity Mini List */}
          <PremiumCard title="Recent Activity" action={<button className="text-[11px] font-bold text-primary hover:underline">View All</button>}>
            <div className="space-y-6">
              {statsData?.recent_activity?.slice(0, 3).map((act: any) => (
                <Link key={act.id} href={`/customer/orders`} className="block">
                  <div className="flex gap-4 relative group cursor-pointer">
                    <div className="absolute left-[15px] top-8 bottom-[-24px] w-0.5 bg-white/5 last:hidden" />
                    <div className="size-8 rounded-full glass border-white/10 flex items-center justify-center flex-shrink-0 z-10 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                      <Zap className="size-3.5 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[12px] font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-1">
                        {act.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        {formatDistanceToNow(new Date(act.updated_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </PremiumCard>
        </div>
      </div>
    </div>
  );
}
