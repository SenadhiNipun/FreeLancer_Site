from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from pydantic import ConfigDict

class TaskBriefResponse(BaseModel):
    id: int
    title: str
    task_status: str
    
    class Config:
        from_attributes = True

class PublicWriterProfileResponse(BaseModel):
    id: int
    first_name: str
    last_name: Optional[str] = None
    bio: Optional[str] = None
    experience_years: Optional[int] = None
    institution_name: Optional[str] = None
    academic_status: Optional[str] = None
    profile_image_url: Optional[str] = None

    class Config:
        from_attributes = True

class BidResponse(BaseModel):
    id: int
    task_id: int
    writer_id: int
    bid_amount: float
    message: Optional[str] = None
    bid_status: str
    created_at: datetime
    updated_at: datetime
    writer: Optional[PublicWriterProfileResponse] = None
    task: Optional[TaskBriefResponse] = None

    class Config:
        from_attributes = True
