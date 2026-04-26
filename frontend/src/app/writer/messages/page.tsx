"use client";

import React from "react";
import ChatInterface from "@/components/chat/ChatInterface";
import { Zap, MessageCircle } from "lucide-react";

export default function WriterMessagesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest border border-emerald-200">
              Writer's Lounge
            </span>
            <Zap className="size-3 text-emerald-500 fill-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1a1033]">Project Chat</h1>
          <p className="text-sm text-[#9490a8] mt-0.5">Communicate with your clients and clarify task requirements.</p>
        </div>
      </div>

      <div className="mt-8">
        <ChatInterface />
      </div>
    </div>
  );
}
