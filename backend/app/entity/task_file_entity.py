from sqlalchemy import Column, BIGINT, String, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from app.entity.base_entity import BaseEntity

class TaskFileEntity(Base, BaseEntity):
    __tablename__ = "task_files"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    task_id = Column(BIGINT, ForeignKey("tasks.id"), nullable=False)
    uploaded_by_user_id = Column(BIGINT, ForeignKey("users.id"), nullable=False)
    
    file_type = Column(String(50), nullable=False) # REQUIREMENT_FILE, REFERENCE_FILE, etc.
    file_url = Column(String(255), nullable=False)
    file_name = Column(String(255), nullable=False)
    mime_type = Column(String(100), nullable=True)
    file_size = Column(BIGINT, nullable=True)

    # Relationships
    task = relationship("TaskEntity", back_populates="files")
    uploader = relationship("UserEntity")
