from sqlalchemy import Column, Boolean, DateTime, func
from datetime import datetime

class BaseEntity:
    is_delete = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime, nullable=True)

    def soft_delete(self):
        self.is_delete = True
        self.deleted_at = datetime.now()
