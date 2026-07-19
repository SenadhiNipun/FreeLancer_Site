from sqlalchemy import Column, BIGINT, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from app.entity.base_entity import BaseEntity
from datetime import datetime

class TaskRevisionEntity(Base, BaseEntity):
    __tablename__ = "task_revisions"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    task_id = Column(BIGINT, ForeignKey("tasks.id"), nullable=False)
    submission_id = Column(BIGINT, ForeignKey("task_submissions.id"), nullable=False)
    requested_by_user_id = Column(BIGINT, ForeignKey("users.id"), nullable=False)
    
    revision_note = Column(Text, nullable=False)
    revision_status = Column(String(50), default="REQUESTED", nullable=False) # REQUESTED, IN_PROGRESS, COMPLETED, REJECTED
    
    requested_at = Column(DateTime, default=datetime.now)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    task = relationship("TaskEntity", back_populates="revisions")
    submission = relationship("TaskSubmissionEntity")
    requester = relationship("UserEntity")
    files = relationship("RevisionFileEntity", back_populates="revision", cascade="all, delete-orphan")
