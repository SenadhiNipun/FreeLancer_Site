from pydantic import BaseModel
from typing import Any, Optional


class GenericResponse(BaseModel):
    is_error: bool
    message: str
    results: Optional[Any] = None

    @classmethod
    def success(cls, message: str, results: Optional[Any] = None):
        return cls(
            is_error=False,
            message=message,
            results=results
        )

    @classmethod
    def failed(cls, message: str, results: Optional[Any] = None):
        return cls(
            is_error=True,
            message=message,
            results=results
        )