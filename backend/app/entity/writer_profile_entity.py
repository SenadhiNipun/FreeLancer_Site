from decimal import Decimal

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DECIMAL, Enum
from sqlalchemy.orm import relationship


from backend.app.config.database import Base
from backend.app.enums import WriterApprovalStatusEnum


class WriterProfileEntity(Base):
    __tablename__ = "writer_profiles"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    bio = Column(Text, nullable=True)
    qualification = Column(String(255), nullable=True)
    experience_years = Column(Integer, nullable=True)
    average_rating = Column(DECIMAL(3, 2), default=Decimal("5.00"), nullable=False)
    completed_tasks = Column(Integer, default=0, nullable=False)
    late_tasks = Column(Integer, default=0, nullable=False)
    approval_status = Column(
        Enum(WriterApprovalStatusEnum, name="writer_approval_status_enum"),
        default=WriterApprovalStatusEnum.PENDING_APPROVAL,
        nullable=False,
        index=True
    )
    profile_image_url = Column(String(255), nullable=True)

    user = relationship("UserEntity", back_populates="writer_profile")