"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase, CheckCircle2, Wallet, Star,
  Clock, ArrowUpRight, Gavel, TrendingUp, Zap,
} from "lucide-react";
import { taskService } from "@/services/task.service";
import { formatDistanceToNow } from "date-fns";

function StatCard({ label, value, sub, icon: Icon, color, href }: {
  label: string; value: string | number; sub?: string;
  icon: any; color: string; href?: string;
}) {
  const card = (
    <div className="bg-white border border-border rounded-xl p-5 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-3">
        <div className={`size-9 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="size-4.5 text-white" strokeWidth={2} />
        </div>
        {href && <ArrowUpRight className="size-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />}
      </div>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
      {sub && <p className="text-xs text-muted-foreground/60 mt-0.5">{sub}</p>}
    </div>
  );
  return href ? <Link href={href}>{card}</Link> : card;
}

export default function WriterDashboard() {
  const [tasks, setTasks]         = useState<any[]>([]);
  const [bids, setBids]           = useState<any[]>([]);
  const [openTasks, setOpenTasks] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [userName, setUserName]   = useState("there");

  useEffect(() => {
    Promise.all([
      taskService.getWriterTasks(),
      taskService.getWriterBids(),
      taskService.getOpenTasksForWriter(),
    ]).then(([tRes, bRes, oRes]) => {
      setTasks(tRes.results || []);
      setBids(bRes.results || []);
      setOpenTasks(oRes.results || []);
      try {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        setUserName(u.first_name || "there");
      } catch {}
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const active   = tasks.filter(t => !["COMPLETED","CANCELLED"].includes(t.task_status));
  const pending  = bids.filter(b => b.bid_status === "PENDING");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] gap-3">
        <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground">Loading dashboard…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Welcome back, {userName}!</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {active.length} active tasks · {openTasks.length} new opportunities available
          </p>
        </div>
        <Link href="/writer/tasks/available">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
            <Zap className="size-4" />
            Browse Tasks
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Tasks"   value={active.length}          icon={Briefcase}    color="bg-violet-600" href="/writer/tasks/active" />
        <StatCard label="Pending Bids"   value={pending.length}         icon={Gavel}        color="bg-blue-600"   href="/writer/tasks/available" />
        <StatCard label="Available Now"  value={openTasks.length}       icon={TrendingUp}   color="bg-green-600"  href="/writer/tasks/available" />
        <StatCard label="Completed"      value={tasks.filter(t => t.task_status === "COMPLETED").length} icon={CheckCircle2} color="bg-amber-500" href="/writer/tasks/completed" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Active tasks */}
        <div className="lg:col-span-2 bg-white border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Active Workstreams</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Tasks currently in progress</p>
            </div>
            <Link href="/writer/tasks/active" className="text-xs font-medium text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-border/50">
            {active.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-muted-foreground">
                No active tasks.{" "}
                <Link href="/writer/tasks/available" className="text-primary hover:underline">Browse available tasks.</Link>
              </div>
            ) : active.slice(0, 5).map((task) => (
              <Link key={task.id} href={`/writer/tasks/${task.id}`}>
                <div className="flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors group">
                  <div className="size-9 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="size-4 text-violet-600" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="size-3" />
                      Due {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-foreground">${parseFloat(task.budget || 0).toFixed(2)}</p>
                    <span className="text-xs text-muted-foreground">{task.task_status.replace(/_/g," ")}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Opportunity spotlight */}
          <div className="bg-violet-600 rounded-xl p-5 text-white">
            <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center mb-3">
              <Zap className="size-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold mb-1">New Opportunities</h3>
            <p className="text-xs text-white/75 leading-relaxed mb-4">
              <span className="font-semibold text-white">{openTasks.length} projects</span> currently accepting bids from writers like you.
            </p>
            <Link href="/writer/tasks/available">
              <button className="w-full py-2 rounded-lg bg-white text-violet-700 text-sm font-medium hover:bg-white/90 transition-colors">
                Browse Marketplace
              </button>
            </Link>
          </div>

          {/* Pending bids */}
          <div className="bg-white border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Your Bids</h3>
              <Link href="/writer/tasks/available" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {bids.slice(0, 4).map((bid) => (
                <div key={bid.id} className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                    <Gavel className="size-3.5 text-blue-600" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{bid.task?.title || "Project"}</p>
                    <p className="text-xs text-muted-foreground">${parseFloat(bid.bid_amount).toFixed(2)} · {bid.bid_status}</p>
                  </div>
                </div>
              ))}
              {bids.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">No bids placed yet.</p>}
            </div>
          </div>

          {/* Reviews snapshot */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Performance</h3>
            <div className="space-y-2.5">
              {[
                { label: "Avg. Rating",    value: "—",   icon: Star,         color: "text-amber-500" },
                { label: "On-Time Rate",   value: "—",   icon: CheckCircle2, color: "text-green-600" },
                { label: "Total Earnings", value: "—",   icon: Wallet,       color: "text-violet-600" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon className={`size-3.5 ${color}`} strokeWidth={1.75} />
                    {label}
                  </div>
                  <span className="text-xs font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
            <Link href="/writer/earnings" className="block mt-4">
              <button className="w-full py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted/50 transition-colors">
                View Earnings
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
