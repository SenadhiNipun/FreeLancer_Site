from sqlalchemy import Column, BIGINT, String, Integer, Text, ForeignKey, TIMESTAMP, DateTime, text
from sqlalchemy.orm import relationship
from backend.app.config.database import Base

class WriterProfileEntity(Base):
    __tablename__ = "writer_profiles"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    user_id = Column(BIGINT, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    full_name = Column(String(100), nullable=True)
    phone_number = Column(String(20), nullable=True)
    whatsapp_number = Column(String(20), nullable=True)
    national_id_number = Column(String(50), nullable=True)
    profile_image_url = Column(String(255), nullable=True)
    university = Column(String(255), nullable=True)
    
    # qualification is still here for legacy/primary but moving to many-to-many/list soon
    qualification = Column(String(255), nullable=True) 
    experience_years = Column(Integer, nullable=True)
    bio = Column(Text, nullable=True)
    
    approval_status = Column(String(50), nullable=False)
    approved_by = Column(BIGINT, ForeignKey("users.id"), nullable=True)
    approved_at = Column(DateTime, nullable=True)
    suspended_at = Column(DateTime, nullable=True)
    
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP")
    )

    user = relationship("UserEntity", back_populates="writer_profile", foreign_keys=[user_id])
    approver = relationship("UserEntity", foreign_keys=[approved_by])
    
    # New relationship for multiple qualifications
    qualifications = relationship("WriterQualificationEntity", back_populates="writer_profile", cascade="all, delete-orphan")