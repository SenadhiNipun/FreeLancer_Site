"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Loader2, PenSquare, ChevronRight } from "lucide-react";
import { adminService } from "@/services/admin.service";

const FILTERS = ["All", "APPROVED", "PENDING_APPROVAL", "REJECTED", "INCOMPLETE"];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    APPROVED:         "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200",
    PENDING_APPROVAL: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200",
    REJECTED:         "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200",
    SUSPENDED:        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200",
    INCOMPLETE:       "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200",
    ACTIVE:           "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200",
  };
  return <span className={map[status] || map.INCOMPLETE}>{status.replace(/_/g, " ")}</span>;
}

export default function AdminWritersPage() {
  const [writers, setWriters]           = useState<any[]>([]);
  const [filter, setFilter]             = useState("All");
  const [search, setSearch]             = useState("");
  const [loading, setLoading]           = useState(true);
  const [actioning, setActioning]       = useState<number | null>(null);

  useEffect(() => {
    adminService.getAllWriters()
      .then(r => setWriters(r.results || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = writers.filter(w => {
    const ps = w.writer_profile?.profile_status || "INCOMPLETE";
    if (filter !== "All" && ps !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return `${w.first_name} ${w.last_name}`.toLowerCase().includes(q) || w.email.toLowerCase().includes(q);
    }
    return true;
  });

  const approve = async (id: number) => {
    setActioning(id);
    await adminService.approveWriter(id).finally(() => setActioning(null));
    setWriters(p => p.map(w => w.id === id ? { ...w, writer_profile: { ...w.writer_profile, profile_status: "APPROVED" } } : w));
  };

  const reject = async (id: number) => {
    setActioning(id);
    await adminService.rejectWriter(id).finally(() => setActioning(null));
    setWriters(p => p.map(w => w.id === id ? { ...w, writer_profile: { ...w.writer_profile, profile_status: "REJECTED" } } : w));
  };

  const toggleSuspend = async (id: number, status: string) => {
    setActioning(id);
    try {
      if (status === "SUSPENDED") await adminService.activateUser(id);
      else await adminService.suspendUser(id);
      setWriters(p => p.map(w => w.id === id ? { ...w, status: status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED" } : w));
    } finally { setActioning(null); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Writers</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{writers.length} registered writers</p>
      </div>

      <div className="bg-white border border-border rounded-xl p-3 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors placeholder:text-muted-foreground/50" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {f === "All" ? "All" : f.replace(/_/g," ")}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2">
            <Loader2 className="size-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Loading writers…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <PenSquare className="size-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No writers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Writer</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Profile</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Account</th>
                  <th className="px-5 py-3 text-center text-xs font-medium text-muted-foreground">Tasks</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Joined</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((w: any) => {
                  const ps = w.writer_profile?.profile_status || "INCOMPLETE";
                  const isPending   = ps === "PENDING_APPROVAL";
                  const isSuspended = w.status === "SUSPENDED";
                  return (
                    <tr key={w.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                            {(w.first_name?.[0] || "") + (w.last_name?.[0] || "")}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{w.first_name} {w.last_name}</p>
                            <p className="text-xs text-muted-foreground">{w.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={ps} /></td>
                      <td className="px-5 py-4"><StatusBadge status={w.status} /></td>
                      <td className="px-5 py-4 text-center font-medium">{w.task_count}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {w.created_at ? new Date(w.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          {isPending && (
                            <>
                              <button disabled={actioning === w.id} onClick={() => approve(w.id)}
                                className="px-2.5 py-1 rounded-md text-xs font-medium text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 transition-colors disabled:opacity-40">
                                Approve
                              </button>
                              <button disabled={actioning === w.id} onClick={() => reject(w.id)}
                                className="px-2.5 py-1 rounded-md text-xs font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-40">
                                Reject
                              </button>
                            </>
                          )}
                          <button disabled={actioning === w.id} onClick={() => toggleSuspend(w.id, w.status)}
                            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors disabled:opacity-40 ${isSuspended ? "text-green-700 bg-green-50 border-green-200 hover:bg-green-100" : "text-red-600 bg-red-50 border-red-200 hover:bg-red-100"}`}>
                            {isSuspended ? "Activate" : "Suspend"}
                          </button>
                          <Link href={`/admin/writers/${w.id}`}>
                            <button className="size-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">
                              <ChevronRight className="size-3.5" />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
