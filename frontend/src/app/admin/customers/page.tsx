"use client";

import React, { useEffect, useState } from "react";
import { Search, Loader2, Users } from "lucide-react";
import { adminService } from "@/services/admin.service";

const FILTERS = ["All", "ACTIVE", "SUSPENDED", "PENDING"];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE:    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200",
    SUSPENDED: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200",
    PENDING:   "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200",
  };
  return <span className={map[status] || map.PENDING}>{status}</span>;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers]   = useState<any[]>([]);
  const [filter, setFilter]         = useState("All");
  const [search, setSearch]         = useState("");
  const [loading, setLoading]       = useState(true);
  const [actioning, setActioning]   = useState<number | null>(null);

  useEffect(() => {
    adminService.getAllCustomers()
      .then(r => setCustomers(r.results || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c => {
    if (filter !== "All" && c.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleSuspend = async (id: number, status: string) => {
    setActioning(id);
    try {
      if (status === "SUSPENDED") await adminService.activateUser(id);
      else await adminService.suspendUser(id);
      setCustomers(p => p.map(c => c.id === id ? { ...c, status: status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED" } : c));
    } finally { setActioning(null); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Customers</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{customers.length} registered customers</p>
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
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2">
            <Loader2 className="size-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Loading customers…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="size-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No customers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Customer</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-center text-xs font-medium text-muted-foreground">Tasks</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Joined</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c: any) => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                          {(c.first_name?.[0] || "") + (c.last_name?.[0] || "")}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{c.first_name} {c.last_name}</p>
                          <p className="text-xs text-muted-foreground">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-4 text-center font-medium">{c.task_count}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button disabled={actioning === c.id} onClick={() => toggleSuspend(c.id, c.status)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors disabled:opacity-40 ${c.status === "SUSPENDED" ? "text-green-700 bg-green-50 border-green-200 hover:bg-green-100" : "text-red-600 bg-red-50 border-red-200 hover:bg-red-100"}`}>
                        {c.status === "SUSPENDED" ? "Activate" : "Suspend"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground">Showing {filtered.length} of {customers.length}</p>
        </div>
      </div>
    </div>
  );
}
