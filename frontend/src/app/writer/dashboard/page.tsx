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
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { taskService } from "@/services/task.service";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

  const activeTasksCount = tasks.filter(t => t.task_status === "ASSIGNED" || t.task_status === "IN_PROGRESS").length;
  const pendingBidsCount = bids.filter(b => b.bid_status === "PENDING").length;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1a1033]">Welcome Back, {userName}</h1>
          <p className="text-sm text-[#9490a8] mt-1">Manage your active projects and new bidding opportunities.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/writer/tasks/available">
            <Button className="rounded-xl bg-[#7C5CFC] hover:bg-[#6d4ef0] font-bold h-11 px-6 gap-2 shadow-lg shadow-violet-400/20 transition-all">
              <Zap className="size-4 fill-white/20" /> Browse New Tasks
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Projects", val: activeTasksCount, icon: Briefcase, color: "text-[#7C5CFC]", bg: "bg-violet-50" },
          { label: "Pending Bids", val: pendingBidsCount, icon: Gavel, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total Earnings", val: "$0.00", icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Success Rate", val: "100%", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
        ].map((stat, i) => (
          <Card key={i} className="border-border/50 shadow-sm transition-all hover:shadow-md hover:border-[#7C5CFC]/20 rounded-2xl overflow-hidden group bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2.5 rounded-xl transition-colors group-hover:scale-110 duration-300", stat.bg)}>
                  <stat.icon className={cn("size-5", stat.color)} />
                </div>
                <TrendingUp className="size-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-3xl font-black text-[#1a1033]">{stat.val}</div>
              <p className="text-[10px] font-bold text-[#9490a8] uppercase tracking-widest mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Section: Projects & Bids */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Projects */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1a1033] flex items-center gap-2">
                <Briefcase className="size-5 text-[#7C5CFC]" /> Active Projects
              </h2>
              <Link href="/writer/tasks/active">
                <Button variant="ghost" size="sm" className="text-[#7C5CFC] font-bold text-xs gap-1 hover:bg-violet-50">
                  View All <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
            
            <Card className="border-border/50 overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm">
              <div className="divide-y divide-border/40">
                {isLoading ? (
                  <div className="p-12 text-center text-[#9490a8]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="size-6 border-2 border-[#7C5CFC] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-bold uppercase tracking-widest">Updating task list...</span>
                    </div>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="p-16 text-center text-[#9490a8] space-y-4">
                    <AlertCircle className="size-10 mx-auto opacity-20" />
                    <p className="text-sm font-medium">No projects assigned yet. Try bidding on open tasks!</p>
                  </div>
                ) : tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="p-6 hover:bg-violet-50/30 transition-all flex items-center justify-between gap-4 group">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <h3 className="font-bold text-[#1a1033] truncate group-hover:text-[#7C5CFC] transition-colors">{task.title}</h3>
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
                        <span className="px-2 py-0.5 rounded-md bg-violet-100 text-[#7C5CFC] border border-violet-200">{task.academic_category?.name || "General"}</span>
                        <span className="flex items-center gap-1.5 text-orange-600">
                          <Clock className="size-3" /> Due {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-6">
                      <div className="hidden sm:block">
                        <p className="font-black text-lg text-[#1a1033]">${parseFloat(task.budget || 0).toFixed(2)}</p>
                        <p className="text-[9px] text-[#9490a8] uppercase font-black tracking-widest">Agreed Fee</p>
                      </div>
                      <Link href={`/writer/tasks/active`}>
                        <Button size="sm" className="h-9 px-4 rounded-xl bg-white border border-border/60 text-[#6b6880] hover:text-[#1a1033] hover:border-[#7C5CFC]/40 shadow-sm font-bold text-xs">Manage</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Pending Bids */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1a1033] flex items-center gap-2">
                <Gavel className="size-5 text-emerald-600" /> My Active Bids
              </h2>
            </div>
            
            <Card className="border-border/50 overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm">
              <div className="divide-y divide-border/40">
                {isLoading ? (
                  <div className="p-12 text-center text-[#9490a8]"><Clock className="size-6 animate-spin mx-auto" /></div>
                ) : bids.length === 0 ? (
                  <div className="p-12 text-center text-[#9490a8] text-sm">You haven't placed any bids yet.</div>
                ) : bids.slice(0, 3).map((bid) => (
                  <div key={bid.id} className="p-6 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                       <h3 className="font-bold text-[#1a1033] text-sm truncate">{bid.task?.title || "Project Proposal"}</h3>
                       <p className="text-[11px] text-[#9490a8] font-medium mt-0.5 italic line-clamp-1">"{bid.message || "No pitch provided"}"</p>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="text-right">
                          <p className="font-bold text-sm text-[#1a1033]">${parseFloat(bid.bid_amount).toFixed(2)}</p>
                          <Badge variant="outline" className={cn(
                            "text-[9px] uppercase font-black px-2 py-0.5 rounded-md mt-1",
                            bid.bid_status === "PENDING" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
                          )}>
                             {bid.bid_status}
                          </Badge>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar: Recommendations & Feed */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1a1033]">Opportunities</h2>
            <Card className="border-[#7C5CFC]/20 shadow-lg shadow-violet-400/5 bg-gradient-to-br from-[#7C5CFC] to-[#6d4ef0] rounded-3xl p-6 text-white relative overflow-hidden">
               <div className="relative z-10 space-y-4">
                  <div className="size-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                     <Zap className="size-5 fill-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">New Task Alerts</h3>
                    <p className="text-xs text-white/70 mt-1 leading-relaxed">
                      There are <strong>{openTasks.length} projects</strong> currently accepting bids in your field. Don't miss out!
                    </p>
                  </div>
                  <Link href="/writer/tasks/available" className="block">
                    <Button className="w-full bg-white text-[#7C5CFC] hover:bg-white/90 font-bold rounded-xl h-11 gap-2 shadow-xl shadow-black/10 transition-all">
                       Marketplace <ChevronRight className="size-4" />
                    </Button>
                  </Link>
               </div>
               {/* Abstract circles for flair */}
               <div className="absolute -bottom-10 -right-10 size-40 bg-white/10 rounded-full blur-3xl" />
               <div className="absolute -top-10 -left-10 size-40 bg-white/10 rounded-full blur-3xl" />
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1a1033]">Performance</h2>
            <Card className="border-border/50 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm space-y-6">
               <div>
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-[#9490a8] mb-2">
                    <span>Profile Strength</span>
                    <span className="text-[#7C5CFC]">85%</span>
                  </div>
                  <div className="h-2 w-full bg-violet-50 rounded-full overflow-hidden">
                    <div className="h-full bg-[#7C5CFC] w-[85%] rounded-full shadow-[0_0_8px_rgba(124,92,252,0.4)]" />
                  </div>
               </div>
               
               <div className="pt-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9490a8] mb-4">Market Stats</h3>
                  <div className="space-y-4">
                     {[
                       { label: "Bids Won", val: "0", color: "bg-emerald-50 text-emerald-600" },
                       { label: "Avg. Response", val: "2h", color: "bg-blue-50 text-blue-600" },
                       { label: "Completion", val: "100%", color: "bg-amber-50 text-amber-600" }
                     ].map((s, idx) => (
                       <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white border border-border/50">
                          <span className="text-xs font-bold text-[#6b6880]">{s.label}</span>
                          <span className={cn("text-[10px] font-black px-2 py-1 rounded-lg", s.color)}>{s.val}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
