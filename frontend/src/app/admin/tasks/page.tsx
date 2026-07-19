"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Loader2, ClipboardList, ChevronRight } from "lucide-react";
import { adminService } from "@/services/admin.service";

const FILTERS = ["Confirmed", "ASSIGNED", "IN_PROGRESS", "SUBMITTED", "REVISION_REQUESTED", "COMPLETED", "ALL"];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    COMPLETED:         "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200",
    IN_PROGRESS:       "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200",
    ASSIGNED:          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200",
    SUBMITTED:         "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200",
    REVISION_REQUESTED:"inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200",
    OPEN:              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200",
    PENDING_PAYMENT:   "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200",
    PENDING_ASSIGNMENT:"inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200",
    CANCELLED:         "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200",
  };
  return <span className={map[status] || map.CANCELLED}>{status.replace(/_/g, " ")}</span>;
}

export default function AdminTasksPage() {
  const [tasks, setTasks]     = useState<any[]>([]);
  const [filter, setFilter]   = useState("Confirmed");
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState(true);

  const load = (f: string) => {
    setLoading(true);
    const statusParam = f === "Confirmed" ? undefined : f;
    adminService.getAllTasks(statusParam)
      .then(r => setTasks(r.results || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(filter); }, [filter]);

  const filtered = search
    ? tasks.filter(t => {
        const term = search.trim().replace(/^#/, "").toLowerCase();
        if (t.id.toString().includes(term) || t.id.toString().padStart(6, "0").includes(term)) return true;
        return [t.title, t.customer_name, t.writer_name].some(v =>
          v?.toLowerCase().includes(search.toLowerCase())
        );
      })
    : tasks;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Tasks</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{tasks.length} tasks matching this filter</p>
      </div>

      <div className="bg-white border border-border rounded-xl p-3 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by task ID, title, client, or writer…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors placeholder:text-muted-foreground/50" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${filter === f ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {f === "Confirmed" || f === "ALL" ? f : f.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2">
            <Loader2 className="size-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Loading tasks…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="size-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No tasks found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Task</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Client</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Writer</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Budget</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Uploaded</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Deadline</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t: any) => (
                  <tr key={t.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-foreground truncate max-w-[220px]">
                      <Link href={`/admin/tasks/${t.id}`} className="hover:text-primary transition-colors">{t.title}</Link>
                      <p className="text-xs font-normal text-muted-foreground">#{t.id.toString().padStart(6,"0")}</p>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={t.task_status} /></td>
                    <td className="px-5 py-3.5 text-muted-foreground">{t.customer_name}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{t.writer_name || "Unassigned"}</td>
                    <td className="px-5 py-3.5 font-medium">{t.budget != null ? `$${t.budget.toFixed(2)}` : "—"}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{t.created_at ? new Date(t.created_at).toLocaleDateString() : "—"}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{t.deadline ? new Date(t.deadline).toLocaleDateString() : "—"}</td>
                    <td className="px-5 py-3.5 text-right">
                      <Link href={`/admin/tasks/${t.id}`}>
                        <ChevronRight className="size-4 text-muted-foreground/30 hover:text-primary transition-colors" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground">Showing {filtered.length} of {tasks.length}</p>
        </div>
      </div>
    </div>
  );
}
