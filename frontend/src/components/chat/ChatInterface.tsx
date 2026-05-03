"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
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
import { authService } from "@/services/auth.service";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const sessionIdParam = searchParams.get("session");

  useEffect(() => {
    const fetchUser = async () => {
      let userId = null;
      const userStr = localStorage.getItem('user');
      
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          userId = user.id;
        } catch (e) {
          console.error("Failed to parse user from local storage");
        }
      }

      if (!userId) {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const meRes = await authService.me(token);
            if (meRes.results) {
              const u = meRes.results as any;
              userId = u.id;
              localStorage.setItem('user', JSON.stringify({ id: u.id, email: u.email }));
            }
          } catch (e) {
            console.error("Failed to fetch current user");
          }
        }
      }
      
      setCurrentUserId(userId);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 10000); // Poll sessions every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sessionIdParam && sessions.length > 0) {
      const session = sessions.find(s => s.id === parseInt(sessionIdParam));
      if (session) {
        setActiveSession(session);
      }
    }
  }, [sessionIdParam, sessions]);

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

      // Update session locally to move it to the top
      setSessions(prev => prev.map(s => 
        s.id === activeSession.id 
          ? { ...s, updated_at: new Date().toISOString() } 
          : s
      ));
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
      // Re-focus the input after sending
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredSessions = [...sessions]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .filter(s => 
      s.other_party_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.task_title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (isLoading && sessions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[600px] glass rounded-[32px] border-border/50">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Loading Chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[750px] glass rounded-[32px] border-border/50 shadow-2xl overflow-hidden">
      
      {/* ── Sessions List (Sidebar) ──────────────── */}
      <div className={cn(
        "w-full md:w-[350px] border-r border-border/50 flex flex-col bg-card/30",
        activeSession ? "hidden md:flex" : "flex"
      )}>
        <div className="p-6 border-b border-border/50">
          <h2 className="text-xl font-bold text-foreground mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/20 border border-border/50 rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/30"
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
                  "w-full p-5 flex items-start gap-4 transition-all hover:bg-primary/5 text-left border-b border-border/50",
                  activeSession?.id === session.id && "bg-primary/10 border-l-[4px] border-l-primary pl-4"
                )}
              >
                <div className="size-12 rounded-2xl bg-gradient-to-br from-[#7C5CFC] to-[#A78BFA] flex items-center justify-center flex-shrink-0 shadow-sm text-white">
                  <User className="size-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-foreground truncate">{session.task_title}</span>
                    <span className="text-[10px] text-muted-foreground/60 font-medium">
                      {formatDistanceToNow(new Date(session.updated_at), { addSuffix: false })}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-primary truncate mb-1">{session.other_party_name}</p>
                  <p className="text-xs text-muted-foreground truncate">Click to start chatting</p>
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
        "flex-1 flex flex-col bg-card/20",
        !activeSession ? "hidden md:flex" : "flex"
      )}>
        {activeSession ? (
          <>
            {/* Header */}
            <div className="p-5 border-b border-border/50 bg-card/80 backdrop-blur-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden size-8 text-primary"
                  onClick={() => setActiveSession(null)}
                >
                  <ChevronLeft className="size-5" />
                </Button>
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <User className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground leading-tight">{activeSession.task_title}</h3>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{activeSession.other_party_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-primary/5 rounded-lg transition-colors text-muted-foreground/50 hover:text-primary">
                  <MoreVertical className="size-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('/grid-light.svg')] bg-center">
              {messages.length > 0 ? (
                messages.map((msg, idx) => {
                  const isMine = msg.sender_id == currentUserId;
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
                            ? "bg-primary text-white rounded-tr-none shadow-primary/20" 
                            : "bg-card text-foreground rounded-tl-none border border-border/50"
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
            <div className="p-5 bg-card/80 backdrop-blur-md border-t border-border/50">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <div className="flex-1 relative group">
                  <input 
                    ref={inputRef}
                    type="text" 
                    placeholder="Type your message here..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={isSending}
                    className="w-full bg-muted/20 border border-border/50 rounded-[20px] py-3.5 px-5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all outline-none placeholder:text-muted-foreground/30"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim() || isSending}
                  className="size-12 rounded-2xl bg-primary hover:bg-primary/90 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                >
                  <Send className={cn("size-5 text-white transition-transform", isSending ? "animate-pulse" : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5")} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-card/10 backdrop-blur-[2px]">
            <div className="size-24 rounded-[32px] glass bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center mb-6 shadow-sm border border-border/50">
              <MessageSquare className="size-10 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-foreground">Your Inbox</h3>
            <p className="text-sm text-muted-foreground mt-2 text-center max-w-[280px]">
              Select a conversation from the list to start chatting with experts or customers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
