from sqlalchemy import Column, BIGINT, String, ForeignKey, TIMESTAMP, text
from sqlalchemy.orm import relationship
from app.config.database import Base


class AdminConversationEntity(Base):
    __tablename__ = "admin_conversations"

    id      = Column(BIGINT, primary_key=True, autoincrement=True)
    user_id = Column(BIGINT, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subject = Column(String(255), nullable=True)

    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP"),
        onupdate=text("CURRENT_TIMESTAMP"),
    )

    user     = relationship("UserEntity")
    messages = relationship(
        "AdminConversationMessageEntity",
        back_populates="conversation",
        cascade="all, delete-orphan",
        order_by="AdminConversationMessageEntity.created_at",
    )
