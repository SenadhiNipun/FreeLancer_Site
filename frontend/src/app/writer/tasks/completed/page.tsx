"use client";

import React from "react";
import { 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  ChevronRight,
  Star,
  Award,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { taskService } from "@/services/task.service";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { format } from "date-fns";

export default function CompletedTasks() {
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const response = await taskService.getWriterTasks();
        setTasks(response.results || []);
      } catch (error) {
        console.error("Failed to fetch completed tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletedTasks();
  }, []);

  React.useEffect(() => {
    if (!isLoading && typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;
      const element = document.getElementById(hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add("ring-4", "ring-amber-400/55", "scale-[1.02]", "shadow-2xl");
          setTimeout(() => {
            element.classList.remove("ring-4", "ring-amber-400/55", "scale-[1.02]", "shadow-2xl");
          }, 3500);
        }, 300);
      }
    }
  }, [isLoading]);

  const completedTasks = tasks.filter(t => t.task_status === 'COMPLETED');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1a1033]">Completed Work</h1>
        <p className="text-sm text-[#9490a8] mt-1">Your portfolio of successfully finished projects, released payments, and client feedback.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="size-8 border-[3px] border-[#7C5CFC] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-[#9490a8] uppercase tracking-widest">Retrieving history...</p>
        </div>
      ) : completedTasks.length === 0 ? (
        <div className="border-2 border-dashed border-border/50 rounded-3xl flex flex-col items-center justify-center p-20 text-center bg-white/50">
           <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6 text-emerald-600">
              <CheckCircle2 className="size-8" />
           </div>
           <h3 className="text-lg font-bold text-[#1a1033]">No completed tasks yet</h3>
           <p className="text-sm text-[#9490a8] mt-1 mb-8 max-w-sm mx-auto">Complete your active projects to release milestone payments and build up your expert profile.</p>
           <Link href="/writer/tasks/active">
              <Button className="rounded-xl bg-[#7C5CFC] hover:bg-[#6d4ef0] font-bold h-11 px-8 gap-2 shadow-lg shadow-violet-400/20 transition-all">
                View Active Projects <ChevronRight className="size-4" />
              </Button>
           </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          {completedTasks.map((task) => (
            <Card id={`task-${task.id}`} key={task.id} className="border-border/50 shadow-sm hover:shadow-xl hover:shadow-emerald-400/5 transition-all bg-white rounded-2xl overflow-hidden group">
              <CardHeader className="border-b border-border/50 p-6 flex flex-row items-center justify-between bg-emerald-50/20">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="size-3" /> Completed
                </span>
                <span className="text-xs text-[#9490a8] font-bold">
                  Budget: ${parseFloat(task.budget || 0).toFixed(2)}
                </span>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Link href={`/writer/tasks/${task.id}`}>
                    <h3 className="text-xl font-bold leading-tight text-[#1a1033] hover:text-[#7C5CFC] transition-colors cursor-pointer">
                      {task.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#9490a8] flex items-center gap-1">
                    Completed on: {format(new Date(task.updated_at), "dd MMM yyyy")}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-9 w-9 rounded-xl bg-violet-100 flex items-center justify-center text-[#7C5CFC] font-bold text-xs border border-violet-200 shadow-sm">
                      {task.customer?.first_name?.[0] || "C"}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1a1033] text-xs">{task.customer?.first_name} {task.customer?.last_name}</span>
                      <span className="text-[10px] text-[#9490a8] font-bold uppercase">Client</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    Payout Released
                  </span>
                </div>

                {/* Client Review Testimonial card if it exists */}
                {task.review ? (
                  <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-4 space-y-2 relative overflow-hidden animate-in fade-in duration-500">
                    <div className="absolute right-3 top-3 opacity-[0.05] text-[#7C5CFC]">
                      <Award className="size-16" />
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={cn(
                            "size-3.5",
                            i < task.review.rating 
                              ? "text-amber-500 fill-amber-500" 
                              : "text-muted-foreground/20"
                          )} 
                        />
                      ))}
                      <span className="text-[10px] font-black text-amber-600 ml-1.5 uppercase tracking-wider">Verified Rating</span>
                    </div>
                    <p className="text-xs text-[#524f66] italic font-medium leading-relaxed">
                      "{task.review.feedback}"
                    </p>
                  </div>
                ) : (
                  <div className="bg-muted/10 border border-border/50 rounded-2xl p-4 flex items-center gap-2 text-xs text-[#9490a8]">
                    <Info className="size-4 text-violet-400 flex-shrink-0" />
                    <span>Customer rating and review pending for this project.</span>
                  </div>
                )}

                <div className="pt-2">
                  <Link href={`/writer/tasks/${task.id}`} className="w-full">
                    <Button className="h-10 w-full rounded-xl bg-[#7C5CFC] shadow-lg shadow-violet-400/20 font-bold hover:bg-[#6d4ef0] transition-all flex items-center justify-center gap-2 text-white text-xs">
                      View Project Details <ChevronRight className="size-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
