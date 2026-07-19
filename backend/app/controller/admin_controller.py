from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.config.database import db_dependency
from app.service.admin_service import AdminService
from app.service.auth_service import AuthService
from app.model.generic_response import GenericResponse
from app.model.assign_writer_request import AssignWriterRequest
from app.exceptions.exception import UnauthorizedException
from app.enums.role_enum import RoleEnum

router = APIRouter(
    prefix="/api/v1/admin",
    tags=["Admin Management"]
)

security = HTTPBearer()


# ─── Auth helpers ───────────────────────────────────────────────────────────

def get_current_user(db: Session, auth: HTTPAuthorizationCredentials):
    token = auth.credentials
    return AuthService.get_current_user(db, token)


def require_super_admin(db: Session, auth: HTTPAuthorizationCredentials):
    """Raise 403 unless the caller has the SUPER_ADMIN role."""
    user = get_current_user(db, auth)
    roles = user.role if isinstance(user.role, list) else [user.role]
    if RoleEnum.SUPER_ADMIN.value not in roles and RoleEnum.ADMIN.value not in roles:
        raise UnauthorizedException(detail="Super admin access required")
    return user


# ─── Original endpoints (preserved) ────────────────────────────────────────

@router.get("/writers/pending")
def get_pending_writers(db: db_dependency):
    results = AdminService.get_pending_writers(db)
    return GenericResponse.success(message="Pending writers fetched successfully", results=results)


@router.post("/writers/{writer_id}/approve")
def approve_writer(
    writer_id: int,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    require_super_admin(db, auth)
    AdminService.approve_writer(db, writer_id)
    return GenericResponse.success(message="Writer approved successfully")


@router.post("/writers/{writer_id}/reject")
def reject_writer(
    writer_id: int,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    require_super_admin(db, auth)
    AdminService.reject_writer(db, writer_id, reason="Admin rejected")
    return GenericResponse.success(message="Writer rejected successfully")


@router.post("/tasks/{task_id}/assign-writer")
def assign_writer(
    task_id: int,
    request: AssignWriterRequest,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    admin = require_super_admin(db, auth)
    AdminService.assign_writer(db, task_id, request.writer_id, admin.id)
    return GenericResponse.success(message="Writer assigned to task successfully")


# ─── New Super Admin endpoints ───────────────────────────────────────────────

@router.get("/stats")
def get_platform_stats(
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    require_super_admin(db, auth)
    results = AdminService.get_platform_stats(db)
    return GenericResponse.success(message="Platform stats fetched successfully", results=results)


@router.get("/writers")
def get_all_writers(
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    require_super_admin(db, auth)
    results = AdminService.get_all_writers(db)
    return GenericResponse.success(message="Writers fetched successfully", results=results)


@router.get("/writers/{writer_id}/tasks")
def get_writer_tasks(
    writer_id: int,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    require_super_admin(db, auth)
    results = AdminService.get_writer_tasks(db, writer_id)
    return GenericResponse.success(message="Writer tasks fetched successfully", results=results)


@router.get("/customers")
def get_all_customers(
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    require_super_admin(db, auth)
    results = AdminService.get_all_customers(db)
    return GenericResponse.success(message="Customers fetched successfully", results=results)


@router.post("/users/{user_id}/suspend")
def suspend_user(
    user_id: int,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    require_super_admin(db, auth)
    result = AdminService.suspend_user(db, user_id)
    return GenericResponse.success(message="User suspended successfully", results=result)


@router.post("/users/{user_id}/activate")
def activate_user(
    user_id: int,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    require_super_admin(db, auth)
    result = AdminService.activate_user(db, user_id)
    return GenericResponse.success(message="User activated successfully", results=result)


@router.get("/tasks")
def get_all_tasks(
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security),
    status: str = None,
):
    require_super_admin(db, auth)
    results = AdminService.get_all_tasks(db, status=status)
    return GenericResponse.success(message="Tasks fetched successfully", results=results)


@router.get("/tasks/{task_id}")
def get_task_details(
    task_id: int,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    require_super_admin(db, auth)
    results = AdminService.get_task_details(db, task_id)
    return GenericResponse.success(message="Task details fetched successfully", results=results)


@router.get("/customers/{customer_id}/tasks")
def get_customer_tasks(
    customer_id: int,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    require_super_admin(db, auth)
    results = AdminService.get_customer_tasks(db, customer_id)
    return GenericResponse.success(message="Customer tasks fetched successfully", results=results)


@router.get("/chats")
def get_all_chat_sessions(
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    require_super_admin(db, auth)
    results = AdminService.get_all_chat_sessions(db)
    return GenericResponse.success(message="Chat sessions fetched successfully", results=results)


@router.get("/chats/{session_id}/messages")
def get_chat_messages(
    session_id: int,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    require_super_admin(db, auth)
    results = AdminService.get_chat_messages_for_admin(db, session_id)
    return GenericResponse.success(message="Chat messages fetched successfully", results=results)


# ─── Super Admin Registration (secret-key protected) ────────────────────────

from pydantic import BaseModel
import os

class RegisterSuperAdminRequest(BaseModel):
    email: str
    password: str
    first_name: str = "Super"
    last_name: str = "Admin"
    secret_key: str


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_super_admin(request: RegisterSuperAdminRequest, db: db_dependency):
    """
    Create a super admin account.
    Requires the SUPER_ADMIN_SECRET environment variable to match the provided secret_key.
    """
    expected_secret = os.environ.get("SUPER_ADMIN_SECRET", "")
    if not expected_secret or request.secret_key != expected_secret:
        raise UnauthorizedException(detail="Invalid secret key")

    from app.entity.user_entity import UserEntity
    from app.entity.user_role_entity import UserRoleEntity
    from app.entity.role_entity import RoleEntity
    from app.util.password_util import hash_password
    from app.repository.role_repository import RoleRepository

    existing = db.query(UserEntity).filter(UserEntity.email == request.email).first()
    if existing:
        from app.exceptions.exception import ValidationException
        raise ValidationException(detail="Email already exists")

    role = RoleRepository.get_role_by_name(db, RoleEnum.SUPER_ADMIN.value)
    if not role:
        role = RoleEntity(
            role_name=RoleEnum.SUPER_ADMIN.value,
            description="Super Administrator"
        )
        db.add(role)
        db.flush()

    new_user = UserEntity(
        first_name=request.first_name,
        last_name=request.last_name,
        email=request.email,
        username=request.email,
        password_hash=hash_password(request.password),
        role_id=role.id,
        status="ACTIVE",
        is_email_verified=True,
    )
    db.add(new_user)
    db.flush()
    db.refresh(new_user)

    user_role = UserRoleEntity(user_id=new_user.id, role_id=role.id)
    db.add(user_role)
    db.commit()

    return GenericResponse.success(
        message="Super Admin registered successfully",
        results={"id": new_user.id, "email": new_user.email}
    )
