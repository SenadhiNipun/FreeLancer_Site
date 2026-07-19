from sqlalchemy.orm import Session
from app.entity.admin_conversation_entity import AdminConversationEntity
from app.entity.admin_conversation_message_entity import AdminConversationMessageEntity
from app.repository.user_repository import UserRepository
from app.exceptions.exception import NotFoundException, ValidationException


def _message_to_dict(m: AdminConversationMessageEntity) -> dict:
    return {
        "id": m.id,
        "conversation_id": m.conversation_id,
        "sender_id": m.sender_id,
        "sender_name": f"{m.sender.first_name} {m.sender.last_name}".strip() if m.sender else "Unknown",
        "message": m.message,
        "is_admin": m.is_admin,
        "created_at": m.created_at.isoformat() if m.created_at else None,
    }


def _conversation_to_dict(c: AdminConversationEntity, include_messages: bool = False) -> dict:
    messages = list(c.messages or [])
    last_message = messages[-1] if messages else None
    d = {
        "id": c.id,
        "user_id": c.user_id,
        "user_name": f"{c.user.first_name} {c.user.last_name}".strip() if c.user else "Unknown",
        "user_email": c.user.email if c.user else None,
        "subject": c.subject,
        "message_count": len(messages),
        "last_message": last_message.message if last_message else None,
        "last_message_at": last_message.created_at.isoformat() if last_message and last_message.created_at else None,
        "created_at": c.created_at.isoformat() if c.created_at else None,
    }
    if include_messages:
        d["messages"] = [_message_to_dict(m) for m in messages]
    return d


class AdminMessagingService:

    @staticmethod
    def get_or_create_conversation(db: Session, user_id: int, subject: str = None) -> AdminConversationEntity:
        user = UserRepository.get_user_by_id(db, user_id)
        if not user:
            raise NotFoundException(detail="User not found")

        conversation = (
            db.query(AdminConversationEntity)
            .filter(AdminConversationEntity.user_id == user_id)
            .order_by(AdminConversationEntity.id.desc())
            .first()
        )
        if conversation:
            return conversation

        conversation = AdminConversationEntity(user_id=user_id, subject=subject)
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
        return conversation

    @staticmethod
    def start_conversation(db: Session, admin_id: int, user_id: int, subject: str, message: str) -> dict:
        conversation = AdminMessagingService.get_or_create_conversation(db, user_id, subject=subject)
        if subject and not conversation.subject:
            conversation.subject = subject

        msg = AdminConversationMessageEntity(
            conversation_id=conversation.id,
            sender_id=admin_id,
            message=message,
            is_admin=True,
        )
        db.add(msg)
        db.commit()
        db.refresh(conversation)

        from app.service.notification_service import NotificationService
        NotificationService.create_notification(
            db,
            user_id=user_id,
            title=subject or "New message from admin",
            message=message,
            notification_type="ADMIN_MESSAGE",
            related_id=conversation.id,
        )

        return _conversation_to_dict(conversation, include_messages=True)

    @staticmethod
    def get_all_conversations(db: Session) -> list:
        conversations = (
            db.query(AdminConversationEntity)
            .order_by(AdminConversationEntity.id.desc())
            .all()
        )
        return [_conversation_to_dict(c) for c in conversations]

    @staticmethod
    def get_conversation(db: Session, conversation_id: int, user_id: int = None) -> dict:
        conversation = db.query(AdminConversationEntity).filter(AdminConversationEntity.id == conversation_id).first()
        if not conversation:
            raise NotFoundException(detail="Conversation not found")
        if user_id is not None and conversation.user_id != user_id:
            raise ValidationException(detail="You are not a participant in this conversation")
        return _conversation_to_dict(conversation, include_messages=True)

    @staticmethod
    def get_user_conversations(db: Session, user_id: int) -> list:
        conversations = (
            db.query(AdminConversationEntity)
            .filter(AdminConversationEntity.user_id == user_id)
            .order_by(AdminConversationEntity.id.desc())
            .all()
        )
        return [_conversation_to_dict(c) for c in conversations]

    @staticmethod
    def reply(db: Session, conversation_id: int, sender_id: int, message: str, is_admin: bool) -> dict:
        conversation = db.query(AdminConversationEntity).filter(AdminConversationEntity.id == conversation_id).first()
        if not conversation:
            raise NotFoundException(detail="Conversation not found")
        if not is_admin and conversation.user_id != sender_id:
            raise ValidationException(detail="You are not a participant in this conversation")

        msg = AdminConversationMessageEntity(
            conversation_id=conversation_id,
            sender_id=sender_id,
            message=message,
            is_admin=is_admin,
        )
        db.add(msg)
        db.commit()
        db.refresh(msg)

        from app.service.notification_service import NotificationService
        if is_admin:
            NotificationService.create_notification(
                db,
                user_id=conversation.user_id,
                title=conversation.subject or "New message from admin",
                message=message,
                notification_type="ADMIN_MESSAGE",
                related_id=conversation.id,
            )
        else:
            from app.repository.user_repository import UserRepository as UR
            from app.enums.role_enum import RoleEnum
            admins = UR.get_all_users_by_role(db, RoleEnum.SUPER_ADMIN.value)
            for admin in admins:
                NotificationService.create_notification(
                    db,
                    user_id=admin.id,
                    title=f"Reply from {conversation.user.first_name if conversation.user else 'a user'}",
                    message=message,
                    notification_type="ADMIN_MESSAGE_REPLY",
                    related_id=conversation.id,
                )

        return _message_to_dict(msg)
