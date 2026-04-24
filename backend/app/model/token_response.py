from pydantic import BaseModel
from typing import List


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    roles: List[str]
    user_id: int
    email: str
