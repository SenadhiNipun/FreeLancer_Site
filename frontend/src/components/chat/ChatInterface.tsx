"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Send, 
  Search, 
  MoreVertical, 
  User, 
  MessageSquare,
  Check,
  CheckCheck,
  ChevronLeft,
  Smile,
  Paperclip,
  FileText,
  Clock,
  X,
  Download,
  Loader2,
  File,
  Trash,
  DollarSign
} from "lucide-react";
import { chatService } from "@/services/chat.service";
import { authService } from "@/services/auth.service";
import { ChatSession, ChatMessage } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getFileUrl } from "@/lib/api-client";

const EMOJIS = [
  // Smileys & Emotions
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", 
  "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", 
  // Hand Gestures & People
  "👍", "👎", "👊", "✊", "🤛", "🤜", "🤞", "✌️", "🤟", "🤘", "👌", "🤌", "👈", "👉", "👆", "👇", 
  "☝️", "✋", "🤚", "🖐️", "🖖", "👋", "✍️", "👏", "🙌", "🙏", "💪", "🧠", "👀", "🗣️", "👤", "👥",
  // Academic & Office & Symbols
  "📝", "📚", "📖", "✏️", "🎓", "💼", "📅", "📊", "📈", "📉", "📁", "💻", "💡", "✨", "🔥", "⭐", 
  "🌟", "✅", "❌", "💯", "🔔", "📢", "💬", "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎"
];

