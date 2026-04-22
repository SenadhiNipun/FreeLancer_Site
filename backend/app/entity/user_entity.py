from sqlalchemy import Column, BIGINT, String, Boolean, DateTime, TIMESTAMP, text
from sqlalchemy.orm import relationship
from backend.app.config.database import Base
import uuid

class UserEntity(Base):
    __tablename__ = "users"

    id = Column(BIGINT, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String(36), nullable=False, unique=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), nullable=False, unique=True, index=True)
    username = Column(String(100), nullable=True, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    verification_code = Column(String(10), nullable=True)
    verification_code_expires_at = Column(DateTime, nullable=True)
    
    reset_password_code = Column(String(10), nullable=True)
    reset_password_expires_at = Column(DateTime, nullable=True)
    
    last_login_at = Column(DateTime, nullable=True)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP")
    )
    
    created_by = Column(BIGINT, nullable=True)
    updated_by = Column(BIGINT, nullable=True)

    # Relationships
    user_roles = relationship("UserRoleEntity", back_populates="user", cascade="all, delete-orphan")
    user_profile = relationship("UserProfileEntity", back_populates="user", uselist=False, cascade="all, delete-orphan")
    writer_profile = relationship(
        "WriterProfileEntity",
        primaryjoin="UserEntity.id == WriterProfileEntity.user_id",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )