"use client";

import React from "react";
import { 
  Clock, 
  MessageSquare, 
  Upload, 
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  ChevronRight,
  Info,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { taskService } from "@/services/task.service";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { format } from "date-fns";
import { CountdownTimer } from "@/components/tasks/CountdownTimer";
import { Badge } from "@/components/ui";

export default function ActiveTasks() {
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchActiveTasks = async () => {
      try {
        const response = await taskService.getWriterTasks();
        setTasks(response.results || []);
      } catch (error) {
        console.error("Failed to fetch active tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveTasks();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1a1033]">Active Work</h1>
          <p className="text-sm text-[#9490a8] mt-1">Manage ongoing tasks, collaborate with clients, and submit your work.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="size-8 border-[3px] border-[#7C5CFC] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-[#9490a8] uppercase tracking-widest">Retrieving assignments...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="border-2 border-dashed border-border/50 rounded-3xl flex flex-col items-center justify-center p-20 text-center bg-white/50">
           <div className="h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center mb-6 text-[#7C5CFC]">
              <AlertCircle className="size-8" />
           </div>
           <h3 className="text-lg font-bold text-[#1a1033]">No active tasks found</h3>
           <p className="text-sm text-[#9490a8] mt-1 mb-8 max-w-sm mx-auto">Browse available projects in the marketplace and submit your best bids to start earning.</p>
           <Link href="/writer/tasks/available">
              <Button className="rounded-xl bg-[#7C5CFC] hover:bg-[#6d4ef0] font-bold h-11 px-8 gap-2 shadow-lg shadow-violet-400/20 transition-all">
                Go to Marketplace <ChevronRight className="size-4" />
              </Button>
           </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          {tasks.filter(t => t.task_status !== 'COMPLETED' && t.task_status !== 'CANCELLED').map((task) => (
            <Card key={task.id} className="border-border/50 shadow-sm hover:shadow-xl hover:shadow-violet-400/5 transition-all bg-white rounded-2xl overflow-hidden group">
              <CardHeader className="border-b border-border/50 p-6 flex flex-row items-center justify-between bg-violet-50/30">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                    task.task_status === "IN_PROGRESS" || task.task_status === "ASSIGNED" 
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                      : "bg-orange-100 text-orange-700 border-orange-200"
                  )}>
                    {task.task_status.replace('_', ' ')}
                  </span>
                </div>
                <button className="text-[#9490a8] hover:text-[#1a1033] transition-colors">
                  <MoreVertical className="size-5" />
                </button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6 space-y-6">
                  <Link href={`/writer/tasks/${task.id}`}>
                    <h3 className="text-xl font-bold leading-tight text-[#1a1033] hover:text-[#7C5CFC] transition-colors cursor-pointer">
                      {task.title}
                    </h3>
                  </Link>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#9490a8] font-medium italic">Project Status</span>
                      <span className="font-bold text-[#1a1033]">{task.payment_status === "PAID" ? "100% Paid" : "Escrowed"}</span>
                    </div>
                    <Progress value={task.task_status === "SUBMITTED" ? 100 : 45} className="h-2 bg-violet-50 transition-all" />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-9 w-9 rounded-xl bg-violet-100 flex items-center justify-center text-[#7C5CFC] font-bold text-xs border border-violet-200 shadow-sm">
                        {task.customer?.first_name?.[0] || "C"}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1a1033] text-xs">{task.customer?.first_name} {task.customer?.last_name}</span>
                        <span className="text-[10px] text-[#9490a8] font-bold uppercase">Client</span>
                      </div>
                    </div>
                    <CountdownTimer deadline={task.deadline} />
                  </div>
                </div>

                {/* Action Footer */}
                <div className="bg-muted/10 border-t border-border/50 p-4 grid grid-cols-2 gap-4">
                  <Link href="/writer/messages" className="w-full">
                    <Button variant="outline" className="h-11 w-full rounded-xl bg-white hover:bg-violet-50 text-[#6b6880] hover:text-[#7C5CFC] font-bold transition-all flex items-center gap-2 border-border/50">
                       <MessageSquare className="size-4" /> Message
                    </Button>
                  </Link>
                  <Link href={`/writer/tasks/${task.id}`} className="w-full">
                    <Button className="h-11 w-full rounded-xl bg-[#7C5CFC] shadow-lg shadow-violet-400/20 font-bold hover:bg-[#6d4ef0] transition-all flex items-center gap-2 text-white">
                       <Upload className="size-4" /> View & Submit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* More Work Card */}
          <Link href="/writer/tasks/available" className="border-2 border-dashed border-border/50 rounded-2xl flex flex-col items-center justify-center p-12 text-center text-[#9490a8] hover:bg-violet-50/50 hover:border-[#7C5CFC]/30 transition-all cursor-pointer group bg-white/40">
             <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-border/50">
                <Zap className="size-6 text-[#7C5CFC] fill-[#7C5CFC]/10" />
             </div>
             <p className="font-bold text-[#1a1033]">Need more work?</p>
             <p className="text-[11px] max-w-[200px] mt-1">Browse available tasks and increase your earnings today.</p>
             <div className="mt-4 text-[#7C5CFC] font-bold text-xs flex items-center gap-2">Go to Marketplace <ArrowRight className="size-3.5" /></div>
          </Link>
        </div>
      )}
    </div>
  );
}
