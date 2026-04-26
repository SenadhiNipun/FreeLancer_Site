from sqlalchemy import Column, BIGINT, String
from sqlalchemy.orm import relationship
from app.config.database import Base
from app.entity.base_entity import BaseEntity

class RoleEntity(Base, BaseEntity):
    __tablename__ = "roles"

    id = Column(BIGINT, primary_key=True, index=True, autoincrement=True)
    role_name = Column(String(50), nullable=False, unique=True)
    description = Column(String(255), nullable=True)

    # Relationships
    user_roles = relationship("UserRoleEntity", back_populates="role", cascade="all, delete-orphan")
    users = relationship("UserEntity", back_populates="role")
