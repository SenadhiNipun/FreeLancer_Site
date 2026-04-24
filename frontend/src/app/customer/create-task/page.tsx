"use client";

import React from "react";
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  Upload, 
  ChevronRight,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui";
import { 
  Select, 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function CreateTask() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create New Task</h1>
        <p className="text-muted-foreground">Provide clear instructions to get the best results from our writers.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Task Details</CardTitle>
              <CardDescription>Basic information about your writing requirement.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input id="title" placeholder="e.g. Advanced Quantum Physics Report" className="rounded-xl h-11 bg-muted/30 border-none" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Subject / Category</Label>
                  <Select id="category" className="rounded-xl h-11 bg-muted/30 border-none px-4">
                    <option value="">Select Subject</option>
                    <option value="physics">Physics</option>
                    <option value="math">Mathematics</option>
                    <option value="cs">Computer Science</option>
                    <option value="law">Law</option>
                    <option value="literature">Literature</option>
                    <option value="other">Other</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="deadline" type="date" className="pl-10 rounded-xl h-11 bg-muted/30 border-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your requirements in detail..." 
                  className="min-h-[150px] rounded-xl bg-muted/30 border-none resize-none p-4"
                />
              </div>

              <div className="space-y-4">
                <Label>Attachments</Label>
                <div className="border-2 border-dashed border-border/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-muted/5 hover:bg-muted/10 transition-colors cursor-pointer group">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="size-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">PDF, DOCX, JPG or PNG (max 10MB)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing & Summary */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm bg-primary/5 sticky top-28">
            <CardHeader>
              <CardTitle className="text-lg">Pricing & Budget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="budget">Your Budget ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input id="budget" type="number" placeholder="0.00" className="pl-10 rounded-xl h-11 bg-white border-border/50" />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee (5%)</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>$0.00</span>
                </div>
              </div>

              <Button className="w-full h-12 rounded-xl shadow-lg shadow-primary/20 gap-2">
                Post Task <ChevronRight className="size-4" />
              </Button>

              <div className="flex gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-700">
                <Info className="size-4 shrink-0" />
                <p>Funds are held securely in escrow and only released when you approve the work.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
