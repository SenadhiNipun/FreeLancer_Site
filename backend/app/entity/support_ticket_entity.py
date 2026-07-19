from sqlalchemy import Column, BIGINT, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from app.entity.base_entity import BaseEntity


class SupportTicketEntity(Base, BaseEntity):
    __tablename__ = "support_tickets"

    id            = Column(BIGINT, primary_key=True, autoincrement=True)
    ticket_number = Column(String(20), unique=True, nullable=False)   # TKT-0001
    user_id       = Column(BIGINT, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subject       = Column(String(255), nullable=False)
    message       = Column(Text, nullable=False)
    status        = Column(String(20), default="OPEN", nullable=False)  # OPEN | IN_PROGRESS | RESOLVED | CLOSED

    user    = relationship("UserEntity")
    replies = relationship("SupportTicketReplyEntity", back_populates="ticket",
                           order_by="SupportTicketReplyEntity.created_at")
