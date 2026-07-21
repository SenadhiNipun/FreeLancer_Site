from sqlalchemy.orm import Session, selectinload
from typing import List, Optional
from app.entity.admin_conversation_entity import AdminConversationEntity
from app.entity.admin_conversation_message_entity import AdminConversationMessageEntity

class AdminMessagingRepository:

    @staticmethod
    def get_latest_conversation_by_user(db: Session, user_id: int) -> Optional[AdminConversationEntity]:
        return (
            db.query(AdminConversationEntity)
            .filter(AdminConversationEntity.user_id == user_id)
            .order_by(AdminConversationEntity.id.desc())
            .first()
        )

    @staticmethod
    def create_conversation(db: Session, conversation: AdminConversationEntity) -> AdminConversationEntity:
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
        return conversation

    @staticmethod
    def add_message_refresh_conversation(db: Session, message: AdminConversationMessageEntity, conversation: AdminConversationEntity) -> AdminConversationEntity:
        db.add(message)
        db.commit()
        db.refresh(conversation)
        return conversation

    @staticmethod
    def add_message_refresh_message(db: Session, message: AdminConversationMessageEntity) -> AdminConversationMessageEntity:
        db.add(message)
        db.commit()
        db.refresh(message)
        return message

    @staticmethod
    def get_conversation_by_id(db: Session, conversation_id: int) -> Optional[AdminConversationEntity]:
        return (
            db.query(AdminConversationEntity)
            .options(
                selectinload(AdminConversationEntity.user),
                selectinload(AdminConversationEntity.messages).selectinload(AdminConversationMessageEntity.sender),
            )
            .filter(AdminConversationEntity.id == conversation_id)
            .first()
        )

    @staticmethod
    def get_all_conversations(db: Session) -> List[AdminConversationEntity]:
        return (
            db.query(AdminConversationEntity)
            .options(
                selectinload(AdminConversationEntity.user),
                selectinload(AdminConversationEntity.messages),
            )
            .order_by(AdminConversationEntity.id.desc())
            .all()
        )

    @staticmethod
    def get_conversations_by_user(db: Session, user_id: int) -> List[AdminConversationEntity]:
        return (
            db.query(AdminConversationEntity)
            .options(
                selectinload(AdminConversationEntity.user),
                selectinload(AdminConversationEntity.messages),
            )
            .filter(AdminConversationEntity.user_id == user_id)
            .order_by(AdminConversationEntity.id.desc())
            .all()
        )
