from sqlalchemy import Column, BIGINT, String, Text, DateTime, Numeric, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from app.entity.base_entity import BaseEntity

class TaskEntity(Base, BaseEntity):
    __tablename__ = "tasks"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    customer_id = Column(BIGINT, ForeignKey("users.id"), nullable=False)
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    
    academic_category_id = Column(BIGINT, ForeignKey("academic_categories.id"), nullable=True)
    specialization_id = Column(BIGINT, ForeignKey("specializations.id"), nullable=True)
    education_level_id = Column(BIGINT, ForeignKey("education_levels.id"), nullable=True)
    
    deadline = Column(DateTime, nullable=False)
    budget = Column(Numeric(10, 2), nullable=True)
    
    task_status = Column(String(50), default="OPEN", nullable=False) 
    # OPEN, PENDING_PAYMENT, PENDING_ASSIGNMENT, ASSIGNED, IN_PROGRESS, SUBMITTED, REVISION_REQUESTED, COMPLETED, CANCELLED
    
    payment_status = Column(String(50), default="UNPAID", nullable=False)
    # UNPAID, PARTIALLY_PAID, PAID, REFUNDED
    
    is_urgent = Column(Boolean, default=False)

    # Relationships
    customer = relationship("UserEntity", foreign_keys=[customer_id])
    academic_category = relationship("AcademicCategoryEntity")
    specialization = relationship("SpecializationEntity")
    education_level = relationship("EducationLevelEntity")
    
    files = relationship("TaskFileEntity", back_populates="task", cascade="all, delete-orphan")
    assignments = relationship("TaskAssignmentEntity", back_populates="task", cascade="all, delete-orphan")
    submissions = relationship("TaskSubmissionEntity", back_populates="task", cascade="all, delete-orphan")
    revisions = relationship("TaskRevisionEntity", back_populates="task", cascade="all, delete-orphan")
    bids = relationship("TaskBidEntity", back_populates="task", cascade="all, delete-orphan")

    @property
    def writer(self):
        # 1. Try assignments first
        if self.assignments:
            for a in self.assignments:
                if a.assignment_status not in ["CANCELLED", "REJECTED"]:
                    return a.writer
        
        # 2. Fallback to accepted bids (for backwards compatibility or pending assignments)
        if self.bids:
            for b in self.bids:
                if b.bid_status == "ACCEPTED":
                    return b.writer
                    
        return None
