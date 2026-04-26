"use client";

import React from "react";
import ChatInterface from "@/components/chat/ChatInterface";
import { Sparkles } from "lucide-react";

export default function CustomerMessagesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-violet-100 text-[#7C5CFC] text-[10px] font-bold uppercase tracking-widest border border-violet-200">
              Direct Communication
            </span>
            <Sparkles className="size-3 text-amber-400 fill-amber-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1a1033]">Messages</h1>
          <p className="text-sm text-[#9490a8] mt-0.5">Chat with assigned writers to finalize project details.</p>
        </div>
      </div>

      <div className="mt-8">
        <ChatInterface />
      </div>
    </div>
  );
}
