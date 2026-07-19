from sqlalchemy.orm import Session
from app.repository.user_repository import UserRepository
from app.exceptions.exception import NotFoundException, ValidationException, UnauthorizedException
from app.service.chat_service import ChatService
from app.service.notification_service import NotificationService
from app.enums.role_enum import RoleEnum


def _user_to_dict(user, include_writer_profile=False, task_count=0):
    """Serialize a UserEntity to a dict for API responses."""
    d = {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "status": user.status,
        "is_email_verified": user.is_email_verified,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "last_login_at": user.last_login_at.isoformat() if user.last_login_at else None,
        "profile_image_url": user.profile_image_url,
        "task_count": task_count,
    }
    if include_writer_profile and user.writer_profile:
        wp = user.writer_profile
        d["mobile_number"] = user.mobile_number
        d["whatsapp_number"] = user.whatsapp_number
        d["writer_profile"] = {
            "profile_status": wp.profile_status,
            "bio": wp.bio,
            "experience_years": wp.experience_years,
            "city": wp.city,
            "country": wp.country,
            "institution_name": wp.institution_name,
            "academic_status": wp.academic_status,
            "education_level": wp.education_level.name if wp.education_level else None,
            "academic_category": wp.academic_category.name if wp.academic_category else None,
            "specialization": wp.specialization.name if wp.specialization else None,
            "qualifications": [q.qualification_name for q in wp.qualifications] if wp.qualifications else [],
        }
    return d


