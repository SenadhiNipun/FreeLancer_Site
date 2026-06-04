"use client";

import React from "react";
import {
  Wallet, TrendingUp, ArrowUpRight, Download,
  CreditCard, Building, CheckCircle2, History,
} from "lucide-react";
import { cn } from "@/lib/utils";

const transactions = [
  { type: "Task Payment",  project: "AI Research Paper",       amount: "+$450.00",   date: "Oct 24, 2023", credit: true  },
  { type: "Withdrawal",    project: "Bank Transfer (Direct)",  amount: "-$1,200.00", date: "Oct 20, 2023", credit: false },
  { type: "Task Payment",  project: "Software Case Study",     amount: "+$120.00",   date: "Oct 18, 2023", credit: true  },
];

export default function EarningsPage() {
  return (
    <div className="space-y-5 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Earnings & Wallet</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your income, payouts, and withdrawal history.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
            <Download className="size-4" /> Statement
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
            <ArrowUpRight className="size-4" /> Withdraw
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-primary rounded-xl p-5 text-white">
          <p className="text-xs font-medium text-white/70 mb-2">Available Balance</p>
          <p className="text-3xl font-semibold">$2,450.00</p>
          <p className="text-xs text-white/60 mt-2 flex items-center gap-1.5">
            <TrendingUp className="size-3.5" /> +15.5% this month
          </p>
        </div>
        <div className="bg-white border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground mb-2">Pending Payouts</p>
          <p className="text-3xl font-semibold text-foreground">$120.00</p>
          <p className="text-xs text-muted-foreground mt-2">Held in escrow (3 projects)</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground mb-2">Next Payment</p>
          <p className="text-3xl font-semibold text-foreground">Oct 31</p>
          <p className="text-xs text-muted-foreground mt-2">Auto-withdrawal to primary bank</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Transactions */}
        <div className="lg:col-span-2 bg-white border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
            <History className="size-4 text-primary" />
            <h2 className="font-semibold text-foreground">Recent Transactions</h2>
          </div>
          <div className="divide-y divide-border/50">
            {transactions.map((tx, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className={cn(
                  "size-9 rounded-lg flex items-center justify-center flex-shrink-0",
                  tx.credit ? "bg-green-50 border border-green-100" : "bg-orange-50 border border-orange-100"
                )}>
                  {tx.credit
                    ? <ArrowUpRight className="size-4 text-green-600" />
                    : <Download className="size-4 rotate-180 text-orange-600" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{tx.project}</p>
                  <p className="text-xs text-muted-foreground">{tx.date} · {tx.type}</p>
                </div>
                <div className="text-right">
                  <p className={cn("text-sm font-semibold", tx.credit ? "text-green-600" : "text-foreground")}>
                    {tx.amount}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-0.5">
                    <CheckCircle2 className="size-3 text-green-500" /> Completed
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payout methods */}
        <div className="space-y-4">
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
              <CreditCard className="size-4 text-primary" />
              <h2 className="font-semibold text-foreground">Payout Methods</h2>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg border border-violet-200 bg-violet-50">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-white border border-border flex items-center justify-center">
                    <Building className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Standard Chartered</p>
                    <p className="text-xs text-muted-foreground">•••• 8921 · Primary</p>
                  </div>
                </div>
                <CheckCircle2 className="size-4 text-primary" />
              </div>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-border hover:bg-muted/30 transition-colors">
                <div className="size-9 rounded-lg border border-border flex items-center justify-center">
                  <CreditCard className="size-4 text-muted-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">Add Payout Method</p>
                  <p className="text-xs text-muted-foreground">Bank or Wise transfer</p>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm font-medium text-amber-800 mb-1">Earnings Tip</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Writers with verified university emails earn 5% more on technical assignments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
