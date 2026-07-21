from sqlalchemy.orm import Session
from app.entity.payment_entity import PaymentEntity
from app.repository.payment_repository import PaymentRepository
from app.repository.task_repository import TaskRepository
from app.exceptions.exception import NotFoundException

class PaymentService:

    @staticmethod
    def process_payment_callback(db: Session, task_id: int, customer_id: int, amount: float, transaction_id: str):
        task = TaskRepository.get_task_by_id(db, task_id)
        if not task:
            raise NotFoundException(detail="Task not found")
        
        payment = PaymentEntity(
            task_id=task_id,
            customer_id=customer_id,
            amount=amount,
            transaction_id=transaction_id,
            payment_status="PAID",
            payment_method="MOCK_GATEWAY"
        )
        PaymentRepository.create_payment(db, payment)
        
        task.payment_status = "PAID"
        if task.task_status == "PENDING_PAYMENT":
            task.task_status = "PENDING_ASSIGNMENT"

        TaskRepository.save_task(db, task)
        return payment
