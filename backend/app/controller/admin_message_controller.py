from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

from app.config.database import db_dependency
from app.service.auth_service import AuthService
from app.service.admin_messaging_service import AdminMessagingService
from app.model.generic_response import GenericResponse
from app.exceptions.exception import UnauthorizedException
from app.enums.role_enum import RoleEnum

router = APIRouter(prefix="/api/v1/admin-messages", tags=["Admin Messaging"])
security = HTTPBearer()


# ── request models ──────────────────────────────────────────────────────────

class StartConversationRequest(BaseModel):
    target_user_id: int
    subject: str
    message: str


class ReplyRequest(BaseModel):
    message: str


# ── helpers ──────────────────────────────────────────────────────────────────

def get_current_user(db, auth):
    return AuthService.get_current_user(db, auth.credentials)


def require_admin(db, auth):
    user = get_current_user(db, auth)
    roles = user.role if isinstance(user.role, list) else [user.role]
    if RoleEnum.SUPER_ADMIN.value not in roles and RoleEnum.ADMIN.value not in roles:
        raise UnauthorizedException(detail="Admin access required")
    return user


# ── Admin endpoints ──────────────────────────────────────────────────────────

@router.post("/admin/start", status_code=201)
def start_conversation(
    request: StartConversationRequest,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security),
):
    admin = require_admin(db, auth)
    result = AdminMessagingService.start_conversation(
        db, admin.id, request.target_user_id, request.subject, request.message
    )
    return GenericResponse.success(message="Message sent successfully", results=result)


@router.post("/admin/by-user/{user_id}")
def get_or_create_conversation_for_user(
    user_id: int,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security),
):
    require_admin(db, auth)
    conversation = AdminMessagingService.get_or_create_conversation(db, user_id)
    return GenericResponse.success(message="Conversation ready", results={"id": conversation.id})


@router.get("/admin")
def get_all_conversations(
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security),
):
    require_admin(db, auth)
    results = AdminMessagingService.get_all_conversations(db)
    return GenericResponse.success(message="Conversations fetched", results=results)


@router.get("/admin/{conversation_id}")
def get_conversation(
    conversation_id: int,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security),
):
    require_admin(db, auth)
    result = AdminMessagingService.get_conversation(db, conversation_id)
    return GenericResponse.success(message="Conversation fetched", results=result)


@router.post("/admin/{conversation_id}/reply")
def admin_reply(
    conversation_id: int,
    request: ReplyRequest,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security),
):
    admin = require_admin(db, auth)
    result = AdminMessagingService.reply(db, conversation_id, admin.id, request.message, is_admin=True)
    return GenericResponse.success(message="Reply sent", results=result)


# ── Customer / Writer endpoints ─────────────────────────────────────────────

@router.get("/mine")
def get_my_conversations(
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security),
):
    user = get_current_user(db, auth)
    results = AdminMessagingService.get_user_conversations(db, user.id)
    return GenericResponse.success(message="Conversations fetched", results=results)


@router.get("/mine/{conversation_id}")
def get_my_conversation(
    conversation_id: int,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security),
):
    user = get_current_user(db, auth)
    result = AdminMessagingService.get_conversation(db, conversation_id, user_id=user.id)
    return GenericResponse.success(message="Conversation fetched", results=result)


@router.post("/mine/{conversation_id}/reply")
def reply_as_user(
    conversation_id: int,
    request: ReplyRequest,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security),
):
    user = get_current_user(db, auth)
    result = AdminMessagingService.reply(db, conversation_id, user.id, request.message, is_admin=False)
    return GenericResponse.success(message="Reply sent", results=result)
