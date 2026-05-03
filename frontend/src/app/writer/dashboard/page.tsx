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
  AlertCircle,
  MessageSquare,
  Activity,
  Target,
  Search,
  Bell,
  MoreHorizontal,
  FileText,
  Award,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { taskService } from "@/services/task.service";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ─── Advanced UI Components ────────────────────── */

function PremiumCard({ className, children, title, subtitle, action }: { 
  className?: string; 
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("glass rounded-3xl p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-6">
          <div>
            {title && <h3 className="text-[15px] font-bold text-foreground tracking-tight">{title}</h3>}
            {subtitle && <p className="text-[11px] text-muted-foreground font-medium mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="relative z-10">{children}</div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
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
    <PremiumCard className="p-5 cursor-pointer hover:bg-white/[0.02]">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("size-10 rounded-2xl flex items-center justify-center shadow-lg shadow-black/5", color)}>
          <Icon className="size-5 text-white" strokeWidth={2.5} />
        </div>
        <div className="text-muted-foreground/40 hover:text-foreground transition-colors">
          <ArrowUpRight className="size-4" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">{label}</p>
        <div className="flex items-end gap-2.5">
          <span className="text-2xl font-bold text-foreground tracking-tight leading-none">
            {value}
          </span>
          {trend && (
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full",
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
    return <Link href={href}>{CardContent}</Link>;
  }

  return CardContent;
}

/* ─── main component ─────────────────────────────── */

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-reveal">
        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/20 animate-pulse" />
          <Activity className="size-6 text-primary animate-bounce" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-sm font-bold text-foreground tracking-tight uppercase tracking-[0.2em]">Synchronizing Portal</p>
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-progress" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-reveal pb-10">
      
      {/* Page content starts here */}

      {/* ── Greeting & Earnings Hero ── */}
      <div className="glass rounded-[2rem] p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border-gradient">
        <div className="absolute -bottom-24 -left-24 size-64 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 space-y-4">
          <div className="size-14 rounded-2xl glass bg-card/50 flex items-center justify-center animate-float">
            <span className="text-3xl">🚀</span>
          </div>
          <div className="space-y-1.5">
            <h1 className="text-3xl font-bold text-foreground tracking-tight leading-tight">
              Welcome back, <span className="text-primary">{userName}!</span>
            </h1>
            <p className="text-sm text-muted-foreground font-medium max-w-md leading-relaxed">
              You have <span className="text-foreground font-bold">{activeTasksCount} active projects</span> and <span className="text-foreground font-bold">{openTasks.length} new opportunities</span> available in the marketplace.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-4">
            <Link href="/writer/tasks/available">
              <Button className="h-11 px-6 rounded-xl font-bold bg-primary text-white shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all gap-2">
                <Zap className="size-4.5" />
                Browse Marketplace
              </Button>
            </Link>
            <Link href="/writer/earnings">
              <button className="text-[13px] font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                Review Earnings <ChevronRight className="size-4" />
              </button>
            </Link>
          </div>
        </div>

        <div className="relative z-10 w-full md:w-auto">
          <div className="glass bg-card/40 p-6 rounded-3xl border-border/50 shadow-2xl shadow-black/5 max-w-xs ml-auto">
            <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.1em] mb-4">Target Achievement</p>
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Award className="size-6" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-foreground">Monthly Goal</p>
                <p className="text-[10px] text-muted-foreground font-semibold">$2,500.00 Target</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-muted-foreground">Earnings to date</span>
                <span className="text-primary">$1,850</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '74%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Active Tasks" 
          value={activeTasksCount.toString().padStart(2, '0')} 
          icon={Briefcase} 
          color="bg-[#7C5CFC]" 
          trend={{ val: "+2 New", pos: true }}
          href="/writer/tasks/active"
        />
        <StatCard 
          label="Pending Bids" 
          value={pendingBidsCount.toString().padStart(2, '0')} 
          icon={Gavel} 
          color="bg-[#4F46E5]" 
          trend={{ val: "3 Active", pos: true }}
          href="/writer/tasks/available"
        />
        <StatCard 
          label="Total Earnings" 
          value="$1,240.50" 
          icon={DollarSign} 
          color="bg-emerald-500" 
          trend={{ val: "+15.2%", pos: true }}
          href="/writer/earnings"
        />
        <StatCard 
          label="Success Rate" 
          value="100%" 
          icon={Star} 
          color="bg-amber-500" 
          trend={{ val: "Top Rated", pos: true }}
          href="/writer/profile"
        />
      </div>

      {/* ── Main Dashboard Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Tasks Detailed List */}
          <PremiumCard 
            title="Active Workstreams" 
            subtitle="Projects currently in progress or awaiting final submission"
            action={
              <Link href="/writer/tasks/active">
                <button className="text-[12px] font-bold text-primary hover:underline">View All</button>
              </Link>
            }
            className="p-0 overflow-hidden"
          >
            <div className="divide-y divide-white/5">
              {tasks.filter(t => t.task_status !== 'COMPLETED' && t.task_status !== 'CANCELLED').length === 0 ? (
                <div className="p-16 text-center text-muted-foreground space-y-4">
                  <div className="size-16 rounded-3xl glass mx-auto flex items-center justify-center opacity-40">
                    <Briefcase className="size-8" />
                  </div>
                  <p className="text-sm font-bold tracking-tight">No active projects assigned yet.</p>
                </div>
              ) : tasks.filter(t => t.task_status !== 'COMPLETED' && t.task_status !== 'CANCELLED').slice(0, 4).map((task) => (
                <div key={task.id} className="p-6 hover:bg-white/[0.02] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-2xl glass flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-lg shadow-black/5">
                      <FileText className="size-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors">{task.title}</h3>
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        <span className="px-2 py-0.5 rounded-lg glass border-white/5">{task.academic_category?.name || "Academic"}</span>
                        <span className="flex items-center gap-1.5 text-rose-500/80">
                          <Clock className="size-3.5" /> Due {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 sm:text-right">
                    <div className="flex flex-col sm:items-end">
                      <p className="text-xl font-bold text-foreground leading-none">${parseFloat(task.budget || 0).toFixed(2)}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1.5">Project Fee</p>
                    </div>
                    <Link href={`/writer/tasks/active`}>
                      <Button variant="ghost" size="sm" className="h-10 px-5 rounded-xl text-[11px] font-bold border border-white/10 hover:bg-white/10 group-hover:border-primary/50 transition-all">
                        Open Portal
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>

          {/* Earnings Overview (Chart style) */}
          <PremiumCard 
            title="Earnings Overview" 
            subtitle="Income trajectory for the last 30 days"
          >
            <div className="h-[250px] flex items-end justify-between gap-4 pt-10 px-4">
              {[40, 65, 35, 55, 80, 45, 90, 30, 70, 85, 40, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="relative w-full flex items-end justify-center h-[160px]">
                    <div 
                      className="w-full max-w-[14px] bg-emerald-500/10 rounded-t-full absolute bottom-0 group-hover:bg-emerald-500/30 transition-all duration-500" 
                      style={{ height: '100%' }}
                    />
                    <div 
                      className="w-full max-w-[14px] bg-emerald-500 rounded-t-full absolute bottom-0 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-700" 
                      style={{ height: `${h}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-8">
          
          {/* Marketplace Spotlight */}
          <PremiumCard className="bg-gradient-to-br from-primary to-[#6d4ef0] border-none text-white shadow-2xl shadow-primary/20">
            <div className="relative z-10 space-y-5">
              <div className="size-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 animate-float">
                <Zap className="size-6 fill-white" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold">New Opportunities</h3>
                <p className="text-xs text-white/70 leading-relaxed font-medium">
                  There are <span className="text-white font-bold">{openTasks.length} high-value projects</span> currently accepting bids. Experts are already competing.
                </p>
              </div>
              <Link href="/writer/tasks/available">
                <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold rounded-2xl h-12 gap-2 shadow-xl shadow-black/10 transition-all">
                  Browse Marketplace <ChevronRight className="size-4" />
                </Button>
              </Link>
            </div>
            {/* Abstract Decorative Circles */}
            <div className="absolute -bottom-10 -right-10 size-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-10 -left-10 size-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          </PremiumCard>

          {/* Writer Analytics */}
          <PremiumCard title="Performance Analytics">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  <span>Profile Strength</span>
                  <span className="text-primary">85%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[85%] rounded-full shadow-[0_0_12px_rgba(var(--primary),0.4)]" />
                </div>
              </div>
              
              <div className="space-y-4 pt-2">
                {[
                  { label: "Bids Won", val: "12", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                  { label: "Avg. Rating", val: "4.9", color: "text-amber-500", bg: "bg-amber-500/10" },
                  { label: "On Time", val: "100%", color: "text-indigo-500", bg: "bg-indigo-500/10" }
                ].map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl glass bg-white/5 border-white/5 hover:bg-white/10 transition-all">
                    <span className="text-[12px] font-bold text-muted-foreground">{s.label}</span>
                    <span className={cn("text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider", s.color, s.bg)}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </PremiumCard>

          {/* Active Bids Mini List */}
          <PremiumCard title="Your Active Bids" action={<button className="text-[11px] font-bold text-primary hover:underline">View All</button>}>
            <div className="space-y-6">
              {bids.slice(0, 3).map((bid) => (
                <div key={bid.id} className="flex items-start gap-4 group">
                  <div className="size-10 rounded-xl glass flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Gavel className="size-4.5 text-indigo-500" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-foreground leading-tight truncate group-hover:text-primary transition-colors">
                      {bid.task?.title || "Project Proposal"}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-primary">${parseFloat(bid.bid_amount).toFixed(2)}</p>
                      <span className="text-[10px] text-muted-foreground font-medium">{bid.bid_status}</span>
                    </div>
                  </div>
                </div>
              ))}
              {bids.length === 0 && (
                <p className="text-[12px] text-muted-foreground italic text-center py-4">No active bids found.</p>
              )}
            </div>
          </PremiumCard>
        </div>
      </div>
    </div>
  );
}
