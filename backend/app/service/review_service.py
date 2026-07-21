from sqlalchemy.orm import Session
from app.entity.review_entity import ReviewEntity
from app.repository.task_repository import TaskRepository
from app.repository.review_repository import ReviewRepository
from app.model.review_model import CreateReviewRequest, ReviewResponse
from app.exceptions.exception import NotFoundException, ValidationException
from app.service.notification_service import NotificationService

class ReviewService:

    @staticmethod
    def submit_review(db: Session, task_id: int, customer_id: int, request: CreateReviewRequest):
        # Fetch task
        task = TaskRepository.get_task_by_id(db, task_id)
        if not task or task.customer_id != customer_id:
            raise NotFoundException(detail="Task not found")

        # Validate task status
        if task.task_status != "COMPLETED":
            raise ValidationException(detail="Reviews can only be submitted for completed tasks")

        # Verify writer assignment
        writer = task.writer
        if not writer:
            raise ValidationException(detail="No writer assigned to this task")

        # Check for existing review
        existing_review = ReviewRepository.get_review_by_task(db, task_id)
        if existing_review:
            raise ValidationException(detail="You have already submitted a review for this task")

        # Create review
        review = ReviewEntity(
            task_id=task_id,
            customer_id=customer_id,
            writer_id=writer.id,
            rating=request.rating,
            feedback=request.feedback
        )
        review = ReviewRepository.add_review(db, review)

        # Notify writer about the review
        try:
            stars = "★" * request.rating
            NotificationService.create_notification(
                db=db,
                user_id=writer.id,
                title="New Review Received!",
                message=f"A customer rated you {stars} for project '{task.title}'!",
                notification_type="REVIEW_RECEIVED",
                related_id=task_id
            )
        except Exception as e:
            print(f"Failed to send review notification to writer: {e}")

        review = ReviewRepository.save_review(db, review)
        return ReviewResponse.model_validate(review)
