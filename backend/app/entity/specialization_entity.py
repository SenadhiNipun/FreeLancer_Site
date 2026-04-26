from sqlalchemy import Column, BIGINT, String, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from app.entity.base_entity import BaseEntity

class SpecializationEntity(Base, BaseEntity):
    __tablename__ = "specializations"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    academic_category_id = Column(BIGINT, ForeignKey("academic_categories.id"), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    # Relationships
    academic_category = relationship("AcademicCategoryEntity", back_populates="specializations")
