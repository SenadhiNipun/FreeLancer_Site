from sqlalchemy.orm import Session
from app.entity.notification_entity import NotificationEntity
from app.entity.writer_profile_entity import WriterProfileEntity
from app.entity.task_entity import TaskEntity
from typing import List

class NotificationService:
    @staticmethod
    def create_notification(db: Session, user_id: int, title: str, message: str, notification_type: str, related_id: int = None):
        notification = NotificationEntity(
            user_id=user_id,
            title=title,
            message=message,
            notification_type=notification_type,
            related_id=related_id
        )
        db.add(notification)
        db.commit()
        return notification

    @staticmethod
    def notify_writers_for_new_task(db: Session, task: TaskEntity):
        # Find writers with matching specialization or category
        query = db.query(WriterProfileEntity)
        
        if task.specialization_id:
            query = query.filter(WriterProfileEntity.specialization_id == task.specialization_id)
        elif task.academic_category_id:
            query = query.filter(WriterProfileEntity.academic_category_id == task.academic_category_id)
        else:
            # If no category/specialization, maybe notify all active writers? 
            # Or just skip for now to avoid spam.
            return

        writers = query.filter(WriterProfileEntity.profile_status == "APPROVED").all()

        for writer in writers:
            NotificationService.create_notification(
                db,
                user_id=writer.user_id,
                title="New Task Available!",
                message=f"A new task '{task.title}' is available in your field.",
                notification_type="TASK_AVAILABLE",
                related_id=task.id
            )

    @staticmethod
    def get_user_notifications(db: Session, user_id: int, limit: int = 20):
        return db.query(NotificationEntity)\
            .filter(NotificationEntity.user_id == user_id)\
            .order_by(NotificationEntity.created_at.desc())\
            .limit(limit)\
            .all()

    @staticmethod
    def notify_admins_support_ticket(db: Session, ticket_id: int, ticket_number: str, subject: str):
        from app.repository.user_repository import UserRepository
        from app.enums.role_enum import RoleEnum
        admins = UserRepository.get_all_users_by_role(db, RoleEnum.SUPER_ADMIN.value)
        for admin in admins:
            NotificationService.create_notification(
                db,
                user_id=admin.id,
                title=f"New Support Ticket {ticket_number}",
                message=f"A customer submitted a support ticket: \"{subject}\"",
                notification_type="SUPPORT_TICKET",
                related_id=ticket_id,
            )

    @staticmethod
    def notify_admins_ticket_reply(db: Session, ticket_id: int, ticket_number: str, subject: str):
        from app.repository.user_repository import UserRepository
        from app.enums.role_enum import RoleEnum
        admins = UserRepository.get_all_users_by_role(db, RoleEnum.SUPER_ADMIN.value)
        for admin in admins:
            NotificationService.create_notification(
                db,
                user_id=admin.id,
                title=f"New reply on ticket {ticket_number}",
                message=f"A reply was added to support ticket: \"{subject}\"",
                notification_type="SUPPORT_REPLY",
                related_id=ticket_id,
            )

    @staticmethod
    def notify_admins_new_writer(db: Session, writer_user_id: int, writer_name: str):
        from app.repository.user_repository import UserRepository
        from app.enums.role_enum import RoleEnum
        admins = UserRepository.get_all_users_by_role(db, RoleEnum.SUPER_ADMIN.value)
        for admin in admins:
            NotificationService.create_notification(
                db,
                user_id=admin.id,
                title="New Writer Application",
                message=f"{writer_name} has registered and is awaiting approval.",
                notification_type="WRITER_REGISTRATION",
                related_id=writer_user_id,
            )

    @staticmethod
    def mark_as_read(db: Session, user_id: int, notification_id: int):
        notification = db.query(NotificationEntity)\
            .filter(NotificationEntity.id == notification_id, NotificationEntity.user_id == user_id)\
            .first()
        if notification:
            notification.is_read = True
            db.commit()
            return True
        return False
