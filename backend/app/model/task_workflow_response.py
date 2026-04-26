from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SubmissionResponse(BaseModel):
    id: int
    task_id: int
    writer_id: int
    submission_note: Optional[str] = None
    submission_status: str
    submitted_at: datetime

    class Config:
        from_attributes = True

class RevisionResponse(BaseModel):
    id: int
    task_id: int
    submission_id: int
    requested_by_user_id: int
    revision_note: str
    revision_status: str
    requested_at: datetime

    class Config:
        from_attributes = True
