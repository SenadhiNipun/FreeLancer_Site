"use client";

import React from "react";
import { 
  Users, 
  BarChart3, 
  AlertCircle, 
  ShieldCheck, 
  Settings,
  LayoutDashboard,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 pt-28 pb-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 text-center md:text-left">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
              Admin Control Center <ShieldCheck className="size-8 text-primary" />
            </h1>
            <p className="text-muted-foreground mt-2">Manage the Project Hub ecosystem and monitor platform analytics.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="h-12 px-6 font-semibold border-2 gap-2">
              <Settings className="size-4" /> System Settings
            </Button>
            <Button size="lg" className="h-12 px-8 font-bold bg-primary shadow-lg shadow-primary/20 gap-2 transition-all hover:scale-105">
              Generate Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <Card className="border-border/50 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="size-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,204</div>
              <p className="text-xs text-muted-foreground mt-1">+12 this week</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Platform Revenue</CardTitle>
              <DollarSign className="size-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$12,450</div>
              <p className="text-xs text-green-600 font-medium mt-1">+8% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 shadow-sm transition-all hover:shadow-md border-primary/20 bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-primary">Pending Writers</CardTitle>
              <AlertCircle className="size-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">8</div>
              <p className="text-xs text-primary font-medium mt-1">Require immediate review</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
              <BarChart3 className="size-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">156</div>
              <p className="text-xs text-muted-foreground mt-1">Healthy platform activity</p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Content Mockup */}
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Writer Applications</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 py-12 text-muted-foreground">
              <LayoutDashboard className="size-10 opacity-20" />
              <p>User list implementation coming soon</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 py-12 text-muted-foreground">
              <ShieldCheck className="size-10 opacity-20" />
              <p>Platform monitoring logs coming soon</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
