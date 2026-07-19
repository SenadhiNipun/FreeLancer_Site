from sqlalchemy import Column, BIGINT, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from app.entity.base_entity import BaseEntity

class ReviewEntity(Base, BaseEntity):
    __tablename__ = "reviews"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    task_id = Column(BIGINT, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, unique=True)
    customer_id = Column(BIGINT, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    writer_id = Column(BIGINT, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    rating = Column(Integer, nullable=False)
    feedback = Column(Text, nullable=True)

    # Relationships
    task = relationship("TaskEntity", back_populates="review")
    customer = relationship("UserEntity", foreign_keys=[customer_id])
    writer = relationship("UserEntity", foreign_keys=[writer_id])
