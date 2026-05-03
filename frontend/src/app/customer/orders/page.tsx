"use client";

import React from "react";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  User,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Badge
} from "@/components/ui";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { taskService } from "@/services/task.service";
import { format } from "date-fns";

export default function MyOrders() {
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const searchParams = useSearchParams();
  const filterStatus = searchParams.get("status");

  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await taskService.getCustomerTasks();
        setTasks(response.results || []);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const displayedTasks = React.useMemo(() => {
    if (filterStatus === "active") {
      return tasks.filter(t => t.task_status !== 'OPEN' && t.task_status !== 'COMPLETED' && t.task_status !== 'CANCELLED' && t.task_status !== 'SUBMITTED');
    }
    return tasks;
  }, [tasks, filterStatus]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 uppercase text-[9px] font-black tracking-widest px-2 py-1 rounded-lg">Bidding</Badge>;
      case "ASSIGNED":
      case "IN_PROGRESS":
        return <Badge className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 hover:bg-indigo-500/20 uppercase text-[9px] font-black tracking-widest px-2 py-1 rounded-lg">In Progress</Badge>;
      case "PENDING_PAYMENT":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20 uppercase text-[9px] font-black tracking-widest px-2 py-1 rounded-lg">Payment Due</Badge>;
      case "PENDING_ASSIGNMENT":
        return <Badge className="bg-muted text-muted-foreground border-border hover:bg-muted/80 uppercase text-[9px] font-black tracking-widest px-2 py-1 rounded-lg">Assigning</Badge>;
      case "SUBMITTED":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 uppercase text-[9px] font-black tracking-widest px-2 py-1 rounded-lg">Submitted</Badge>;
      case "COMPLETED":
        return <Badge className="bg-foreground text-background border-foreground hover:bg-foreground/90 uppercase text-[9px] font-black tracking-widest px-2 py-1 rounded-lg">Completed</Badge>;
      case "REVISION_REQUESTED":
        return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20 uppercase text-[9px] font-black tracking-widest px-2 py-1 rounded-lg">Revision</Badge>;
      default:
        return <Badge variant="secondary" className="uppercase text-[9px] font-black tracking-widest px-2 py-1 rounded-lg">{status.replace('_', ' ')}</Badge>;
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-border/50">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-4 bg-primary rounded-full" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Project Management</p>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Project Repository</h1>
          <p className="text-muted-foreground font-medium italic">Comprehensive log of all academic project submissions and status tracking.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
           <div className="relative w-full sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
              <Input placeholder="Search project records..." className="pl-11 h-12 rounded-xl glass bg-card border-border/50 shadow-sm text-sm" />
           </div>
           <Button variant="outline" className="h-12 rounded-xl border-border/50 gap-2 px-6 font-bold text-muted-foreground bg-card shadow-sm hover:bg-primary/5">
              <Filter className="size-4" /> Advanced Filters
           </Button>
           <Link href="/customer/create-task" className="w-full sm:w-auto">
            <Button className="w-full h-12 rounded-xl gap-2 shadow-sm bg-primary hover:bg-primary/90 font-black px-6 text-[13px] text-white">
              New Submission
            </Button>
           </Link>
        </div>
      </div>

      <Card className="border-border/50 overflow-hidden shadow-sm glass bg-card rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Identification</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Timeline</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Assigned Expert</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Allocation</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-4">
                      <div className="size-8 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-[11px] font-black uppercase tracking-widest">Retrieving Records...</p>
                    </div>
                  </td>
                </tr>
              ) : displayedTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-4">
                      <AlertCircle className="size-10 text-muted/30" />
                      <div className="space-y-1">
                        <p className="text-[11px] font-black uppercase tracking-widest">No Active Records Found</p>
                        <Link href="/customer/orders" className="text-primary hover:underline text-sm font-bold">View All Records</Link>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : displayedTasks.map((task) => (
                <tr key={task.id} className="hover:bg-muted/10 transition-colors group border-b border-border/30">
                  <td className="px-8 py-8">
                    <div className="space-y-1.5">
                      <p className="text-[13px] font-black text-foreground group-hover:text-primary transition-colors">{task.title}</p>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">ID: {task.id.toString().padStart(6, '0')}</p>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-2.5 text-[11px] font-black text-muted-foreground uppercase tracking-wide">
                      <Clock className="size-3.5 text-muted-foreground/30" />
                      {format(new Date(task.deadline), "dd MMM yyyy")}
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg glass bg-muted flex items-center justify-center text-[10px] font-black text-foreground border border-border/50 shadow-sm">
                        {task.writer ? task.writer.first_name[0] : "!"}
                      </div>
                      <span className="text-[12px] font-bold text-foreground/80">
                        {task.writer ? `${task.writer.first_name} ${task.writer.last_name}` : "Unallocated"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <span className="text-[13px] font-black text-foreground">
                      {task.task_status === "OPEN" ? (
                        <span className="text-primary italic">Bidding...</span>
                      ) : (
                        `$${parseFloat(task.budget || 0).toFixed(2)}`
                      )}
                    </span>
                  </td>
                  <td className="px-8 py-8">
                    {getStatusBadge(task.task_status)}
                  </td>
                  <td className="px-8 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/customer/orders/${task.id}`}>
                        <Button variant="ghost" size="sm" className="rounded-lg h-9 px-4 gap-2 text-[11px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                          Inspect <ArrowRight className="size-3.5" />
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-slate-100">
                            <MoreHorizontal className="size-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-xl min-w-[180px] p-2">
                          <DropdownMenuItem className="rounded-lg text-[11px] font-black uppercase tracking-wider p-3">View Details</DropdownMenuItem>
                          {task.writer && <DropdownMenuItem className="rounded-lg text-[11px] font-black uppercase tracking-wider p-3 text-indigo-600">Secure Channel</DropdownMenuItem>}
                          {task.task_status === "SUBMITTED" && <DropdownMenuItem className="rounded-lg text-[11px] font-black uppercase tracking-wider p-3">Request Revision</DropdownMenuItem>}
                          {task.payment_status === "UNPAID" && <DropdownMenuItem className="rounded-lg text-[11px] font-black uppercase tracking-wider p-3 text-indigo-600 bg-indigo-50/50">Authorize Payment</DropdownMenuItem>}
                          <DropdownMenuItem className="rounded-lg text-[11px] font-black uppercase tracking-wider p-3 text-rose-600 hover:bg-rose-50">Terminate Request</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Style */}
        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing 1 to {displayedTasks.length} of {displayedTasks.length} entries</p>
           <div className="flex items-center gap-2">
              <Button disabled variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-wider px-4">Previous</Button>
              <Button disabled variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-wider px-4 bg-slate-900 text-white border-slate-900">1</Button>
              <Button disabled variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-wider px-4">Next</Button>
           </div>
        </div>
      </Card>
    </div>
  );
}
