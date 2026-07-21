from sqlalchemy.orm import Session, selectinload
from sqlalchemy import func, or_
from typing import List, Optional
from datetime import datetime
from app.entity.task_entity import TaskEntity
from app.entity.task_bid_entity import TaskBidEntity
from app.entity.task_assignment_entity import TaskAssignmentEntity
from app.entity.task_submission_entity import TaskSubmissionEntity
from app.entity.task_revision_entity import TaskRevisionEntity
from app.entity.task_file_entity import TaskFileEntity
from app.entity.submission_file_entity import SubmissionFileEntity
from app.entity.revision_file_entity import RevisionFileEntity
from app.entity.user_entity import UserEntity
from app.entity.writer_profile_entity import WriterProfileEntity
from app.entity.payment_entity import PaymentEntity

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

    @staticmethod
    def get_overdue_confirmed_tasks(db: Session, now) -> List[TaskEntity]:
        OVERDUE_ELIGIBLE_STATUSES = ["ASSIGNED", "IN_PROGRESS", "SUBMITTED", "REVISION_REQUESTED"]
        return (
            db.query(TaskEntity)
            .filter(
                TaskEntity.is_delete == False,
                TaskEntity.task_status.in_(OVERDUE_ELIGIBLE_STATUSES),
                TaskEntity.deadline < now,
            )
            .all()
        )

    # ──────────────────────────────────────────────
    # Bids
    # ──────────────────────────────────────────────
    @staticmethod
    def get_active_bids_for_task(db: Session, task_id: int) -> List[TaskBidEntity]:
        return (
            db.query(TaskBidEntity)
            .options(
                selectinload(TaskBidEntity.writer).selectinload(UserEntity.writer_profile),
                selectinload(TaskBidEntity.writer).selectinload(UserEntity.user_profile),
            )
            .filter(
                TaskBidEntity.task_id == task_id,
                TaskBidEntity.bid_status != "WITHDRAWN",
            )
            .all()
        )

    @staticmethod
    def get_pending_bid_by_id_and_task(db: Session, bid_id: int, task_id: int) -> Optional[TaskBidEntity]:
        return db.query(TaskBidEntity).filter(
            TaskBidEntity.id == bid_id,
            TaskBidEntity.task_id == task_id,
            TaskBidEntity.bid_status == "PENDING",
        ).first()

    @staticmethod
    def get_bid_by_task_writer_status(db: Session, task_id: int, writer_id: int, status: str) -> Optional[TaskBidEntity]:
        return db.query(TaskBidEntity).filter(
            TaskBidEntity.task_id == task_id,
            TaskBidEntity.writer_id == writer_id,
            TaskBidEntity.bid_status == status,
        ).first()

    @staticmethod
    def get_bid_by_id_and_writer(db: Session, bid_id: int, writer_id: int) -> Optional[TaskBidEntity]:
        return db.query(TaskBidEntity).filter(
            TaskBidEntity.id == bid_id,
            TaskBidEntity.writer_id == writer_id,
        ).first()

    @staticmethod
    def get_bids_by_writer(db: Session, writer_id: int) -> List[TaskBidEntity]:
        return (
            db.query(TaskBidEntity)
            .options(selectinload(TaskBidEntity.task))
            .filter(TaskBidEntity.writer_id == writer_id)
            .order_by(TaskBidEntity.created_at.desc())
            .all()
        )

    @staticmethod
    def get_pending_bids_by_writer_for_tasks(db: Session, writer_id: int, task_ids: List[int]) -> List[TaskBidEntity]:
        if not task_ids:
            return []
        return db.query(TaskBidEntity).filter(
            TaskBidEntity.task_id.in_(task_ids),
            TaskBidEntity.writer_id == writer_id,
            TaskBidEntity.bid_status == "PENDING",
        ).all()

    @staticmethod
    def reject_other_pending_bids(db: Session, task_id: int, accepted_bid_id: int) -> None:
        db.query(TaskBidEntity).filter(
            TaskBidEntity.task_id == task_id,
            TaskBidEntity.id != accepted_bid_id,
            TaskBidEntity.bid_status == "PENDING",
        ).update({"bid_status": "REJECTED"})

    @staticmethod
    def create_bid(db: Session, bid: TaskBidEntity) -> TaskBidEntity:
        db.add(bid)
        db.commit()
        db.refresh(bid)
        return bid

    @staticmethod
    def save_bid(db: Session, bid: TaskBidEntity) -> TaskBidEntity:
        db.commit()
        db.refresh(bid)
        return bid

    @staticmethod
    def commit_bid_withdrawal(db: Session, bid: TaskBidEntity) -> None:
        db.commit()

    @staticmethod
    def save_bid_acceptance(db: Session, task: TaskEntity, bid: TaskBidEntity) -> None:
        db.commit()
        db.refresh(task)
        db.refresh(bid)

    # ──────────────────────────────────────────────
    # Assignments
    # ──────────────────────────────────────────────
    @staticmethod
    def create_assignment(db: Session, assignment: TaskAssignmentEntity) -> TaskAssignmentEntity:
        db.add(assignment)
        return assignment

    @staticmethod
    def get_active_assignment_for_writer(db: Session, task_id: int, writer_id: int) -> Optional[TaskAssignmentEntity]:
        return db.query(TaskAssignmentEntity).filter(
            TaskAssignmentEntity.task_id == task_id,
            TaskAssignmentEntity.writer_id == writer_id,
            TaskAssignmentEntity.assignment_status.in_(["PENDING", "ACCEPTED"]),
        ).first()

    # ──────────────────────────────────────────────
    # Submissions
    # ──────────────────────────────────────────────
    @staticmethod
    def create_submission(db: Session, submission: TaskSubmissionEntity) -> TaskSubmissionEntity:
        db.add(submission)
        db.flush()
        return submission

    @staticmethod
    def add_submission_files(db: Session, files: List[SubmissionFileEntity]) -> None:
        db.add_all(files)

    @staticmethod
    def save_submission(db: Session, submission: TaskSubmissionEntity) -> TaskSubmissionEntity:
        db.commit()
        db.refresh(submission)
        return submission

    @staticmethod
    def get_last_submission_for_task(db: Session, task_id: int) -> Optional[TaskSubmissionEntity]:
        return (
            db.query(TaskSubmissionEntity)
            .filter(TaskSubmissionEntity.task_id == task_id)
            .order_by(TaskSubmissionEntity.submitted_at.desc())
            .first()
        )

    # ──────────────────────────────────────────────
    # Revisions
    # ──────────────────────────────────────────────
    @staticmethod
    def get_active_revisions_for_task(db: Session, task_id: int) -> List[TaskRevisionEntity]:
        return db.query(TaskRevisionEntity).filter(
            TaskRevisionEntity.task_id == task_id,
            TaskRevisionEntity.revision_status.in_(["REQUESTED", "IN_PROGRESS"])
        ).all()

    @staticmethod
    def create_revision(db: Session, revision: TaskRevisionEntity) -> TaskRevisionEntity:
        db.add(revision)
        db.flush()
        return revision

    @staticmethod
    def add_revision_files(db: Session, files: List[RevisionFileEntity]) -> None:
        db.add_all(files)

    @staticmethod
    def save_revision(db: Session, revision: TaskRevisionEntity) -> TaskRevisionEntity:
        db.commit()
        db.refresh(revision)
        return revision

    # ──────────────────────────────────────────────
    # Task files
    # ──────────────────────────────────────────────
    @staticmethod
    def add_task_files(db: Session, files: List[TaskFileEntity]) -> List[TaskFileEntity]:
        db.add_all(files)
        db.commit()
        return files

    # ──────────────────────────────────────────────
    # Generic task persistence
    # ──────────────────────────────────────────────
    @staticmethod
    def save_task(db: Session, task: TaskEntity) -> TaskEntity:
        db.commit()
        db.refresh(task)
        return task

    # ──────────────────────────────────────────────
    # Writer-facing task/bid listings
    # ──────────────────────────────────────────────
    @staticmethod
    def get_writer_profile_by_user_id(db: Session, user_id: int) -> Optional[WriterProfileEntity]:
        return (
            db.query(WriterProfileEntity)
            .filter(WriterProfileEntity.user_id == user_id)
            .first()
        )

    @staticmethod
    def get_open_tasks_matching_profile(db: Session, category_id: Optional[int], specialization_id: Optional[int]) -> List[TaskEntity]:
        query = db.query(TaskEntity).options(selectinload(TaskEntity.files)).filter(
            TaskEntity.task_status == "OPEN",
            TaskEntity.is_delete == False,
        )
        filters = []
        if category_id:
            filters.append(TaskEntity.academic_category_id == category_id)
        if specialization_id:
            filters.append(TaskEntity.specialization_id == specialization_id)
        if filters:
            query = query.filter(or_(*filters))
        return query.order_by(TaskEntity.created_at.desc()).all()

    @staticmethod
    def get_tasks_for_writer(db: Session, writer_id: int) -> List[TaskEntity]:
        return (
            db.query(TaskEntity)
            .outerjoin(TaskAssignmentEntity)
            .outerjoin(TaskBidEntity)
            .options(selectinload(TaskEntity.files))
            .filter(
                TaskEntity.is_delete == False,
                or_(
                    TaskAssignmentEntity.writer_id == writer_id,
                    (TaskBidEntity.writer_id == writer_id) & (TaskBidEntity.bid_status == "ACCEPTED")
                )
            )
            .order_by(TaskEntity.created_at.desc())
            .distinct()
            .all()
        )

    # ──────────────────────────────────────────────
    # Customer dashboard stats
    # ──────────────────────────────────────────────
    @staticmethod
    def get_tasks_for_customer_stats(db: Session, customer_id: int) -> List[TaskEntity]:
        return db.query(TaskEntity).filter(
            TaskEntity.customer_id == customer_id,
            TaskEntity.is_delete == False,
        ).all()

    @staticmethod
    def get_weekly_paid_amount(db: Session, customer_id: int, since: datetime):
        return db.query(func.sum(PaymentEntity.amount)).filter(
            PaymentEntity.customer_id == customer_id,
            PaymentEntity.payment_status == "PAID",
            PaymentEntity.created_at >= since,
        ).scalar()
