from sqlalchemy import Column, BIGINT, String, Integer, Boolean
from app.config.database import Base
from app.entity.base_entity import BaseEntity

class EducationLevelEntity(Base, BaseEntity):
    __tablename__ = "education_levels"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
