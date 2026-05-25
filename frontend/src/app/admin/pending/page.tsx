"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardCheck, Search, Loader2, CheckCircle2, ChevronRight, FileText, Clock, Building, MapPin } from "lucide-react";
import { adminService } from "@/services/admin.service";

export default function AdminPendingPage() {
  const [writers, setWriters] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionPending, setActionPending] = useState<number | null>(null);

  useEffect(() => {
    adminService
      .getPendingWriters()
      .then((res) => {
        setWriters(res.results || []);
        setFiltered(res.results || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      setFiltered(
        writers.filter(
          (w) =>
            `${w.first_name} ${w.last_name}`.toLowerCase().includes(q) ||
            w.email.toLowerCase().includes(q)
        )
      );
    } else {
      setFiltered(writers);
    }
  }, [writers, search]);

  const handleApprove = async (id: number) => {
    setActionPending(id);
    try {
      await adminService.approveWriter(id);
      setWriters((prev) => prev.filter((w) => w.id !== id));
    } finally {
      setActionPending(null);
    }
  };

  const handleReject = async (id: number) => {
    setActionPending(id);
    try {
      await adminService.rejectWriter(id);
      setWriters((prev) => prev.filter((w) => w.id !== id));
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
            <ClipboardCheck className="size-6 text-indigo-500" />
            Pending Approvals
          </h1>
          <p className="text-[13px] text-muted-foreground font-medium mt-1">
            Review and approve {writers.length} pending writer applications
          </p>
        </div>
      </div>

      {/* Search */}
      <div
        className="rounded-2xl p-4 flex flex-col sm:flex-row gap-3"
        style={{
          background: "oklch(1 0 0 / 0.9)",
          border: "1px solid oklch(0.88 0.018 260 / 0.5)",
        }}
      >
        <div className="relative flex-1 max-w-md">
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
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="size-5 animate-spin text-indigo-500" />
            <span className="text-[13px] font-semibold">Loading applications…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/40 rounded-2xl border border-border bg-white/50">
            <CheckCircle2 className="size-10 mb-3 text-emerald-500/50" />
            <p className="text-[14px] font-semibold">All caught up! No pending applications.</p>
          </div>
        ) : (
          filtered.map((w) => {
            const wp = w.writer_profile;
            return (
              <div
                key={w.id}
                className="rounded-2xl overflow-hidden group"
                style={{
                  background: "oklch(1 0 0 / 0.9)",
                  border: "1px solid oklch(0.88 0.018 260 / 0.5)",
                  boxShadow: "0 2px 8px oklch(0 0 0 / 0.04)",
                }}
              >
                {/* Header */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5"
                  style={{ borderBottom: "1px solid oklch(0.88 0.018 260 / 0.3)" }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="size-12 rounded-xl flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0"
                      style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                    >
                      {(w.first_name?.[0] || "") + (w.last_name?.[0] || "")}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-foreground">
                        {w.first_name} {w.last_name}
                      </h3>
                      <p className="text-[12px] text-muted-foreground">{w.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      disabled={actionPending === w.id}
                      onClick={() => handleReject(w.id)}
                      className="px-5 py-2 rounded-xl text-[12px] font-bold text-rose-500 hover:bg-rose-50 border border-rose-200 transition-colors disabled:opacity-40"
                    >
                      Reject Application
                    </button>
                    <button
                      disabled={actionPending === w.id}
                      onClick={() => handleApprove(w.id)}
                      className="px-5 py-2 rounded-xl text-[12px] font-bold text-white shadow-md hover:opacity-90 transition-all disabled:opacity-40"
                      style={{ background: "linear-gradient(135deg, oklch(0.65 0.18 145), oklch(0.55 0.2 160))" }}
                    >
                      Approve Writer
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="px-6 py-5 bg-black/[0.01]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wp?.city && (
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <MapPin className="size-3" /> Location
                        </p>
                        <p className="text-[13px] font-semibold text-foreground">
                          {wp.city}{wp.country ? `, ${wp.country}` : ""}
                        </p>
                      </div>
                    )}
                    {wp?.institution_name && (
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Building className="size-3" /> Institution
                        </p>
                        <p className="text-[13px] font-semibold text-foreground">{wp.institution_name}</p>
                      </div>
                    )}
                    {wp?.experience_years != null && (
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Clock className="size-3" /> Experience
                        </p>
                        <p className="text-[13px] font-semibold text-foreground">
                          {wp.experience_years} Years
                        </p>
                      </div>
                    )}
                    {wp?.academic_status && (
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <FileText className="size-3" /> Academic Status
                        </p>
                        <p className="text-[13px] font-semibold text-foreground">{wp.academic_status}</p>
                      </div>
                    )}
                  </div>

                  {wp?.bio && (
                    <div className="mt-5 pt-5" style={{ borderTop: "1px solid oklch(0.88 0.018 260 / 0.3)" }}>
                      <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider mb-2">Bio / Cover Letter</p>
                      <p className="text-[13px] text-muted-foreground leading-relaxed bg-white p-4 rounded-xl border border-border/50">
                        {wp.bio}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 pt-4" style={{ borderTop: "1px dashed oklch(0.88 0.018 260 / 0.5)" }}>
                    <Link href={`/admin/writers/${w.id}`} className="text-[12px] font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-1">
                      View Full Profile <ChevronRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
