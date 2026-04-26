export interface ChatMessage {
  id: number;
  session_id: number;
  sender_id: number;
  message_text: string;
  is_read: boolean;
  created_at: string;
}

export interface ChatSession {
  id: number;
  task_id: number;
  customer_id: number;
  writer_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  task_title?: string;
  other_party_name?: string;
}

export interface SendMessageRequest {
  message_text: string;
}
