from sqlalchemy.orm import Session, selectinload
from typing import List, Optional
from app.entity.writer_profile_entity import WriterProfileEntity
from app.entity.writer_qualification_entity import WriterQualificationEntity
from app.entity.user_entity import UserEntity
from app.entity.user_profile_entity import UserProfileEntity
from app.entity.task_assignment_entity import TaskAssignmentEntity
from app.entity.task_entity import TaskEntity

class WriterRepository:

    @staticmethod
    def get_approved_writers_by_specialization_or_category(
        db: Session, specialization_id: Optional[int], academic_category_id: Optional[int]
    ) -> List[WriterProfileEntity]:
        query = db.query(WriterProfileEntity)

        if specialization_id:
            query = query.filter(WriterProfileEntity.specialization_id == specialization_id)
        elif academic_category_id:
            query = query.filter(WriterProfileEntity.academic_category_id == academic_category_id)
        else:
            return []

        return query.filter(WriterProfileEntity.profile_status == "APPROVED").all()

    @staticmethod
    def get_user_with_writer_profile(db: Session, user_id: int) -> Optional[UserEntity]:
        return (
            db.query(UserEntity)
            .options(
                selectinload(UserEntity.writer_profile).selectinload(WriterProfileEntity.qualifications),
                selectinload(UserEntity.writer_profile).selectinload(WriterProfileEntity.education_level),
                selectinload(UserEntity.writer_profile).selectinload(WriterProfileEntity.academic_category),
                selectinload(UserEntity.writer_profile).selectinload(WriterProfileEntity.specialization),
                selectinload(UserEntity.user_profile),
            )
            .filter(UserEntity.id == user_id)
            .first()
        )

    @staticmethod
    def get_completed_project_count(db: Session, writer_id: int) -> int:
        return db.query(TaskAssignmentEntity).join(TaskEntity).filter(
            TaskAssignmentEntity.writer_id == writer_id,
            TaskEntity.task_status == "COMPLETED"
        ).count()

    @staticmethod
    def save_user_and_profile(db: Session, user: UserEntity, user_profile: UserProfileEntity) -> None:
        db.commit()
        db.refresh(user)
        db.refresh(user_profile)

    @staticmethod
    def save_user_and_writer_profile(db: Session, user: UserEntity, writer_profile: WriterProfileEntity) -> None:
        db.commit()
        db.refresh(user)
        db.refresh(writer_profile)

    @staticmethod
    def delete_qualifications(db: Session, writer_profile_id: int) -> None:
        db.query(WriterQualificationEntity).filter(
            WriterQualificationEntity.writer_profile_id == writer_profile_id
        ).delete()

    @staticmethod
    def add_qualifications(db: Session, writer_profile_id: int, names: List[str]) -> None:
        db.add_all([
            WriterQualificationEntity(writer_profile_id=writer_profile_id, qualification_name=name)
            for name in names
        ])
