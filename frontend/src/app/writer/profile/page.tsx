"use client";

import React from "react";
import { 
  User, 
  GraduationCap, 
  ShieldCheck, 
  Award, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3,
  Camera,
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function WriterProfile() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Professional Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your identity, academic credentials, and portfolio.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-11 px-6 font-bold border-2 gap-2">View Public Profile</Button>
          <Button className="h-11 px-8 font-bold bg-primary shadow-lg shadow-primary/20 gap-2 transition-all hover:scale-105 active:scale-95">
             <Edit3 className="size-4" /> Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Avatar & Basic Info */}
        <div className="space-y-8 lg:col-span-1">
          <Card className="border-border/50 shadow-sm overflow-hidden text-center p-8 relative">
             <div className="absolute top-4 right-4">
                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                   <ShieldCheck className="size-4 text-green-600" />
                </div>
             </div>
             
             <div className="mx-auto w-32 h-32 rounded-3xl bg-primary/10 flex items-center justify-center text-primary text-4xl font-black mb-6 border-4 border-background shadow-xl relative group">
                SR
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl cursor-pointer">
                   <Camera className="size-8 text-white" />
                </div>
             </div>
             
             <h2 className="text-2xl font-bold">Senadhi Rajarathna</h2>
             <p className="text-sm font-medium text-muted-foreground mt-1 tracking-wide">Expert Academic Writer</p>
             
             <div className="mt-8 flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 rounded-full bg-muted text-[10px] font-bold text-muted-foreground border border-border uppercase">Verified Identity</span>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-[10px] font-bold text-primary border border-primary/20 uppercase">Top 10% Writer</span>
             </div>

             <div className="mt-10 space-y-4 text-left border-t border-border/50 pt-8">
                <div className="flex items-center gap-3 text-sm">
                   <Mail className="size-4 text-muted-foreground" />
                   <span className="text-foreground font-medium">senadhi@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                   <Phone className="size-4 text-muted-foreground" />
                   <span className="text-foreground font-medium">+94 77 123 4567</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                   <MapPin className="size-4 text-muted-foreground" />
                   <span className="text-foreground font-medium">Colombo, Sri Lanka</span>
                </div>
             </div>
          </Card>
          
          <Card className="border-border/50 shadow-sm p-6 bg-accent text-white">
             <h3 className="font-bold flex items-center gap-2 mb-4">
                <Award className="size-5" /> Professional Bio
             </h3>
             <p className="text-sm opacity-90 leading-relaxed italic">
                "Specialized in Quantum Physics and Advanced Mathematics with 5+ years of academic writing experience. Focused on delivering high-quality, plagiarism-free research reports."
             </p>
          </Card>
        </div>

        {/* Right Column: Detailed Forms */}
        <div className="lg:col-span-2 space-y-8">
           <Card className="border-border/50 shadow-sm">
              <CardHeader className="border-b border-border/50 p-6">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                       <GraduationCap className="size-6 text-orange-600" />
                    </div>
                    <div>
                       <CardTitle>Academic Qualifications</CardTitle>
                       <CardDescription>Your educational background and credentials.</CardDescription>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                 <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                       <Label>University / Institution</Label>
                       <Input defaultValue="University of Colombo" />
                    </div>
                    <div className="space-y-2">
                       <Label>Degree Level</Label>
                       <Input defaultValue="PhD Candidate" />
                    </div>
                    <div className="space-y-2">
                       <Label>Field of Study</Label>
                       <Input defaultValue="Theoretical Physics" />
                    </div>
                    <div className="space-y-2">
                       <Label>Graduation Year</Label>
                       <Input defaultValue="2024" />
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-border/50 shadow-sm">
              <CardHeader className="border-b border-border/50 p-6">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                       <ShieldCheck className="size-6 text-blue-600" />
                    </div>
                    <div>
                       <CardTitle>Verification Status</CardTitle>
                       <CardDescription>Identity and document verification status.</CardDescription>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="p-8">
                 <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-muted/30 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600">
                          <CheckCircle2 className="size-6" />
                       </div>
                       <div>
                          <p className="font-bold text-foreground leading-tight">Identity Verified</p>
                          <p className="text-xs text-muted-foreground mt-1">NIC/Passport verification complete.</p>
                       </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary font-bold gap-1">Update Document <ExternalLink className="size-3" /></Button>
                 </div>
                 
                 <div className="mt-8 flex justify-between items-center px-2">
                    <p className="text-sm font-medium text-muted-foreground">Expertise Areas:</p>
                    <div className="flex gap-2">
                       {['Physics', 'Mathematics', 'Python', 'Latex'].map(tag => (
                          <span key={tag} className="px-3 py-1 bg-muted rounded-lg text-xs font-bold text-foreground">
                             {tag}
                          </span>
                       ))}
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
