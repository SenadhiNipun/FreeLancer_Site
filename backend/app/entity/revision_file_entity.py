from sqlalchemy import Column, BIGINT, String, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from app.entity.base_entity import BaseEntity


class RevisionFileEntity(Base, BaseEntity):
    __tablename__ = "revision_files"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    revision_id = Column(BIGINT, ForeignKey("task_revisions.id"), nullable=False)
    uploaded_by_user_id = Column(BIGINT, ForeignKey("users.id"), nullable=False)

    file_name = Column(String(255), nullable=False)
    file_url = Column(Text, nullable=False)
    mime_type = Column(String(100), nullable=True)
    file_size = Column(Integer, nullable=True)

    # Relationships
    revision = relationship("TaskRevisionEntity", back_populates="files")
    uploader = relationship("UserEntity")
