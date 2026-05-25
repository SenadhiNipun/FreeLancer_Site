"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight, Loader2, PenSquare, ChevronRight } from "lucide-react";
import { adminService } from "@/services/admin.service";

function Badge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    APPROVED:         { bg: "oklch(0.65 0.18 145 / 0.12)", color: "oklch(0.45 0.2 145)" },
    PENDING_APPROVAL: { bg: "oklch(0.78 0.16 70 / 0.12)",  color: "oklch(0.58 0.18 70)" },
    REJECTED:         { bg: "oklch(0.58 0.22 25 / 0.12)",  color: "oklch(0.48 0.22 25)" },
    ACTIVE:           { bg: "oklch(0.65 0.18 145 / 0.12)", color: "oklch(0.45 0.2 145)" },
    SUSPENDED:        { bg: "oklch(0.58 0.22 25 / 0.12)",  color: "oklch(0.48 0.22 25)" },
    INCOMPLETE:       { bg: "oklch(0.88 0.018 260 / 0.4)",  color: "oklch(0.5 0.05 260)" },
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

const STATUS_FILTERS = ["ALL", "APPROVED", "PENDING_APPROVAL", "REJECTED", "INCOMPLETE"];

export default function AdminWritersPage() {
  const [writers, setWriters] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [actionPending, setActionPending] = useState<number | null>(null);

  useEffect(() => {
    adminService
      .getAllWriters()
      .then((res) => {
        setWriters(res.results || []);
        setFiltered(res.results || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let list = writers;
    if (statusFilter !== "ALL") {
      list = list.filter((w) => w.writer_profile?.profile_status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (w) =>
          `${w.first_name} ${w.last_name}`.toLowerCase().includes(q) ||
          w.email.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [writers, search, statusFilter]);

  const handleApprove = async (id: number) => {
    setActionPending(id);
    try {
      await adminService.approveWriter(id);
      setWriters((prev) =>
        prev.map((w) =>
          w.id === id
            ? { ...w, writer_profile: { ...w.writer_profile, profile_status: "APPROVED" } }
            : w
        )
      );
    } finally {
      setActionPending(null);
    }
  };

  const handleReject = async (id: number) => {
    setActionPending(id);
    try {
      await adminService.rejectWriter(id);
      setWriters((prev) =>
        prev.map((w) =>
          w.id === id
            ? { ...w, writer_profile: { ...w.writer_profile, profile_status: "REJECTED" } }
            : w
        )
      );
    } finally {
      setActionPending(null);
    }
  };

  const handleSuspend = async (id: number, currentStatus: string) => {
    setActionPending(id);
    try {
      if (currentStatus === "SUSPENDED") {
        await adminService.activateUser(id);
        setWriters((prev) =>
          prev.map((w) => (w.id === id ? { ...w, status: "ACTIVE" } : w))
        );
      } else {
        await adminService.suspendUser(id);
        setWriters((prev) =>
          prev.map((w) => (w.id === id ? { ...w, status: "SUSPENDED" } : w))
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
            <PenSquare className="size-6 text-indigo-500" />
            Writers
          </h1>
          <p className="text-[13px] text-muted-foreground font-medium mt-1">
            {writers.length} registered writers on the platform
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
        {/* Search */}
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
        {/* Status filters */}
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
            <span className="text-[13px] font-semibold">Loading writers…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/40">
            <PenSquare className="size-10 mb-3" />
            <p className="text-[14px] font-semibold">No writers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr
                  className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.12em]"
                  style={{ borderBottom: "1px solid oklch(0.88 0.018 260 / 0.4)" }}
                >
                  <th className="px-5 py-3.5">Writer</th>
                  <th className="px-5 py-3.5">Profile Status</th>
                  <th className="px-5 py-3.5">Account</th>
                  <th className="px-5 py-3.5 text-center">Tasks</th>
                  <th className="px-5 py-3.5">Joined</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((w: any) => {
                  const profileStatus = w.writer_profile?.profile_status || "INCOMPLETE";
                  const isPending = profileStatus === "PENDING_APPROVAL";
                  const isSuspended = w.status === "SUSPENDED";

                  return (
                    <tr
                      key={w.id}
                      className="group transition-colors"
                      style={{ borderBottom: "1px solid oklch(0.88 0.018 260 / 0.25)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "oklch(0.62 0.22 265 / 0.02)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                    >
                      {/* Writer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="size-9 rounded-xl flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                          >
                            {(w.first_name?.[0] || "") + (w.last_name?.[0] || "")}
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-foreground">
                              {w.first_name} {w.last_name}
                            </p>
                            <p className="text-[11px] text-muted-foreground">{w.email}</p>
                          </div>
                        </div>
                      </td>
                      {/* Profile status */}
                      <td className="px-5 py-4">
                        <Badge status={profileStatus} />
                      </td>
                      {/* Account */}
                      <td className="px-5 py-4">
                        <Badge status={w.status} />
                      </td>
                      {/* Task count */}
                      <td className="px-5 py-4 text-center">
                        <span className="text-[13px] font-bold text-foreground">{w.task_count}</span>
                      </td>
                      {/* Joined */}
                      <td className="px-5 py-4 text-[12px] text-muted-foreground">
                        {w.created_at ? new Date(w.created_at).toLocaleDateString() : "—"}
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          {isPending && (
                            <>
                              <button
                                disabled={actionPending === w.id}
                                onClick={() => handleApprove(w.id)}
                                className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 border border-emerald-200 transition-colors disabled:opacity-40"
                              >
                                Approve
                              </button>
                              <button
                                disabled={actionPending === w.id}
                                onClick={() => handleReject(w.id)}
                                className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-rose-500 hover:bg-rose-50 border border-rose-200 transition-colors disabled:opacity-40"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            disabled={actionPending === w.id}
                            onClick={() => handleSuspend(w.id, w.status)}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors disabled:opacity-40"
                            style={
                              isSuspended
                                ? { color: "oklch(0.45 0.2 145)", border: "1px solid oklch(0.65 0.18 145 / 0.3)", background: "oklch(0.65 0.18 145 / 0.08)" }
                                : { color: "oklch(0.48 0.22 25)", border: "1px solid oklch(0.58 0.22 25 / 0.3)", background: "oklch(0.58 0.22 25 / 0.08)" }
                            }
                          >
                            {isSuspended ? "Activate" : "Suspend"}
                          </button>
                          <Link href={`/admin/writers/${w.id}`}>
                            <button className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 transition-colors border border-border/50">
                              <ChevronRight className="size-4" />
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
