from pydantic import BaseModel
from typing import List, Optional

class UpdateWriterProfileRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    bio: Optional[str] = None
    experience_years: Optional[int] = None
    institution_name: Optional[str] = None
    academic_status: Optional[str] = None
    qualifications: Optional[List[str]] = None
    expertise: Optional[List[str]] = None
