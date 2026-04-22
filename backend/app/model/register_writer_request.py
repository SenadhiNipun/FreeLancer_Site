from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

class RegisterWriterRequest(BaseModel):
    # Basic User Info
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)
    
    # Contact & Identity
    phone_number: str = Field(..., max_length=20)
    whatsapp_number: Optional[str] = Field(None, max_length=20)
    national_id_number: str = Field(..., max_length=50)
    
    # Academic & Professional
    university: str = Field(..., max_length=255)
    qualifications: List[str] = Field(..., description="List of degrees, e.g. ['Degree', 'MSC', 'PHD']")
    experience_years: int = Field(..., ge=0)
    bio: str = Field(..., min_length=10)
    
    # Media & Field Expertise
    profile_image_url: Optional[str] = None
    expertise_field_ids: List[int] = Field(..., min_items=1, description="List of IDs from fields table")