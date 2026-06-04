"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Star, ChevronRight, Briefcase } from "lucide-react";
import { taskService } from "@/services/task.service";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function CompletedTasks() {
  const [tasks, setTasks]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taskService.getWriterTasks()
      .then(r => setTasks(r.results || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const completed = tasks.filter(t => t.task_status === "COMPLETED");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] gap-3">
        <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground">Loading…</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Completed Work</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{completed.length} successfully finished project{completed.length !== 1 ? "s" : ""}</p>
      </div>

      {completed.length === 0 ? (
        <div className="bg-white border border-dashed border-border rounded-xl flex flex-col items-center justify-center py-16 text-center">
          <CheckCircle2 className="size-10 text-green-500/50 mb-3" />
          <p className="font-medium text-foreground">No completed tasks yet</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Complete your active projects to build your portfolio.</p>
          <Link href="/writer/tasks/active">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
              <Briefcase className="size-4" /> View Active Tasks
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {completed.map((task) => (
            <div key={task.id} className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-green-50/50">
                <span className="status-completed">Completed</span>
                <span className="text-sm font-semibold text-foreground">${parseFloat(task.budget || 0).toFixed(2)}</span>
              </div>

              <div className="p-5 space-y-3">
                <Link href={`/writer/tasks/${task.id}`}>
                  <h3 className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer line-clamp-2">
                    {task.title}
                  </h3>
                </Link>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Completed {format(new Date(task.updated_at), "dd MMM yyyy")}</span>
                  {task.customer && <span>Client: {task.customer.first_name} {task.customer.last_name}</span>}
                </div>

                {task.review ? (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={cn("size-3.5", s <= task.review.rating ? "text-amber-500 fill-amber-500" : "text-slate-200")} />
                      ))}
                    </div>
                    {task.review.feedback && (
                      <p className="text-xs text-amber-800 italic line-clamp-2">"{task.review.feedback}"</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No review submitted yet.</p>
                )}

                <Link href={`/writer/tasks/${task.id}`}>
                  <button className="w-full flex items-center justify-center gap-1.5 h-9 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
                    View Details <ChevronRight className="size-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
