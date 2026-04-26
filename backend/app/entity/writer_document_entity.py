from sqlalchemy import Column, BIGINT, String, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from app.entity.base_entity import BaseEntity

class WriterDocumentEntity(Base, BaseEntity):
    __tablename__ = "writer_documents"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    writer_profile_id = Column(BIGINT, ForeignKey("writer_profiles.id"), nullable=False)
    
    document_type = Column(String(50), nullable=False) # NIC, PASSPORT, CV, CERTIFICATE, etc.
    file_url = Column(String(255), nullable=False)
    file_name = Column(String(255), nullable=False)
    mime_type = Column(String(100), nullable=True)
    
    status = Column(String(50), default="PENDING", nullable=False) # PENDING, APPROVED, REJECTED
    remarks = Column(String(255), nullable=True)

    # Relationships
    writer_profile = relationship("WriterProfileEntity", back_populates="documents")
