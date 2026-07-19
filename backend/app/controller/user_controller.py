from fastapi import APIRouter, Depends, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.config.database import db_dependency
from app.service.writer_service import WriterService
from app.service.auth_service import AuthService
from app.model.generic_response import GenericResponse
from app.model.update_writer_profile_request import UpdateWriterProfileRequest
import os
import shutil

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

@router.post("/me/profile-picture")
async def upload_profile_picture(
    db: db_dependency,
    file: UploadFile = File(...),
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    token = auth.credentials
    user = AuthService.get_current_user(db, token)
    
    # Ensure upload directory exists
    upload_dir = "uploads/profiles"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Save the file
    ext = os.path.splitext(file.filename)[1]
    saved_name = f"profile_{user.id}{ext}"
    file_path = os.path.join(upload_dir, saved_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Get or create UserProfileEntity from the actual UserEntity model
    from app.entity.user_entity import UserEntity
    from app.entity.user_profile_entity import UserProfileEntity
    
    user_entity = db.query(UserEntity).filter(UserEntity.id == user.id).first()
    if not user_entity:
        return GenericResponse.error(message="User not found")
        
    user_profile = user_entity.user_profile
    if not user_profile:
        user_profile = UserProfileEntity(user_id=user.id)
        db.add(user_profile)
        db.flush()
        
    # Update profile image url
    user_profile.profile_image_url = f"/uploads/profiles/{saved_name}"
    db.commit()
    
    return GenericResponse.success(
        message="Profile picture uploaded successfully",
        results={"profile_image_url": user_profile.profile_image_url}
    )

