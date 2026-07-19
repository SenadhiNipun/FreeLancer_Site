from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

from app.config.database import db_dependency
from app.service.auth_service import AuthService
from app.service.support_service import SupportService
from app.model.generic_response import GenericResponse
from app.exceptions.exception import UnauthorizedException
from app.enums.role_enum import RoleEnum

router = APIRouter(prefix="/api/v1/support", tags=["Support"])
security = HTTPBearer()


# ── request models ──────────────────────────────────────────────────────────

class CreateTicketRequest(BaseModel):
    subject: str
    message: str

class ReplyRequest(BaseModel):
    message: str

class StatusRequest(BaseModel):
    status: str


# ── helpers ─────────────────────────────────────────────────────────────────

def get_current_user(db, auth):
    return AuthService.get_current_user(db, auth.credentials)

def require_admin(db, auth):
    user = get_current_user(db, auth)
    roles = user.role if isinstance(user.role, list) else [user.role]
    if RoleEnum.SUPER_ADMIN.value not in roles and RoleEnum.ADMIN.value not in roles:
        raise UnauthorizedException(detail="Admin access required")
    return user


# ── Customer endpoints ───────────────────────────────────────────────────────

@router.post("/tickets", status_code=201)
def create_ticket(
    request: CreateTicketRequest,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security),
):
    user = get_current_user(db, auth)
    result = SupportService.create_ticket(db, user.id, request.subject, request.message)
    return GenericResponse.success(message="Ticket submitted successfully", results=result)


@router.get("/tickets")
def get_my_tickets(
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security),
):
    user = get_current_user(db, auth)
    results = SupportService.get_user_tickets(db, user.id)
    return GenericResponse.success(message="Tickets fetched", results=results)


@router.get("/tickets/{ticket_id}")
def get_ticket(
    ticket_id: int,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security),
):
    user = get_current_user(db, auth)
    result = SupportService.get_ticket(db, ticket_id, user_id=user.id)
    return GenericResponse.success(message="Ticket fetched", results=result)


# ── Admin endpoints ──────────────────────────────────────────────────────────

@router.get("/admin/tickets")
def admin_get_all_tickets(
    status: str = None,
    db: db_dependency = None,
    auth: HTTPAuthorizationCredentials = Depends(security),
):
    require_admin(db, auth)
    results = SupportService.get_all_tickets(db, status=status)
    return GenericResponse.success(message="Tickets fetched", results=results)


@router.get("/admin/tickets/{ticket_id}")
def admin_get_ticket(
    ticket_id: int,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security),
):
    require_admin(db, auth)
    result = SupportService.get_ticket(db, ticket_id)
    return GenericResponse.success(message="Ticket fetched", results=result)


@router.post("/admin/tickets/{ticket_id}/reply")
def admin_reply(
    ticket_id: int,
    request: ReplyRequest,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security),
):
    admin = require_admin(db, auth)
    result = SupportService.reply(db, ticket_id, admin.id, request.message, is_admin=True)
    return GenericResponse.success(message="Reply sent", results=result)


@router.patch("/admin/tickets/{ticket_id}/status")
def admin_update_status(
    ticket_id: int,
    request: StatusRequest,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security),
):
    require_admin(db, auth)
    result = SupportService.update_status(db, ticket_id, request.status)
    return GenericResponse.success(message="Status updated", results=result)
