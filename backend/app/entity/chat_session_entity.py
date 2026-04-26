from sqlalchemy import Column, BIGINT, ForeignKey, text, TIMESTAMP, Boolean
from sqlalchemy.orm import relationship
from app.config.database import Base

class ChatSessionEntity(Base):
    __tablename__ = "chat_sessions"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    task_id = Column(BIGINT, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    customer_id = Column(BIGINT, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    writer_id = Column(BIGINT, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    is_active = Column(Boolean, default=True, nullable=False)
    
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP"),
        onupdate=text("CURRENT_TIMESTAMP"),
    )

    # Relationships
    task = relationship("TaskEntity")
    customer = relationship("UserEntity", foreign_keys=[customer_id])
    writer = relationship("UserEntity", foreign_keys=[writer_id])
    messages = relationship("ChatMessageEntity", back_populates="session", cascade="all, delete-orphan")
