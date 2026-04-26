from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List

class RegisterWriterRequest(BaseModel):
    # Basic User Info
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)
    confirm_password: str = Field(..., min_length=8)
    
    # Contact & Location
    mobile_number: str = Field(..., min_length=10, max_length=15)
    whatsapp_number: str = Field(..., min_length=10, max_length=15)
    city: str = Field(..., max_length=100)
    country: str = Field(..., max_length=100)
    
    # Academic Info
    education_level_id: int = Field(..., description="ID of the education level")
    institution_name: str = Field(..., max_length=255)
    academic_status: str = Field(..., description="CURRENTLY_STUDYING or COMPLETED")
    
    # Professional & Specialization
    academic_category_id: int = Field(..., description="ID of the main academic category")
    specialization_id: int = Field(..., description="ID of the specific specialization")
    experience_years: Optional[int] = Field(0, ge=0)
    bio: Optional[str] = Field(None, min_length=10)
    
    @field_validator('confirm_password')
    @classmethod
    def passwords_match(cls, v, info):
        if 'password' in info.data and v != info.data['password']:
            raise ValueError('Passwords do not match')
        return v
