"use client";

import React from "react";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  User,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Badge
} from "@/components/ui";
import Link from "next/link";

const orders = [
  { 
    id: "ORD-721", 
    title: "Quantum Mechanics Research Paper", 
    deadline: "24 Apr 2026", 
    writer: "Alice Johnson", 
    status: "In Progress", 
    budget: "$120.00",
    priority: "High"
  },
  { 
    id: "ORD-718", 
    title: "Civil Law Case Study", 
    deadline: "28 Apr 2026", 
    writer: "Bob Smith", 
    status: "Pending Assignment", 
    budget: "$85.00",
    priority: "Normal"
  },
  { 
    id: "ORD-710", 
    title: "React.js Component Optimization", 
    deadline: "20 Apr 2026", 
    writer: "Charlie Davis", 
    status: "Submitted", 
    budget: "$250.00",
    priority: "High"
  },
  { 
    id: "ORD-695", 
    title: "Modern Poetry Analysis", 
    deadline: "15 Apr 2026", 
    writer: "Diana Prince", 
    status: "Completed", 
    budget: "$60.00",
    priority: "Low"
  }
];

export default function MyOrders() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Progress":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/10 uppercase text-[10px] font-bold">In Progress</Badge>;
      case "Pending Assignment":
        return <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/10 uppercase text-[10px] font-bold">Pending</Badge>;
      case "Submitted":
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/10 uppercase text-[10px] font-bold">Submitted</Badge>;
      case "Completed":
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/10 uppercase text-[10px] font-bold">Completed</Badge>;
      default:
        return <Badge variant="secondary" className="uppercase text-[10px] font-bold">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track all your writing projects in one place.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search orders..." className="pl-10 h-10 rounded-xl bg-muted/50 border-none" />
           </div>
           <Button variant="outline" className="rounded-xl border-border/50 gap-2">
              <Filter className="size-4" /> Filter
           </Button>
        </div>
      </div>

      <Card className="border-border/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Order Info</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Deadline</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Assigned Writer</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Budget</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-6">
                    <div className="space-y-1">
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors">{order.title}</p>
                      <p className="text-xs text-muted-foreground">ID: {order.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="size-3 text-muted-foreground" />
                      {order.deadline}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {order.writer.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium">{order.writer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-sm font-bold">{order.budget}</span>
                  </td>
                  <td className="px-6 py-6">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/customer/orders/${order.id}`}>
                        <Button variant="ghost" size="sm" className="rounded-lg h-8 gap-1 text-xs">
                          Details <ArrowRight className="size-3" />
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-border/50">
                          <DropdownMenuItem className="rounded-lg">View Details</DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg text-primary">Chat with Writer</DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg">Request Revision</DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg text-destructive">Cancel Order</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
