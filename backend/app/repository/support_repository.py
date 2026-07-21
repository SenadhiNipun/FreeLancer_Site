from sqlalchemy.orm import Session, selectinload
from typing import List, Optional
from app.entity.support_ticket_entity import SupportTicketEntity
from app.entity.support_ticket_reply_entity import SupportTicketReplyEntity

class SupportRepository:

    @staticmethod
    def count_tickets(db: Session) -> int:
        return db.query(SupportTicketEntity).count()

    @staticmethod
    def create_ticket(db: Session, ticket: SupportTicketEntity) -> SupportTicketEntity:
        db.add(ticket)
        db.commit()
        db.refresh(ticket)
        return ticket

    @staticmethod
    def get_tickets_by_user(db: Session, user_id: int) -> List[SupportTicketEntity]:
        return (
            db.query(SupportTicketEntity)
            .options(selectinload(SupportTicketEntity.user))
            .filter(SupportTicketEntity.user_id == user_id, SupportTicketEntity.is_delete == False)
            .order_by(SupportTicketEntity.created_at.desc())
            .all()
        )

    @staticmethod
    def get_ticket_by_id(db: Session, ticket_id: int, user_id: Optional[int] = None) -> Optional[SupportTicketEntity]:
        q = db.query(SupportTicketEntity).options(
            selectinload(SupportTicketEntity.user),
            selectinload(SupportTicketEntity.replies).selectinload(SupportTicketReplyEntity.user),
        ).filter(
            SupportTicketEntity.id == ticket_id,
            SupportTicketEntity.is_delete == False,
        )
        if user_id is not None:
            q = q.filter(SupportTicketEntity.user_id == user_id)
        return q.first()

    @staticmethod
    def get_all_tickets(db: Session, status: Optional[str] = None) -> List[SupportTicketEntity]:
        q = db.query(SupportTicketEntity).options(
            selectinload(SupportTicketEntity.user)
        ).filter(SupportTicketEntity.is_delete == False)
        if status:
            q = q.filter(SupportTicketEntity.status == status)
        return q.order_by(SupportTicketEntity.created_at.desc()).all()

    @staticmethod
    def add_reply(db: Session, reply: SupportTicketReplyEntity) -> SupportTicketReplyEntity:
        db.add(reply)
        db.commit()
        db.refresh(reply)
        return reply

    @staticmethod
    def save_ticket(db: Session, ticket: SupportTicketEntity) -> SupportTicketEntity:
        db.commit()
        return ticket
