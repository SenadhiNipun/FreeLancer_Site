"use client";

import React from "react";
import { 
  Search, 
  Filter, 
  Briefcase, 
  Clock, 
  MapPin,
  Star,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AvailableTasks() {
  const tasks = [
    { 
      title: "Blockchain Integration Strategy", 
      subject: "Fintech", 
      budget: "LKR 45,000", 
      deadline: "5 Days", 
      complexity: "Expert",
      rating: 4.9
    },
    { 
      title: "Sustainable Architecture Essay", 
      subject: "Architecture", 
      budget: "LKR 12,000", 
      deadline: "2 Days", 
      complexity: "Intermediate",
      rating: 4.5
    },
    { 
      title: "Data Analysis with Python", 
      subject: "Data Science", 
      budget: "LKR 25,000", 
      deadline: "3 Days", 
      complexity: "Advanced",
      rating: 5.0
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Available Tasks</h1>
          <p className="text-muted-foreground mt-1">High-priority tasks matched to your domain expertise.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search by title or subject..." className="pl-10 border-none bg-muted/50 focus-visible:ring-primary/20" />
        </div>
        <Button variant="outline" className="gap-2 rounded-xl">
          <Filter className="size-4" /> Filter Categories
        </Button>
      </div>

      {/* Task List */}
      <div className="grid gap-6">
        {tasks.map((task, i) => (
          <Card key={i} className="border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-md transition-all group">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row lg:items-center">
                <div className="p-6 lg:p-8 flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                      {task.subject}
                    </span>
                    <span className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="size-3 fill-amber-500" /> {task.rating} Client Rating
                    </span>
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{task.title}</h3>
                  <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-medium">
                    <span className="flex items-center gap-2"><Clock className="size-4" /> {task.deadline} Left</span>
                    <span className="flex items-center gap-2"><Zap className="size-4" /> {task.complexity} Level</span>
                  </div>
                </div>
                
                <div className="bg-muted/30 lg:w-64 p-6 lg:p-8 flex flex-row lg:flex-col items-center justify-between lg:justify-center border-t lg:border-t-0 lg:border-l border-border/50 gap-4">
                  <div className="text-center lg:text-center w-full">
                    <p className="text-2xl font-black text-foreground">{task.budget}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Fixed Budget</p>
                  </div>
                  <Button className="w-full h-12 rounded-xl bg-primary shadow-lg shadow-primary/20 font-bold hover:scale-105 transition-transform active:scale-95">
                    Interest & Apply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
