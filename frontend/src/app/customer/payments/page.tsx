"use client";

import React from "react";
import { Wallet, ArrowUpRight, ArrowDownLeft, Download, CreditCard, Plus, History } from "lucide-react";
import { cn } from "@/lib/utils";

const transactions = [
  { id: "TXN-9021", date: "22 Apr 2026", task: "Quantum Mechanics Paper",  amount: "-$120.00", type: "Payment", credit: false, status: "Escrow" },
  { id: "TXN-9018", date: "20 Apr 2026", task: "Wallet Deposit",           amount: "+$500.00", type: "Deposit", credit: true,  status: "Completed" },
  { id: "TXN-8995", date: "15 Apr 2026", task: "Modern Poetry Analysis",   amount: "-$60.00",  type: "Payment", credit: false, status: "Completed" },
  { id: "TXN-8980", date: "10 Apr 2026", task: "Law Case Study",           amount: "-$85.00",  type: "Payment", credit: false, status: "Completed" },
];

export default function Payments() {
  return (
    <div className="space-y-5 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Payments</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your funds, view history, and download invoices.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="size-4" /> Add Funds
        </button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-primary rounded-xl p-5 text-white">
          <p className="text-xs font-medium text-white/70 mb-2">Available Balance</p>
          <p className="text-3xl font-semibold">$380.00</p>
          <p className="text-xs text-white/60 mt-2">Ready for new tasks</p>
        </div>
        <div className="bg-white border border-orange-200 bg-orange-50/30 rounded-xl p-5">
          <p className="text-xs text-muted-foreground mb-2">Held in Escrow</p>
          <p className="text-3xl font-semibold text-orange-600">$205.00</p>
          <p className="text-xs text-muted-foreground mt-2">Allocated to 2 active tasks</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground mb-2">Total Spent</p>
          <p className="text-3xl font-semibold text-foreground">$1,420.00</p>
          <p className="text-xs text-muted-foreground mt-2">Since joining June 2025</p>
        </div>
      </div>

      {/* Transaction history */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <History className="size-4 text-primary" /> Transaction History
          </h2>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted/50 transition-colors">
            <Download className="size-3.5" /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Transaction</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Type</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">Amount</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-foreground">{txn.task}</p>
                    <p className="text-xs text-muted-foreground">{txn.id}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      {txn.credit
                        ? <ArrowDownLeft className="size-3.5 text-green-600" />
                        : <ArrowUpRight className="size-3.5 text-orange-500" />
                      }
                      {txn.type}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{txn.date}</td>
                  <td className={cn("px-5 py-4 text-right font-semibold", txn.credit ? "text-green-600" : "text-foreground")}>
                    {txn.amount}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                      txn.status === "Completed"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    )}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
