from sqlalchemy import Column, BIGINT, Text, Boolean, ForeignKey, TIMESTAMP, text
from sqlalchemy.orm import relationship
from app.config.database import Base


class AdminConversationMessageEntity(Base):
    __tablename__ = "admin_conversation_messages"

    id              = Column(BIGINT, primary_key=True, autoincrement=True)
    conversation_id = Column(BIGINT, ForeignKey("admin_conversations.id", ondelete="CASCADE"), nullable=False)
    sender_id       = Column(BIGINT, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    message         = Column(Text, nullable=False)
    is_admin        = Column(Boolean, default=False, nullable=False)

    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    conversation = relationship("AdminConversationEntity", back_populates="messages")
    sender       = relationship("UserEntity")
