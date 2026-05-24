from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional

class ChatMessageBase(BaseModel):
    message_text: str

class ChatAttachmentCreate(BaseModel):
    file_name: str
    file_url: str
    mime_type: Optional[str] = None
    file_size: Optional[int] = None

class ChatMessageCreate(ChatMessageBase):
    attachments: Optional[List[ChatAttachmentCreate]] = None
    message_type: Optional[str] = "TEXT"
    proposed_amount: Optional[float] = None

class ChatMessageAttachmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    message_id: int
    file_name: str
    file_url: str
    mime_type: Optional[str] = None
    file_size: Optional[int] = None

class ChatMessageResponse(ChatMessageBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    session_id: int
    sender_id: int
    is_read: bool
    created_at: datetime
    sender_profile_image_url: Optional[str] = None
    attachments: Optional[List[ChatMessageAttachmentResponse]] = []
    message_type: str = "TEXT"
    proposed_amount: Optional[float] = None
    bid_change_status: Optional[str] = None

class ChatSessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    task_id: int
    customer_id: int
    writer_id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    # Optional: include task title or other user details
    task_title: Optional[str] = None
    other_party_name: Optional[str] = None
    other_party_profile_image_url: Optional[str] = None

class ChatSessionListResponse(BaseModel):
    sessions: List[ChatSessionResponse]
