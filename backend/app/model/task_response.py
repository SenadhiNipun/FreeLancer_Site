from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.model.bid_response import BidResponse

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str

    class Config:
        from_attributes = True

class AcademicCategoryResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class SpecializationResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class TaskFileResponse(BaseModel):
    id: int
    file_type: str
    file_url: str
    file_name: str
    mime_type: Optional[str] = None
    file_size: Optional[int] = None

    class Config:
        from_attributes = True

class TaskResponse(BaseModel):
    id: int
    customer_id: int
    customer: Optional[UserResponse] = None
    writer: Optional[UserResponse] = None
    my_bid: Optional[BidResponse] = None
    title: str
    description: str
    academic_category_id: Optional[int] = None
    academic_category: Optional[AcademicCategoryResponse] = None
    specialization_id: Optional[int] = None
    specialization: Optional[SpecializationResponse] = None
    education_level_id: Optional[int] = None
    deadline: datetime
    budget: Optional[float] = None
    task_status: str
    payment_status: str
    is_urgent: bool
    files: List[TaskFileResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
