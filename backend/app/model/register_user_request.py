from pydantic import BaseModel, EmailStr, Field, field_validator
from app.util.phone_util import validate_phone_number

class RegisterUserRequest(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    mobile_number: str = Field(..., min_length=10, max_length=15)
    whatsapp_number: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=8)
    verify_password: str = Field(..., min_length=8)

    @field_validator('mobile_number', 'whatsapp_number')
    @classmethod
    def validate_phone(cls, v):
        return validate_phone_number(v)

    @field_validator('verify_password')
    @classmethod
    def passwords_match(cls, v, info):
        if 'password' in info.data and v != info.data['password']:
            raise ValueError('Passwords do not match')
        return v
