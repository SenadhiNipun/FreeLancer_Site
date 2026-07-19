from pydantic import BaseModel
from typing import Optional

class SubmitTaskRequest(BaseModel):
    submission_note: Optional[str] = None
    is_final: bool = True
