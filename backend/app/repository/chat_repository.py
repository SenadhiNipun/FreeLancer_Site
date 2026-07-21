from sqlalchemy.orm import Session
from app.entity.chat_session_entity import ChatSessionEntity
from app.entity.chat_message_entity import ChatMessageEntity
from app.entity.chat_message_attachment_entity import ChatMessageAttachmentEntity
from typing import List, Optional

class ChatRepository:
    @staticmethod
    def create_session(db: Session, session: ChatSessionEntity) -> ChatSessionEntity:
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def get_session_by_id(db: Session, session_id: int) -> Optional[ChatSessionEntity]:
        return db.query(ChatSessionEntity).filter(ChatSessionEntity.id == session_id).first()

    @staticmethod
    def get_session_by_id_with_details(db: Session, session_id: int) -> Optional[ChatSessionEntity]:
        from sqlalchemy.orm import selectinload
        return (
            db.query(ChatSessionEntity)
            .options(
                selectinload(ChatSessionEntity.task),
                selectinload(ChatSessionEntity.customer),
                selectinload(ChatSessionEntity.writer),
            )
            .filter(ChatSessionEntity.id == session_id)
            .first()
        )

    @staticmethod
    def get_session_by_task_id(db: Session, task_id: int) -> Optional[ChatSessionEntity]:
        return db.query(ChatSessionEntity).filter(ChatSessionEntity.task_id == task_id).first()

    @staticmethod
    def get_session_by_task_and_users(db: Session, task_id: int, customer_id: int, writer_id: int) -> Optional[ChatSessionEntity]:
        return db.query(ChatSessionEntity).filter(
            ChatSessionEntity.task_id == task_id,
            ChatSessionEntity.customer_id == customer_id,
            ChatSessionEntity.writer_id == writer_id
        ).first()

    @staticmethod
    def get_user_sessions(db: Session, user_id: int) -> List[ChatSessionEntity]:
        from sqlalchemy.orm import selectinload
        from app.entity.user_entity import UserEntity
        return db.query(ChatSessionEntity).options(
            selectinload(ChatSessionEntity.task),
            selectinload(ChatSessionEntity.writer).selectinload(UserEntity.user_profile),
            selectinload(ChatSessionEntity.customer).selectinload(UserEntity.user_profile)
        ).filter(
            (ChatSessionEntity.customer_id == user_id) | (ChatSessionEntity.writer_id == user_id)
        ).all()

    @staticmethod
    def create_message(db: Session, message: ChatMessageEntity) -> ChatMessageEntity:
        db.add(message)
        db.commit()
        db.refresh(message)
        return message

    @staticmethod
    def get_messages_by_session(db: Session, session_id: int) -> List[ChatMessageEntity]:
        from sqlalchemy.orm import selectinload
        from app.entity.user_entity import UserEntity
        return db.query(ChatMessageEntity).options(
            selectinload(ChatMessageEntity.sender).selectinload(UserEntity.user_profile),
            selectinload(ChatMessageEntity.attachments)
        ).filter(
            ChatMessageEntity.session_id == session_id
        ).order_by(ChatMessageEntity.created_at.asc()).all()

    @staticmethod
    def get_messages_by_session_ordered_by_id(db: Session, session_id: int) -> List[ChatMessageEntity]:
        from sqlalchemy.orm import selectinload
        return db.query(ChatMessageEntity).options(
            selectinload(ChatMessageEntity.sender),
            selectinload(ChatMessageEntity.attachments)
        ).filter(
            ChatMessageEntity.session_id == session_id
        ).order_by(ChatMessageEntity.id.asc()).all()

    @staticmethod
    def mark_messages_as_read(db: Session, session_id: int, user_id: int):
        db.query(ChatMessageEntity).filter(
            ChatMessageEntity.session_id == session_id,
            ChatMessageEntity.sender_id != user_id,
            ChatMessageEntity.is_read == False
        ).update({"is_read": True})
        db.commit()

    @staticmethod
    def get_message_by_id(db: Session, message_id: int) -> Optional[ChatMessageEntity]:
        return db.query(ChatMessageEntity).filter(ChatMessageEntity.id == message_id).first()

    @staticmethod
    def add_attachments(db: Session, attachments: List[ChatMessageAttachmentEntity], message: ChatMessageEntity) -> ChatMessageEntity:
        db.add_all(attachments)
        db.commit()
        db.refresh(message)
        return message

    @staticmethod
    def save_session(db: Session, session: ChatSessionEntity) -> ChatSessionEntity:
        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def delete_message(db: Session, message: ChatMessageEntity) -> None:
        db.delete(message)
        db.commit()

    @staticmethod
    def commit_bid_change_decision(db: Session) -> None:
        db.commit()

    @staticmethod
    def refresh_message(db: Session, message: ChatMessageEntity) -> ChatMessageEntity:
        db.refresh(message)
        return message
