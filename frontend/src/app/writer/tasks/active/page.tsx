"use client";

import React from "react";
import { 
  Clock, 
  MessageSquare, 
  Upload, 
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ActiveTasks() {
  const activeTasks = [
    {
      title: "Market Analysis for E-commerce Startup",
      status: "In Progress",
      progress: 65,
      deadline: "24 Hours Left",
      client: "Alex Rivera",
      lastUpdate: "Saved 2h ago"
    },
    {
      title: "Python Script for Inventory Automation",
      status: "Revision Requested",
      progress: 90,
      deadline: "2 Days Left",
      client: "Sarah Chen",
      lastUpdate: "Comment received 1h ago"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Work</h1>
          <p className="text-muted-foreground mt-1">Manage ongoing tasks, collaborate with clients, and submit your work.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {activeTasks.map((task, i) => (
          <Card key={i} className="border-border/50 shadow-lg hover:shadow-xl transition-shadow bg-card/40 overflow-hidden">
            <CardHeader className="border-b border-border/50 p-6 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                {task.status === "In Progress" ? (
                  <span className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold uppercase border border-primary/20">
                    {task.status}
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-lg bg-orange-500/10 text-orange-600 text-[10px] font-bold uppercase border border-orange-500/20">
                    {task.status}
                  </span>
                )}
              </div>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <MoreVertical className="size-5" />
              </button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6 space-y-6">
                <h3 className="text-xl font-bold leading-tight">{task.title}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Project Progress</span>
                    <span className="font-bold">{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-2 bg-muted transition-all" />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-[10px]">
                      {task.client.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <span className="font-semibold text-muted-foreground">{task.client}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-orange-600 font-bold bg-orange-500/5 px-3 py-1 rounded-lg">
                    <Clock className="size-4" /> {task.deadline}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="bg-muted/10 border-t border-border/50 p-4 grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-11 rounded-xl bg-background hover:bg-muted font-bold transition-all flex items-center gap-2 border-border/50">
                   <MessageSquare className="size-4" /> Chat with Client
                </Button>
                <Button className="h-11 rounded-xl bg-primary shadow-lg shadow-primary/20 font-bold hover:scale-[1.02] transition-all flex items-center gap-2">
                   <Upload className="size-4" /> Submit Work
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty State / Add Task */}
        <div className="border-2 border-dashed border-border/50 rounded-3xl flex flex-col items-center justify-center p-12 text-center text-muted-foreground hover:bg-muted/30 transition-colors cursor-pointer group">
           <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <AlertCircle className="size-8 opacity-40" />
           </div>
           <p className="font-bold text-foreground">Need more work?</p>
           <p className="text-xs max-w-[200px] mt-1">Browse available tasks and increase your earnings today.</p>
           <Button variant="ghost" className="mt-4 text-primary font-bold">Go to Market <ArrowRight className="size-4 ml-2" /></Button>
        </div>
      </div>
    </div>
  );
}
