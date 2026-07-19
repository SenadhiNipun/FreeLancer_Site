from sqlalchemy import Column, BIGINT, String, Text, ForeignKey, TIMESTAMP, text
from sqlalchemy.orm import relationship
from app.config.database import Base

class UserProfileEntity(Base):
    __tablename__ = "user_profiles"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    user_id = Column(BIGINT, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    full_name = Column(String(100), nullable=True)
    phone_number = Column(String(20), nullable=True)
    profile_image_url = Column(String(255), nullable=True)
    university = Column(String(255), nullable=True)
    course = Column(String(255), nullable=True)
    address = Column(Text, nullable=True)
    
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP")
    )

    user = relationship("UserEntity", back_populates="user_profile")
