from sqlalchemy.orm import Session
from app.entity.notification_entity import NotificationEntity
from app.entity.task_entity import TaskEntity
from app.repository.notification_repository import NotificationRepository
from app.repository.writer_repository import WriterRepository
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
        return NotificationRepository.create_notification(db, notification)

    @staticmethod
    def notify_writers_for_new_task(db: Session, task: TaskEntity):
        # If no category/specialization, maybe notify all active writers?
        # Or just skip for now to avoid spam.
        if not task.specialization_id and not task.academic_category_id:
            return

        writers = WriterRepository.get_approved_writers_by_specialization_or_category(
            db, task.specialization_id, task.academic_category_id
        )

        notifications = [
            NotificationEntity(
                user_id=writer.user_id,
                title="New Task Available!",
                message=f"A new task '{task.title}' is available in your field.",
                notification_type="TASK_AVAILABLE",
                related_id=task.id
            )
            for writer in writers
        ]
        NotificationRepository.bulk_create(db, notifications)

    @staticmethod
    def get_user_notifications(db: Session, user_id: int, limit: int = 20):
        return NotificationRepository.get_user_notifications(db, user_id, limit)

    @staticmethod
    def notify_admins_support_ticket(db: Session, ticket_id: int, ticket_number: str, subject: str):
        from app.repository.user_repository import UserRepository
        from app.enums.role_enum import RoleEnum
        admins = UserRepository.get_all_users_by_role(db, RoleEnum.SUPER_ADMIN.value)
        notifications = [
            NotificationEntity(
                user_id=admin.id,
                title=f"New Support Ticket {ticket_number}",
                message=f"A customer submitted a support ticket: \"{subject}\"",
                notification_type="SUPPORT_TICKET",
                related_id=ticket_id,
            )
            for admin in admins
        ]
        NotificationRepository.bulk_create(db, notifications)

    @staticmethod
    def notify_admins_ticket_reply(db: Session, ticket_id: int, ticket_number: str, subject: str):
        from app.repository.user_repository import UserRepository
        from app.enums.role_enum import RoleEnum
        admins = UserRepository.get_all_users_by_role(db, RoleEnum.SUPER_ADMIN.value)
        notifications = [
            NotificationEntity(
                user_id=admin.id,
                title=f"New reply on ticket {ticket_number}",
                message=f"A reply was added to support ticket: \"{subject}\"",
                notification_type="SUPPORT_REPLY",
                related_id=ticket_id,
            )
            for admin in admins
        ]
        NotificationRepository.bulk_create(db, notifications)

    @staticmethod
    def notify_admins_new_writer(db: Session, writer_user_id: int, writer_name: str):
        from app.repository.user_repository import UserRepository
        from app.enums.role_enum import RoleEnum
        admins = UserRepository.get_all_users_by_role(db, RoleEnum.SUPER_ADMIN.value)
        notifications = [
            NotificationEntity(
                user_id=admin.id,
                title="New Writer Application",
                message=f"{writer_name} has registered and is awaiting approval.",
                notification_type="WRITER_REGISTRATION",
                related_id=writer_user_id,
            )
            for admin in admins
        ]
        NotificationRepository.bulk_create(db, notifications)

    @staticmethod
    def has_overdue_notification(db: Session, task_id: int) -> bool:
        return NotificationRepository.has_notification_of_type(db, "TASK_OVERDUE", task_id)

    @staticmethod
    def notify_task_overdue(db: Session, task: TaskEntity):
        from app.repository.user_repository import UserRepository
        from app.enums.role_enum import RoleEnum

        notifications = [
            NotificationEntity(
                user_id=task.customer_id,
                title="Your task is overdue",
                message=f"Your task '{task.title}' has passed its deadline.",
                notification_type="TASK_OVERDUE",
                related_id=task.id,
            )
        ]

        writer = task.writer
        if writer:
            notifications.append(NotificationEntity(
                user_id=writer.id,
                title="Task deadline passed",
                message=f"The task '{task.title}' you're working on has passed its deadline.",
                notification_type="TASK_OVERDUE",
                related_id=task.id,
            ))

        admins = UserRepository.get_all_users_by_role(db, RoleEnum.SUPER_ADMIN.value)
        notifications.extend([
            NotificationEntity(
                user_id=admin.id,
                title="Task overdue",
                message=f"The task '{task.title}' has passed its deadline.",
                notification_type="TASK_OVERDUE",
                related_id=task.id,
            )
            for admin in admins
        ])

        NotificationRepository.bulk_create(db, notifications)

    @staticmethod
    def mark_as_read(db: Session, user_id: int, notification_id: int):
        notification = NotificationRepository.get_notification_by_id_and_user(db, notification_id, user_id)
        if notification:
            notification.is_read = True
            NotificationRepository.save_notification(db, notification)
            return True
        return False
