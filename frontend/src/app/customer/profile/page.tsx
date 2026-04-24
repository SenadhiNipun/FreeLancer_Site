"use client";

import React from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Lock, 
  Bell, 
  ShieldCheck,
  CreditCard,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui";

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information and preferences.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          {[
            { label: "General Information", icon: User, active: true },
            { label: "Security & Password", icon: Lock, active: false },
            { label: "Notifications", icon: Bell, active: false },
            { label: "Payment Methods", icon: CreditCard, active: false },
            { label: "Privacy & Data", icon: ShieldCheck, active: false },
          ].map((item, i) => (
            <Button 
              key={i} 
              variant={item.active ? "secondary" : "ghost"} 
              className={`w-full justify-start gap-3 rounded-xl h-11 px-4 ${item.active ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'text-muted-foreground'}`}
            >
              <item.icon className="size-4" />
              {item.label}
            </Button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Header */}
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
            <CardContent className="relative pt-0">
               <div className="flex flex-col sm:flex-row items-end gap-6 -mt-10 px-4">
                  <div className="relative group">
                    <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-xl border border-border/50">
                      <div className="h-full w-full rounded-xl bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                        JD
                      </div>
                    </div>
                    <button className="absolute -bottom-2 -right-2 h-8 w-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <Camera className="size-4" />
                    </button>
                  </div>
                  <div className="pb-2 space-y-1">
                    <h2 className="text-xl font-bold">John Doe</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-2"><Mail className="size-3" /> john.doe@example.com</p>
                  </div>
               </div>
            </CardContent>
          </Card>

          {/* Form Sections */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
              <CardDescription>Update your basic contact details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" className="rounded-xl h-11 bg-muted/30 border-none" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" className="rounded-xl h-11 bg-muted/30 border-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" defaultValue="john.doe@example.com" disabled className="rounded-xl h-11 bg-muted/50 border-none" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="phone" defaultValue="+1 234 567 890" className="pl-10 rounded-xl h-11 bg-muted/30 border-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="location" defaultValue="New York, USA" className="pl-10 rounded-xl h-11 bg-muted/30 border-none" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Account Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/50">
                 <div className="space-y-1">
                    <p className="text-sm font-bold">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive updates about your tasks and messages.</p>
                 </div>
                 <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-border/50">
                 <div className="space-y-1">
                    <p className="text-sm font-bold">Public Profile</p>
                    <p className="text-xs text-muted-foreground">Allow others to see your reviews and feedback.</p>
                 </div>
                 <Switch />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="ghost" className="rounded-xl px-6">Discard Changes</Button>
            <Button className="rounded-xl px-8 shadow-lg shadow-primary/20">Save Profile</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
