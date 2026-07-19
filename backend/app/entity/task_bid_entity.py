from sqlalchemy import Column, BIGINT, Numeric, Text, String, TIMESTAMP, ForeignKey, text
from sqlalchemy.orm import relationship
from app.config.database import Base


class TaskBidEntity(Base):
    __tablename__ = "task_bids"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    task_id = Column(BIGINT, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    writer_id = Column(BIGINT, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    bid_amount = Column(Numeric(10, 2), nullable=False)
    message = Column(Text, nullable=True)

    # PENDING | ACCEPTED | REJECTED | WITHDRAWN
    bid_status = Column(String(50), default="PENDING", nullable=False)

    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP"),
        onupdate=text("CURRENT_TIMESTAMP"),
    )

    # Relationships
    task = relationship("TaskEntity", back_populates="bids")
    writer = relationship("UserEntity", foreign_keys=[writer_id])
