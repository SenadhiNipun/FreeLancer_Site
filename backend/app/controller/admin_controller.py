from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.config.database import db_dependency
from app.service.admin_service import AdminService
from app.service.auth_service import AuthService
from app.model.generic_response import GenericResponse
from app.model.assign_writer_request import AssignWriterRequest

router = APIRouter(
    prefix="/api/v1/admin",
    tags=["Admin Management"]
)

security = HTTPBearer()

def get_current_user_id(db: Session, auth: HTTPAuthorizationCredentials):
    token = auth.credentials
    user = AuthService.get_current_user(db, token)
    return user.id

@router.get("/writers/pending")
def get_pending_writers(db: db_dependency):
    results = AdminService.get_pending_writers(db)
    return GenericResponse.success(message="Pending writers fetched successfully", results=results)

@router.post("/writers/{writer_id}/approve")
def approve_writer(writer_id: int, db: db_dependency):
    AdminService.approve_writer(db, writer_id)
    return GenericResponse.success(message="Writer approved successfully")

@router.post("/writers/{writer_id}/reject")
def reject_writer(writer_id: int, db: db_dependency):
    AdminService.reject_writer(db, writer_id, reason="Admin rejected")
    return GenericResponse.success(message="Writer rejected successfully")

@router.post("/tasks/{task_id}/assign-writer")
def assign_writer(
    task_id: int, 
    request: AssignWriterRequest, 
    db: db_dependency, 
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    admin_id = get_current_user_id(db, auth)
    AdminService.assign_writer(db, task_id, request.writer_id, admin_id)
    return GenericResponse.success(message="Writer assigned to task successfully")
