from sqlalchemy import Column, BIGINT, String, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base
from app.entity.base_entity import BaseEntity

class PaymentEntity(Base, BaseEntity):
    __tablename__ = "payments"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    task_id = Column(BIGINT, ForeignKey("tasks.id"), nullable=False)
    customer_id = Column(BIGINT, ForeignKey("users.id"), nullable=False)
    
    amount = Column(Numeric(10, 2), nullable=False)
    payment_method = Column(String(50), nullable=True) # STRIPE, PAYPAL, BANK_TRANSFER, etc.
    transaction_id = Column(String(255), nullable=True)
    
    payment_status = Column(String(50), default="PENDING", nullable=False) # PENDING, PAID, FAILED, REFUNDED

    # Relationships
    task = relationship("TaskEntity")
    customer = relationship("UserEntity")
