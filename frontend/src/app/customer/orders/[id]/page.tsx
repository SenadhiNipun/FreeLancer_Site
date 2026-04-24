"use client";

import React from "react";
import { 
  ArrowLeft, 
  Clock, 
  User, 
  FileText, 
  Download, 
  MessageSquare, 
  RotateCcw,
  CheckCircle2,
  DollarSign,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderDetails() {
  const params = useParams();
  const id = params.id;

  // Mock data for a specific order
  const order = {
    id: id || "ORD-721",
    title: "Quantum Mechanics Research Paper",
    description: "I need a comprehensive research paper on the principles of quantum entanglement and its applications in modern communication systems. The paper should be around 3000 words and include at least 15 peer-reviewed references.",
    subject: "Physics",
    deadline: "24 Apr 2026",
    budget: "$120.00",
    status: "Submitted",
    writer: {
      name: "Alice Johnson",
      rating: "4.9",
      completedTasks: 124
    },
    files: [
      { name: "Requirements_Doc.pdf", size: "1.2 MB", type: "document" },
      { name: "Reference_Material.zip", size: "15.5 MB", type: "archive" }
    ],
    submissions: [
      { id: 1, name: "Quantum_Entanglement_Draft_V1.docx", date: "22 Apr 2026", size: "450 KB" }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Link href="/customer/orders">
          <Button variant="ghost" size="icon" className="rounded-xl border border-border/50">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{order.title}</h1>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20 uppercase text-[10px] font-bold">
              {order.status}
            </Badge>
            <span className="text-xs text-muted-foreground">Order ID: {order.id}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Details & Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Description */}
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/20">
              <CardTitle className="text-lg">Project Description</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <p className="text-foreground/80 leading-relaxed">
                {order.description}
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-border/50">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Subject</p>
                  <p className="text-sm font-bold">{order.subject}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Deadline</p>
                  <p className="text-sm font-bold flex items-center gap-2"><Clock className="size-3 text-orange-500" /> {order.deadline}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Budget</p>
                  <p className="text-sm font-bold">{order.budget}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submissions Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
               <CheckCircle2 className="size-5 text-green-500" /> Writer Submissions
            </h2>
            <Card className="border-border/50 shadow-sm bg-green-500/5 border-green-500/10">
              <div className="divide-y divide-green-500/10">
                {order.submissions.map((file) => (
                  <div key={file.id} className="p-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white border border-green-500/20 flex items-center justify-center text-green-600 shadow-sm">
                        <FileText className="size-5" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-sm">{file.name}</h3>
                        <p className="text-xs text-muted-foreground">{file.size} • Uploaded on {file.date}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl border-green-500/20 text-green-600 hover:bg-green-500/10 gap-2">
                      <Download className="size-4" /> Download
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
            
            <div className="flex flex-wrap gap-4">
               <Button className="rounded-xl flex-1 h-12 shadow-lg shadow-primary/20 bg-primary gap-2">
                  Approve & Release Payment
               </Button>
               <Button variant="outline" className="rounded-xl flex-1 h-12 border-orange-500/20 text-orange-600 hover:bg-orange-500/10 gap-2">
                  <RotateCcw className="size-4" /> Request Revision
               </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Writer & Stats */}
        <div className="space-y-8">
          {/* Assigned Writer */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Assigned Writer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary border border-primary/20 shadow-inner">
                  AJ
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">{order.writer.name}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="flex items-center gap-1 text-amber-500 font-bold">★ {order.writer.rating}</span>
                    <span className="text-muted-foreground">• {order.writer.completedTasks} Tasks</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full rounded-xl gap-2 h-11 border-border/50 hover:bg-primary/5 hover:text-primary transition-colors">
                <MessageSquare className="size-4" /> Open Chat
              </Button>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card className="border-border/50 shadow-sm bg-muted/20">
            <CardHeader>
              <CardTitle className="text-lg">Payment Status</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order Amount</span>
                  <span className="font-bold">{order.budget}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-bold text-orange-600 italic">Held in Escrow</span>
                </div>
              </div>
              <div className="p-4 bg-orange-500/5 border-t border-orange-500/10 flex gap-3 text-[11px] text-orange-700">
                <AlertTriangle className="size-4 shrink-0" />
                <p>Funds will only be released after your explicit approval of the submitted work.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
