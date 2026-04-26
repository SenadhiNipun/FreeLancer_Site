from sqlalchemy.orm import Session
from app.repository.academic_repository import AcademicRepository
from app.model.generic_response import GenericResponse

class AcademicService:

    @staticmethod
    def get_education_levels(db: Session):
        levels = AcademicRepository.get_all_education_levels(db)
        return [{"id": l.id, "name": l.name, "description": l.description} for l in levels]

    @staticmethod
    def get_academic_categories(db: Session):
        categories = AcademicRepository.get_all_academic_categories(db)
        return [{"id": c.id, "name": c.name, "description": c.description} for c in categories]

    @staticmethod
    def get_specializations(db: Session, category_id: int):
        specs = AcademicRepository.get_specializations_by_category(db, category_id)
        return [{"id": s.id, "name": s.name, "description": s.description} for s in specs]
