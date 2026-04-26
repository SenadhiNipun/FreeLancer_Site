from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.config.database import db_dependency
from app.service.auth_service import AuthService
from app.service.chat_service import ChatService
from app.model.chat_model import ChatMessageCreate, ChatMessageResponse, ChatSessionResponse
from app.util.response_util import success_response
from typing import List

router = APIRouter(prefix="/api/v1/chat", tags=["Chat"])

security = HTTPBearer()

def get_current_user_id(db: Session, auth: HTTPAuthorizationCredentials):
    token = auth.credentials
    user = AuthService.get_current_user(db, token)
    return user.id

@router.get("/sessions")
def get_chat_sessions(
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = get_current_user_id(db, auth)
    sessions = ChatService.get_user_chat_sessions(db, user_id)
    return success_response(results=sessions, message="Chat sessions fetched successfully")

@router.post("/sessions/{session_id}/messages")
def send_message(
    session_id: int,
    request: ChatMessageCreate,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = get_current_user_id(db, auth)
    message = ChatService.send_message(db, session_id, user_id, request)
    return success_response(
        results=ChatMessageResponse.model_validate(message), 
        message="Message sent successfully"
    )

@router.get("/sessions/{session_id}/messages")
def get_messages(
    session_id: int,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = get_current_user_id(db, auth)
    messages = ChatService.get_messages(db, session_id, user_id)
    return success_response(results=messages, message="Messages fetched successfully")
