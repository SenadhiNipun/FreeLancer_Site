from fastapi import Request
from .exception import BaseAppException
from ..util.response_util import error_response
from ..config.logging_config import logger

def register_exception_handlers(app):
    @app.exception_handler(BaseAppException)
    async def app_exception_handler(request: Request, exc: BaseAppException):
        logger.error(f"Application error: {exc.detail}")
        return error_response(
            message=exc.detail,
            status_code=exc.status_code
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        logger.exception("Unexpected error occurred")
        return error_response(
            message=f"An unexpected error occurred: {str(exc)}",
            status_code=500
        )
