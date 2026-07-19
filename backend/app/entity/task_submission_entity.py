from sqlalchemy import Column, BIGINT, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from app.entity.base_entity import BaseEntity
from datetime import datetime

class TaskSubmissionEntity(Base, BaseEntity):
    __tablename__ = "task_submissions"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    task_id = Column(BIGINT, ForeignKey("tasks.id"), nullable=False)
    writer_id = Column(BIGINT, ForeignKey("users.id"), nullable=False)
    
    submission_note = Column(Text, nullable=True)
    submission_status = Column(String(50), default="DRAFT_SUBMISSION", nullable=False) 
    # DRAFT_SUBMISSION, FINAL_SUBMISSION, APPROVED_BY_CUSTOMER, REVISION_REQUESTED
    
    submitted_at = Column(DateTime, default=datetime.now)

    # Relationships
    task = relationship("TaskEntity", back_populates="submissions")
    writer = relationship("UserEntity")
    files = relationship("SubmissionFileEntity", back_populates="submission", cascade="all, delete-orphan")
