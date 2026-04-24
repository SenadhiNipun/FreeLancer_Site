"use client";

import React from "react";
import { 
  LifeBuoy, 
  MessageCircle, 
  Mail, 
  FileQuestion, 
  AlertCircle,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui";
import { Label } from "@/components/ui/label";

export default function Support() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Support & Help</h1>
        <p className="text-muted-foreground">We're here to help you with any issues or questions.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contact Options */}
        <div className="space-y-6">
           <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6 space-y-4">
                 <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <MessageCircle className="size-6" />
                 </div>
                 <div className="space-y-1">
                    <h3 className="font-bold">Live Chat</h3>
                    <p className="text-xs text-muted-foreground">Typical response time: 5 mins</p>
                 </div>
                 <Button variant="outline" className="w-full rounded-xl gap-2">Start Chat <ChevronRight className="size-3" /></Button>
              </CardContent>
           </Card>

           <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6 space-y-4">
                 <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                    <Mail className="size-6" />
                 </div>
                 <div className="space-y-1">
                    <h3 className="font-bold">Email Support</h3>
                    <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                 </div>
                 <Button variant="outline" className="w-full rounded-xl gap-2">Send Email <ChevronRight className="size-3" /></Button>
              </CardContent>
           </Card>

           <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6 space-y-4">
                 <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                    <ShieldAlert className="size-6" />
                 </div>
                 <div className="space-y-1">
                    <h3 className="font-bold">Dispute Center</h3>
                    <p className="text-xs text-muted-foreground">For order & payment issues</p>
                 </div>
                 <Button variant="outline" className="w-full rounded-xl gap-2">Open Case <ChevronRight className="size-3" /></Button>
              </CardContent>
           </Card>
        </div>

        {/* Support Ticket Form */}
        <div className="lg:col-span-2">
           <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Create a Support Ticket</CardTitle>
                <CardDescription>If you can't find what you're looking for, please submit a ticket.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="What is the issue?" className="rounded-xl h-11 bg-muted/30 border-none" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" placeholder="Payment, Task, etc." className="rounded-xl h-11 bg-muted/30 border-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Describe your problem in detail..." 
                    className="min-h-[150px] rounded-xl bg-muted/30 border-none resize-none p-4"
                  />
                </div>

                <Button className="w-full h-12 rounded-xl shadow-lg shadow-primary/20 bg-primary gap-2">
                  Submit Ticket
                </Button>
              </CardContent>
           </Card>

           <div className="mt-10 space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><FileQuestion className="size-5" /> Frequently Asked Questions</h2>
              <div className="grid gap-4">
                 {[
                   "How do I request a refund?",
                   "How can I change my assigned writer?",
                   "What happens if I miss a deadline?",
                   "Is my payment information secure?"
                 ].map((q, i) => (
                   <div key={i} className="p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors flex items-center justify-between cursor-pointer group">
                      <span className="text-sm font-medium">{q}</span>
                      <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
