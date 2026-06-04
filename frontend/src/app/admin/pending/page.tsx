"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Loader2, CheckCircle2, ChevronRight, MapPin, Building, Clock } from "lucide-react";
import { adminService } from "@/services/admin.service";

export default function AdminPendingPage() {
  const [writers, setWriters]     = useState<any[]>([]);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [actioning, setActioning] = useState<number | null>(null);

  useEffect(() => {
    adminService.getPendingWriters()
      .then(r => setWriters(r.results || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? writers.filter(w => `${w.first_name} ${w.last_name} ${w.email}`.toLowerCase().includes(search.toLowerCase()))
    : writers;

  const approve = async (id: number) => {
    setActioning(id);
    await adminService.approveWriter(id).finally(() => setActioning(null));
    setWriters(p => p.filter(w => w.id !== id));
  };

  const reject = async (id: number) => {
    setActioning(id);
    await adminService.rejectWriter(id).finally(() => setActioning(null));
    setWriters(p => p.filter(w => w.id !== id));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Pending Approvals</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {writers.length} writer {writers.length === 1 ? "application" : "applications"} awaiting review
        </p>
      </div>

      <div className="bg-white border border-border rounded-xl p-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors placeholder:text-muted-foreground/50" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 gap-2">
          <Loader2 className="size-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading applications…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-border rounded-xl flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle2 className="size-10 text-green-500 mb-3" />
          <p className="font-medium text-foreground">All caught up!</p>
          <p className="text-sm text-muted-foreground mt-1">No pending writer applications.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((w: any) => {
            const wp = w.writer_profile;
            return (
              <div key={w.id} className="bg-white border border-border rounded-xl overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold flex items-center justify-center flex-shrink-0">
                      {(w.first_name?.[0] || "") + (w.last_name?.[0] || "")}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{w.first_name} {w.last_name}</p>
                      <p className="text-xs text-muted-foreground">{w.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button disabled={actioning === w.id} onClick={() => reject(w.id)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-40">
                      Reject
                    </button>
                    <button disabled={actioning === w.id} onClick={() => approve(w.id)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-40">
                      Approve
                    </button>
                  </div>
                </div>

                <div className="px-5 py-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
                    {wp?.city && (
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5"><MapPin className="size-3" /> Location</p>
                        <p className="text-sm font-medium text-foreground">{wp.city}{wp.country ? `, ${wp.country}` : ""}</p>
                      </div>
                    )}
                    {wp?.institution_name && (
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5"><Building className="size-3" /> Institution</p>
                        <p className="text-sm font-medium text-foreground">{wp.institution_name}</p>
                      </div>
                    )}
                    {wp?.experience_years != null && (
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5"><Clock className="size-3" /> Experience</p>
                        <p className="text-sm font-medium text-foreground">{wp.experience_years} yrs</p>
                      </div>
                    )}
                  </div>

                  {wp?.bio && (
                    <div className="mb-3 p-3 rounded-lg bg-muted/40 border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">Bio</p>
                      <p className="text-sm text-foreground leading-relaxed line-clamp-3">{wp.bio}</p>
                    </div>
                  )}

                  <Link href={`/admin/writers/${w.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    View full profile <ChevronRight className="size-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
