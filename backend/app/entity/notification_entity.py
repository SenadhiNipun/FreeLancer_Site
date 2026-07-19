from sqlalchemy import Column, BIGINT, String, Text, Boolean, ForeignKey, TIMESTAMP, text
from sqlalchemy.orm import relationship
from app.config.database import Base
from app.entity.base_entity import BaseEntity

class NotificationEntity(Base, BaseEntity):
    __tablename__ = "notifications"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    user_id = Column(BIGINT, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), nullable=False) # TASK_AVAILABLE, BID_ACCEPTED, TASK_UPDATE, etc.
    
    related_id = Column(BIGINT, nullable=True) # e.g. task_id
    
    is_read = Column(Boolean, default=False, nullable=False)
    
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    # Relationships
    user = relationship("UserEntity")
