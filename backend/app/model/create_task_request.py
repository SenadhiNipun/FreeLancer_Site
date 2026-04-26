from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class CreateTaskRequest(BaseModel):
    title: str = Field(..., min_length=5, max_length=255)
    description: str = Field(..., min_length=10)
    academic_category_id: Optional[int] = None
    specialization_id: Optional[int] = None
    education_level_id: Optional[int] = None
    deadline: datetime
    budget: Optional[float] = None
    is_urgent: bool = False
