from sqlalchemy import Column, BIGINT, ForeignKey, text, TIMESTAMP, Text, Boolean, String, Numeric
from sqlalchemy.orm import relationship
from app.config.database import Base

class ChatMessageEntity(Base):
    __tablename__ = "chat_messages"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    session_id = Column(BIGINT, ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False)
    sender_id = Column(BIGINT, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    message_text = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    
    message_type = Column(String(50), default="TEXT", nullable=False) # TEXT, BID_CHANGE
    proposed_amount = Column(Numeric(10, 2), nullable=True)
    bid_change_status = Column(String(50), nullable=True) # PENDING, ACCEPTED, REJECTED
    
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    # Relationships
    session = relationship("ChatSessionEntity", back_populates="messages")
    sender = relationship("UserEntity", foreign_keys=[sender_id])
    attachments = relationship("ChatMessageAttachmentEntity", back_populates="message", cascade="all, delete-orphan")
