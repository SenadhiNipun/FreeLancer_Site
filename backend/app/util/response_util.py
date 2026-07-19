from fastapi.responses import JSONResponse
from typing import Any, Optional
from ..model.generic_response import GenericResponse

def success_response(results: Optional[Any] = None, message: str = "Success") -> JSONResponse:
    response_data = GenericResponse(
        is_error=False,
        message=message,
        results=results
    ).model_dump(mode='json')
    return JSONResponse(status_code=200, content=response_data)

def error_response(message: str = "Error", status_code: int = 400, results: Optional[Any] = None) -> JSONResponse:
    response_data = GenericResponse(
        is_error=True,
        message=message,
        results=results
    ).model_dump(mode='json')
    return JSONResponse(status_code=status_code, content=response_data)
