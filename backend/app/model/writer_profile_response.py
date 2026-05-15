from pydantic import BaseModel
from typing import List, Optional

class QualificationModel(BaseModel):
    id: int
    qualification_name: str

class WriterProfileResponse(BaseModel):
    id: int
    user_id: int
    first_name: str
    last_name: Optional[str] = None
    email: str
    phone: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    bio: Optional[str] = None
    experience_years: Optional[int] = None
    education_level: Optional[str] = None
    institution_name: Optional[str] = None
    academic_category: Optional[str] = None
    specialization: Optional[str] = None
    qualifications: List[str] = []
    expertise: List[str] = []
    completed_projects: int = 0
    rating: float = 4.9
