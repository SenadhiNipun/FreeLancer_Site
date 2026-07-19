from fastapi import APIRouter, Depends, File, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.config.database import db_dependency
from app.service.auth_service import AuthService
from app.service.chat_service import ChatService
from app.model.chat_model import ChatMessageCreate, ChatMessageResponse, ChatSessionResponse
from app.util.response_util import success_response
from typing import List
import os
import shutil

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

@router.post("/sessions/initialize")
def initialize_chat(
    task_id: int,
    writer_id: int,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = get_current_user_id(db, auth)
    # user_id is the customer_id in this context
    session = ChatService.initialize_chat(db, task_id, user_id, writer_id)
    return success_response(
        results={"id": session.id}, 
        message="Chat session initialized successfully"
    )

@router.post("/upload")
async def upload_chat_file(
    file: UploadFile = File(...),
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    upload_dir = "uploads/chats"
    from datetime import datetime
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S%f")
    safe_filename = file.filename.replace(" ", "_")
    saved_name = f"{timestamp}_{safe_filename}"
    file_path = os.path.join(upload_dir, saved_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return success_response(
        results={
            "file_name": file.filename,
            "file_url": f"/uploads/chats/{saved_name}",
            "mime_type": file.content_type,
            "file_size": getattr(file, "size", 0)
        },
        message="Attachment uploaded successfully"
    )

@router.put("/sessions/{session_id}/toggle")
def toggle_chat_session(
    session_id: int,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = get_current_user_id(db, auth)
    session = ChatService.toggle_session_status(db, session_id, user_id)
    return success_response(
        results={"id": session.id, "is_active": session.is_active},
        message=f"Chat session {'opened' if session.is_active else 'closed'} successfully"
    )

@router.delete("/messages/{message_id}")
def delete_message(
    message_id: int,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = get_current_user_id(db, auth)
    ChatService.delete_message(db, message_id, user_id)
    return success_response(message="Message deleted successfully")

@router.post("/messages/{message_id}/respond-bid-change")
def respond_bid_change(
    message_id: int,
    action: str,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = get_current_user_id(db, auth)
    message = ChatService.respond_to_bid_change(db, message_id, user_id, action)
    return success_response(
        results=ChatMessageResponse.model_validate(message),
        message=f"Bid change request {action.lower()}ed successfully"
    )
