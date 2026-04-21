from pydantic import BaseModel, EmailStr, Field


class RegisterUserRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    full_name: str | None = Field(default=None, max_length=100)
    phone: str | None = Field(default=None, max_length=20)
    university: str | None = Field(default=None, max_length=255)
    course: str | None = Field(default=None, max_length=255)
    address: str | None = None
    profile_image_url: str | None = Field(default=None, max_length=255)