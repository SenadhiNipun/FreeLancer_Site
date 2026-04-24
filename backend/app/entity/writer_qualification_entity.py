from sqlalchemy import Column, BIGINT, String, ForeignKey, TIMESTAMP, text
from sqlalchemy.orm import relationship
from app.config.database import Base

class WriterQualificationEntity(Base):
    __tablename__ = "writer_qualifications"

    id = Column(BIGINT, primary_key=True, autoincrement=True)
    writer_profile_id = Column(BIGINT, ForeignKey("writer_profiles.id", ondelete="CASCADE"), nullable=False)
    qualification_name = Column(String(255), nullable=False) # e.g. "Degree", "MSC", "PHD"
    
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    writer_profile = relationship("WriterProfileEntity", back_populates="qualifications")
