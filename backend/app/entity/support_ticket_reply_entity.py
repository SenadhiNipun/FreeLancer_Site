from sqlalchemy import Column, BIGINT, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from app.entity.base_entity import BaseEntity


class SupportTicketReplyEntity(Base, BaseEntity):
    __tablename__ = "support_ticket_replies"

    id        = Column(BIGINT, primary_key=True, autoincrement=True)
    ticket_id = Column(BIGINT, ForeignKey("support_tickets.id", ondelete="CASCADE"), nullable=False)
    user_id   = Column(BIGINT, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    message   = Column(Text, nullable=False)
    is_admin  = Column(Boolean, default=False, nullable=False)

    ticket = relationship("SupportTicketEntity", back_populates="replies")
    user   = relationship("UserEntity")
