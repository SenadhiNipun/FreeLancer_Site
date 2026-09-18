from fastapi import APIRouter, Depends, Request, Response, status
from fastapi.security import HTTPAuthorizationCredentials

from app.config.config import ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS, APP_ENV
from app.config.database import db_dependency
from app.exceptions.exception import UnauthorizedException
from app.model.generic_response import GenericResponse
from app.model.forgot_password_request import ForgotPasswordRequest
from app.model.login_request import LoginRequest
from app.model.register_user_request import RegisterUserRequest
from app.model.register_writer_request import RegisterWriterRequest
from app.model.reset_password_request import ResetPasswordRequest
from app.model.verify_email_request import VerifyEmailRequest
from app.model.refresh_token_request import RefreshTokenRequest
from app.service.auth_service import AuthService
from app.util.auth_scheme_util import (
    ACCESS_TOKEN_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME,
    CookieOrBearer,
)

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"]
)

security = CookieOrBearer()


# TODO(security): add double-submit CSRF token (separate non-httpOnly cookie + required
# header on mutating requests) before production launch, or sooner if a payment-related
# endpoint ends up trusting request-body data alone. SameSite=Lax currently covers this
# since all mutating admin/task/etc. endpoints are POST, not GET.
def _set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    # Secure cookies are only ever sent by the browser over https. In local dev the
    # app runs over plain http, so secure=True would make the browser silently drop
    # the cookie entirely, breaking login. Only require it in production (real https).
    cookie_kwargs = dict(httponly=True, secure=APP_ENV == "production", samesite="lax", path="/")
    response.set_cookie(
        ACCESS_TOKEN_COOKIE_NAME,
        access_token,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        **cookie_kwargs,
    )
    response.set_cookie(
        REFRESH_TOKEN_COOKIE_NAME,
        refresh_token,
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        **cookie_kwargs,
    )


def _clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(ACCESS_TOKEN_COOKIE_NAME, path="/")
    response.delete_cookie(REFRESH_TOKEN_COOKIE_NAME, path="/")


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
def login(request: LoginRequest, db: db_dependency, response: Response):
    result = AuthService.login(db, request)
    _set_auth_cookies(response, result.access_token, result.refresh_token)
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


@router.post(
    "/refresh",
    status_code=status.HTTP_200_OK,
    response_model=GenericResponse
)
def refresh_token(
    request: Request,
    db: db_dependency,
    response: Response,
    body: RefreshTokenRequest | None = None,
):
    token = (body.refresh_token if body else None) or request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)
    if not token:
        raise UnauthorizedException(detail="Missing refresh token")

    result = AuthService.refresh_token(db, token)
    _set_auth_cookies(response, result.access_token, result.refresh_token)
    return GenericResponse.success(
        message="Token refreshed successfully",
        results=result
    )


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    response_model=GenericResponse
)
def logout(response: Response):
    _clear_auth_cookies(response)
    return GenericResponse.success(message="Logged out successfully")
