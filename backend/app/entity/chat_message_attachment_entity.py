from sqlalchemy import Column, BIGINT, String, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from app.entity.base_entity import BaseEntity


class ChatMessageAttachmentEntity(Base, BaseEntity):
    __tablename__ = "chat_message_attachments"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    message_id = Column(BIGINT, ForeignKey("chat_messages.id", ondelete="CASCADE"), nullable=False)

    file_name = Column(String(255), nullable=False)
    file_url = Column(Text, nullable=False)
    mime_type = Column(String(100), nullable=True)
    file_size = Column(Integer, nullable=True)

    # Relationships
    message = relationship("ChatMessageEntity", back_populates="attachments")
