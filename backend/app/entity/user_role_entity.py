from sqlalchemy import Column, BIGINT, ForeignKey, TIMESTAMP, text
from sqlalchemy.orm import relationship
from backend.app.config.database import Base

class UserRoleEntity(Base):
    __tablename__ = "user_roles"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    user_id = Column(BIGINT, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role_id = Column(BIGINT, ForeignKey("roles.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    # Optional: if you want back-references from the junction table itself
    user = relationship("UserEntity", back_populates="user_roles")
    role = relationship("RoleEntity", back_populates="user_roles")
