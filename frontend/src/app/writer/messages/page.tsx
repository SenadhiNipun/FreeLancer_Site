"use client";

import React from "react";
import ChatInterface from "@/components/chat/ChatInterface";

export default function WriterMessagesPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] lg:h-[calc(100vh-6.5rem)]">
      <div className="mb-4 flex-shrink-0">
        <h1 className="text-2xl font-semibold text-foreground">Messages</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Communicate with your clients and clarify task requirements.</p>
      </div>
      <div className="flex-1 min-h-0">
        <ChatInterface />
      </div>
    </div>
  );
}
