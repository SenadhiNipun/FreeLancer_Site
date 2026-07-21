from sqlalchemy.orm import Session, selectinload
from typing import List, Optional
from app.entity.review_entity import ReviewEntity

class ReviewRepository:

    @staticmethod
    def get_review_by_task(db: Session, task_id: int) -> Optional[ReviewEntity]:
        return db.query(ReviewEntity).filter(ReviewEntity.task_id == task_id).first()

    @staticmethod
    def get_reviews_by_writer(db: Session, writer_id: int) -> List[ReviewEntity]:
        return (
            db.query(ReviewEntity)
            .options(selectinload(ReviewEntity.customer))
            .filter(ReviewEntity.writer_id == writer_id)
            .all()
        )

    @staticmethod
    def add_review(db: Session, review: ReviewEntity) -> ReviewEntity:
        db.add(review)
        return review

    @staticmethod
    def save_review(db: Session, review: ReviewEntity) -> ReviewEntity:
        db.commit()
        db.refresh(review)
        return review
