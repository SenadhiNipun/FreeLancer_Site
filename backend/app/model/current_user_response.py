from pydantic import BaseModel


class CurrentUserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: str | None = None
    phone: str | None = None
    role: str
    is_active: bool