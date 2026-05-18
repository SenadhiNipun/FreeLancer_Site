export interface ChatMessageAttachment {
  id: number;
  message_id: number;
  file_name: string;
  file_url: string;
  mime_type?: string;
  file_size?: number;
}

export interface ChatMessage {
  id: number;
  session_id: number;
  sender_id: number;
  message_text: string;
  is_read: boolean;
  created_at: string;
  sender_profile_image_url?: string;
  attachments?: ChatMessageAttachment[];
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
  other_party_profile_image_url?: string;
}

export interface SendMessageRequest {
  message_text: string;
  attachments?: Omit<ChatMessageAttachment, "id" | "message_id">[];
}
