from pydantic import BaseModel, EmailStr
from typing import List, Optional

class CurrentUserResponse(BaseModel):
    id: int
    uuid: str
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    role: List[str]  # Changed to list to support many-to-many roles
    
    is_active: bool
    is_verified: bool
    
    profile_image_url: Optional[str] = None
