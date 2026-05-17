from sqlalchemy.orm import Session
from typing import List, Optional
from app.entity.task_entity import TaskEntity

class TaskRepository:

    @staticmethod
    def create_task(db: Session, task: TaskEntity) -> TaskEntity:
        db.add(task)
        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def get_task_by_id(db: Session, task_id: int) -> Optional[TaskEntity]:
        from sqlalchemy.orm import selectinload
        from app.entity.task_assignment_entity import TaskAssignmentEntity
        from app.entity.task_bid_entity import TaskBidEntity
        from app.entity.task_revision_entity import TaskRevisionEntity
        from app.entity.task_submission_entity import TaskSubmissionEntity
        from app.entity.user_entity import UserEntity
        return (
            db.query(TaskEntity)
            .options(
                selectinload(TaskEntity.assignments).selectinload(TaskAssignmentEntity.writer).selectinload(UserEntity.user_profile),
                selectinload(TaskEntity.bids).selectinload(TaskBidEntity.writer).selectinload(UserEntity.user_profile),
                selectinload(TaskEntity.customer).selectinload(UserEntity.user_profile),
                selectinload(TaskEntity.files),
                selectinload(TaskEntity.submissions).selectinload(TaskSubmissionEntity.files),
                selectinload(TaskEntity.revisions).selectinload(TaskRevisionEntity.files)
            )
            .filter(TaskEntity.id == task_id, TaskEntity.is_delete == False)
            .first()
        )

    @staticmethod
    def get_tasks_by_customer(db: Session, customer_id: int) -> List[TaskEntity]:
        from sqlalchemy.orm import selectinload
        from app.entity.task_assignment_entity import TaskAssignmentEntity
        from app.entity.task_bid_entity import TaskBidEntity
        from app.entity.user_entity import UserEntity
        return (
            db.query(TaskEntity)
            .options(
                selectinload(TaskEntity.assignments).selectinload(TaskAssignmentEntity.writer).selectinload(UserEntity.user_profile),
                selectinload(TaskEntity.bids).selectinload(TaskBidEntity.writer).selectinload(UserEntity.user_profile),
                selectinload(TaskEntity.files)
            )
            .filter(TaskEntity.customer_id == customer_id, TaskEntity.is_delete == False)
            .order_by(TaskEntity.created_at.desc())
            .all()
        )

    @staticmethod
    def get_all_tasks(db: Session, status: Optional[str] = None) -> List[TaskEntity]:
        query = db.query(TaskEntity).filter(TaskEntity.is_delete == False)
        if status:
            query = query.filter(TaskEntity.task_status == status)
        return query.order_by(TaskEntity.created_at.desc()).all()
