from sqlalchemy import Column, BIGINT, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from app.entity.base_entity import BaseEntity
from datetime import datetime

class TaskAssignmentEntity(Base, BaseEntity):
    __tablename__ = "task_assignments"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    task_id = Column(BIGINT, ForeignKey("tasks.id"), nullable=False)
    writer_id = Column(BIGINT, ForeignKey("users.id"), nullable=False) # Refers to user with WRITER role
    assigned_by_admin_id = Column(BIGINT, ForeignKey("users.id"), nullable=True)
    
    assignment_status = Column(String(50), default="PENDING", nullable=False) # PENDING, ACCEPTED, REJECTED, CANCELLED
    
    assigned_at = Column(DateTime, default=datetime.now)
    accepted_at = Column(DateTime, nullable=True)
    rejected_at = Column(DateTime, nullable=True)

    # Relationships
    task = relationship("TaskEntity", back_populates="assignments")
    writer = relationship("UserEntity", foreign_keys=[writer_id])
    admin = relationship("UserEntity", foreign_keys=[assigned_by_admin_id])
