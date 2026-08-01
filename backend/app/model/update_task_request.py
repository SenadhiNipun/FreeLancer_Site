from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class UpdateTaskRequest(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=255)
    description: Optional[str] = Field(None, min_length=10)
    academic_category_id: Optional[int] = None
    specialization_id: Optional[int] = None
    education_level_id: Optional[int] = None
    deadline: Optional[datetime] = None
    is_urgent: Optional[bool] = None
