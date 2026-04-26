from sqlalchemy import Column, BIGINT, String, Integer, Boolean
from sqlalchemy.orm import relationship
from app.config.database import Base
from app.entity.base_entity import BaseEntity

class AcademicCategoryEntity(Base, BaseEntity):
    __tablename__ = "academic_categories"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    # Relationships
    specializations = relationship("SpecializationEntity", back_populates="academic_category", cascade="all, delete-orphan")
