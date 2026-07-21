from sqlalchemy.orm import Session
from typing import List, Optional
from app.entity.notification_entity import NotificationEntity

class NotificationRepository:

    @staticmethod
    def create_notification(db: Session, notification: NotificationEntity) -> NotificationEntity:
        db.add(notification)
        db.commit()
        return notification

    @staticmethod
    def bulk_create(db: Session, notifications: List[NotificationEntity]) -> None:
        if not notifications:
            return
        db.add_all(notifications)
        db.commit()

    @staticmethod
    def get_user_notifications(db: Session, user_id: int, limit: int = 20) -> List[NotificationEntity]:
        return db.query(NotificationEntity)\
            .filter(NotificationEntity.user_id == user_id)\
            .order_by(NotificationEntity.created_at.desc())\
            .limit(limit)\
            .all()

    @staticmethod
    def has_notification_of_type(db: Session, notification_type: str, related_id: int) -> bool:
        return db.query(NotificationEntity)\
            .filter(
                NotificationEntity.notification_type == notification_type,
                NotificationEntity.related_id == related_id,
            )\
            .first() is not None

    @staticmethod
    def get_notification_by_id_and_user(db: Session, notification_id: int, user_id: int) -> Optional[NotificationEntity]:
        return db.query(NotificationEntity)\
            .filter(NotificationEntity.id == notification_id, NotificationEntity.user_id == user_id)\
            .first()

    @staticmethod
    def save_notification(db: Session, notification: NotificationEntity) -> NotificationEntity:
        db.commit()
        return notification
