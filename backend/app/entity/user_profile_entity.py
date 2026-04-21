from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from backend.app.config.database import Base


class UserProfileEntity(Base):
    __tablename__ = "user_profiles"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    university = Column(String(255), nullable=True)
    course = Column(String(255), nullable=True)
    address = Column(Text, nullable=True)
    profile_image_url = Column(String(255), nullable=True)

    user = relationship("UserEntity", back_populates="user_profile")