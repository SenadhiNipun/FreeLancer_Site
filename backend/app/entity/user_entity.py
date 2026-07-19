from sqlalchemy import Column, BIGINT, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from app.entity.base_entity import BaseEntity
import uuid
from typing import Optional

class UserEntity(Base, BaseEntity):
    __tablename__ = "users"

    id = Column(BIGINT, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), nullable=False, unique=True, default=lambda: str(uuid.uuid4()))
    
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    username = Column(String(100), nullable=True, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    
    mobile_number = Column(String(20), nullable=True, unique=True, index=True)
    whatsapp_number = Column(String(20), nullable=True)
    
    role_id = Column(BIGINT, ForeignKey("roles.id"), nullable=True)
    
    is_email_verified = Column(Boolean, default=False, nullable=False)
    is_mobile_verified = Column(Boolean, default=False, nullable=False)
    
    status = Column(String(50), default="PENDING", nullable=False) # ACTIVE, INACTIVE, SUSPENDED, PENDING
    
    verification_code = Column(String(10), nullable=True)
    verification_code_expires_at = Column(DateTime, nullable=True)
    
    reset_password_code = Column(String(10), nullable=True)
    reset_password_expires_at = Column(DateTime, nullable=True)
    
    last_login_at = Column(DateTime, nullable=True)
    
    created_by = Column(BIGINT, nullable=True)
    updated_by = Column(BIGINT, nullable=True)

    # Relationships
    role = relationship("RoleEntity", back_populates="users")
    user_roles = relationship("UserRoleEntity", back_populates="user", cascade="all, delete-orphan")
    user_profile = relationship("UserProfileEntity", back_populates="user", uselist=False, cascade="all, delete-orphan")
    writer_profile = relationship(
        "WriterProfileEntity",
        primaryjoin="UserEntity.id == WriterProfileEntity.user_id",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )

    @property
    def profile_image_url(self) -> Optional[str]:
        return self.user_profile.profile_image_url if self.user_profile else None

