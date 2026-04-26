from sqlalchemy import Column, BIGINT, String, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from app.entity.base_entity import BaseEntity

class SubmissionFileEntity(Base, BaseEntity):
    __tablename__ = "submission_files"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    submission_id = Column(BIGINT, ForeignKey("task_submissions.id"), nullable=False)
    
    file_url = Column(String(255), nullable=False)
    file_name = Column(String(255), nullable=False)
    mime_type = Column(String(100), nullable=True)
    file_size = Column(BIGINT, nullable=True)

    # Relationships
    submission = relationship("TaskSubmissionEntity", back_populates="files")
