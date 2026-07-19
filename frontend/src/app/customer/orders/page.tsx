"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Search, Plus, MoreHorizontal, ChevronDown } from "lucide-react";
import { taskService } from "@/services/task.service";
import { getFileUrl } from "@/lib/api-client";
import { format } from "date-fns";

const STATUS_OPTIONS = ["All", "OPEN", "IN_PROGRESS", "SUBMITTED", "REVISION_REQUESTED", "COMPLETED", "CANCELLED"];

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { cls: string; label: string }> = {
    OPEN:                { cls: "status-open",        label: "Bidding"     },
    PENDING_PAYMENT:     { cls: "status-open",        label: "Payment Due" },
    PENDING_ASSIGNMENT:  { cls: "status-open",        label: "Assigning"   },
    ASSIGNED:            { cls: "status-in-progress", label: "In Progress" },
    IN_PROGRESS:         { cls: "status-in-progress", label: "In Progress" },
    SUBMITTED:           { cls: "status-submitted",   label: "Submitted"   },
    REVISION_REQUESTED:  { cls: "status-revision",    label: "Revision"    },
    COMPLETED:           { cls: "status-completed",   label: "Completed"   },
    CANCELLED:           { cls: "status-cancelled",   label: "Cancelled"   },
  };
  const { cls, label } = cfg[status] || { cls: "status-cancelled", label: status };
  return <span className={cls}>{label}</span>;
}

export default function MyOrders() {
  const [tasks, setTasks]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("All");

  useEffect(() => {
    taskService.getCustomerTasks()
      .then(r => setTasks(r.results || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const displayed = useMemo(() => {
    let list = tasks;
    if (filter !== "All") list = list.filter(t => t.task_status === filter || (filter === "IN_PROGRESS" && ["ASSIGNED","IN_PROGRESS"].includes(t.task_status)));
    if (search) list = list.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [tasks, filter, search]);

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{tasks.length} total projects</p>
        </div>
        <Link href="/customer/create-task">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="size-4" />
            New Task
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-border rounded-xl p-3 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors placeholder:text-muted-foreground/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "OPEN", "IN_PROGRESS", "SUBMITTED", "COMPLETED"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === s ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}>
              {s === "IN_PROGRESS" ? "In Progress" : s === "All" ? "All" : s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g," ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-5 py-3.5 text-left text-xs font-medium text-muted-foreground">Project</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-muted-foreground">Deadline</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-muted-foreground">Writer</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-muted-foreground">Budget</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium text-muted-foreground">Status</th>
                <th className="px-5 py-3.5 text-right text-xs font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Loading projects…
                    </div>
                  </td>
                </tr>
              ) : displayed.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    {search || filter !== "All" ? "No projects match your filters." : (
                      <>No projects yet. <Link href="/customer/create-task" className="text-primary hover:underline">Create your first task.</Link></>
                    )}
                  </td>
                </tr>
              ) : displayed.map((task) => (
                <tr key={task.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <Link href={`/customer/orders/${task.id}`} className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
                      {task.title}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">#{task.id.toString().padStart(4,"0")}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-foreground whitespace-nowrap">
                    {format(new Date(task.deadline), "dd MMM yyyy")}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full bg-violet-100 text-violet-700 text-xs font-medium flex items-center justify-center overflow-hidden flex-shrink-0">
                        {task.writer?.profile_image_url ? (
                          <img src={getFileUrl(task.writer.profile_image_url)} alt="" className="w-full h-full object-cover" />
                        ) : task.writer?.first_name?.[0] || "—"}
                      </div>
                      <span className="text-sm text-foreground">
                        {task.writer ? `${task.writer.first_name || ""} ${task.writer.last_name || ""}`.trim() || task.writer.email?.split("@")[0] : "Unassigned"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-medium text-foreground">
                    {task.task_status === "OPEN" ? <span className="text-muted-foreground italic text-xs">Pending bids</span> : `$${parseFloat(task.budget || 0).toFixed(2)}`}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={task.task_status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/customer/orders/${task.id}`}>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-primary bg-violet-50 border border-violet-200 hover:bg-violet-100 transition-colors">
                        View
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-border bg-muted/20 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Showing {displayed.length} of {tasks.length} projects</p>
        </div>
      </div>
    </div>
  );
}
