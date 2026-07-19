"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock, Briefcase, Zap, ArrowRight, MessageSquare, Upload,
  User, FileText, AlertCircle, CheckCircle2, RotateCcw, CreditCard, Search,
} from "lucide-react";
import { taskService } from "@/services/task.service";
import { formatDistanceToNow, differenceInHours } from "date-fns";
import { cn } from "@/lib/utils";

const STATUS_CFG: Record<string, { label: string; cls: string; icon: any; dot: string }> = {
  ASSIGNED:           { label: "In Progress",     cls: "bg-blue-50 text-blue-700 border-blue-200",     icon: Briefcase,   dot: "bg-blue-500"   },
  IN_PROGRESS:        { label: "In Progress",     cls: "bg-blue-50 text-blue-700 border-blue-200",     icon: Briefcase,   dot: "bg-blue-500"   },
  SUBMITTED:          { label: "Submitted",       cls: "bg-green-50 text-green-700 border-green-200",  icon: CheckCircle2,dot: "bg-green-500"  },
  REVISION_REQUESTED: { label: "Needs Revision",  cls: "bg-orange-50 text-orange-700 border-orange-200",icon: RotateCcw,  dot: "bg-orange-500" },
  PENDING_PAYMENT:    { label: "Pending Payment", cls: "bg-amber-50 text-amber-700 border-amber-200",  icon: CreditCard,  dot: "bg-amber-500"  },
  PENDING_ASSIGNMENT: { label: "Assigning",       cls: "bg-slate-50 text-slate-600 border-slate-200",  icon: AlertCircle, dot: "bg-slate-400"  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CFG[status] || { label: status.replace(/_/g," "), cls: "bg-slate-50 text-slate-600 border-slate-200", icon: AlertCircle, dot: "bg-slate-400" };
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", cfg.cls)}>
      <Icon className="size-3" strokeWidth={2} />
      {cfg.label}
    </span>
  );
}

function DeadlineTag({ deadline }: { deadline: string }) {
  const hoursLeft = differenceInHours(new Date(deadline), new Date());
  const isOverdue  = hoursLeft <= 0;
  const isUrgent   = hoursLeft > 0 && hoursLeft <= 24;
  const isWarning  = hoursLeft > 24 && hoursLeft <= 72;

  return (
    <span className={cn(
      "inline-flex items-center gap-1 text-xs font-medium",
      isOverdue ? "text-red-600" : isUrgent ? "text-orange-600" : isWarning ? "text-amber-600" : "text-muted-foreground"
    )}>
      <Clock className={cn("size-3", isOverdue && "animate-pulse")} />
      {isOverdue ? "Overdue" : formatDistanceToNow(new Date(deadline), { addSuffix: true })}
    </span>
  );
}

