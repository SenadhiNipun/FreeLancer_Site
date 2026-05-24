import { apiClient } from "@/lib/api-client";
import { ChatMessage, ChatSession, SendMessageRequest } from "@/types/chat";

export const chatService = {
  getSessions: async (): Promise<ChatSession[]> => {
    const response = (await apiClient('/api/v1/chat/sessions', {
      method: 'GET',
    })) as any;
    return response.results;
  },

  getMessages: async (sessionId: number): Promise<ChatMessage[]> => {
    const response = (await apiClient(`/api/v1/chat/sessions/${sessionId}/messages`, {
      method: 'GET',
    })) as any;
    return response.results;
  },

  sendMessage: async (sessionId: number, data: SendMessageRequest): Promise<ChatMessage> => {
    const response = (await apiClient(`/api/v1/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    })) as any;
    return response.results;
  },

  uploadAttachment: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = (await apiClient('/api/v1/chat/upload', {
      method: 'POST',
      body: formData,
    })) as any;
    return response.results;
  },

  toggleSessionStatus: async (sessionId: number): Promise<any> => {
    const response = (await apiClient(`/api/v1/chat/sessions/${sessionId}/toggle`, {
      method: 'PUT',
    })) as any;
    return response.results;
  },

  deleteMessage: async (messageId: number): Promise<any> => {
    const response = (await apiClient(`/api/v1/chat/messages/${messageId}`, {
      method: 'DELETE',
    })) as any;
    return response.results;
  },
  
  respondToBidChange: async (messageId: number, action: 'ACCEPT' | 'REJECT'): Promise<any> => {
    const response = (await apiClient(`/api/v1/chat/messages/${messageId}/respond-bid-change?action=${action}`, {
      method: 'POST',
    })) as any;
    return response.results;
  },

  initializeChat: async (taskId: number, writerId: number): Promise<{ id: number }> => {
    const response = (await apiClient(`/api/v1/chat/sessions/initialize?task_id=${taskId}&writer_id=${writerId}`, {
      method: 'POST',
    })) as any;
    return response.results;
  },
};
