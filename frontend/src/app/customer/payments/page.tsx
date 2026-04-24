"use client";

import React from "react";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  CreditCard,
  Plus,
  History,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui";

const transactions = [
  { id: "TXN-9021", date: "22 Apr 2026", task: "Quantum Mechanics Paper", amount: "-$120.00", type: "Payment", status: "Escrow" },
  { id: "TXN-9018", date: "20 Apr 2026", task: "Wallet Deposit", amount: "+$500.00", type: "Deposit", status: "Completed" },
  { id: "TXN-8995", date: "15 Apr 2026", task: "Modern Poetry Analysis", amount: "-$60.00", type: "Payment", status: "Completed" },
  { id: "TXN-8980", date: "10 Apr 2026", task: "Law Case Study", amount: "-$85.00", type: "Payment", status: "Completed" },
];

export default function Payments() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Payments</h1>
          <p className="text-muted-foreground mt-1">Manage your funds, view history, and download invoices.</p>
        </div>
        <Button className="rounded-xl shadow-lg shadow-primary/20 gap-2 h-11 px-6">
          <Plus className="size-4" /> Add Funds
        </Button>
      </div>

      {/* Payment Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/50 shadow-sm bg-primary text-white overflow-hidden relative group">
           <div className="absolute -right-8 -top-8 size-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-white/80 uppercase tracking-widest">Available Balance</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-4xl font-bold">$380.00</div>
             <p className="text-xs text-white/60 mt-2 flex items-center gap-1 italic"><Info className="size-3" /> Ready for new tasks</p>
           </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm border-orange-500/20 bg-orange-500/5">
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Held in Escrow</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-4xl font-bold text-orange-600">$205.00</div>
             <p className="text-xs text-muted-foreground mt-2">Allocated to 2 active tasks</p>
           </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Total Spent</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-4xl font-bold">$1,420.00</div>
             <p className="text-xs text-muted-foreground mt-2">Since joining June 2025</p>
           </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <History className="size-5" /> Transaction History
          </h2>
          <Button variant="outline" size="sm" className="rounded-xl border-border/50 h-9">
            Export CSV
          </Button>
        </div>

        <Card className="border-border/50 overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-border/50 bg-muted/20">
                   <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Transaction Details</th>
                   <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type</th>
                   <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Date</th>
                   <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Amount</th>
                   <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border/50">
                 {transactions.map((txn) => (
                   <tr key={txn.id} className="hover:bg-muted/30 transition-colors group">
                     <td className="px-6 py-6">
                       <div className="space-y-1">
                         <p className="font-bold text-foreground">{txn.task}</p>
                         <p className="text-xs text-muted-foreground">ID: {txn.id}</p>
                       </div>
                     </td>
                     <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                           {txn.type === 'Deposit' ? (
                             <ArrowDownLeft className="size-4 text-green-500" />
                           ) : (
                             <ArrowUpRight className="size-4 text-orange-500" />
                           )}
                           <span className="text-sm font-medium">{txn.type}</span>
                        </div>
                     </td>
                     <td className="px-6 py-6 text-sm text-muted-foreground">
                       {txn.date}
                     </td>
                     <td className={`px-6 py-6 text-right font-bold ${txn.amount.startsWith('+') ? 'text-green-600' : 'text-foreground'}`}>
                       {txn.amount}
                     </td>
                     <td className="px-6 py-6 text-right">
                        <Badge variant="outline" className={`uppercase text-[10px] font-bold ${
                          txn.status === 'Completed' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 
                          'bg-orange-500/10 text-orange-600 border-orange-500/20'
                        }`}>
                          {txn.status}
                        </Badge>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </Card>
      </div>
    </div>
  );
}
