from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional

class ChatMessageBase(BaseModel):
    message_text: str

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessageResponse(ChatMessageBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    session_id: int
    sender_id: int
    is_read: bool
    created_at: datetime
    sender_profile_image_url: Optional[str] = None

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
