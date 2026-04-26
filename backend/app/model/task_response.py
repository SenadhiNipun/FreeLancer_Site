from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class TaskResponse(BaseModel):
    id: int
    customer_id: int
    title: str
    description: str
    academic_category_id: Optional[int] = None
    specialization_id: Optional[int] = None
    education_level_id: Optional[int] = None
    deadline: datetime
    budget: Optional[float] = None
    task_status: str
    payment_status: str
    is_urgent: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
