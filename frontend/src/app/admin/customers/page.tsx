"use client";

import React, { useEffect, useState } from "react";
import { Search, Users, Loader2 } from "lucide-react";
import { adminService } from "@/services/admin.service";

function Badge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    ACTIVE:           { bg: "oklch(0.65 0.18 145 / 0.12)", color: "oklch(0.45 0.2 145)" },
    SUSPENDED:        { bg: "oklch(0.58 0.22 25 / 0.12)",  color: "oklch(0.48 0.22 25)" },
    PENDING:          { bg: "oklch(0.78 0.16 70 / 0.12)",  color: "oklch(0.58 0.18 70)" },
  };
  const s = map[status] || { bg: "oklch(0.88 0.018 260 / 0.4)", color: "oklch(0.5 0.05 260)" };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}25` }}
    >
      <span className="size-1.5 rounded-full" style={{ background: s.color }} />
      {status.replace(/_/g, " ")}
    </span>
  );
}

const STATUS_FILTERS = ["ALL", "ACTIVE", "SUSPENDED", "PENDING"];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [actionPending, setActionPending] = useState<number | null>(null);

  useEffect(() => {
    adminService
      .getAllCustomers()
      .then((res) => {
        setCustomers(res.results || []);
        setFiltered(res.results || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let list = customers;
    if (statusFilter !== "ALL") {
      list = list.filter((c) => c.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [customers, search, statusFilter]);

  const handleSuspend = async (id: number, currentStatus: string) => {
    setActionPending(id);
    try {
      if (currentStatus === "SUSPENDED") {
        await adminService.activateUser(id);
        setCustomers((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: "ACTIVE" } : c))
        );
      } else {
        await adminService.suspendUser(id);
        setCustomers((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: "SUSPENDED" } : c))
        );
      }
    } finally {
      setActionPending(null);
    }
  };

  return (
    <div className="space-y-7 pb-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-black text-foreground tracking-tight flex items-center gap-3">
            <Users className="size-6 text-indigo-500" />
            Customers
          </h1>
          <p className="text-[13px] text-muted-foreground font-medium mt-1">
            {customers.length} registered customers on the platform
          </p>
        </div>
      </div>

      {/* Filters */}
      <div
        className="rounded-2xl p-4 flex flex-col sm:flex-row gap-3"
        style={{
          background: "oklch(1 0 0 / 0.9)",
          border: "1px solid oklch(0.88 0.018 260 / 0.5)",
        }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full h-10 pl-9 pr-4 rounded-xl text-[13px] font-medium outline-none"
            style={{
              background: "oklch(0 0 0 / 0.04)",
              border: "1px solid oklch(0.88 0.018 260 / 0.5)",
            }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className="px-3 py-2 rounded-xl text-[11px] font-bold transition-all duration-200"
              style={
                statusFilter === f
                  ? {
                      background: "linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1))",
                      border: "1px solid rgba(99,102,241,0.3)",
                      color: "#6366f1",
                    }
                  : {
                      background: "oklch(0 0 0 / 0.03)",
                      border: "1px solid oklch(0.88 0.018 260 / 0.5)",
                      color: "oklch(0.5 0.05 260)",
                    }
              }
            >
              {f.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "oklch(1 0 0 / 0.9)",
          border: "1px solid oklch(0.88 0.018 260 / 0.5)",
          boxShadow: "0 2px 8px oklch(0 0 0 / 0.04)",
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-indigo-500" />
            <span className="text-[13px] font-semibold">Loading customers…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/40">
            <Users className="size-10 mb-3" />
            <p className="text-[14px] font-semibold">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr
                  className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.12em]"
                  style={{ borderBottom: "1px solid oklch(0.88 0.018 260 / 0.4)" }}
                >
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-center">Tasks</th>
                  <th className="px-5 py-3.5">Joined</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c: any) => {
                  const isSuspended = c.status === "SUSPENDED";
                  return (
                    <tr
                      key={c.id}
                      className="group transition-colors"
                      style={{ borderBottom: "1px solid oklch(0.88 0.018 260 / 0.25)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "oklch(0.62 0.22 265 / 0.02)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="size-9 rounded-xl flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                          >
                            {(c.first_name?.[0] || "") + (c.last_name?.[0] || "")}
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-foreground">
                              {c.first_name} {c.last_name}
                            </p>
                            <p className="text-[11px] text-muted-foreground">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge status={c.status} />
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-[13px] font-bold text-foreground">{c.task_count}</span>
                      </td>
                      <td className="px-5 py-4 text-[12px] text-muted-foreground">
                        {c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            disabled={actionPending === c.id}
                            onClick={() => handleSuspend(c.id, c.status)}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors disabled:opacity-40"
                            style={
                              isSuspended
                                ? { color: "oklch(0.45 0.2 145)", border: "1px solid oklch(0.65 0.18 145 / 0.3)", background: "oklch(0.65 0.18 145 / 0.08)" }
                                : { color: "oklch(0.48 0.22 25)", border: "1px solid oklch(0.58 0.22 25 / 0.3)", background: "oklch(0.58 0.22 25 / 0.08)" }
                            }
                          >
                            {isSuspended ? "Activate" : "Suspend"}
                          </button>
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
