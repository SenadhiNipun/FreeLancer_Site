from typing import List, Optional
from sqlalchemy.orm import Session
from app.entity.task_entity import TaskEntity
from app.entity.task_bid_entity import TaskBidEntity
from app.entity.task_submission_entity import TaskSubmissionEntity
from app.entity.task_revision_entity import TaskRevisionEntity
from app.repository.task_repository import TaskRepository
from app.model.create_task_request import CreateTaskRequest
from app.model.submit_task_request import SubmitTaskRequest
from app.model.revision_request import RevisionRequest
from app.model.bid_request import BidRequest
from app.model.task_response import TaskResponse, TaskFileResponse
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
        bids = TaskRepository.get_active_bids_for_task(db, task_id)

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

        bid = TaskRepository.get_pending_bid_by_id_and_task(db, bid_id, task_id)
        if not bid:
            raise NotFoundException(detail="Bid not found or already processed")

        # Accept this bid
        bid.bid_status = "ACCEPTED"
        task.budget = bid.bid_amount
        task.task_status = "PENDING_PAYMENT"

        # Reject all other pending bids on the same task
        TaskRepository.reject_other_pending_bids(db, task_id, bid_id)

        # Create task assignment for the writer
        from app.entity.task_assignment_entity import TaskAssignmentEntity
        from datetime import datetime

        assignment = TaskAssignmentEntity(
            task_id=task_id,
            writer_id=bid.writer_id,
            assignment_status="ACCEPTED",
            accepted_at=datetime.now()
        )
        TaskRepository.create_assignment(db, assignment)

        TaskRepository.save_bid_acceptance(db, task, bid)

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
        tasks = TaskRepository.get_tasks_for_customer_stats(db, customer_id)

        # Total posted tasks (all statuses)
        total_posted = len(tasks)
        
        # Active projects with accepted bids (status is not OPEN and not terminal)
        # Note: SUBMITTED is technically still active until COMPLETED (payment released/approved)
        active_accepted = [t for t in tasks if t.task_status in ["PENDING_PAYMENT", "ASSIGNED", "IN_PROGRESS", "REVISION_REQUESTED", "SUBMITTED"]]
        
        completed_tasks = [t for t in tasks if t.task_status == "COMPLETED"]
        
        # Pipeline stats
        bidding_tasks = [t for t in tasks if t.task_status == "OPEN"]
        in_progress_tasks = [t for t in tasks if t.task_status in ["ASSIGNED", "IN_PROGRESS", "REVISION_REQUESTED", "SUBMITTED"]]
        
        # Success Rate (completed / total posted)
        success_rate = 0
        if total_posted > 0:
            success_rate = int((len(completed_tasks) / total_posted) * 100)

        # Real spending this week
        from datetime import datetime, timedelta

        one_week_ago = datetime.now() - timedelta(days=7)
        weekly_spending_result = TaskRepository.get_weekly_paid_amount(db, customer_id, one_week_ago)

        spending_this_week = float(weekly_spending_result) if weekly_spending_result else 0.0

        # Real monthly data, aggregated in-memory from the already-loaded tasks
        # (avoids a redundant SQL aggregation query over the same rows)
        month_map = {1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
                     7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"}

        monthly_data = [{"month": month_map[m], "value": 0} for m in range(1, 13)]
        for t in tasks:
            if t.created_at:
                try:
                    m_idx = t.created_at.month
                    monthly_data[m_idx - 1]["value"] += float(t.budget or 0)
                except:
                    continue

        # Mock recent activity
        recent_activity = []
        for t in sorted(tasks, key=lambda x: x.updated_at or x.created_at, reverse=True)[:5]:
            recent_activity.append({
                "id": t.id,
                "title": t.title,
                "status": t.task_status,
                "updated_at": t.updated_at or t.created_at
            })

        return {
            "balance": 0.00,
            "total_posted_count": total_posted,
            "active_accepted_count": len(active_accepted),
            "active_projects_count": len(active_accepted),
            "completed_tasks_count": len(completed_tasks),
            "spending_this_week": spending_this_week,
            "pipeline_posted": total_posted,
            "pipeline_bidding": len(bidding_tasks),
            "pipeline_in_progress": len(in_progress_tasks),
            "pipeline_completed": len(completed_tasks),
            "success_rate": success_rate,
            "monthly_data": monthly_data,
            "recent_activity": recent_activity
        }

    # ──────────────────────────────────────────────
    # WRITER — open tasks matching their field
    # ──────────────────────────────────────────────
    @staticmethod
    def get_open_tasks_for_writer(db: Session, writer_id: int):
        profile = TaskRepository.get_writer_profile_by_user_id(db, writer_id)

        category_id = profile.academic_category_id if profile else None
        specialization_id = profile.specialization_id if profile else None
        tasks = TaskRepository.get_open_tasks_matching_profile(db, category_id, specialization_id)

        my_bids = TaskRepository.get_pending_bids_by_writer_for_tasks(db, writer_id, [t.id for t in tasks])
        my_bids_by_task = {b.task_id: b for b in my_bids}

        results = []
        for t in tasks:
            resp = TaskResponse.model_validate(t)
            my_bid = my_bids_by_task.get(t.id)
            if my_bid:
                from app.model.bid_response import BidResponse
                resp.my_bid = BidResponse.model_validate(my_bid)
            results.append(resp)

        return results

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

        # Handle existing active bids (update instead of error)
        existing = TaskRepository.get_bid_by_task_writer_status(db, task_id, writer_id, "PENDING")

        is_update = False
        if existing:
            existing.bid_amount = request.bid_amount
            existing.message = request.message
            bid = existing
            bid = TaskRepository.save_bid(db, bid)
            is_update = True
        else:
            bid = TaskBidEntity(
                task_id=task_id,
                writer_id=writer_id,
                bid_amount=request.bid_amount,
                message=request.message,
                bid_status="PENDING",
            )
            bid = TaskRepository.create_bid(db, bid)

        # Initialize chat between customer and writer so they can discuss before acceptance
        try:
            # ── Notification for Customer ──
            from app.repository.user_repository import UserRepository
            writer = UserRepository.get_user_by_id(db, writer_id)
            writer_name = f"{writer.first_name} {writer.last_name}" if writer else "An expert writer"
            
            action_text = "updated their bid to" if is_update else "placed a new bid of"
            title_text = "Bid Updated!" if is_update else "New Bid Received!"
            
            from app.service.notification_service import NotificationService
            print(f"DEBUG: Triggering notification for customer {task.customer_id} regarding task {task_id}")
            
            NotificationService.create_notification(
                db,
                user_id=task.customer_id,
                title=title_text,
                message=f"{writer_name} has {action_text} ${request.bid_amount} on your project '{task.title}'.",
                notification_type="BID_RECEIVED",
                related_id=task_id
            )
            print(f"DEBUG: Notification created successfully for {title_text}")
        except Exception as e:
            print(f"Post-bid processing error (Notification/Chat): {e}")
            import traceback
            traceback.print_exc()

        return BidResponse.model_validate(bid)

    # ──────────────────────────────────────────────
    # WRITER — get own bids
    # ──────────────────────────────────────────────
    @staticmethod
    def get_writer_bids(db: Session, writer_id: int):
        from app.model.bid_response import TaskBriefResponse
        bids = TaskRepository.get_bids_by_writer(db, writer_id)
        results = []
        for b in bids:
            resp = BidResponse.model_validate(b)
            if b.task:
                resp.task = TaskBriefResponse.model_validate(b.task)
            results.append(resp)
        return results

    # ──────────────────────────────────────────────
    # WRITER — get assigned tasks
    # ──────────────────────────────────────────────
    @staticmethod
    def get_writer_tasks(db: Session, writer_id: int):
        tasks = TaskRepository.get_tasks_for_writer(db, writer_id)
        return [TaskResponse.model_validate(t) for t in tasks]

    # ──────────────────────────────────────────────
    # WRITER — withdraw a bid
    # ──────────────────────────────────────────────
    @staticmethod
    def withdraw_bid(db: Session, bid_id: int, writer_id: int):
        bid = TaskRepository.get_bid_by_id_and_writer(db, bid_id, writer_id)
        if not bid:
            raise NotFoundException(detail="Bid not found")
        if bid.bid_status != "PENDING":
            raise ValidationException(detail="Only pending bids can be withdrawn")
        bid.bid_status = "WITHDRAWN"
        TaskRepository.commit_bid_withdrawal(db, bid)
        return {"message": "Bid withdrawn successfully"}

    # ──────────────────────────────────────────────
    # Shared — get task details
    # ──────────────────────────────────────────────
    @staticmethod
    def get_task_details(db: Session, task_id: int, writer_id: Optional[int] = None):
        task = TaskRepository.get_task_by_id(db, task_id)
        if not task:
            raise NotFoundException(detail="Task not found")
        
        resp = TaskResponse.model_validate(task)
        if writer_id:
            from app.model.bid_response import BidResponse
            my_bid = TaskRepository.get_bid_by_task_writer_status(db, task_id, writer_id, "PENDING")
            if my_bid:
                resp.my_bid = BidResponse.model_validate(my_bid)
                
        return resp

    # ──────────────────────────────────────────────
    # WRITER — submit completed work
    # ──────────────────────────────────────────────
    @staticmethod
    async def submit_task(
        db: Session, 
        task_id: int, 
        writer_id: int, 
        submission_note: str, 
        is_final: bool = True, 
        files: List["UploadFile"] = None
    ):
        task = TaskRepository.get_task_by_id(db, task_id)
        if not task:
            raise NotFoundException(detail="Task not found")

        assignment = TaskRepository.get_active_assignment_for_writer(db, task_id, writer_id)

        if not assignment:
            # Fallback: check for accepted bid
            bid = TaskRepository.get_bid_by_task_writer_status(db, task_id, writer_id, "ACCEPTED")

            if not bid:
                raise ValidationException(detail="Writer not assigned to this task")

        submission = TaskSubmissionEntity(
            task_id=task_id,
            writer_id=writer_id,
            submission_note=submission_note,
            submission_status="FINAL_SUBMISSION" if is_final else "DRAFT_SUBMISSION",
        )
        task.task_status = "SUBMITTED"
        submission = TaskRepository.create_submission(db, submission)  # flushes to get submission.id

        # Save submission files if provided
        if files:
            import os, shutil
            from app.entity.submission_file_entity import SubmissionFileEntity
            from datetime import datetime as dt

            upload_dir = "uploads/submissions"
            os.makedirs(upload_dir, exist_ok=True)

            submission_files = []
            for file in files:
                timestamp = dt.now().strftime("%Y%m%d%H%M%S%f")
                safe_filename = file.filename.replace(" ", "_")
                saved_name = f"{task_id}_{submission.id}_{timestamp}_{safe_filename}"
                file_path = os.path.join(upload_dir, saved_name)

                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(file.file, buffer)

                submission_files.append(SubmissionFileEntity(
                    submission_id=submission.id,
                    file_name=file.filename,
                    file_url=f"/uploads/submissions/{saved_name}",
                    mime_type=file.content_type,
                    file_size=getattr(file, "size", 0),
                ))
            TaskRepository.add_submission_files(db, submission_files)

        # Transition any active revision requests to COMPLETED
        active_revisions = TaskRepository.get_active_revisions_for_task(db, task_id)
        for rev in active_revisions:
            rev.revision_status = "COMPLETED"

        # Notify the customer about the delivery
        customer_id = task.customer_id
        if customer_id:
            try:
                from app.service.notification_service import NotificationService
                if active_revisions:
                    title = "Revision Delivered"
                    message = f"The writer has submitted revised files for project '{task.title}'"
                    notification_type = "REVISION_DELIVERED"
                else:
                    title = "Work Delivered"
                    message = f"The writer has submitted the completed work for project '{task.title}'"
                    notification_type = "WORK_DELIVERED"

                NotificationService.create_notification(
                    db=db,
                    user_id=customer_id,
                    title=title,
                    message=message,
                    notification_type=notification_type,
                    related_id=task_id
                )
            except Exception as e:
                print(f"Failed to send delivery notification to customer: {e}")

        submission = TaskRepository.save_submission(db, submission)
        return SubmissionResponse.model_validate(submission)

    @staticmethod
    def approve_task(db: Session, task_id: int, customer_id: int):
        task = TaskRepository.get_task_by_id(db, task_id)
        if not task or task.customer_id != customer_id:
            raise NotFoundException(detail="Task not found")

        task.task_status = "COMPLETED"

        # Notify the writer if one is assigned
        writer = task.writer
        if writer:
            try:
                from app.service.notification_service import NotificationService
                NotificationService.create_notification(
                    db=db,
                    user_id=writer.id,
                    title="Task Approved!",
                    message=f"The client has approved your work for task '{task.title}' and released the payment!",
                    notification_type="TASK_APPROVED",
                    related_id=task_id
                )
            except Exception as e:
                print(f"Failed to send task approval notification: {e}")

        task = TaskRepository.save_task(db, task)
        return TaskResponse.model_validate(task)

    # ──────────────────────────────────────────────
    # CUSTOMER — request revision
    # ──────────────────────────────────────────────
    @staticmethod
    async def request_revision(db: Session, task_id: int, customer_id: int, revision_note: str, files: List["UploadFile"] = None):
        task = TaskRepository.get_task_by_id(db, task_id)
        if not task or task.customer_id != customer_id:
            raise NotFoundException(detail="Task not found")

        last_submission = TaskRepository.get_last_submission_for_task(db, task_id)
        if not last_submission:
            raise ValidationException(detail="No submission found to revise")

        revision = TaskRevisionEntity(
            task_id=task_id,
            submission_id=last_submission.id,
            requested_by_user_id=customer_id,
            revision_note=revision_note,
            revision_status="REQUESTED",
        )
        task.task_status = "REVISION_REQUESTED"
        revision = TaskRepository.create_revision(db, revision)  # flushes to get revision.id

        # Save revision files if provided
        if files:
            import os, shutil
            from app.entity.revision_file_entity import RevisionFileEntity
            from datetime import datetime as dt

            upload_dir = "uploads/revisions"
            os.makedirs(upload_dir, exist_ok=True)

            revision_files = []
            for file in files:
                timestamp = dt.now().strftime("%Y%m%d%H%M%S%f")
                safe_filename = file.filename.replace(" ", "_")
                saved_name = f"{task_id}_{revision.id}_{timestamp}_{safe_filename}"
                file_path = os.path.join(upload_dir, saved_name)

                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(file.file, buffer)

                revision_files.append(RevisionFileEntity(
                    revision_id=revision.id,
                    uploaded_by_user_id=customer_id,
                    file_name=file.filename,
                    file_url=f"/uploads/revisions/{saved_name}",
                    mime_type=file.content_type,
                    file_size=getattr(file, "size", 0),
                ))
            TaskRepository.add_revision_files(db, revision_files)

        # Notify the writer about the revision request
        writer = task.writer
        if writer:
            try:
                from app.service.notification_service import NotificationService
                NotificationService.create_notification(
                    db=db,
                    user_id=writer.id,
                    title="Revision Requested",
                    message=f"The client requested a revision for project '{task.title}'",
                    notification_type="REVISION_REQUESTED",
                    related_id=task_id
                )
            except Exception as e:
                print(f"Failed to send revision notification: {e}")

        revision = TaskRepository.save_revision(db, revision)
        return RevisionResponse.model_validate(revision)
    @staticmethod
    async def save_task_files_locally(db: Session, task_id: int, user_id: int, files: List["UploadFile"], file_type: str = "REQUIREMENT_FILE"):
        import os
        import shutil
        from app.entity.task_file_entity import TaskFileEntity
        
        task = TaskRepository.get_task_by_id(db, task_id)
        if not task:
            raise NotFoundException(detail="Task not found")
        
        # Check permissions: User must be either the customer or the assigned writer
        # (task.assignments is already eager-loaded by get_task_by_id, so this
        # is an in-memory check instead of a redundant query)
        is_customer = task.customer_id == user_id
        is_writer = any(a.writer_id == user_id for a in task.assignments)

        if not is_customer and not is_writer:
            raise ValidationException(detail="You don't have permission to add files to this task")
            
        upload_dir = "uploads/tasks"
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
            
        new_files = []
        for file in files:
            # Create a unique filename to avoid collisions
            from datetime import datetime
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            safe_filename = file.filename.replace(" ", "_")
            saved_name = f"{task_id}_{timestamp}_{safe_filename}"
            file_path = os.path.join(upload_dir, saved_name)
            
            # Save file to disk
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            # Record in database
            # Note: file_url is the path used to retrieve the file later
            file_url = f"/uploads/tasks/{saved_name}"
            
            new_file = TaskFileEntity(
                task_id=task_id,
                uploaded_by_user_id=user_id,
                file_name=file.filename,
                file_url=file_url,
                file_type=file_type,
                mime_type=file.content_type,
                file_size=getattr(file, 'size', 0)
            )
            new_files.append(new_file)

        new_files = TaskRepository.add_task_files(db, new_files)

        # Notify the writer if one is assigned
        writer = task.writer
        if writer:
            try:
                from app.service.notification_service import NotificationService
                NotificationService.create_notification(
                    db=db,
                    user_id=writer.id,
                    title="New Files Added",
                    message=f"The client added {len(new_files)} new file(s) to project '{task.title}'",
                    notification_type="FILES_ADDED",
                    related_id=task_id
                )
            except Exception as e:
                print(f"Failed to send notification for files: {e}")

        return [TaskFileResponse.model_validate(f) for f in new_files]

    # ──────────────────────────────────────────────
    # CUSTOMER — add files to existing task (JSON Metadata version - Legacy)
    # ──────────────────────────────────────────────
    @staticmethod
    def add_task_files(db: Session, task_id: int, customer_id: int, request: "AddTaskFilesRequest"):
        from app.entity.task_file_entity import TaskFileEntity
        
        task = TaskRepository.get_task_by_id(db, task_id)
        if not task:
            raise NotFoundException(detail="Task not found")
        
        if task.customer_id != customer_id:
            raise ValidationException(detail="You don't own this task")
            
        new_files = []
        for file_data in request.files:
            new_file = TaskFileEntity(
                task_id=task_id,
                uploaded_by_user_id=customer_id,
                file_name=file_data.file_name,
                file_url=file_data.file_url,
                file_type=file_data.file_type,
                mime_type=file_data.mime_type,
                file_size=file_data.file_size
            )
            new_files.append(new_file)

        new_files = TaskRepository.add_task_files(db, new_files)

        # Notify the writer if one is assigned
        writer = task.writer
        if writer:
            from app.service.notification_service import NotificationService
            NotificationService.create_notification(
                db=db,
                user_id=writer.id,
                title="New Files Added",
                message=f"The client added {len(new_files)} new file(s) to project '{task.title}'",
                notification_type="FILES_ADDED",
                related_id=task_id
            )

        return [TaskFileResponse.model_validate(f) for f in new_files]

    # ──────────────────────────────────────────────
    # SYSTEM — check for confirmed tasks that missed their deadline
    # ──────────────────────────────────────────────
    @staticmethod
    def check_and_notify_overdue_tasks(db: Session):
        from datetime import datetime

        overdue_tasks = TaskRepository.get_overdue_confirmed_tasks(db, datetime.now())
        for task in overdue_tasks:
            if NotificationService.has_overdue_notification(db, task.id):
                continue
            try:
                NotificationService.notify_task_overdue(db, task)
            except Exception as e:
                print(f"Failed to send overdue notifications for task {task.id}: {e}")

    DEADLINE_REMINDER_THRESHOLDS = [
        ("TASK_DUE_7_DAYS", "days", 7, "7 days"),
        ("TASK_DUE_48_HOURS", "hours", 48, "48 hours"),
        ("TASK_DUE_24_HOURS", "hours", 24, "24 hours"),
    ]

    @staticmethod
    def check_and_notify_upcoming_deadlines(db: Session):
        from datetime import datetime, timedelta

        now = datetime.now()
        for notification_type, unit, amount, time_label in TaskService.DEADLINE_REMINDER_THRESHOLDS:
            window_end = now + timedelta(**{unit: amount})
            tasks = TaskRepository.get_tasks_due_within(db, now, window_end)
            for task in tasks:
                if NotificationService.has_deadline_reminder(db, task.id, notification_type):
                    continue
                try:
                    NotificationService.notify_task_deadline_reminder(db, task, notification_type, time_label)
                except Exception as e:
                    print(f"Failed to send {notification_type} reminder for task {task.id}: {e}")
