from sqlalchemy import Column, BIGINT, ForeignKey, TIMESTAMP, text
from sqlalchemy.orm import relationship
from app.config.database import Base

class WriterFieldEntity(Base):
    __tablename__ = "writer_fields"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    writer_user_id = Column(BIGINT, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    field_id = Column(BIGINT, ForeignKey("fields.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    writer = relationship("UserEntity")
    field = relationship("FieldEntity", back_populates="writer_fields")
