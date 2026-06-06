"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ChevronRight, Search, TicketCheck } from "lucide-react";
import { supportService } from "@/services/support.service";
import { cn } from "@/lib/utils";

const STATUSES = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const STATUS_STYLE: Record<string, string> = {
  OPEN:        "bg-amber-50 text-amber-700 border-amber-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
  RESOLVED:    "bg-green-50 text-green-700 border-green-200",
  CLOSED:      "bg-slate-100 text-slate-500 border-slate-200",
};

export default function AdminSupportPage() {
  const [tickets, setTickets]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("ALL");
  const [search, setSearch]     = useState("");

  useEffect(() => {
    setLoading(true);
    supportService.getAllTickets(filter === "ALL" ? undefined : filter)
      .then(r => setTickets(r.results || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  const filtered = search
    ? tickets.filter(t =>
        `${t.ticket_number} ${t.subject} ${t.user_name} ${t.user_email}`
          .toLowerCase().includes(search.toLowerCase())
      )
    : tickets;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Support Tickets</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} total
        </p>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1.5 flex-wrap">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                filter === s
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-slate-600 border-border hover:bg-slate-50"
              )}>
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tickets…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors placeholder:text-muted-foreground/50" />
        </div>
      </div>

      {/* Ticket list */}
      {loading ? (
        <div className="flex items-center justify-center py-12 gap-2">
          <Loader2 className="size-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading tickets…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-border rounded-xl flex flex-col items-center justify-center py-14 text-center">
          <TicketCheck className="size-10 text-muted-foreground/30 mb-3" />
          <p className="font-medium text-foreground">No tickets found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {filter !== "ALL" ? "Try a different status filter." : "No support tickets yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Ticket</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Customer</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((t: any) => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-mono text-xs text-muted-foreground">{t.ticket_number}</p>
                    <p className="font-medium text-foreground truncate max-w-[220px]">{t.subject}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-foreground">{t.user_name}</p>
                    <p className="text-xs text-muted-foreground">{t.user_email}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", STATUS_STYLE[t.status] || STATUS_STYLE.CLOSED)}>
                      {t.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">
                    {t.created_at ? new Date(t.created_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/support/${t.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                      View <ChevronRight className="size-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
