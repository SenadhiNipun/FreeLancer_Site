from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.service.notification_service import NotificationService
from app.model.notification_response import NotificationResponse
from app.model.generic_response import GenericResponse
from app.controller.task_controller import get_current_user_id
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List

router = APIRouter(prefix="/api/v1/notifications", tags=["Notifications"])
security = HTTPBearer()

@router.get("", response_model=GenericResponse)
def get_notifications(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = get_current_user_id(db, auth)
    notifications = NotificationService.get_user_notifications(db, user_id, limit)
    data = [NotificationResponse.from_orm(n) for n in notifications]
    return GenericResponse.success(message="Notifications fetched successfully", results=data)

@router.post("/{notification_id}/read", response_model=GenericResponse)
def mark_notification_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = get_current_user_id(db, auth)
    success = NotificationService.mark_as_read(db, user_id, notification_id)
    if success:
        return GenericResponse.success(message="Notification marked as read", results=True)
    return GenericResponse.failed(message="Notification not found")
