"use client";

import React from "react";
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video,
  Check,
  CheckCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui";

const chats = [
  { id: 1, name: "Alice Johnson", task: "Quantum Mechanics", lastMsg: "I've uploaded the first draft, please check.", time: "10:30 AM", unread: 2, online: true },
  { id: 2, name: "Bob Smith", task: "Civil Law Case Study", lastMsg: "Can you provide more details on section 3?", time: "Yesterday", unread: 0, online: false },
  { id: 3, name: "Support Team", task: "Platform Assistance", lastMsg: "Your refund has been processed.", time: "2 days ago", unread: 0, online: true },
];

export default function Messages() {
  return (
    <div className="h-[calc(100vh-160px)] flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Sidebar: Chat List */}
      <Card className="w-96 border-border/50 flex flex-col overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border/50 space-y-4">
          <h2 className="text-xl font-bold">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-10 h-10 rounded-xl bg-muted/50 border-none" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border/50">
          {chats.map((chat) => (
            <div key={chat.id} className="p-4 hover:bg-muted/30 cursor-pointer transition-colors flex gap-4 relative group">
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary border border-primary/20">
                  {chat.name.split(' ').map(n => n[0]).join('')}
                </div>
                {chat.online && (
                  <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm truncate">{chat.name}</h3>
                  <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                </div>
                <p className="text-[10px] uppercase font-bold text-primary tracking-tighter">{chat.task}</p>
                <p className="text-xs text-muted-foreground truncate">{chat.lastMsg}</p>
              </div>
              {chat.unread > 0 && (
                <Badge className="absolute right-4 bottom-4 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-primary text-white text-[10px]">
                  {chat.unread}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Main: Chat Window */}
      <Card className="flex-1 border-border/50 flex flex-col overflow-hidden shadow-sm bg-muted/5">
        {/* Chat Header */}
        <div className="p-4 border-b border-border/50 flex items-center justify-between bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary border border-primary/20">
              AJ
            </div>
            <div>
              <h3 className="font-bold text-sm">Alice Johnson</h3>
              <p className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" /> Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-muted-foreground"><Phone className="size-4" /></Button>
            <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-muted-foreground"><Video className="size-4" /></Button>
            <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-muted-foreground"><MoreVertical className="size-4" /></Button>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex flex-col items-center">
            <Badge variant="secondary" className="bg-muted text-muted-foreground text-[10px] rounded-full px-3 py-0.5">Today</Badge>
          </div>

          {/* Receiver Message */}
          <div className="flex gap-4 max-w-[80%]">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">AJ</div>
            <div className="space-y-1">
              <div className="p-4 bg-white border border-border/50 rounded-2xl rounded-tl-none shadow-sm text-sm">
                Hi! I've finished the draft for the Quantum Mechanics paper. I've focused heavily on the entanglement section as requested.
              </div>
              <p className="text-[10px] text-muted-foreground">10:28 AM</p>
            </div>
          </div>

          {/* Sender Message */}
          <div className="flex gap-4 max-w-[80%] ml-auto flex-row-reverse">
            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">JD</div>
            <div className="space-y-1 text-right">
              <div className="p-4 bg-primary text-white rounded-2xl rounded-tr-none shadow-lg shadow-primary/20 text-sm">
                That's great! Let me review it now. Did you include the references I sent earlier?
              </div>
              <div className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
                10:30 AM <CheckCheck className="size-3 text-primary" />
              </div>
            </div>
          </div>

          {/* Receiver Message */}
          <div className="flex gap-4 max-w-[80%]">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">AJ</div>
            <div className="space-y-1">
              <div className="p-4 bg-white border border-border/50 rounded-2xl rounded-tl-none shadow-sm text-sm">
                Yes, all 15 references are cited in APA format. I've uploaded the file to the order details page.
              </div>
              <p className="text-[10px] text-muted-foreground">10:32 AM</p>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-border/50">
          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" className="rounded-xl h-11 w-11 text-muted-foreground"><Paperclip className="size-5" /></Button>
             <Input 
                placeholder="Type your message here..." 
                className="flex-1 h-11 rounded-xl bg-muted/50 border-none focus-visible:ring-primary/20"
             />
             <Button className="h-11 w-11 rounded-xl shadow-lg shadow-primary/20 p-0">
               <Send className="size-5" />
             </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
