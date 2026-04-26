from pydantic import BaseModel

class AssignWriterRequest(BaseModel):
    writer_id: int
