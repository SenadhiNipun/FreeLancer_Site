from sqlalchemy.orm import Session
from app.entity.payment_entity import PaymentEntity

class PaymentRepository:

    @staticmethod
    def create_payment(db: Session, payment: PaymentEntity) -> PaymentEntity:
        db.add(payment)
        db.commit()
        db.refresh(payment)
        return payment

    @staticmethod
    def get_payment_by_id(db: Session, payment_id: int) -> PaymentEntity | None:
        return db.query(PaymentEntity).filter(PaymentEntity.id == payment_id, PaymentEntity.is_delete == False).first()

    @staticmethod
    def get_payments_by_task(db: Session, task_id: int):
        return db.query(PaymentEntity).filter(PaymentEntity.task_id == task_id, PaymentEntity.is_delete == False).all()
