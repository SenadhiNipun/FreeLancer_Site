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
import Link from "next/link";
import { cn } from "@/lib/utils";

import { taskService } from "@/services/task.service";
import { format } from "date-fns";

export default function MyOrders() {
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return <Badge className="bg-violet-50 text-violet-700 border-violet-100 hover:bg-violet-50 uppercase text-[9px] font-black tracking-widest px-2 py-1 rounded-lg">Bidding</Badge>;
      case "ASSIGNED":
      case "IN_PROGRESS":
        return <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-50 uppercase text-[9px] font-black tracking-widest px-2 py-1 rounded-lg">In Progress</Badge>;
      case "PENDING_PAYMENT":
        return <Badge className="bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-50 uppercase text-[9px] font-black tracking-widest px-2 py-1 rounded-lg">Payment Due</Badge>;
      case "PENDING_ASSIGNMENT":
        return <Badge className="bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-50 uppercase text-[9px] font-black tracking-widest px-2 py-1 rounded-lg">Assigning</Badge>;
      case "SUBMITTED":
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 uppercase text-[9px] font-black tracking-widest px-2 py-1 rounded-lg">Submitted</Badge>;
      case "COMPLETED":
        return <Badge className="bg-slate-900 text-white border-slate-900 hover:bg-slate-800 uppercase text-[9px] font-black tracking-widest px-2 py-1 rounded-lg">Completed</Badge>;
      case "REVISION_REQUESTED":
        return <Badge className="bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-50 uppercase text-[9px] font-black tracking-widest px-2 py-1 rounded-lg">Revision</Badge>;
      default:
        return <Badge variant="secondary" className="uppercase text-[9px] font-black tracking-widest px-2 py-1 rounded-lg">{status.replace('_', ' ')}</Badge>;
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-slate-200/60">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1 w-4 bg-slate-900 rounded-full" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Project Management</p>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Project Repository</h1>
          <p className="text-slate-500 font-medium italic">Comprehensive log of all academic project submissions and status tracking.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
           <div className="relative w-full sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input placeholder="Search project records..." className="pl-11 h-12 rounded-xl bg-white border-slate-200 shadow-sm text-sm" />
           </div>
           <Button variant="outline" className="h-12 rounded-xl border-slate-200 gap-2 px-6 font-bold text-slate-600 bg-white shadow-sm">
              <Filter className="size-4" /> Advanced Filters
           </Button>
           <Link href="/customer/create-task" className="w-full sm:w-auto">
            <Button className="w-full h-12 rounded-xl gap-2 shadow-sm bg-slate-900 font-black px-6 text-[13px]">
              New Submission
            </Button>
           </Link>
        </div>
      </div>

      <Card className="border-slate-200/60 overflow-hidden shadow-sm bg-white rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Identification</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Timeline</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Assigned Expert</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Allocation</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-4">
                      <div className="size-8 border-[3px] border-slate-900 border-t-transparent rounded-full animate-spin" />
                      <p className="text-[11px] font-black uppercase tracking-widest">Retrieving Records...</p>
                    </div>
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-4">
                      <AlertCircle className="size-10 text-slate-200" />
                      <div className="space-y-1">
                        <p className="text-[11px] font-black uppercase tracking-widest">No Records Found</p>
                        <Link href="/customer/create-task" className="text-indigo-600 hover:underline text-sm font-bold">Initiate New Project</Link>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : tasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-8">
                    <div className="space-y-1.5">
                      <p className="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{task.title}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {task.id.toString().padStart(6, '0')}</p>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-2.5 text-[11px] font-black text-slate-500 uppercase tracking-wide">
                      <Clock className="size-3.5 text-slate-300" />
                      {format(new Date(task.deadline), "dd MMM yyyy")}
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 border border-slate-200 shadow-sm">
                        {task.writer ? task.writer.first_name[0] : "!"}
                      </div>
                      <span className="text-[12px] font-bold text-slate-700">
                        {task.writer ? `${task.writer.first_name} ${task.writer.last_name}` : "Unallocated"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <span className="text-[13px] font-black text-slate-900">
                      {task.task_status === "OPEN" ? (
                        <span className="text-violet-600 italic">Bidding...</span>
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
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing 1 to {tasks.length} of {tasks.length} entries</p>
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
