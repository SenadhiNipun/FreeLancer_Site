from sqlalchemy import Column, BIGINT, String, Boolean, TIMESTAMP, ForeignKey, text
from sqlalchemy.orm import relationship
from backend.app.config.database import Base

class FieldEntity(Base):
    __tablename__ = "fields"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(String(255), nullable=True)
    parent_id = Column(BIGINT, ForeignKey("fields.id", ondelete="CASCADE"), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP"),
        server_onupdate=text("CURRENT_TIMESTAMP")
    )

    parent = relationship("FieldEntity", remote_side=[id], back_populates="sub_fields")
    sub_fields = relationship("FieldEntity", back_populates="parent", cascade="all, delete-orphan")
    writer_fields = relationship("WriterFieldEntity", back_populates="field", cascade="all, delete-orphan")
