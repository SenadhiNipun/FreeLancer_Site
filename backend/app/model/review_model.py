from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class CreateReviewRequest(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="Rating must be between 1 and 5 stars")
    feedback: Optional[str] = None

class ReviewResponse(BaseModel):
    id: int
    task_id: int
    customer_id: int
    writer_id: int
    rating: int
    feedback: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
