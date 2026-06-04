"use client";

import React from "react";
import ChatInterface from "@/components/chat/ChatInterface";

export default function CustomerMessagesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Messages</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Chat with your assigned writers.</p>
      </div>
      <ChatInterface />
    </div>
  );
}
