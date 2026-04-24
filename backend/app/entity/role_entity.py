from sqlalchemy import Column, BIGINT, String, TIMESTAMP, text
from sqlalchemy.orm import relationship
from app.config.database import Base

class RoleEntity(Base):
    __tablename__ = "roles"

    id = Column(BIGINT, primary_key=True, index=True, autoincrement=True)
    name = Column(String(50), nullable=False, unique=True, index=True)
    description = Column(String(255), nullable=True)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP")
    )

    # Relationships
    user_roles = relationship("UserRoleEntity", back_populates="role", cascade="all, delete-orphan")
