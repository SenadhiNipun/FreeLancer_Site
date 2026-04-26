"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Search, 
  MoreVertical, 
  User, 
  MessageSquare,
  Clock,
  Check,
  CheckCheck,
  ChevronLeft
} from "lucide-react";
import { chatService } from "@/services/chat.service";
import { ChatSession, ChatMessage } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ChatInterface() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}').id : null;

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 10000); // Poll sessions every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeSession) {
      fetchMessages(activeSession.id);
      const interval = setInterval(() => fetchMessages(activeSession.id), 5000); // Poll messages every 5s
      return () => clearInterval(interval);
    }
  }, [activeSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchSessions = async () => {
    try {
      const data = await chatService.getSessions();
      setSessions(data);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (sessionId: number) => {
    try {
      const data = await chatService.getMessages(sessionId);
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession || !newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const sentMsg = await chatService.sendMessage(activeSession.id, { message_text: newMessage });
      setMessages(prev => [...prev, sentMsg]);
      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredSessions = sessions.filter(s => 
    s.other_party_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.task_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading && sessions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-white/50 backdrop-blur-sm rounded-[32px] border border-white/60">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 border-4 border-[#7C5CFC] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-[#9490a8] uppercase tracking-widest">Loading Chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[750px] bg-white/40 backdrop-blur-md rounded-[32px] border border-white/80 shadow-[0_8px_40px_rgba(124,92,252,0.08)] overflow-hidden">
      
      {/* ── Sessions List (Sidebar) ──────────────── */}
      <div className={cn(
        "w-full md:w-[350px] border-r border-violet-100 flex flex-col bg-white/60",
        activeSession ? "hidden md:flex" : "flex"
      )}>
        <div className="p-6 border-b border-violet-50">
          <h2 className="text-xl font-bold text-[#1a1033] mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9490a8]" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8F7FF] border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#7C5CFC]/20 transition-all placeholder:text-[#c4bfd8]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setActiveSession(session)}
                className={cn(
                  "w-full p-5 flex items-start gap-4 transition-all hover:bg-violet-50/50 text-left border-b border-violet-50/50",
                  activeSession?.id === session.id && "bg-[#F2EEFF] border-l-[4px] border-l-[#7C5CFC] pl-4"
                )}
              >
                <div className="size-12 rounded-2xl bg-gradient-to-br from-[#7C5CFC] to-[#A78BFA] flex items-center justify-center flex-shrink-0 shadow-sm text-white">
                  <User className="size-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#1a1033] truncate">{session.other_party_name}</span>
                    <span className="text-[10px] text-[#9490a8] font-medium">
                      {formatDistanceToNow(new Date(session.updated_at), { addSuffix: false })}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#7C5CFC] truncate mb-1">{session.task_title}</p>
                  <p className="text-xs text-[#9490a8] truncate">Click to start chatting</p>
                </div>
              </button>
            ))
          ) : (
            <div className="p-10 text-center space-y-3">
              <MessageSquare className="size-10 text-[#c4bfd8] mx-auto opacity-50" />
              <p className="text-xs font-medium text-[#9490a8] italic">No active conversations found.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Chat Window (Main Area) ──────────────── */}
      <div className={cn(
        "flex-1 flex flex-col bg-white/20",
        !activeSession ? "hidden md:flex" : "flex"
      )}>
        {activeSession ? (
          <>
            {/* Header */}
            <div className="p-5 border-b border-violet-100 bg-white/80 backdrop-blur-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden size-8 text-[#7C5CFC]"
                  onClick={() => setActiveSession(null)}
                >
                  <ChevronLeft className="size-5" />
                </Button>
                <div className="size-10 rounded-xl bg-[#F2EEFF] flex items-center justify-center text-[#7C5CFC]">
                  <User className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1a1033] leading-tight">{activeSession.other_party_name}</h3>
                  <p className="text-[10px] font-bold text-[#7C5CFC] uppercase tracking-wider">{activeSession.task_title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-violet-50 rounded-lg transition-colors text-[#c4bfd8] hover:text-[#7C5CFC]">
                  <MoreVertical className="size-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('/grid-light.svg')] bg-center">
              {messages.length > 0 ? (
                messages.map((msg, idx) => {
                  const isMine = msg.sender_id === currentUserId;
                  const showDate = idx === 0 || 
                    new Date(msg.created_at).getDate() !== new Date(messages[idx-1].created_at).getDate();

                  return (
                    <React.Fragment key={msg.id}>
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <span className="px-3 py-1 rounded-full bg-violet-50 text-[10px] font-bold text-[#9490a8] uppercase tracking-widest border border-violet-100">
                            {new Date(msg.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className={cn(
                        "flex flex-col max-w-[75%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                        isMine ? "ml-auto items-end" : "mr-auto items-start"
                      )}>
                        <div className={cn(
                          "px-5 py-3 rounded-2xl shadow-sm relative",
                          isMine 
                            ? "bg-[#7C5CFC] text-white rounded-tr-none shadow-violet-200/50" 
                            : "bg-white text-[#1a1033] rounded-tl-none border border-violet-50"
                        )}>
                          <p className="text-[13px] leading-relaxed font-medium">{msg.message_text}</p>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5 px-1">
                          <span className="text-[10px] font-bold text-[#c4bfd8]">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMine && (
                            msg.is_read ? <CheckCheck className="size-3 text-emerald-400" /> : <Check className="size-3 text-[#c4bfd8]" />
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-30 grayscale">
                  <div className="size-20 bg-violet-50 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="size-10 text-[#7C5CFC]" />
                  </div>
                  <p className="text-sm font-bold text-[#1a1033]">Start the conversation!</p>
                  <p className="text-xs font-medium text-[#9490a8] mt-1 text-center max-w-[200px]">Send a message to discuss project details.</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-5 bg-white/80 backdrop-blur-md border-t border-violet-100">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <div className="flex-1 relative group">
                  <input 
                    type="text" 
                    placeholder="Type your message here..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={isSending}
                    className="w-full bg-[#F8F7FF] border border-violet-50 rounded-[20px] py-3.5 px-5 text-sm focus:ring-4 focus:ring-[#7C5CFC]/10 focus:border-[#7C5CFC]/30 transition-all outline-none placeholder:text-[#c4bfd8]"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim() || isSending}
                  className="size-12 rounded-2xl bg-[#7C5CFC] hover:bg-[#6d4ef0] flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-200 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                >
                  <Send className={cn("size-5 text-white transition-transform", isSending ? "animate-pulse" : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5")} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white/10 backdrop-blur-[2px]">
            <div className="size-24 rounded-[32px] bg-gradient-to-br from-[#F2EEFF] to-white flex items-center justify-center mb-6 shadow-sm border border-white/60">
              <MessageSquare className="size-10 text-[#7C5CFC]" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-[#1a1033]">Your Inbox</h3>
            <p className="text-sm text-[#9490a8] mt-2 text-center max-w-[280px]">
              Select a conversation from the list to start chatting with experts or customers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
