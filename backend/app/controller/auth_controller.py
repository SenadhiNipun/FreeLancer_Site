from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.config.database import db_dependency
from app.exceptions.exception import UnauthorizedException
from app.model.generic_response import GenericResponse
from app.model.forgot_password_request import ForgotPasswordRequest
from app.model.login_request import LoginRequest
from app.model.register_user_request import RegisterUserRequest
from app.model.register_writer_request import RegisterWriterRequest
from app.model.reset_password_request import ResetPasswordRequest
from app.model.verify_email_request import VerifyEmailRequest
from app.service.auth_service import AuthService

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"]
)

security = HTTPBearer()


@router.post(
    "/register/customer",
    status_code=status.HTTP_201_CREATED,
    response_model=GenericResponse
)
def register_customer(request: RegisterUserRequest, db: db_dependency):
    result = AuthService.register_user(db, request)
    return GenericResponse.success(
        message="Customer registered successfully",
        results=result
    )


@router.post("/verify-email")
def verify_email(request: VerifyEmailRequest, db: db_dependency):
    AuthService.verify_email(db, request)
    return GenericResponse.success(message="Email verified successfully")


@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: db_dependency):
    AuthService.forgot_password(db, request)
    return GenericResponse.success(message="Password reset code sent to your email")


@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: db_dependency):
    AuthService.reset_password(db, request)
    return GenericResponse.success(message="Password reset successfully")


@router.post(
    "/register/writer",
    status_code=status.HTTP_201_CREATED,
    response_model=GenericResponse
)
def register_writer(request: RegisterWriterRequest, db: db_dependency):
    result = AuthService.register_writer(db, request)
    return GenericResponse.success(
        message="Writer registered successfully",
        results=result
    )


@router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    response_model=GenericResponse
)
def login(request: LoginRequest, db: db_dependency):
    result = AuthService.login(db, request)
    return GenericResponse.success(
        message="Login successful",
        results=result
    )


@router.get(
    "/me",
    status_code=status.HTTP_200_OK,
    response_model=GenericResponse
)
def get_current_user(
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    token = auth.credentials
    result = AuthService.get_current_user(db, token)

    return GenericResponse.success(
        message="Current user fetched successfully",
        results=result
    )
