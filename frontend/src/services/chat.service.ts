import { apiClient } from "@/lib/api-client";
import { ChatMessage, ChatSession, SendMessageRequest } from "@/types/chat";

export const chatService = {
  getSessions: async (): Promise<ChatSession[]> => {
    const response = await apiClient('/api/v1/chat/sessions', {
      method: 'GET',
    });
    return response.results;
  },

  getMessages: async (sessionId: number): Promise<ChatMessage[]> => {
    const response = await apiClient(`/api/v1/chat/sessions/${sessionId}/messages`, {
      method: 'GET',
    });
    return response.results;
  },

  sendMessage: async (sessionId: number, data: SendMessageRequest): Promise<ChatMessage> => {
    const response = await apiClient(`/api/v1/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.results;
  },
};
