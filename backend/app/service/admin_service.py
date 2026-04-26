from sqlalchemy.orm import Session
from app.repository.user_repository import UserRepository
from app.exceptions.exception import NotFoundException, ValidationException
from app.service.chat_service import ChatService

class AdminService:

    @staticmethod
    def approve_writer(db: Session, writer_id: int):
        user = UserRepository.get_user_by_id(db, writer_id)
        if not user or not user.writer_profile:
            raise NotFoundException(detail="Writer not found")
        
        user.writer_profile.profile_status = "APPROVED"
        db.commit()
        return True

    @staticmethod
    def reject_writer(db: Session, writer_id: int, reason: str):
        user = UserRepository.get_user_by_id(db, writer_id)
        if not user or not user.writer_profile:
            raise NotFoundException(detail="Writer not found")
        
        user.writer_profile.profile_status = "REJECTED"
        # Optional: store reason in a remarks field if added
        db.commit()
        return True

    @staticmethod
    def get_pending_writers(db: Session):
        from app.entity.user_entity import UserEntity
        from app.entity.writer_profile_entity import WriterProfileEntity
        
        return (
            db.query(UserEntity)
            .join(WriterProfileEntity)
            .filter(WriterProfileEntity.profile_status == "PENDING_APPROVAL")
            .all()
        )

    @staticmethod
    def assign_writer(db: Session, task_id: int, writer_id: int, admin_id: int):
        from app.entity.task_assignment_entity import TaskAssignmentEntity
        from app.repository.task_repository import TaskRepository
        
        task = TaskRepository.get_task_by_id(db, task_id)
        if not task:
            raise NotFoundException(detail="Task not found")
        
        # Check if writer exists and is approved
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
        
        # Initialize chat between customer and writer
        try:
            ChatService.initialize_chat(db, task_id, task.customer_id, writer_id)
        except Exception as e:
            print(f"Failed to initialize chat: {e}")
            
        db.commit()
        return assignment