class AdminService:

    # ─── Existing methods (preserved) ─────────────────────────────────────

    @staticmethod
    def approve_writer(db: Session, writer_id: int):
        user = UserRepository.get_user_by_id(db, writer_id)
        if not user or not user.writer_profile:
            raise NotFoundException(detail="Writer not found")

        user.writer_profile.profile_status = "APPROVED"
        db.commit()
        NotificationService.create_notification(
            db,
            user_id=writer_id,
            title="Application Approved!",
            message="Congratulations! Your writer application has been approved. You can now start accepting tasks.",
            notification_type="WRITER_APPROVED",
            related_id=writer_id,
        )
        return True

    @staticmethod
    def reject_writer(db: Session, writer_id: int, reason: str):
        user = UserRepository.get_user_by_id(db, writer_id)
        if not user or not user.writer_profile:
            raise NotFoundException(detail="Writer not found")

        user.writer_profile.profile_status = "REJECTED"
        db.commit()
        NotificationService.create_notification(
            db,
            user_id=writer_id,
            title="Application Not Approved",
            message="Unfortunately, your writer application was not approved at this time. Please contact support for more information.",
            notification_type="WRITER_REJECTED",
            related_id=writer_id,
        )
        return True

    @staticmethod
    def get_pending_writers(db: Session):
        from app.entity.user_entity import UserEntity
        from app.entity.writer_profile_entity import WriterProfileEntity

        users = (
            db.query(UserEntity)
            .join(WriterProfileEntity)
            .filter(WriterProfileEntity.profile_status == "PENDING_APPROVAL")
            .all()
        )
        return [_user_to_dict(u, include_writer_profile=True) for u in users]

    @staticmethod
    def assign_writer(db: Session, task_id: int, writer_id: int, admin_id: int):
        from app.entity.task_assignment_entity import TaskAssignmentEntity
        from app.repository.task_repository import TaskRepository

        task = TaskRepository.get_task_by_id(db, task_id)
        if not task:
            raise NotFoundException(detail="Task not found")

        writer = UserRepository.get_user_by_id(db, writer_id)
        if not writer or not writer.writer_profile or writer.writer_profile.profile_status != "APPROVED":
            raise ValidationException(detail="Writer not found or not approved")

        assignment = TaskAssignmentEntity(
            task_id=task_id,
            writer_id=writer_id,
            assigned_by_admin_id=admin_id,
            assignment_status="PENDING"
        )
        db.add(assignment)
        task.task_status = "ASSIGNED"

        try:
            ChatService.initialize_chat(db, task_id, task.customer_id, writer_id)
        except Exception as e:
            print(f"Failed to initialize chat: {e}")

        db.commit()
        return assignment

    # ─── New Admin Methods ──────────────────────────────────────────────────

    @staticmethod
    def get_all_writers(db: Session):
        from app.entity.task_assignment_entity import TaskAssignmentEntity

        users = UserRepository.get_all_users_by_role(db, RoleEnum.WRITER.value)
        result = []
        for u in users:
            task_count = (
                db.query(TaskAssignmentEntity)
                .filter(TaskAssignmentEntity.writer_id == u.id)
                .count()
            )
            result.append(_user_to_dict(u, include_writer_profile=True, task_count=task_count))
        return result

    @staticmethod
    def get_all_customers(db: Session):
        from app.entity.task_entity import TaskEntity

        users = UserRepository.get_all_users_by_role(db, RoleEnum.CUSTOMER.value)
        result = []
        for u in users:
            task_count = (
                db.query(TaskEntity)
                .filter(TaskEntity.customer_id == u.id)
                .count()
            )
            result.append(_user_to_dict(u, task_count=task_count))
        return result

    @staticmethod
    def get_writer_tasks(db: Session, writer_id: int):
        from app.entity.task_entity import TaskEntity
        from app.entity.task_assignment_entity import TaskAssignmentEntity
        from app.entity.task_bid_entity import TaskBidEntity

        user = UserRepository.get_user_by_id(db, writer_id)
        if not user:
            raise NotFoundException(detail="Writer not found")

        # Tasks assigned to this writer
        assigned_task_ids = (
            db.query(TaskAssignmentEntity.task_id)
            .filter(TaskAssignmentEntity.writer_id == writer_id)
            .subquery()
        )

        # Tasks the writer has bid on
        bid_task_ids = (
            db.query(TaskBidEntity.task_id)
            .filter(TaskBidEntity.writer_id == writer_id)
            .subquery()
        )

        tasks = (
            db.query(TaskEntity)
            .filter(
                (TaskEntity.id.in_(db.query(assigned_task_ids)))
                | (TaskEntity.id.in_(db.query(bid_task_ids)))
            )
            .order_by(TaskEntity.id.desc())
            .all()
        )

        result = []
        for t in tasks:
            # get bid for this writer on this task
            bid = (
                db.query(TaskBidEntity)
                .filter(TaskBidEntity.task_id == t.id, TaskBidEntity.writer_id == writer_id)
                .first()
            )
            result.append({
                "id": t.id,
                "title": t.title,
                "task_status": t.task_status,
                "budget": float(t.budget) if t.budget else None,
                "deadline": t.deadline.isoformat() if t.deadline else None,
                "created_at": t.created_at.isoformat() if t.created_at else None,
                "customer_name": f"{t.customer.first_name} {t.customer.last_name}" if t.customer else "Unknown",
                "bid_amount": float(bid.bid_amount) if bid else None,
                "bid_status": bid.bid_status if bid else None,
            })
        return result

    @staticmethod
    def get_all_chat_sessions(db: Session):
        from app.entity.chat_session_entity import ChatSessionEntity

        sessions = (
            db.query(ChatSessionEntity)
            .order_by(ChatSessionEntity.id.desc())
            .all()
        )
        result = []
        for s in sessions:
            # Count messages
            from app.entity.chat_message_entity import ChatMessageEntity
            msg_count = (
                db.query(ChatMessageEntity)
                .filter(ChatMessageEntity.session_id == s.id)
                .count()
            )
            result.append({
                "id": s.id,
                "task_id": s.task_id,
                "task_title": s.task.title if s.task else "Unknown",
                "customer_id": s.customer_id,
                "customer_name": f"{s.customer.first_name} {s.customer.last_name}" if s.customer else "Unknown",
                "writer_id": s.writer_id,
                "writer_name": f"{s.writer.first_name} {s.writer.last_name}" if s.writer else "Unknown",
                "is_active": s.is_active,
                "message_count": msg_count,
                "created_at": s.created_at.isoformat() if s.created_at else None,
            })
        return result

    @staticmethod
    def get_chat_messages_for_admin(db: Session, session_id: int):
        from app.entity.chat_session_entity import ChatSessionEntity
        from app.entity.chat_message_entity import ChatMessageEntity

        session = db.query(ChatSessionEntity).filter(ChatSessionEntity.id == session_id).first()
        if not session:
            raise NotFoundException(detail="Chat session not found")

        messages = (
            db.query(ChatMessageEntity)
            .filter(ChatMessageEntity.session_id == session_id)
            .order_by(ChatMessageEntity.id.asc())
            .all()
        )
        result = []
        for m in messages:
            sender_name = f"{m.sender.first_name} {m.sender.last_name}" if m.sender else "Unknown"
            result.append({
                "id": m.id,
                "session_id": m.session_id,
                "sender_id": m.sender_id,
                "sender_name": sender_name,
                "sender_profile_image_url": m.sender.profile_image_url if m.sender else None,
                "message_text": m.message_text,
                "message_type": m.message_type,
                "proposed_amount": float(m.proposed_amount) if m.proposed_amount else None,
                "bid_change_status": m.bid_change_status,
                "is_read": m.is_read,
                "created_at": m.created_at.isoformat() if m.created_at else None,
                "attachments": [
                    {
                        "id": att.id,
                        "file_name": att.file_name,
                        "file_url": att.file_url,
                        "mime_type": att.mime_type,
                        "file_size": att.file_size,
                    }
                    for att in (m.attachments or [])
                ],
            })
        return {
            "session": {
                "id": session.id,
                "task_title": session.task.title if session.task else "Unknown",
                "customer_name": f"{session.customer.first_name} {session.customer.last_name}" if session.customer else "Unknown",
                "writer_name": f"{session.writer.first_name} {session.writer.last_name}" if session.writer else "Unknown",
            },
            "messages": result,
        }

    @staticmethod
    def get_platform_stats(db: Session):
        from app.entity.task_entity import TaskEntity
        from app.entity.user_entity import UserEntity
        from app.entity.writer_profile_entity import WriterProfileEntity
        from app.entity.payment_entity import PaymentEntity
        from sqlalchemy import func

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
            "total_revenue": float(total_revenue),
        }

    @staticmethod
    def suspend_user(db: Session, user_id: int):
        user = UserRepository.get_user_by_id(db, user_id)
        if not user:
            raise NotFoundException(detail="User not found")
        user.status = "SUSPENDED"
        db.commit()
        return {"id": user_id, "status": "SUSPENDED"}

    @staticmethod
    def activate_user(db: Session, user_id: int):
        user = UserRepository.get_user_by_id(db, user_id)
        if not user:
            raise NotFoundException(detail="User not found")
        user.status = "ACTIVE"
        db.commit()
        return {"id": user_id, "status": "ACTIVE"}