export default function ChatInterface() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"open" | "closed">("open");
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [stagedFiles, setStagedFiles] = useState<{ file_name: string; file_url: string; mime_type?: string; file_size?: number }[]>([]);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const sessionIdParam = searchParams.get("session");

  const [showBidChangeModal, setShowBidChangeModal] = useState(false);
  const [proposedAmount, setProposedAmount] = useState("");
  const [bidChangeReason, setBidChangeReason] = useState("");
  const [isSubmittingBidChange, setIsSubmittingBidChange] = useState(false);
  const [bidChangeError, setBidChangeError] = useState("");

  const isCustomer = activeSession ? currentUserId === activeSession.customer_id : false;
  const isWriter = activeSession ? currentUserId === activeSession.writer_id : false;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleToggleSessionStatus = async () => {
    if (!activeSession) return;
    try {
      const updated = await chatService.toggleSessionStatus(activeSession.id);
      
      // Update session status in sessions list and activeSession
      setSessions(prev => prev.map(s => s.id === activeSession.id ? { ...s, is_active: updated.is_active } : s));
      setActiveSession(prev => prev ? { ...prev, is_active: updated.is_active } : null);
      setShowDropdown(false);
    } catch (error) {
      console.error("Failed to toggle session status:", error);
    }
  };

  const handleClearChatMessages = () => {
    setMessages([]);
    setShowDropdown(false);
  };

  const handleDeleteMessage = async (msgId: number) => {
    try {
      await chatService.deleteMessage(msgId);
      setMessages(prev => prev.filter(m => m.id !== msgId));
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

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
      fetchMessages(activeSession.id, true);
      const interval = setInterval(() => fetchMessages(activeSession.id, false), 5000); // Poll messages every 5s
      return () => clearInterval(interval);
    }
  }, [activeSession]);

  useEffect(() => {
    scrollToBottom(false);
  }, [messages]);

  const fetchSessions = async () => {
    try {
      const data = await chatService.getSessions();
      setSessions(data);
      // Synchronize activeSession with the latest data from fetchSessions
      setActiveSession(prev => {
        if (!prev) return null;
        const updated = data.find(s => s.id === prev.id);
        return updated || prev;
      });
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (sessionId: number, isInitial = false) => {
    try {
      const data = await chatService.getMessages(sessionId);
      setMessages(data);
      if (isInitial) {
        scrollToBottom(true);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasText = newMessage.trim().length > 0;
    const hasFiles = stagedFiles.length > 0;
    if (!activeSession || (!hasText && !hasFiles) || isSending) return;

    setIsSending(true);
    try {
      const sentMsg = await chatService.sendMessage(activeSession.id, { 
        message_text: newMessage,
        attachments: stagedFiles
      });
      setMessages(prev => [...prev, sentMsg]);
      setNewMessage("");
      setStagedFiles([]);
      scrollToBottom(true);

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
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleSendBidChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession || !proposedAmount || isSubmittingBidChange) return;
    
    const amount = parseFloat(proposedAmount);
    if (isNaN(amount) || amount <= 0) {
      setBidChangeError("Please enter a valid positive amount.");
      return;
    }
    
    setIsSubmittingBidChange(true);
    setBidChangeError("");
    try {
      const sentMsg = await chatService.sendMessage(activeSession.id, {
        message_text: bidChangeReason.trim() || `Proposed new bid amount: $${amount}`,
        message_type: "BID_CHANGE",
        proposed_amount: amount
      });
      
      setMessages(prev => [...prev, sentMsg]);
      setShowBidChangeModal(false);
      setProposedAmount("");
      setBidChangeReason("");
      
      // Update session locally to move it to the top
      setSessions(prev => prev.map(s => 
        s.id === activeSession.id 
          ? { ...s, updated_at: new Date().toISOString() } 
          : s
      ));
    } catch (error: any) {
      console.error("Failed to send bid change request:", error);
      setBidChangeError(error?.message || "Failed to submit bid change request. Please try again.");
    } finally {
      setIsSubmittingBidChange(false);
    }
  };

  const handleRespondToBidChange = async (messageId: number, action: 'ACCEPT' | 'REJECT') => {
    try {
      const updatedMsg = await chatService.respondToBidChange(messageId, action);
      // Update the message in messages array
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, bid_change_status: updatedMsg.bid_change_status } : m));
      // Fetch sessions to update task status/budget if accepted
      if (action === 'ACCEPT') {
        fetchSessions();
      }
    } catch (error) {
      console.error("Failed to respond to bid change:", error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingFile(true);
    try {
      const uploaded = await chatService.uploadAttachment(files[0]);
      setStagedFiles(prev => [...prev, {
        file_name: uploaded.file_name,
        file_url: uploaded.file_url,
        mime_type: uploaded.mime_type,
        file_size: uploaded.file_size
      }]);
    } catch (error) {
      console.error("Failed to upload file:", error);
    } finally {
      setIsUploadingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveStagedFile = (idx: number) => {
    setStagedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const scrollToBottom = (force = false) => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= 150;

    if (force || isAtBottom) {
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: force ? "auto" : "smooth"
        });
      }, 50);
    }
  };

  // Filter based on Search and Tabs
  const filteredSessions = [...sessions]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .filter(s => {
      const matchesSearch = s.other_party_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.task_title?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Let active tab split open/active tasks vs closed tasks dynamically
      const isSessionOpen = s.is_active !== false; 
      if (activeTab === "open") {
        return matchesSearch && isSessionOpen;
      } else {
        return matchesSearch && !isSessionOpen;
      }
    });

  if (isLoading && sessions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-[#F4F7F8] rounded-[2rem] border border-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Initializing OChat Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-white rounded-[2.5rem] border border-slate-150 shadow-xl overflow-hidden font-sans text-slate-800 animate-in fade-in duration-500">
      
      {/* ── Column B: Chat Session Inbox (Medium Sidebar) ──────────────── */}
      <div className={cn(
        "w-full md:w-[320px] bg-[#F4F7F8] border-r border-slate-200 flex flex-col flex-shrink-0",
        activeSession ? "hidden md:flex" : "flex"
      )}>
        {/* Header Row */}
        <div className="p-6 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Chats</h2>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Contact" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Capsule Tab Toggle */}
          <div className="flex p-1 bg-slate-200/60 rounded-2xl">
            <button 
              onClick={() => setActiveTab("open")}
              className={cn(
                "flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer select-none",
                activeTab === "open" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              )}
            >
              Open
            </button>
            <button 
              onClick={() => setActiveTab("closed")}
              className={cn(
                "flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer select-none",
                activeTab === "closed" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              )}
            >
              Closed
            </button>
          </div>
        </div>

        {/* Sessions Stream */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-6 space-y-1.5">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => {
              const isActive = activeSession?.id === session.id;
              return (
                <button
                  key={session.id}
                  onClick={() => setActiveSession(session)}
                  className={cn(
                    "w-full p-4 flex items-start gap-3.5 rounded-[1.5rem] transition-all text-left cursor-pointer select-none",
                    isActive 
                      ? "bg-[#EBF3FC] shadow-sm border border-blue-100" 
                      : "hover:bg-slate-200/40 border border-transparent"
                  )}
                >
                  {/* Circular Avatar with status dot */}
                  <div className="relative flex-shrink-0">
                    <div className="size-11 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border border-white shadow-sm overflow-hidden">
                      {session.other_party_profile_image_url ? (
                        <img 
                          src={getFileUrl(session.other_party_profile_image_url)} 
                          alt={session.other_party_name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500 bg-slate-100">
                          {session.other_party_name?.[0] || "C"}
                        </div>
                      )}
                    </div>
                    {/* Active indicator dot */}
                    <div className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                  </div>

                  {/* Body details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-slate-900 text-[13px] truncate pr-2">{session.other_party_name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">
                        {formatDistanceToNow(new Date(session.updated_at), { addSuffix: false })}
                      </span>
                    </div>
                    <p className={cn(
                      "text-xs font-semibold truncate mb-1",
                      isActive ? "text-blue-600" : "text-slate-500"
                    )}>
                      {session.task_title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">Click to chat</p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-20 text-center space-y-3">
              <MessageSquare className="size-8 text-slate-300 mx-auto opacity-70" />
              <p className="text-xs font-bold text-slate-400 italic">No {activeTab} chats found.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Column C: Active Chat Window ──────────────── */}
      <div className={cn(
        "flex-1 flex flex-col bg-[#F9FAFB]",
        !activeSession ? "hidden md:flex" : "flex"
      )}>
        {activeSession ? (
          <>
            {/* Premium Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-white/95 backdrop-blur-md flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-3.5">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden size-8 text-slate-600 hover:bg-slate-100"
                  onClick={() => setActiveSession(null)}
                >
                  <ChevronLeft className="size-5" />
                </Button>
                
                {/* Active user Avatar */}
                <div className="size-11 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 overflow-hidden shadow-inner flex-shrink-0">
                  {activeSession.other_party_profile_image_url ? (
                    <img 
                      src={getFileUrl(activeSession.other_party_profile_image_url)} 
                      alt={activeSession.other_party_name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">
                      {activeSession.other_party_name?.[0] || "C"}
                    </div>
                  )}
                </div>

                <div className="select-none cursor-default">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-[15px] leading-tight">{activeSession.other_party_name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[9px] font-bold border border-blue-100 shadow-sm uppercase tracking-wider">
                      Active Task
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-[#0D9488] uppercase tracking-wider mt-0.5">{activeSession.task_title}</p>
                </div>
              </div>

              {/* Utility action headers */}
              <div className="flex items-center gap-2 relative">
                {isWriter && activeSession.is_active !== false && !activeSession.is_bid_accepted && (
                  <Button
                    onClick={() => setShowBidChangeModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2 px-4 text-xs font-bold shadow-sm shadow-emerald-600/10 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <DollarSign className="size-3.5" />
                    Change Bid
                  </Button>
                )}
                
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={cn(
                    "p-2.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-200",
                    showDropdown && "bg-slate-100 border-slate-200 text-slate-800"
                  )}
                >
                  <MoreVertical className="size-4" />
                </button>

                {showDropdown && (
                  <div 
                    ref={dropdownRef}
                    className="absolute right-0 top-full mt-2 w-52 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col"
                  >
                    <button
                      type="button"
                      onClick={handleToggleSessionStatus}
                      className="px-4 py-2.5 text-xs font-bold text-left hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-2.5"
                    >
                      <span className={cn("size-2 rounded-full", activeSession.is_active !== false ? "bg-rose-500 animate-pulse" : "bg-emerald-500 animate-pulse")} />
                      {activeSession.is_active !== false ? "Close Chat Session" : "Reopen Chat Session"}
                    </button>
                    <button
                      type="button"
                      onClick={handleClearChatMessages}
                      className="px-4 py-2.5 text-xs font-bold text-left hover:bg-slate-50 text-slate-700 hover:text-rose-600 transition-colors border-t border-slate-100 flex items-center gap-2.5"
                    >
                      <Trash className="size-3.5 text-slate-400" />
                      Clear Chat Feed
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages Stream */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/30">
              <div className="flex justify-center my-2 select-none cursor-default">
                <div className="flex items-center gap-4 w-full max-w-[400px]">
                  <div className="h-[1px] bg-slate-200 flex-1" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">TODAY</span>
                  <div className="h-[1px] bg-slate-200 flex-1" />
                </div>
              </div>

              {messages.length > 0 ? (
                messages.map((msg, idx) => {
                  const isMine = msg.sender_id == currentUserId;
                  const messageAgeMs = new Date().getTime() - new Date(msg.created_at).getTime();
                  const isDeletable = isMine && messageAgeMs <= 120000;
                  const showDate = idx === 0 || 
                    new Date(msg.created_at).getDate() !== new Date(messages[idx-1].created_at).getDate();

                  const formattedTime = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <React.Fragment key={msg.id}>
                      {showDate && (
                        <div className="flex justify-center my-4 select-none cursor-default">
                          <span className="px-3 py-1 rounded-full bg-slate-200/50 text-[9px] font-bold text-slate-500 uppercase tracking-widest border border-slate-100">
                            {new Date(msg.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      
                      {/* Structured Message block */}
                      <div className={cn(
                        "flex flex-col w-full group animate-in fade-in slide-in-from-bottom-2 duration-300",
                        isMine ? "items-end" : "items-start"
                      )}>
                        
                        {/* 1. Header Name + Time Row */}
                        <div className="flex items-center gap-2 mb-1 px-11 text-[10px] font-bold text-slate-400">
                          {isMine ? (
                            <>
                              <span>{formattedTime}</span>
                              <span className="text-slate-500">You</span>
                            </>
                          ) : (
                            <>
                              <span className="text-slate-500">{activeSession.other_party_name}</span>
                              <span>{formattedTime}</span>
                            </>
                          )}
                        </div>

                        {/* 2. Avatar + Bubble Row */}
                        <div className={cn(
                          "flex items-end gap-2.5 max-w-[85%]",
                          isMine ? "flex-row-reverse" : "flex-row"
                        )}>
                          {/* Circular Avatar */}
                  <div className="size-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-500 flex-shrink-0 overflow-hidden shadow-sm border border-white">
                            {msg.sender_profile_image_url ? (
                              <img 
                                src={getFileUrl(msg.sender_profile_image_url)} 
                                alt="Avatar" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="size-3.5" />
                            )}
                          </div>

                          {/* Message Bubble container */}
                           <div className="flex flex-col items-start gap-1 w-full">
                             {msg.message_type === "BID_CHANGE" ? (
                               <div className={cn("flex flex-col gap-2.5 max-w-full w-full min-w-[280px] md:min-w-[320px]", isMine ? "items-end" : "items-start")}>
                                 <div className={cn(
                                   "p-5 rounded-2xl shadow-md border text-slate-900 leading-relaxed font-medium relative max-w-full w-full bg-white backdrop-blur",
                                   isMine 
                                     ? "border-emerald-100 shadow-emerald-500/5 bg-gradient-to-br from-white to-emerald-50/10" 
                                     : "border-slate-200 shadow-slate-500/5 bg-gradient-to-br from-white to-slate-50/10"
                                 )}>
                                   <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
                                     <div className="size-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600">
                                       <DollarSign className="size-5" />
                                     </div>
                                     <div className="min-w-0 flex-1 text-left">
                                       <h4 className="text-[13px] font-extrabold text-slate-900 truncate">Bid Change Request</h4>
                                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Proposed Budget</p>
                                     </div>
                                     <div className="ml-auto text-right">
                                       <span className="text-lg font-black text-emerald-600">${msg.proposed_amount}</span>
                                     </div>
                                   </div>
                                   
                                   {msg.message_text && (
                                     <div className="mb-4 text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 text-left">
                                       <p className="whitespace-pre-wrap">{msg.message_text}</p>
                                     </div>
                                   )}

                                   {/* Interactive status / buttons */}
                                   <div className="flex items-center justify-between gap-3 mt-2">
                                     {msg.bid_change_status === "PENDING" ? (
                                       isCustomer ? (
                                         <div className="flex items-center gap-2 w-full">
                                           <button
                                             type="button"
                                             onClick={() => handleRespondToBidChange(msg.id, 'ACCEPT')}
                                             className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 animate-in zoom-in-95 duration-150"
                                           >
                                             <Check className="size-3.5" />
                                             Accept
                                           </button>
                                           <button
                                             type="button"
                                             onClick={() => handleRespondToBidChange(msg.id, 'REJECT')}
                                             className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 animate-in zoom-in-95 duration-150"
                                           >
                                             <X className="size-3.5" />
                                             Decline
                                           </button>
                                         </div>
                                       ) : (
                                         <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 border border-amber-100/50 px-3 py-1.5 rounded-xl text-[11px] font-bold animate-in fade-in duration-200">
                                           <Clock className="size-3.5 animate-pulse" />
                                           <span>Waiting for client approval</span>
                                         </div>
                                       )
                                     ) : msg.bid_change_status === "ACCEPTED" ? (
                                       <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-3 py-1.5 rounded-xl text-[11px] font-bold animate-in zoom-in-95 duration-200">
                                         <CheckCheck className="size-3.5" />
                                         <span>Bid Change Approved</span>
                                       </div>
                                     ) : (
                                       <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50 border border-rose-100/50 px-3 py-1.5 rounded-xl text-[11px] font-bold animate-in zoom-in-95 duration-200">
                                         <X className="size-3.5" />
                                         <span>Bid Change Declined</span>
                                       </div>
                                     )}
                                   </div>
                                 </div>
                               </div>
                             ) : (
                               msg.message_text && (
                                 <div className={cn("flex items-center gap-2 max-w-full", isMine ? "flex-row-reverse" : "flex-row")}>
                                   {isDeletable && (
                                     <button
                                       type="button"
                                       onClick={() => handleDeleteMessage(msg.id)}
                                       title="Delete message (available for 2 mins)"
                                       className="opacity-0 group-hover:opacity-100 transition-all p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full shadow-sm border border-slate-200 bg-white/90 backdrop-blur flex-shrink-0 cursor-pointer"
                                     >
                                       <Trash className="size-3.5" />
                                     </button>
                                   )}
                                   <div className={cn(
                                     "px-4.5 py-3 rounded-2xl shadow-sm text-slate-900 text-[13px] leading-relaxed font-medium relative max-w-full cursor-default select-none",
                                     isMine 
                                       ? "bg-[#DEE9F7] rounded-tr-none border border-blue-200/30" 
                                       : "bg-[#ECF0F3] rounded-tl-none border border-slate-300/20"
                                   )}>
                                     <p className="whitespace-pre-wrap">{msg.message_text}</p>
                                   </div>
                                 </div>
                               )
                             )}

                             {/* Render Attachments */}
                             {msg.attachments && msg.attachments.length > 0 && (
                               <div className="flex flex-col gap-2 mt-1.5 w-full min-w-[240px] max-w-full">
                                 {msg.attachments.map((att) => (
                                   <a
                                     key={att.id}
                                     href={getFileUrl(att.file_url)}
                                     download={att.file_name}
                                     target="_blank"
                                     rel="noopener noreferrer"
                                     className={cn(
                                       "flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all text-left shadow-sm group/att hover:shadow-md max-w-full",
                                       isMine
                                         ? "bg-white/85 border-blue-100 hover:bg-white"
                                         : "bg-white/95 border-slate-200 hover:bg-white"
                                     )}
                                   >
                                     <div className="flex items-center gap-3 min-w-0 flex-1">
                                       <div className="size-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0 text-[#0D9488] group-hover/att:scale-105 transition-transform">
                                         <FileText className="size-4.5" />
                                       </div>
                                       <div className="flex flex-col min-w-0 flex-1">
                                         <span className="text-[12px] font-bold text-slate-800 truncate leading-snug group-hover/att:text-[#0D9488] transition-colors">
                                           {att.file_name}
                                         </span>
                                         {att.file_size && (
                                           <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                                             {(att.file_size / 1024).toFixed(1)} KB
                                           </span>
                                         )}
                                       </div>
                                     </div>
                                     <div className="p-2 rounded-xl bg-slate-50 border border-slate-150 text-slate-500 group-hover/att:bg-[#0D9488] group-hover/att:text-white group-hover/att:border-[#0D9488] transition-all flex-shrink-0">
                                       <Download className="size-4" />
                                     </div>
                                   </a>
                                 ))}
                               </div>
                             )}
                             
                             {/* Read Indicators for my messages */}
                             {isMine && (
                               <div className="flex justify-end w-full px-1 mt-0.5">
                                 {msg.is_read ? (
                                   <CheckCheck className="size-3 text-emerald-500" />
                                 ) : (
                                   <Check className="size-3 text-slate-400" />
                                 )}
                               </div>
                             )}
                           </div>
                        </div>

                      </div>
                    </React.Fragment>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-40 py-20">
                  <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="size-8 text-[#0D9488]" />
                  </div>
                  <p className="text-xs font-bold text-slate-600">Start a Premium Conversation</p>
                  <p className="text-[10px] text-slate-400 mt-1 text-center max-w-[220px]">Discuss project specifications, timelines, and budgets.</p>
                </div>
              )}
            </div>

            {/* Premium Two-Tier Composer Card */}
            <div className="p-6 bg-transparent border-t-0">
              <form onSubmit={handleSendMessage} className="bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col transition-all focus-within:ring-2 focus-within:ring-[#0D9488]/10 focus-within:border-[#0D9488]">
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Staged Attachments Container */}
                {stagedFiles.length > 0 && (
                  <div className="px-5 pt-4 pb-2 flex flex-wrap gap-2.5 border-b border-slate-100 bg-slate-50/50 rounded-t-3xl">
                    {stagedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-2xl pl-3.5 pr-2.5 py-2 shadow-sm animate-in zoom-in duration-200">
                        <FileText className="size-4 text-[#0D9488]" />
                        <div className="flex flex-col max-w-[150px]">
                          <span className="text-[11px] font-bold text-slate-800 truncate leading-snug">{file.file_name}</span>
                          {file.file_size && (
                            <span className="text-[9px] font-semibold text-slate-400">
                              {(file.file_size / 1024).toFixed(1)} KB
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveStagedFile(idx)}
                          className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tier 1: Text Entry Field */}
                <div className={cn("flex items-center px-5 py-4 gap-3", stagedFiles.length === 0 && "rounded-t-3xl")}>
                  <input 
                    ref={inputRef}
                    type="text" 
                    placeholder={isUploadingFile ? "Uploading attachment..." : "Write your message..."}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={isSending || isUploadingFile}
                    className="flex-1 bg-transparent border-none outline-none text-slate-900 text-sm placeholder:text-slate-400 h-10 w-full"
                  />
                  <Button 
                    type="submit" 
                    disabled={(!newMessage.trim() && stagedFiles.length === 0) || isSending || isUploadingFile}
                    className="size-10 rounded-xl bg-[#0D9488] hover:bg-[#0D9488]/90 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#0D9488]/20 transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100"
                  >
                    <Send className={cn("size-4.5 text-white transition-transform", isSending ? "animate-pulse" : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5")} />
                  </Button>
                </div>

                {/* Tier 2: Bottom Utility Action Row */}
                <div className="px-5 py-3 bg-[#F4F7F8] border-t border-slate-100 flex items-center justify-between text-slate-500 rounded-b-3xl">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <button 
                        type="button" 
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className={cn(
                          "p-2 rounded-lg hover:bg-slate-200/50 hover:text-slate-800 transition-colors cursor-pointer select-none",
                          showEmojiPicker && "bg-slate-200/80 text-slate-950"
                        )}
                      >
                        <Smile className="size-4 text-slate-400" />
                      </button>
                      
                      {showEmojiPicker && (
                        <div 
                          ref={emojiPickerRef}
                          className="absolute bottom-full left-0 mb-3 w-72 bg-white/95 backdrop-blur-md border border-slate-200 rounded-3xl shadow-2xl p-4.5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200 flex flex-col gap-3.5"
                        >
                          <div className="flex items-center justify-between px-1">
                            <span className="text-[11px] font-extrabold text-slate-800 tracking-wide uppercase">Select Emoji</span>
                            <button 
                              type="button" 
                              onClick={() => setShowEmojiPicker(false)}
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer select-none"
                            >
                              <X className="size-3" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-8 gap-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                            {EMOJIS.map((emoji, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleAddEmoji(emoji)}
                                className="size-7 flex items-center justify-center text-lg hover:bg-slate-100 rounded-lg active:scale-90 transition-all cursor-pointer select-none"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingFile || isSending}
                      className="p-2 rounded-lg hover:bg-slate-200/50 hover:text-slate-800 transition-colors relative cursor-pointer select-none"
                    >
                      {isUploadingFile ? (
                        <Loader2 className="size-4 text-[#0D9488] animate-spin" />
                      ) : (
                        <Paperclip className="size-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                    {newMessage.length}/1000
                  </span>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#F9FAFB] p-8">
            <div className="size-20 rounded-[2rem] bg-gradient-to-br from-[#0D9488]/10 to-transparent flex items-center justify-center mb-6 shadow-sm border border-slate-100">
              <MessageSquare className="size-9 text-[#0D9488]" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Your Inbox</h3>
            <p className="text-xs text-slate-400 mt-2 text-center max-w-[260px] leading-relaxed">
              Select a conversation from the sidebar list to start chatting with experts or customers using OChat SaaS Messaging.
            </p>
          </div>
        )}
      </div>

      {/* Bid Change Modal */}
      {showBidChangeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5 flex-row">
                <div className="size-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <DollarSign className="size-4.5" />
                </div>
                <div className="text-left">
                  <h3 className="font-extrabold text-slate-900 text-sm">Change Bid Request</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Adjust your proposal</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowBidChangeModal(false);
                  setBidChangeError("");
                }}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
            
            <form onSubmit={handleSendBidChange} className="p-6 space-y-4">
              {bidChangeError && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-xl text-left">
                  {bidChangeError}
                </div>
              )}

              <div className="space-y-1.5 text-left">
                <label htmlFor="proposedAmount" className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">Proposed Bid Amount ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    id="proposedAmount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                    value={proposedAmount}
                    onChange={(e) => setProposedAmount(e.target.value)}
                    disabled={isSubmittingBidChange}
                    className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-2xl py-3 pl-10 pr-4 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label htmlFor="bidChangeReason" className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">Justification / Reason (Optional)</label>
                <textarea
                  id="bidChangeReason"
                  rows={3}
                  placeholder="Explain to the client why you're proposing this change..."
                  value={bidChangeReason}
                  onChange={(e) => setBidChangeReason(e.target.value)}
                  disabled={isSubmittingBidChange}
                  className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-2xl py-3 px-4 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowBidChangeModal(false);
                    setBidChangeError("");
                  }}
                  disabled={isSubmittingBidChange}
                  className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 active:scale-95 transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBidChange}
                  className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/15 hover:shadow active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmittingBidChange ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="size-3.5" />
                      Send Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