export default function ActiveTasks() {
  const [tasks, setTasks]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    taskService.getWriterTasks()
      .then(r => setTasks(r.results || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const active = tasks.filter(t => !["COMPLETED", "CANCELLED"].includes(t.task_status));

  // Group by urgency for sorting
  const sorted = [...active].sort((a, b) => {
    const hoursA = differenceInHours(new Date(a.deadline), new Date());
    const hoursB = differenceInHours(new Date(b.deadline), new Date());
    return hoursA - hoursB;
  });

  const displayed = sorted.filter(t => {
    if (!search) return true;
    const term = search.trim().replace(/^#/, "").toLowerCase();
    return (
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toString().includes(term) ||
      t.id.toString().padStart(6, "0").includes(term)
    );
  });

  const counts = {
    inProgress: active.filter(t => ["ASSIGNED","IN_PROGRESS"].includes(t.task_status)).length,
    submitted:  active.filter(t => t.task_status === "SUBMITTED").length,
    revision:   active.filter(t => t.task_status === "REVISION_REQUESTED").length,
    payment:    active.filter(t => t.task_status === "PENDING_PAYMENT").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] gap-3">
        <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground">Loading tasks…</span>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Active Work</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {active.length} task{active.length !== 1 ? "s" : ""} in progress
          </p>
        </div>
        <Link href="/writer/tasks/available">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
            <Zap className="size-4" /> Browse More Tasks
          </button>
        </Link>
      </div>

      {/* Status summary strip */}
      {active.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "In Progress", count: counts.inProgress, color: "border-l-blue-500",   bg: "bg-blue-50"   },
            { label: "Submitted",   count: counts.submitted,  color: "border-l-green-500",  bg: "bg-green-50"  },
            { label: "Revision",    count: counts.revision,   color: "border-l-orange-500", bg: "bg-orange-50" },
            { label: "Payment Due", count: counts.payment,    color: "border-l-amber-500",  bg: "bg-amber-50"  },
          ].map(({ label, count, color, bg }) => (
            <div key={label} className={cn("bg-white border border-border rounded-xl p-3 border-l-4 flex items-center gap-3", color)}>
              <div className={cn("size-8 rounded-lg flex items-center justify-center flex-shrink-0", bg)}>
                <span className="text-sm font-bold text-foreground">{count}</span>
              </div>
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      {active.length > 0 && (
        <div className="bg-white border border-border rounded-xl p-3">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by task ID or title…"
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors placeholder:text-muted-foreground/50" />
          </div>
        </div>
      )}

      {/* Tasks grid */}
      {active.length === 0 ? (
        <div className="bg-white border border-dashed border-border rounded-xl flex flex-col items-center justify-center py-20 text-center">
          <div className="size-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <Briefcase className="size-6 text-muted-foreground/50" strokeWidth={1.5} />
          </div>
          <h3 className="font-semibold text-foreground">No active tasks</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-xs">
            Browse available projects and place bids to start earning.
          </p>
          <Link href="/writer/tasks/available">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
              <Zap className="size-4" /> Browse Tasks <ArrowRight className="size-3.5" />
            </button>
          </Link>
        </div>
      ) : displayed.length === 0 ? (
        <div className="bg-white border border-dashed border-border rounded-xl flex flex-col items-center justify-center py-16 text-center">
          <Search className="size-10 text-muted-foreground/30 mb-3" />
          <p className="font-medium text-foreground">No matching tasks</p>
          <p className="text-sm text-muted-foreground mt-1">Try a different task ID or title.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {displayed.map((task) => {
            const hoursLeft  = differenceInHours(new Date(task.deadline), new Date());
            const isOverdue  = hoursLeft <= 0;
            const isUrgent   = hoursLeft > 0 && hoursLeft <= 24;
            const cfg        = STATUS_CFG[task.task_status];

            return (
              <div key={task.id}
                className={cn(
                  "bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow",
                  isOverdue ? "border-red-200" : isUrgent ? "border-orange-200" : "border-border"
                )}>
                {/* Card header */}
                <div className={cn(
                  "flex items-center justify-between px-5 py-3 border-b",
                  isOverdue ? "bg-red-50 border-red-100" : isUrgent ? "bg-orange-50 border-orange-100" : "bg-muted/20 border-border/60"
                )}>
                  <StatusBadge status={task.task_status} />
                  <span className="text-sm font-semibold text-foreground">
                    ${parseFloat(task.budget || 0).toFixed(2)}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <Link href={`/writer/tasks/${task.id}`}>
                    <h3 className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer leading-snug">
                      {task.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground mb-3">#{task.id.toString().padStart(6,"0")}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                    <DeadlineTag deadline={task.deadline} />

                    {task.customer && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <User className="size-3" />
                        {task.customer.first_name} {task.customer.last_name}
                      </span>
                    )}

                    {task.files?.length > 0 && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <FileText className="size-3" />
                        {task.files.length} file{task.files.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {/* Urgency bar */}
                  {(isOverdue || isUrgent) && (
                    <div className={cn(
                      "mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium",
                      isOverdue ? "bg-red-50 border border-red-200 text-red-700" : "bg-orange-50 border border-orange-200 text-orange-700"
                    )}>
                      <AlertCircle className="size-3.5 flex-shrink-0" />
                      {isOverdue ? "This task is overdue — please submit or contact your client." : `Deadline in less than 24 hours!`}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2.5 mt-4">
                    <Link href="/writer/messages" className="flex-1">
                      <button className="w-full flex items-center justify-center gap-1.5 h-9 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
                        <MessageSquare className="size-3.5" /> Message
                      </button>
                    </Link>
                    <Link href={`/writer/tasks/${task.id}`} className="flex-[2]">
                      <button className={cn(
                        "w-full flex items-center justify-center gap-1.5 h-9 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90",
                        task.task_status === "REVISION_REQUESTED" ? "bg-orange-500" : "bg-primary"
                      )}>
                        <Upload className="size-3.5" />
                        {task.task_status === "SUBMITTED" ? "View Submission" :
                         task.task_status === "REVISION_REQUESTED" ? "Address Revision" :
                         "View & Submit"}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Discover more card */}
          <Link href="/writer/tasks/available">
            <div className="border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center py-14 text-center hover:border-primary/30 hover:bg-violet-50/20 transition-colors cursor-pointer group">
              <div className="size-12 rounded-xl bg-white border border-border shadow-sm flex items-center justify-center mb-3 group-hover:border-primary/30 transition-colors">
                <Zap className="size-5 text-primary" strokeWidth={1.75} />
              </div>
              <p className="font-medium text-foreground">Need more work?</p>
              <p className="text-sm text-muted-foreground mt-1">Browse available tasks in the marketplace.</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Browse marketplace <ArrowRight className="size-3.5" />
              </span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
