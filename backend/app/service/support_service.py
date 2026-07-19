from sqlalchemy.orm import Session
from app.entity.support_ticket_entity import SupportTicketEntity
from app.entity.support_ticket_reply_entity import SupportTicketReplyEntity
from app.exceptions.exception import NotFoundException


def _reply_to_dict(r):
    return {
        "id":         r.id,
        "message":    r.message,
        "is_admin":   r.is_admin,
        "created_at": r.created_at.isoformat() if r.created_at else None,
        "author":     f"{r.user.first_name} {r.user.last_name}".strip() if r.user else "Unknown",
    }


def _ticket_to_dict(t, include_replies=False):
    d = {
        "id":            t.id,
        "ticket_number": t.ticket_number,
        "subject":       t.subject,
        "message":       t.message,
        "status":        t.status,
        "created_at":    t.created_at.isoformat() if t.created_at else None,
        "user_name":     f"{t.user.first_name} {t.user.last_name}".strip() if t.user else "Unknown",
        "user_email":    t.user.email if t.user else None,
    }
    if include_replies:
        d["replies"] = [_reply_to_dict(r) for r in t.replies if not r.is_delete]
    return d


class SupportService:

    @staticmethod
    def create_ticket(db: Session, user_id: int, subject: str, message: str) -> dict:
        count = db.query(SupportTicketEntity).count()
        ticket_number = f"TKT-{count + 1:04d}"

        ticket = SupportTicketEntity(
            ticket_number=ticket_number,
            user_id=user_id,
            subject=subject,
            message=message,
            status="OPEN",
        )
        db.add(ticket)
        db.commit()
        db.refresh(ticket)

        from app.service.notification_service import NotificationService
        NotificationService.notify_admins_support_ticket(db, ticket.id, ticket_number, subject)

        return _ticket_to_dict(ticket)

    @staticmethod
    def get_user_tickets(db: Session, user_id: int) -> list:
        tickets = (
            db.query(SupportTicketEntity)
            .filter(SupportTicketEntity.user_id == user_id, SupportTicketEntity.is_delete == False)
            .order_by(SupportTicketEntity.created_at.desc())
            .all()
        )
        return [_ticket_to_dict(t) for t in tickets]

    @staticmethod
    def get_ticket(db: Session, ticket_id: int, user_id: int = None) -> dict:
        q = db.query(SupportTicketEntity).filter(
            SupportTicketEntity.id == ticket_id,
            SupportTicketEntity.is_delete == False,
        )
        if user_id is not None:
            q = q.filter(SupportTicketEntity.user_id == user_id)
        ticket = q.first()
        if not ticket:
            raise NotFoundException(detail="Ticket not found")
        return _ticket_to_dict(ticket, include_replies=True)

    @staticmethod
    def get_all_tickets(db: Session, status: str = None) -> list:
        q = db.query(SupportTicketEntity).filter(SupportTicketEntity.is_delete == False)
        if status:
            q = q.filter(SupportTicketEntity.status == status)
        tickets = q.order_by(SupportTicketEntity.created_at.desc()).all()
        return [_ticket_to_dict(t) for t in tickets]

    @staticmethod
    def reply(db: Session, ticket_id: int, user_id: int, message: str, is_admin: bool = False) -> dict:
        ticket = db.query(SupportTicketEntity).filter(
            SupportTicketEntity.id == ticket_id,
            SupportTicketEntity.is_delete == False,
        ).first()
        if not ticket:
            raise NotFoundException(detail="Ticket not found")

        reply = SupportTicketReplyEntity(
            ticket_id=ticket_id,
            user_id=user_id,
            message=message,
            is_admin=is_admin,
        )
        db.add(reply)

        if is_admin and ticket.status == "OPEN":
            ticket.status = "IN_PROGRESS"

        db.commit()
        db.refresh(reply)

        if is_admin:
            from app.service.notification_service import NotificationService
            NotificationService.create_notification(
                db,
                user_id=ticket.user_id,
                title=f"Reply on ticket {ticket.ticket_number}",
                message=f"An admin has responded to your support ticket: \"{ticket.subject}\"",
                notification_type="SUPPORT_REPLY",
                related_id=ticket_id,
            )

        return _reply_to_dict(reply)

    @staticmethod
    def update_status(db: Session, ticket_id: int, status: str) -> dict:
        ticket = db.query(SupportTicketEntity).filter(
            SupportTicketEntity.id == ticket_id,
            SupportTicketEntity.is_delete == False,
        ).first()
        if not ticket:
            raise NotFoundException(detail="Ticket not found")
        ticket.status = status
        db.commit()
        return _ticket_to_dict(ticket)
