from sqlalchemy import Column, Integer, String, TIMESTAMP, text
from sqlalchemy.orm import relationship

from backend.app.config.database import Base


class RoleEntity(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True,autoincrement=True)
    name = Column(String(50), nullable=False, unique=True, index=True)
    description = Column(String(255), nullable=True)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    users = relationship("UserEntity", back_populates="role")