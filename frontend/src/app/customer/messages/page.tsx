import { Suspense } from "react";
import ChatInterface from "@/components/chat/ChatInterface";

export default function CustomerMessagesPage() {
  return (
    <div className="h-[calc(100vh-5.5rem)] lg:h-[calc(100vh-6.5rem)]">
      <Suspense>
        <ChatInterface />
      </Suspense>
    </div>
  );
}
