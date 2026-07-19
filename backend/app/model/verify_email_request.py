from pydantic import BaseModel, EmailStr, Field

class VerifyEmailRequest(BaseModel):
    email: EmailStr
    verification_code: str = Field(..., min_length=6, max_length=6)
