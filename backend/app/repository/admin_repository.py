from sqlalchemy.orm import Session, selectinload
from sqlalchemy import func
from typing import List, Tuple
from app.entity.user_entity import UserEntity
from app.entity.writer_profile_entity import WriterProfileEntity
from app.entity.task_entity import TaskEntity
from app.entity.payment_entity import PaymentEntity
from app.entity.chat_session_entity import ChatSessionEntity
from app.entity.chat_message_entity import ChatMessageEntity
from app.enums.role_enum import RoleEnum

class AdminRepository:

    @staticmethod
    def get_platform_stats(db: Session) -> dict:
        total_customers = (
            db.query(func.count(UserEntity.id))
            .join(UserEntity.role)
            .filter(UserEntity.role.has(role_name=RoleEnum.CUSTOMER.value))
            .filter(UserEntity.is_delete == False)
            .scalar() or 0
        )
        total_writers = (
            db.query(func.count(UserEntity.id))
            .join(UserEntity.role)
            .filter(UserEntity.role.has(role_name=RoleEnum.WRITER.value))
            .filter(UserEntity.is_delete == False)
            .scalar() or 0
        )
        pending_writers = (
            db.query(func.count(WriterProfileEntity.id))
            .filter(WriterProfileEntity.profile_status == "PENDING_APPROVAL")
            .scalar() or 0
        )
        total_tasks = db.query(func.count(TaskEntity.id)).scalar() or 0
        active_tasks = (
            db.query(func.count(TaskEntity.id))
            .filter(TaskEntity.task_status.in_(["ASSIGNED", "IN_PROGRESS", "SUBMITTED"]))
            .scalar() or 0
        )
        completed_tasks = (
            db.query(func.count(TaskEntity.id))
            .filter(TaskEntity.task_status == "COMPLETED")
            .scalar() or 0
        )
        total_revenue = (
            db.query(func.sum(PaymentEntity.amount))
            .filter(PaymentEntity.payment_status == "COMPLETED")
            .scalar() or 0
        )

        return {
            "total_customers": total_customers,
            "total_writers": total_writers,
            "pending_writers": pending_writers,
            "total_tasks": total_tasks,
            "active_tasks": active_tasks,
            "completed_tasks": completed_tasks,
            "total_revenue": total_revenue,
        }

    @staticmethod
    def get_all_chat_sessions_with_message_counts(db: Session) -> List[Tuple[ChatSessionEntity, int]]:
        sessions = (
            db.query(ChatSessionEntity)
            .options(
                selectinload(ChatSessionEntity.task),
                selectinload(ChatSessionEntity.customer),
                selectinload(ChatSessionEntity.writer),
            )
            .order_by(ChatSessionEntity.id.desc())
            .all()
        )
        counts = dict(
            db.query(ChatMessageEntity.session_id, func.count(ChatMessageEntity.id))
            .group_by(ChatMessageEntity.session_id)
            .all()
        )
        return [(s, counts.get(s.id, 0)) for s in sessions]
