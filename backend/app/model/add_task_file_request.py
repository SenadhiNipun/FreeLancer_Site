from pydantic import BaseModel
from typing import List, Optional

class TaskFileCreate(BaseModel):
    file_name: str
    file_url: str
    file_type: str = "REQUIREMENT_FILE"
    mime_type: Optional[str] = None
    file_size: Optional[int] = None

class AddTaskFilesRequest(BaseModel):
    files: List[TaskFileCreate]
