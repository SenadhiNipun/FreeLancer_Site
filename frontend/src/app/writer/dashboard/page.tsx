"use client";

import React from "react";
import { 
  Briefcase, 
  CheckCircle2, 
  TrendingUp, 
  Star, 
  ArrowRight,
  Clock,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WriterDashboard() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back, Senadhi</h1>
          <p className="text-muted-foreground mt-1">Here is what's happening with your projects today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-orange-500/10 text-orange-600 text-sm font-bold border border-orange-500/20 flex items-center gap-2">
             <Clock className="size-4" /> 2 Deadlines Today
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
            Available Tasks
            <Briefcase className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42</div>
            <p className="text-xs text-primary font-medium mt-1">Matched to expertise</p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
            Active Work
            <TrendingUp className="size-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">InProgress Projects</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
            Net Earnings
            <DollarSign className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$1,240</div>
            <p className="text-xs text-green-600 font-medium mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
            Success Rate
            <Star className="size-4 text-amber-500 fill-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground mt-1">Based on last 50 tasks</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Sections */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Active Tasks Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Priority Tasks</h2>
            <Button variant="ghost" size="sm" className="text-primary gap-1">View All <ArrowRight className="size-4" /></Button>
          </div>
          
          <Card className="border-border/50 overflow-hidden">
            <div className="divide-y divide-border/50">
              {[
                { title: "Advanced Quantum Physics Report", subject: "Physics", deadline: "4h 20m", price: "$120", complexity: "Advanced" },
                { title: "Legal Ethics Case Study", subject: "Law", deadline: "1d 2h", price: "$85", complexity: "Intermediate" },
                { title: "Machine Learning Implementation", subject: "Computer Science", deadline: "2d 5h", price: "$250", complexity: "Expert" }
              ].map((task, i) => (
                <div key={i} className="p-6 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-foreground">{task.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 rounded-full bg-muted border border-border">{task.subject}</span>
                      <span className="flex items-center gap-1 text-orange-600"><Clock className="size-3" /> Due in {task.deadline}</span>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-6">
                    <div className="hidden sm:block">
                      <p className="font-bold text-lg">{task.price}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{task.complexity}</p>
                    </div>
                    <Button size="sm" className="h-9 px-4 rounded-lg">Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Performance</h2>
          <Card className="border-border/50 p-6 bg-primary/5">
             <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-muted-foreground">Profile Strength</span>
                    <span className="font-bold">85%</span>
                  </div>
                  <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-primary/10">
                    <div className="h-full bg-primary w-[85%]" />
                  </div>
                </div>
                
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recent Feedback</h3>
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-white border border-border/50 shadow-sm">
                      <div className="flex items-center gap-1 mb-1">
                        {[1,2,3,4,5].map(s => <Star key={s} className="size-3 fill-amber-500 text-amber-500" />)}
                      </div>
                      <p className="text-xs text-foreground italic">"Exceptional work on the thesis proposal. Highly recommended!"</p>
                    </div>
                  </div>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
