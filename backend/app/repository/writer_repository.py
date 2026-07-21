from sqlalchemy.orm import Session
from typing import List, Optional
from app.entity.writer_profile_entity import WriterProfileEntity

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
