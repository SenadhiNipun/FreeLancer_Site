from sqlalchemy.orm import Session
from typing import List
from app.entity.education_level_entity import EducationLevelEntity
from app.entity.academic_category_entity import AcademicCategoryEntity
from app.entity.specialization_entity import SpecializationEntity

class AcademicRepository:

    @staticmethod
    def get_all_education_levels(db: Session) -> List[EducationLevelEntity]:
        return (
            db.query(EducationLevelEntity)
            .filter(EducationLevelEntity.is_delete == False, EducationLevelEntity.is_active == True)
            .order_by(EducationLevelEntity.display_order.asc())
            .all()
        )

    @staticmethod
    def get_all_academic_categories(db: Session) -> List[AcademicCategoryEntity]:
        return (
            db.query(AcademicCategoryEntity)
            .filter(AcademicCategoryEntity.is_delete == False, AcademicCategoryEntity.is_active == True)
            .order_by(AcademicCategoryEntity.display_order.asc())
            .all()
        )

    @staticmethod
    def get_specializations_by_category(db: Session, category_id: int) -> List[SpecializationEntity]:
        return (
            db.query(SpecializationEntity)
            .filter(
                SpecializationEntity.academic_category_id == category_id,
                SpecializationEntity.is_delete == False,
                SpecializationEntity.is_active == True
            )
            .order_by(SpecializationEntity.display_order.asc())
            .all()
        )

    @staticmethod
    def get_education_level_by_id(db: Session, id: int) -> EducationLevelEntity | None:
        return db.query(EducationLevelEntity).filter(EducationLevelEntity.id == id, EducationLevelEntity.is_delete == False).first()

    @staticmethod
    def get_academic_category_by_id(db: Session, id: int) -> AcademicCategoryEntity | None:
        return db.query(AcademicCategoryEntity).filter(AcademicCategoryEntity.id == id, AcademicCategoryEntity.is_delete == False).first()

    @staticmethod
    def get_specialization_by_id(db: Session, id: int) -> SpecializationEntity | None:
        return db.query(SpecializationEntity).filter(SpecializationEntity.id == id, SpecializationEntity.is_delete == False).first()
