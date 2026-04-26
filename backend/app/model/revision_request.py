from pydantic import BaseModel

class RevisionRequest(BaseModel):
    revision_note: str
