"use client";

import React from "react";
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  Download,
  CreditCard,
  Building,
  History,
  MoreVertical,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EarningsPage() {
  const transactions = [
    { type: "Task Payment", project: "AI Research Paper", amount: "+$450.00", date: "Oct 24, 2023", status: "Completed" },
    { type: "Withdrawal", project: "Bank Transfer (Direct)", amount: "-$1,200.00", date: "Oct 20, 2023", status: "Processed" },
    { type: "Task Payment", project: "Software Case Study", amount: "+$120.00", date: "Oct 18, 2023", status: "Completed" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Earnings & Wallet</h1>
          <p className="text-muted-foreground mt-1">Manage your income, view payout history, and withdraw funds.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-12 px-6 font-bold border-2 gap-2">
            <Download className="size-4" /> Download Statement
          </Button>
          <Button className="h-12 px-8 font-bold bg-primary shadow-lg shadow-primary/20 gap-2 transition-all hover:scale-105 active:scale-95">
             <ArrowUpRight className="size-4" /> Withdraw Funds
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/50 shadow-xl bg-primary text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-700">
             <Wallet size={120} />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-white/70 text-sm font-bold uppercase tracking-widest">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black">$2,450.00</div>
            <p className="text-white/60 text-xs font-semibold mt-4 flex items-center gap-2">
               <TrendingUp className="size-4" /> +15.5% Earnings growth
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Pending Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">$120.00</div>
            <p className="text-muted-foreground text-xs font-medium mt-2">Locked in escrow (3 active projects)</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card hover:shadow-md transition-shadow border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Next Scheduled Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">Oct 31</div>
            <p className="text-muted-foreground text-xs font-medium mt-2">Automatic withdrawal to Primary Bank</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
         {/* History Table */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <History className="size-5 text-primary" /> Recent Transactions
              </h2>
            </div>
            
            <Card className="border-border/50 overflow-hidden shadow-sm">
              <div className="divide-y divide-border/50">
                {transactions.map((tx, i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center",
                        tx.amount.startsWith('+') ? "bg-green-500/10 text-green-600" : "bg-orange-500/10 text-orange-600"
                      )}>
                        {tx.amount.startsWith('+') ? <ArrowUpRight className="size-5" /> : <Download className="size-5 rotate-180" />}
                      </div>
                      <div>
                        <p className="font-bold text-foreground leading-tight">{tx.project}</p>
                        <p className="text-xs text-muted-foreground mt-1">{tx.date} • {tx.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-lg font-black", tx.amount.startsWith('+') ? "text-green-600" : "text-foreground")}>
                        {tx.amount}
                      </p>
                      <div className="flex items-center justify-end gap-1 text-[10px] uppercase font-bold text-muted-foreground mt-1 tracking-tighter">
                         <CheckCircle2 className="size-3 text-green-500" /> {tx.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
         </div>

         {/* Payout Methods */}
         <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
               <CreditCard className="size-5 text-primary" /> Payout Methods
            </h2>
            <Card className="border-border/50 shadow-sm p-2">
               <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/20">
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center border border-border shadow-sm">
                           <Building className="size-6 text-primary" />
                        </div>
                        <div>
                           <p className="text-sm font-bold">Standard Chartered</p>
                           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">•••• 8921 | Primary</p>
                        </div>
                     </div>
                     <CheckCircle2 className="size-5 text-primary" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-2xl border border-transparent transition-colors cursor-pointer group">
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center border border-border">
                           <CreditCard className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                           <p className="text-sm font-bold opacity-70">Add New Method</p>
                           <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Connect bank or wise</p>
                        </div>
                     </div>
                     <button className="text-muted-foreground">+</button>
                  </div>
               </div>
            </Card>
            
            <Card className="p-6 border-border/50 bg-accent text-white shadow-lg shadow-accent/20">
               <h3 className="font-bold flex items-center gap-2 mb-2 italic">
                  Earnings Tip 💡
               </h3>
               <p className="text-xs opacity-90 leading-relaxed">
                  Writers with verified university emails earn 5% more on technical assignments.
               </p>
            </Card>
         </div>
      </div>
    </div>
  );
}

// Helper utility (assuming it exists or adding it here for the demo component)
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
