"use client";

import React from "react";
import { 
  ShoppingBag, 
  CheckCircle2, 
  Wallet, 
  MessageSquare, 
  RotateCcw,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function CustomerDashboard() {
  const stats = [
    { label: "Active Orders", value: "3", icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Completed Orders", value: "12", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Pending Payments", value: "$150", icon: Wallet, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Ongoing Chats", value: "2", icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Revision Requests", value: "1", icon: RotateCcw, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  const recentActivity = [
    { id: 1, type: "update", title: "Task 'Quantum Mechanics' moved to In Progress", time: "2 hours ago", status: "In Progress" },
    { id: 2, type: "message", title: "New message from Writer Alice", time: "5 hours ago", status: "Unread" },
    { id: 3, type: "deadline", title: "Upcoming deadline: Biology Essay", time: "Tomorrow at 10:00 AM", status: "Urgent" },
    { id: 4, type: "payment", title: "Payment received for 'Literature Review'", time: "Yesterday", status: "Completed" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your tasks.</p>
        </div>
        <Link href="/customer/create-task">
          <Button className="rounded-xl shadow-lg shadow-primary/20 gap-2">
            <FileText className="size-4" /> Create New Task
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
              {stat.label}
              <stat.icon className={`size-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <Button variant="ghost" size="sm" className="text-primary gap-1">View History <ArrowRight className="size-4" /></Button>
          </div>
          
          <Card className="border-border/50 overflow-hidden">
            <div className="divide-y divide-border/50">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-6 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      {activity.type === 'update' && <TrendingUp className="size-5" />}
                      {activity.type === 'message' && <MessageSquare className="size-5" />}
                      {activity.type === 'deadline' && <Clock className="size-5 text-orange-500" />}
                      {activity.type === 'payment' && <Wallet className="size-5 text-green-500" />}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-foreground">{activity.title}</h3>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
                      activity.status === 'Urgent' ? 'bg-red-500/10 text-red-600' : 
                      activity.status === 'Unread' ? 'bg-purple-500/10 text-purple-600' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Help/Info Column */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Quick Actions</h2>
          <div className="grid gap-4">
             <Card className="border-border/50 p-6 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                    <FileText className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">Post a Requirement</h3>
                    <p className="text-xs text-muted-foreground">Get quotes from expert writers</p>
                  </div>
                </div>
             </Card>

             <Card className="border-border/50 p-6 hover:bg-muted/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                    <MessageSquare className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">Support Chat</h3>
                    <p className="text-xs text-muted-foreground">Need help? Talk to us</p>
                  </div>
                </div>
             </Card>

             <Card className="border-border/50 p-6 hover:bg-muted/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                    <Wallet className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">Add Funds</h3>
                    <p className="text-xs text-muted-foreground">Secure payments for your tasks</p>
                  </div>
                </div>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
