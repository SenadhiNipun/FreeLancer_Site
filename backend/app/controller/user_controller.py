from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.config.database import db_dependency
from app.service.writer_service import WriterService
from app.service.auth_service import AuthService
from app.model.generic_response import GenericResponse
from app.model.update_writer_profile_request import UpdateWriterProfileRequest

router = APIRouter(
    prefix="/api/v1/users",
    tags=["User Profiles"]
)

security = HTTPBearer()

@router.get("/{user_id}/public-profile")
def get_public_profile(
    user_id: int,
    db: db_dependency
):
    result = WriterService.get_public_profile(db, user_id)
    return GenericResponse.success(
        message="Public profile fetched successfully", 
        results=result
    )

@router.get("/me/profile")
def get_my_profile(
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    token = auth.credentials
    user = AuthService.get_current_user(db, token)
    result = WriterService.get_public_profile(db, user.id)
    return GenericResponse.success(
        message="Your profile fetched successfully", 
        results=result
    )

@router.put("/me/profile")
def update_profile(
    request: UpdateWriterProfileRequest,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    token = auth.credentials
    user = AuthService.get_current_user(db, token)
    result = WriterService.update_profile(db, user.id, request)
    return GenericResponse.success(
        message="Profile updated successfully", 
        results=result
    )
