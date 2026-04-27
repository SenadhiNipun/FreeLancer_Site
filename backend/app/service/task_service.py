from sqlalchemy.orm import Session
from app.entity.task_entity import TaskEntity
from app.entity.task_bid_entity import TaskBidEntity
from app.entity.task_submission_entity import TaskSubmissionEntity
from app.entity.task_revision_entity import TaskRevisionEntity
from app.entity.writer_profile_entity import WriterProfileEntity
from app.repository.task_repository import TaskRepository
from app.model.create_task_request import CreateTaskRequest
from app.model.submit_task_request import SubmitTaskRequest
from app.model.revision_request import RevisionRequest
from app.model.bid_request import BidRequest
from app.model.task_response import TaskResponse
from app.model.bid_response import BidResponse
from app.model.task_workflow_response import SubmissionResponse, RevisionResponse
from app.exceptions.exception import NotFoundException, ValidationException
from app.service.notification_service import NotificationService
from app.service.chat_service import ChatService


class TaskService:

    # ──────────────────────────────────────────────
    # CUSTOMER — create task (no budget)
    # ──────────────────────────────────────────────
    @staticmethod
    def create_task(db: Session, customer_id: int, request: CreateTaskRequest):
        new_task = TaskEntity(
            customer_id=customer_id,
            title=request.title,
            description=request.description,
            academic_category_id=request.academic_category_id,
            specialization_id=request.specialization_id,
            education_level_id=request.education_level_id,
            deadline=request.deadline,
            budget=None,           # set later when a bid is accepted
            is_urgent=request.is_urgent,
            task_status="OPEN",    # immediately open for bidding
            payment_status="UNPAID",
        )
        task = TaskRepository.create_task(db, new_task)
        
        # Notify relevant writers
        try:
            NotificationService.notify_writers_for_new_task(db, task)
        except Exception as e:
            # We don't want task creation to fail just because notification failed
            print(f"Failed to send notifications: {e}")

        return TaskResponse.model_validate(task)

    # ──────────────────────────────────────────────
    # CUSTOMER — view own tasks
    # ──────────────────────────────────────────────
    @staticmethod
    def get_customer_tasks(db: Session, customer_id: int):
        tasks = TaskRepository.get_tasks_by_customer(db, customer_id)
        return [TaskResponse.model_validate(t) for t in tasks]

    # ──────────────────────────────────────────────
    # CUSTOMER — view bids on one of their tasks
    # ──────────────────────────────────────────────
    @staticmethod
    def get_bids_for_task(db: Session, task_id: int, customer_id: int):
        task = TaskRepository.get_task_by_id(db, task_id)
        if not task:
            raise NotFoundException(detail="Task not found")
        if task.customer_id != customer_id:
            raise ValidationException(detail="You don't own this task")
        bids = (
            db.query(TaskBidEntity)
            .filter(
                TaskBidEntity.task_id == task_id,
                TaskBidEntity.bid_status != "WITHDRAWN",
            )
            .all()
        )
        
        results = []
        for b in bids:
            resp = BidResponse.model_validate(b)
            if b.writer:
                from app.model.bid_response import PublicWriterProfileResponse
                wp = b.writer.writer_profile
                resp.writer = PublicWriterProfileResponse(
                    id=b.writer.id,
                    first_name=b.writer.first_name,
                    last_name=b.writer.last_name,
                    bio=wp.bio if wp else None,
                    experience_years=wp.experience_years if wp else None,
                    institution_name=wp.institution_name if wp else None,
                    academic_status=wp.academic_status if wp else None,
                    profile_image_url=b.writer.user_profile.profile_image_url if b.writer.user_profile else None
                )
            results.append(resp)
            
        return results

    # ──────────────────────────────────────────────
    # CUSTOMER — accept a bid
    # ──────────────────────────────────────────────
    @staticmethod
    def accept_bid(db: Session, task_id: int, bid_id: int, customer_id: int):
        task = TaskRepository.get_task_by_id(db, task_id)
        if not task:
            raise NotFoundException(detail="Task not found")
        if task.customer_id != customer_id:
            raise ValidationException(detail="You don't own this task")
        if task.task_status != "OPEN":
            raise ValidationException(detail="Task is not open for bidding")

        bid = db.query(TaskBidEntity).filter(
            TaskBidEntity.id == bid_id,
            TaskBidEntity.task_id == task_id,
            TaskBidEntity.bid_status == "PENDING",
        ).first()
        if not bid:
            raise NotFoundException(detail="Bid not found or already processed")

        # Accept this bid
        bid.bid_status = "ACCEPTED"
        task.budget = bid.bid_amount
        task.task_status = "PENDING_PAYMENT"

        # Reject all other pending bids on the same task
        db.query(TaskBidEntity).filter(
            TaskBidEntity.task_id == task_id,
            TaskBidEntity.id != bid_id,
            TaskBidEntity.bid_status == "PENDING",
        ).update({"bid_status": "REJECTED"})

        db.commit()
        db.refresh(task)
        db.refresh(bid)
        
        # Initialize chat between customer and writer
        try:
            ChatService.initialize_chat(db, task_id, customer_id, bid.writer_id)
        except Exception as e:
            print(f"Failed to initialize chat: {e}")

        # Notify writer that their bid was accepted
        try:
            NotificationService.create_notification(
                db,
                user_id=bid.writer_id,
                title="Bid Accepted!",
                message=f"Your bid for task '{task.title}' has been accepted. Please proceed with payment or assignment.",
                notification_type="BID_ACCEPTED",
                related_id=task.id
            )
        except Exception as e:
            print(f"Failed to send notification: {e}")

        return {
            "task": TaskResponse.model_validate(task), 
            "accepted_bid": BidResponse.model_validate(bid)
        }

    # ──────────────────────────────────────────────
    # CUSTOMER — dashboard stats
    # ──────────────────────────────────────────────
    @staticmethod
    def get_customer_dashboard_stats(db: Session, customer_id: int):
        tasks = db.query(TaskEntity).filter(TaskEntity.customer_id == customer_id).all()
        
        active_projects = [t for t in tasks if t.task_status not in ["COMPLETED", "CANCELLED"]]
        completed_tasks = [t for t in tasks if t.task_status == "COMPLETED"]
        
        # Mock recent activity for now, but derived from real tasks
        recent_activity = []
        for t in sorted(tasks, key=lambda x: x.updated_at or x.created_at, reverse=True)[:5]:
            recent_activity.append({
                "id": t.id,
                "title": t.title,
                "status": t.task_status,
                "updated_at": t.updated_at or t.created_at
            })

        return {
            "balance": 150.00, # Mock balance for now
            "active_projects_count": len(active_projects),
            "completed_tasks_count": len(completed_tasks),
            "spending_this_week": 48.00, # Mock spending
            "recent_activity": recent_activity
        }

    # ──────────────────────────────────────────────
    # WRITER — open tasks matching their field
    # ──────────────────────────────────────────────
    @staticmethod
    def get_open_tasks_for_writer(db: Session, writer_id: int):
        profile = (
            db.query(WriterProfileEntity)
            .filter(WriterProfileEntity.user_id == writer_id)
            .first()
        )

        query = db.query(TaskEntity).filter(
            TaskEntity.task_status == "OPEN",
            TaskEntity.is_delete == False,
        )

        # Narrow by writer's academic profile if available
        if profile:
            filters = []
            if profile.academic_category_id:
                filters.append(TaskEntity.academic_category_id == profile.academic_category_id)
            if profile.specialization_id:
                filters.append(TaskEntity.specialization_id == profile.specialization_id)
            if filters:
                from sqlalchemy import or_
                query = query.filter(or_(*filters))

        tasks = query.order_by(TaskEntity.created_at.desc()).all()
        return [TaskResponse.model_validate(t) for t in tasks]

    # ──────────────────────────────────────────────
    # WRITER — place a bid
    # ──────────────────────────────────────────────
    @staticmethod
    def place_bid(db: Session, task_id: int, writer_id: int, request: BidRequest):
        task = TaskRepository.get_task_by_id(db, task_id)
        if not task:
            raise NotFoundException(detail="Task not found")
        if task.task_status != "OPEN":
            raise ValidationException(detail="Task is not open for bidding")

        # Prevent duplicate active bids
        existing = db.query(TaskBidEntity).filter(
            TaskBidEntity.task_id == task_id,
            TaskBidEntity.writer_id == writer_id,
            TaskBidEntity.bid_status == "PENDING",
        ).first()
        if existing:
            raise ValidationException(detail="You already have a pending bid on this task")

        bid = TaskBidEntity(
            task_id=task_id,
            writer_id=writer_id,
            bid_amount=request.bid_amount,
            message=request.message,
            bid_status="PENDING",
        )
        db.add(bid)
        db.commit()
        db.refresh(bid)

        # Initialize chat between customer and writer so they can discuss before acceptance
        try:
            from app.service.chat_service import ChatService
            ChatService.initialize_chat(db, task_id, task.customer_id, writer_id)
        except Exception as e:
            print(f"Failed to initialize chat on bid: {e}")

        return BidResponse.model_validate(bid)

    # ──────────────────────────────────────────────
    # WRITER — get own bids
    # ──────────────────────────────────────────────
    @staticmethod
    def get_writer_bids(db: Session, writer_id: int):
        bids = (
            db.query(TaskBidEntity)
            .filter(TaskBidEntity.writer_id == writer_id)
            .order_by(TaskBidEntity.created_at.desc())
            .all()
        )
        return [BidResponse.model_validate(b) for b in bids]

    # ──────────────────────────────────────────────
    # WRITER — get assigned tasks
    # ──────────────────────────────────────────────
    @staticmethod
    def get_writer_tasks(db: Session, writer_id: int):
        from app.entity.task_assignment_entity import TaskAssignmentEntity
        tasks = (
            db.query(TaskEntity)
            .join(TaskAssignmentEntity)
            .filter(
                TaskAssignmentEntity.writer_id == writer_id,
                TaskEntity.is_delete == False,
            )
            .all()
        )
        return [TaskResponse.model_validate(t) for t in tasks]

    # ──────────────────────────────────────────────
    # WRITER — withdraw a bid
    # ──────────────────────────────────────────────
    @staticmethod
    def withdraw_bid(db: Session, bid_id: int, writer_id: int):
        bid = db.query(TaskBidEntity).filter(
            TaskBidEntity.id == bid_id,
            TaskBidEntity.writer_id == writer_id,
        ).first()
        if not bid:
            raise NotFoundException(detail="Bid not found")
        if bid.bid_status != "PENDING":
            raise ValidationException(detail="Only pending bids can be withdrawn")
        bid.bid_status = "WITHDRAWN"
        db.commit()
        return {"message": "Bid withdrawn successfully"}

    # ──────────────────────────────────────────────
    # Shared — get task details
    # ──────────────────────────────────────────────
    @staticmethod
    def get_task_details(db: Session, task_id: int):
        task = TaskRepository.get_task_by_id(db, task_id)
        if not task:
            raise NotFoundException(detail="Task not found")
        return TaskResponse.model_validate(task)

    # ──────────────────────────────────────────────
    # WRITER — submit completed work
    # ──────────────────────────────────────────────
    @staticmethod
    def submit_task(db: Session, task_id: int, writer_id: int, request: SubmitTaskRequest):
        task = TaskRepository.get_task_by_id(db, task_id)
        if not task:
            raise NotFoundException(detail="Task not found")

        from app.entity.task_assignment_entity import TaskAssignmentEntity
        assignment = db.query(TaskAssignmentEntity).filter(
            TaskAssignmentEntity.task_id == task_id,
            TaskAssignmentEntity.writer_id == writer_id,
            TaskAssignmentEntity.assignment_status.in_(["PENDING", "ACCEPTED"]),
        ).first()

        if not assignment:
            raise ValidationException(detail="Writer not assigned to this task")

        submission = TaskSubmissionEntity(
            task_id=task_id,
            writer_id=writer_id,
            submission_note=request.submission_note,
            submission_status="FINAL_SUBMISSION" if request.is_final else "DRAFT_SUBMISSION",
        )
        db.add(submission)
        task.task_status = "SUBMITTED"
        db.commit()
        db.refresh(submission)
        return SubmissionResponse.model_validate(submission)

    # ──────────────────────────────────────────────
    # CUSTOMER — request revision
    # ──────────────────────────────────────────────
    @staticmethod
    def request_revision(db: Session, task_id: int, customer_id: int, request: RevisionRequest):
        task = TaskRepository.get_task_by_id(db, task_id)
        if not task or task.customer_id != customer_id:
            raise NotFoundException(detail="Task not found")

        last_submission = (
            db.query(TaskSubmissionEntity)
            .filter(TaskSubmissionEntity.task_id == task_id)
            .order_by(TaskSubmissionEntity.submitted_at.desc())
            .first()
        )
        if not last_submission:
            raise ValidationException(detail="No submission found to revise")

        revision = TaskRevisionEntity(
            task_id=task_id,
            submission_id=last_submission.id,
            requested_by_user_id=customer_id,
            revision_note=request.revision_note,
            revision_status="REQUESTED",
        )
        db.add(revision)
        task.task_status = "REVISION_REQUESTED"
        db.commit()
        db.refresh(revision)
        return RevisionResponse.model_validate(revision)
