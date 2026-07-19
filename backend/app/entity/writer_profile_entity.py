from sqlalchemy import Column, BIGINT, String, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from app.entity.base_entity import BaseEntity

class WriterProfileEntity(Base, BaseEntity):
    __tablename__ = "writer_profiles"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    user_id = Column(BIGINT, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    education_level_id = Column(BIGINT, ForeignKey("education_levels.id"), nullable=True)
    institution_name = Column(String(255), nullable=True)
    academic_status = Column(String(50), nullable=True) # CURRENTLY_STUDYING, COMPLETED
    
    academic_category_id = Column(BIGINT, ForeignKey("academic_categories.id"), nullable=True)
    specialization_id = Column(BIGINT, ForeignKey("specializations.id"), nullable=True)
    
    city = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    
    bio = Column(Text, nullable=True)
    experience_years = Column(Integer, nullable=True)
    
    profile_status = Column(String(50), default="INCOMPLETE", nullable=False) # INCOMPLETE, PENDING_APPROVAL, APPROVED, REJECTED, SUSPENDED

    # Relationships
    user = relationship("UserEntity", back_populates="writer_profile", foreign_keys=[user_id])
    education_level = relationship("EducationLevelEntity")
    academic_category = relationship("AcademicCategoryEntity")
    specialization = relationship("SpecializationEntity")
    
    documents = relationship("WriterDocumentEntity", back_populates="writer_profile", cascade="all, delete-orphan")
    qualifications = relationship("WriterQualificationEntity", back_populates="writer_profile", cascade="all, delete-orphan")
